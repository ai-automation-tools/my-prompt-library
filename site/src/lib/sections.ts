/**
 * The five library sections plus Skill Packs: one record each with its tab id,
 * `library/` folder, label, icon, accent colour and blurb. Every component that
 * used to switch on a tab id reads from here instead.
 *
 * The accents are the per-tool hues from the org landing page
 * (ai-automation-tools.dev): rose is My Prompt Library's own colour there, and
 * the rest follow the same family so the sections read as siblings. themes.css
 * applies them through `--section-c` on `[data-section]`; themes other than
 * the default and Light collapse them to the theme accent.
 */

import {
  BookOpen,
  Bot,
  Package,
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
    accent: '#fb7185',
    description: 'Reusable prompt templates, organised by domain and task.',
  },
  {
    id: 'agents',
    slug: 'agents',
    label: 'Agents',
    folder: '2_Agents',
    icon: Bot,
    accent: '#22d3ee',
    description: 'Agent personas and operating instructions, ready to drop into a harness.',
  },
  {
    id: 'agent-guides',
    slug: 'guides',
    label: 'Guides',
    folder: '1_Guides',
    icon: BookOpen,
    accent: '#a78bfa',
    description: 'Setup and usage guides for the tools and providers the prompts target.',
  },
  {
    id: 'system-prompts',
    slug: 'system-prompts',
    label: 'System Prompts',
    folder: '5_System_Prompts',
    icon: TerminalSquare,
    accent: '#fbbf24',
    description: 'An archive of production system prompts, for study and reuse.',
  },
  {
    id: 'skills',
    slug: 'skills',
    label: 'Skills',
    folder: '3_Skills',
    icon: Wrench,
    accent: '#34d399',
    description: 'SKILL.md bundles with their sample code, downloadable as a zip.',
  },
  {
    id: 'skill-packs',
    slug: 'skill-packs',
    label: 'Skill Packs',
    folder: '',
    icon: Package,
    accent: '#2dd4bf',
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
