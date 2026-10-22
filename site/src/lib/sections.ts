/**
 * The six library sections plus Skill Packs: one record each with its tab id,
 * `library/` folder, label, icon, accent colour and blurb. Every component that
 * used to switch on a tab id reads from here instead.
 *
 * The accents are the per-tool hues from the org landing page
 * (ai-automation-tools.dev): rose is Promptbook's own colour there, and
 * the rest follow the same family so the sections read as siblings. They are
 * token references, not literals, so html.light can swap each for its 700
 * shade; index.css also exposes the current one as `--c` via `[data-section]`.
 */

import {
  BookOpen,
  Bot,
  Package,
  Plug,
  Sparkles,
  TerminalSquare,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { LibraryTab } from '../hooks/useLibraryRoute';

export interface SectionMeta {
  /** Tab id, also the `?section=` value. */
  id: LibraryTab;
  /** Value of `data-section` on <html>; drives `--section-c`. */
  slug: string;
  label: string;
  /** Folder under `library/`; empty for Skill Packs, which are served separately. */
  folder: string;
  icon: LucideIcon;
  accent: string;
  description: string;
}

export const SECTIONS: readonly SectionMeta[] = [
  {
    id: 'prompt-library',
    slug: 'prompts',
    label: 'Prompts',
    folder: '4_Prompts',
    icon: Sparkles,
    accent: 'var(--sec-prompts)',
    description: 'Reusable prompt templates, organised by domain and task.',
  },
  {
    id: 'agents',
    slug: 'agents',
    label: 'Agents',
    folder: '2_Agents',
    icon: Bot,
    accent: 'var(--sec-agents)',
    description: 'Installable subagent definitions, ready to drop into .claude/agents/.',
  },
  {
    id: 'agent-guides',
    slug: 'guides',
    label: 'Guides',
    folder: '1_Guides',
    icon: BookOpen,
    accent: 'var(--sec-guides)',
    description: 'Setup and usage guides for the tools and providers the prompts target.',
  },
  {
    id: 'system-prompts',
    slug: 'system-prompts',
    label: 'System Prompts',
    folder: '5_System_Prompts',
    icon: TerminalSquare,
    accent: 'var(--sec-system-prompts)',
    description: 'An archive of production system prompts, for study and reuse.',
  },
  {
    id: 'skills',
    slug: 'skills',
    label: 'Skills',
    folder: '3_Skills',
    icon: Wrench,
    accent: 'var(--sec-skills)',
    description: 'SKILL.md bundles with their sample code, downloadable as a zip.',
  },
  {
    id: 'mcp-servers',
    slug: 'mcp',
    label: 'MCP Servers',
    folder: '6_MCP_Servers',
    icon: Plug,
    accent: 'var(--sec-mcp)',
    description: 'Model Context Protocol servers worth installing, with verified install lines.',
  },
  {
    id: 'skill-packs',
    slug: 'skill-packs',
    label: 'Skill Packs',
    folder: '',
    icon: Package,
    accent: 'var(--sec-skill-packs)',
    description: 'Curated collections of skills for a domain or workflow.',
  },
];

/** Legacy tab spellings still accepted from old links. */
const LEGACY_TABS: Record<string, LibraryTab> = {
  guides: 'agent-guides',
  prompts: 'prompt-library',
};

export function getSection(tab: string): SectionMeta {
  const id = LEGACY_TABS[tab] ?? tab;
  return SECTIONS.find(s => s.id === id) ?? SECTIONS[0];
}

export function getSectionFolder(tab: string): string {
  return getSection(tab).folder;
}

export function getSectionDisplayName(tab: string): string {
  return getSection(tab).label;
}

/** The tab a `library/` folder (a prompt's `section` field) belongs to. */
export function getTabForFolder(folder: string): LibraryTab {
  return SECTIONS.find(s => s.folder && s.folder === folder)?.id ?? 'prompt-library';
}

/** Human form of a `Some_Category_Name` folder segment. */
export function humanize(segment: string | null | undefined): string {
  return (segment ?? '').replace(/_/g, ' ');
}

/** Lower-case a label for running text, keeping acronyms ("MCP Servers" → "MCP servers"). */
export function lowerLabel(label: string): string {
  return label.split(' ').map(w => (/^[A-Z]{2,}$/.test(w) ? w : w.toLowerCase())).join(' ');
}
