/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import {
  Terminal,
  Sparkles,
  Zap,
  Wrench,
  Bot,
  ChevronDown,
  Github,
  ExternalLink,
  FileText,
  Library,
  BookOpen,
  Compass,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import { cn } from '../lib/cn';

interface ResourceLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface ResourceGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  accent: string;
  links: ResourceLink[];
}

/**
 * External reading, grouped. One "Resources" menu replaces the five pills the
 * old top bar carried; the data is unchanged apart from being flattened into
 * groups so it lays out as columns.
 */
const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    id: 'cli',
    label: 'CLI agents',
    icon: Terminal,
    accent: '#38bdf8',
    links: [
      { label: 'Claude Code', href: 'https://github.com/anthropics/claude-code', icon: Github },
      { label: 'Gemini CLI', href: 'https://github.com/google-gemini/gemini-cli', icon: Github },
      { label: 'Codex CLI', href: 'https://github.com/openai/codex', icon: Github },
    ],
  },
  {
    id: 'system-prompts',
    label: 'System prompts',
    icon: FileText,
    accent: '#fbbf24',
    links: [
      { label: 'Learn Prompting', href: 'https://learnprompting.org/docs/basics/system_prompts', icon: Library },
      { label: 'Prompting Guide', href: 'https://www.promptingguide.ai/techniques', icon: Library },
      { label: 'OpenAI Cookbook', href: 'https://cookbook.openai.com/', icon: BookOpen },
      { label: 'Anthropic Docs', href: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering', icon: Library },
      { label: 'Gemini Docs', href: 'https://ai.google.dev/gemini-api/docs/system-instructions', icon: Library },
    ],
  },
  {
    id: 'prompt-libraries',
    label: 'Prompt libraries',
    icon: Sparkles,
    accent: '#fb7185',
    links: [
      { label: 'Prompts.chat', href: 'https://prompts.chat/prompts', icon: Library },
      { label: 'PromptHero', href: 'https://prompthero.com/', icon: Sparkles },
      { label: 'Vertex AI Gallery', href: 'https://cloud.google.com/vertex-ai/generative-ai/docs/prompt-gallery', icon: Library },
      { label: 'WorkMind', href: 'https://workmind.ai/ai-prompt-library/', icon: Library },
      { label: 'PromptSource', href: 'https://github.com/bigscience-workshop/promptsource', icon: Github },
    ],
  },
  {
    id: 'prompting-guides',
    label: 'Prompting guides',
    icon: BookOpen,
    accent: '#a78bfa',
    links: [
      { label: 'Prompting Guide AI', href: 'https://www.promptingguide.ai/', icon: BookOpen },
      { label: 'Claude Prompt Eng', href: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview', icon: Library },
      { label: 'OpenAI Prompt Guide', href: 'https://developers.openai.com/api/docs/guides/prompt-engineering', icon: BookOpen },
      { label: 'Google Prompt Design', href: 'https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/introduction-prompt-design', icon: BookOpen },
      { label: 'Digital Maker Tools', href: 'https://digitalmaker.ai/tools', icon: Wrench },
    ],
  },
  {
    id: 'agents',
    label: 'Agents & MCP',
    icon: Bot,
    accent: '#22d3ee',
    links: [
      { label: 'Anthropic Agents', href: 'https://docs.anthropic.com/en/docs/agents-and-tools/overview', icon: Bot },
      { label: 'OpenAI Agents', href: 'https://platform.openai.com/docs/guides/agents', icon: Bot },
      { label: 'Gemini Function Calling', href: 'https://ai.google.dev/gemini-api/docs/function-calling', icon: Zap },
      { label: 'MCP Introduction', href: 'https://modelcontextprotocol.io/introduction', icon: Library },
      { label: 'OpenClaw Docs', href: 'https://docs.openclaw.ai/', icon: BookOpen },
      { label: 'AI Template Agents', href: 'https://www.aitmpl.com/agents', icon: Bot },
      { label: '500 AI Agents', href: 'https://github.com/ashishpatel26/500-AI-Agents-Projects', icon: Github },
      { label: 'Awesome AI Agents', href: 'https://github.com/e2b-dev/awesome-ai-agents', icon: Github },
      { label: 'HuggingFace Agents', href: 'https://huggingface.co/spaces?sort=trending&search=agent', icon: Bot },
    ],
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: Zap,
    accent: '#34d399',
    links: [
      { label: 'OpenClaw Skills', href: 'https://github.com/openclaw/openclaw/tree/main/skills', icon: Github },
      { label: 'ClawHub', href: 'https://clawhub.com', icon: Library },
      { label: 'Semantic Kernel', href: 'https://github.com/microsoft/semantic-kernel', icon: Github },
      { label: 'LangChain Tools', href: 'https://python.langchain.com/docs/modules/agents/tools/', icon: Library },
      { label: 'MCP Docs', href: 'https://modelcontextprotocol.io/docs', icon: BookOpen },
      { label: 'SkillsMP', href: 'https://skillsmp.com/', icon: Zap },
    ],
  },
];

export default function ResourcesNav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn('btn btn-ghost btn-sm gap-1.5', open && 'bg-[color-mix(in_srgb,var(--fg)_7%,transparent)] text-[var(--fg)]')}
      >
        <Compass className="h-3.5 w-3.5" />
        Resources
        <ChevronDown className={cn('h-3 w-3 text-[var(--fg-4)] transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.2, 0.7, 0.2, 1] }}
            className="popover absolute right-0 top-full z-[100] mt-2 w-[720px] p-2"
          >
            <div className="grid grid-cols-3 gap-1">
              {RESOURCE_GROUPS.map(group => {
                const GroupIcon = group.icon;
                return (
                  <div key={group.id} className="p-2" style={{ ['--c' as string]: group.accent }}>
                    <div className="mb-1.5 flex items-center gap-2 px-2">
                      <span className="grid h-5 w-5 place-items-center rounded-[5px] bg-[color-mix(in_srgb,var(--c)_12%,transparent)] text-[var(--c)]">
                        <GroupIcon className="h-3 w-3" />
                      </span>
                      <span className="eyebrow text-[10px]">{group.label}</span>
                    </div>
                    <ul>
                      {group.links.map(link => {
                        const LinkIcon = link.icon;
                        return (
                          <li key={link.href + link.label}>
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              role="menuitem"
                              className="group flex items-center gap-2.5 rounded-[var(--r-md)] px-2 py-[6px] text-[13px] text-[var(--fg-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                            >
                              <LinkIcon className="h-3.5 w-3.5 shrink-0 text-[var(--fg-5)] transition-colors group-hover:text-[var(--c)]" />
                              <span className="truncate">{link.label}</span>
                              <ExternalLink className="ml-auto h-3 w-3 shrink-0 text-[var(--fg-5)] opacity-0 transition-opacity group-hover:opacity-100" />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
