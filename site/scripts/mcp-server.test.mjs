/**
 * End-to-end check of the MCP server (mcp/server.ts) over real stdio.
 *
 *   npm run test:mcp        # from site/
 *
 * Spawns the server twice with the SDK client: once writable (My Library in a
 * temp folder, so nothing real is touched) and once with READ_ONLY=true. A
 * handshake that succeeds also proves nothing else wrote to stdout. Exits 1 on
 * the first failure.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const SITE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const TSX = path.join(SITE, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const index = JSON.parse(fs.readFileSync(path.join(SITE, 'api', 'prompt-index.json'), 'utf-8'));

async function connect(env) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [TSX, 'mcp/server.ts'],
    cwd: SITE,
    env: { ...process.env, ...env },
    stderr: 'pipe',
  });
  transport.stderr?.on('data', () => {}); // keep the pipe drained
  const client = new Client({ name: 'mcp-server-test', version: '1.0.0' });
  await client.connect(transport);
  return client;
}

const textOf = (r) => r.content.map((c) => c.text ?? '').join('\n');
const call = async (client, name, args = {}) => client.callTool({ name, arguments: args });
const ok = async (client, name, args) => {
  const r = await call(client, name, args);
  assert.ok(!r.isError, `${name} failed: ${textOf(r)}`);
  return textOf(r);
};
const refused = async (client, name, args) => {
  const r = await call(client, name, args);
  // Never echo what came back: a broken guard returns the file it should not
  // have read (in development that can be site/.env).
  assert.ok(r.isError, `${name} should have refused ${JSON.stringify(args)}; it returned ${textOf(r).length} characters instead`);
};

// A skill that has support files, found on disk so the test follows the library.
const skillsRoot = path.join(SITE, 'library', '3_Skills');
function findSkillWithFiles(dir = skillsRoot) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (!e.isDirectory() || e.name === 'packs') continue;
    if (fs.existsSync(path.join(p, 'SKILL.md'))) {
      const extra = fs.readdirSync(p, { withFileTypes: true }).find((f) => f.isFile() && f.name !== 'SKILL.md' && /\.(md|txt|py|js|ts|json)$/.test(f.name));
      if (extra) return { dir: path.relative(path.join(SITE, 'library'), p).split(path.sep).join('/'), file: extra.name };
    } else {
      const found = findSkillWithFiles(p);
      if (found) return found;
    }
  }
  return null;
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-my-library-'));
let client;
try {
  // ---------- writable ----------
  client = await connect({ MY_LIBRARY_DIR: tmp, READ_ONLY: 'false', VERCEL: '' });

  const tools = (await client.listTools()).tools.map((t) => t.name).sort();
  assert.deepEqual(tools, [
    'delete_my_prompt', 'get_item', 'get_skill', 'get_skill_file', 'get_skill_pack', 'list_categories',
    'list_sections', 'list_skill_packs', 'save_to_my_library', 'search_library', 'update_my_prompt',
  ]);

  const search = await ok(client, 'search_library', { query: 'code review', section: 'prompts', limit: 5 });
  assert.match(search, /result/);
  assert.match(search, /`4_Prompts\//);
  assert.match(await ok(client, 'search_library', { section: 'mcp-servers', limit: 50 }), /6_MCP_Servers\//);

  const agent = index.prompts.find((p) => p.section === '2_Agents');
  assert.ok(agent, 'index has an agent');
  assert.match(await ok(client, 'get_item', { id: agent.id }), new RegExp(agent.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  await refused(client, 'get_item', { id: '../../.env' });
  await refused(client, 'get_item', { id: '4_Prompts/../../package.json' });
  await refused(client, 'get_item', { id: '4_Prompts/does-not-exist.md' });

  assert.match(await ok(client, 'list_sections'), /MCP Servers/);
  assert.match(await ok(client, 'list_categories', { section: 'skills' }), /Development/);

  const skill = findSkillWithFiles();
  assert.ok(skill, 'library has a skill with a support file');
  const skillText = await ok(client, 'get_skill', { id: skill.dir });
  assert.match(skillText, /Support files/);
  assert.ok(skillText.includes(skill.file), 'get_skill lists the support file');
  await ok(client, 'get_skill_file', { skill: skill.dir, path: skill.file });
  await refused(client, 'get_skill_file', { skill: skill.dir, path: '../../../../../.env' });
  await refused(client, 'get_skill_file', { skill: skill.dir, path: '../../../../api/index.ts' });
  await refused(client, 'get_skill', { id: '4_Prompts/Engineering' });
  await refused(client, 'get_skill', { id: '3_Skills/../../api' });

  assert.match(await ok(client, 'list_skill_packs'), /developer-essentials-pack/);
  assert.match(await ok(client, 'get_skill_pack', { id: 'developer-essentials-pack' }), /3_Skills\//);
  await refused(client, 'get_skill_pack', { id: 'no-such-pack' });

  const prompts = (await client.listPrompts()).prompts.map((p) => p.name);
  assert.ok(prompts.includes('library_prompt'), 'library_prompt is listed');
  assert.ok(prompts.length > 1, 'featured prompts are listed');
  const libPrompt = index.prompts.find((p) => p.section === '4_Prompts');
  const got = await client.getPrompt({ name: 'library_prompt', arguments: { id: libPrompt.id, input: 'MY-INPUT-MARKER' } });
  assert.match(got.messages[0].content.text, /MY-INPUT-MARKER/);

  // My Library round trip, in the temp folder
  const saved = await ok(client, 'save_to_my_library', { id: libPrompt.id });
  const myId = saved.match(/`([a-z0-9-]+)`/)?.[1];
  assert.ok(myId, `save returned an id: ${saved}`);
  assert.equal(fs.readdirSync(tmp).length, 1, 'one file written to MY_LIBRARY_DIR');
  await refused(client, 'save_to_my_library', { id: libPrompt.id }); // duplicate
  await refused(client, 'save_to_my_library', { title: 'no content' });
  assert.match(await ok(client, 'search_library', { library: 'my' }), new RegExp(myId));
  await ok(client, 'update_my_prompt', { id: myId, content: 'UPDATED-BODY' });
  assert.match(await ok(client, 'get_item', { id: myId }), /UPDATED-BODY/);
  const fresh = await ok(client, 'save_to_my_library', { title: 'Fresh prompt', content: 'Hello', section: 'prompts', tags: ['t1'] });
  assert.match(fresh, /Saved to My Library/);
  await ok(client, 'delete_my_prompt', { id: myId });
  await refused(client, 'get_item', { id: myId });
  await refused(client, 'delete_my_prompt', { id: '../escape' });
  await client.close();

  // ---------- read-only ----------
  client = await connect({ MY_LIBRARY_DIR: tmp, READ_ONLY: 'true' });
  const roTools = (await client.listTools()).tools.map((t) => t.name);
  for (const w of ['save_to_my_library', 'update_my_prompt', 'delete_my_prompt']) {
    assert.ok(!roTools.includes(w), `${w} must not be offered read-only`);
  }
  await ok(client, 'search_library', { query: 'git' });
  await client.close();
  client = null;

  console.log('mcp-server: 11 tools, prompts, traversal refusals, My Library round trip and read-only mode all pass');
} catch (err) {
  console.error('mcp-server test FAILED:', err?.message ?? err);
  process.exitCode = 1;
} finally {
  await client?.close().catch(() => {});
  fs.rmSync(tmp, { recursive: true, force: true });
}
