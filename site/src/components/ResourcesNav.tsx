/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Sparkles,
  Zap,
  Wrench,
  Bot,
  ChevronDown,
  ChevronRight,
  Github,
  ExternalLink,
  FileText,
  Library,
  BookOpen,
  type LucideIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ResourceLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SubCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  links: ResourceLink[];
}

interface TopMenu {
  id: string;
  label: string;
  icon: LucideIcon;
  links?: ResourceLink[];
  subcategories?: SubCategory[];
}

const RESOURCES_NAV: TopMenu[] = [
  {
    id: 'cli',
    label: 'CLI',
    icon: Terminal,
    links: [
      { label: 'Claude Code', href: 'https://github.com/anthropics/claude-code', icon: Github },
      { label: 'Gemini CLI', href: 'https://github.com/google-gemini/gemini-cli', icon: Github },
      { label: 'Codex CLI', href: 'https://github.com/openai/codex', icon: Github },
    ]
  },
  {
    id: 'prompts',
    label: 'Prompts',
    icon: Sparkles,
    subcategories: [
      {
        id: 'system-prompts',
        label: 'System Prompts',
        icon: FileText,
        links: [
          { label: 'Learn Prompting', href: 'https://learnprompting.org/docs/basics/system_prompts', icon: Library },
          { label: 'Prompting Guide', href: 'https://www.promptingguide.ai/techniques', icon: Library },
          { label: 'OpenAI Cookbook', href: 'https://cookbook.openai.com/', icon: BookOpen },
          { label: 'Anthropic Docs', href: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering', icon: Library },
          { label: 'Gemini Docs', href: 'https://ai.google.dev/gemini-api/docs/system-instructions', icon: Library },
        ]
      },
      {
        id: 'prompt-libraries',
        label: 'Prompt Libraries',
        icon: Library,
        links: [
          { label: 'Prompts.chat', href: 'https://prompts.chat/prompts', icon: Library },
          { label: 'PromptHero', href: 'https://prompthero.com/', icon: Sparkles },
          { label: 'Vertex AI Gallery', href: 'https://cloud.google.com/vertex-ai/generative-ai/docs/prompt-gallery', icon: Library },
          { label: 'WorkMind', href: 'https://workmind.ai/ai-prompt-library/', icon: Library },
        ]
      },
      {
        id: 'agent-instructions',
        label: 'Agents',
        icon: Bot,
        links: [
          { label: 'Anthropic Agents', href: 'https://docs.anthropic.com/en/docs/agents-and-tools/overview', icon: Bot },
          { label: 'OpenAI Agents', href: 'https://platform.openai.com/docs/guides/agents', icon: Bot },
          { label: 'Gemini Function Call', href: 'https://ai.google.dev/gemini-api/docs/function-calling', icon: Zap },
          { label: 'MCP Introduction', href: 'https://modelcontextprotocol.io/introduction', icon: Library },
          { label: 'OpenClaw Docs', href: 'https://docs.openclaw.ai/', icon: BookOpen },
        ]
      },
      {
        id: 'prompting-guides',
        label: 'Prompting Guides',
        icon: BookOpen,
        links: [
          { label: 'Prompting Guide AI', href: 'https://www.promptingguide.ai/', icon: BookOpen },
          { label: 'Claude Prompt Eng', href: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview', icon: Library },
          { label: 'OpenAI Prompt Guide', href: 'https://developers.openai.com/api/docs/guides/prompt-engineering', icon: BookOpen },
          { label: 'Google Prompt Design', href: 'https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/introduction-prompt-design', icon: BookOpen },
        ]
      }
    ]
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: Zap,
    links: [
      { label: 'OpenClaw Skills', href: 'https://github.com/openclaw/openclaw/tree/main/skills', icon: Github },
      { label: 'ClawHub', href: 'https://clawhub.com', icon: Library },
      { label: 'Semantic Kernel', href: 'https://github.com/microsoft/semantic-kernel', icon: Github },
      { label: 'LangChain Tools', href: 'https://python.langchain.com/docs/modules/agents/tools/', icon: Library },
      { label: 'MCP Docs', href: 'https://modelcontextprotocol.io/docs', icon: BookOpen },
      { label: 'SkillsMP', href: 'https://skillsmp.com/', icon: Zap },
    ]
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: Wrench,
    links: [
      { label: 'PromptSource', href: 'https://github.com/bigscience-workshop/promptsource', icon: Github },
      { label: 'Prompting Guide', href: 'https://www.promptingguide.ai/', icon: BookOpen },
      { label: 'Digital Maker Tools', href: 'https://digitalmaker.ai/tools', icon: Wrench },
    ]
  },
  {
    id: 'agent-templates',
    label: 'Agents',
    icon: Bot,
    links: [
      { label: 'AI Template', href: 'https://www.aitmpl.com/agents', icon: Bot },
      { label: '500 AI Agents', href: 'https://github.com/ashishpatel26/500-AI-Agents-Projects', icon: Github },
      { label: 'Awesome AI Agents', href: 'https://github.com/e2b-dev/awesome-ai-agents', icon: Github },
      { label: 'HuggingFace Agents', href: 'https://huggingface.co/spaces?sort=trending&search=agent', icon: Bot },
    ]
  }
];

export default function ResourcesNav() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
        setActiveSubmenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menuId: string) => {
    if (activeMenu === menuId) {
      setActiveMenu(null);
      setActiveSubmenu(null);
    } else {
      setActiveMenu(menuId);
      setActiveSubmenu(null);
    }
  };

  const toggleSubmenu = (submenuId: string) => {
    setActiveSubmenu(prev => prev === submenuId ? null : submenuId);
  };

  return (
    <div ref={navRef} className="hidden md:flex items-center justify-center gap-3 flex-1">
      {RESOURCES_NAV.map((menu) => {
        const MenuIcon = menu.icon;
        const isOpen = activeMenu === menu.id;

        return (
          <div key={menu.id} className="relative external-resource-dropdown">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMenu(menu.id);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle border border-[var(--glass-border)] hover:border-[var(--accent)] transition-colors text-xs"
            >
              <MenuIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="font-semibold text-[var(--text-secondary)]">{menu.label}</span>
              <ChevronDown
                className={cn(
                  "w-3 h-3 text-[var(--text-tertiary)] transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[100] min-w-[14rem] dropdown-solid rounded-[var(--radius-md)] p-2 shadow-xl border border-[var(--glass-border)]"
                >
                  {/* Direct links */}
                  {menu.links?.map((link) => {
                    const LinkIcon = link.icon;
                    return (
                      <a
                        key={link.href + link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors group"
                      >
                        <LinkIcon className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)]" />
                        <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent)]">
                          {link.label}
                        </span>
                        <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    );
                  })}

                  {/* Subcategories (e.g. Prompts) */}
                  {menu.subcategories?.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubOpen = activeSubmenu === sub.id;

                    return (
                      <div key={sub.id} className="relative">
                        <button
                          onClick={() => toggleSubmenu(sub.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors group"
                        >
                          <SubIcon className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)]" />
                          <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent)]">
                            {sub.label}
                          </span>
                          <ChevronRight className="w-3 h-3 text-[var(--text-tertiary)] ml-auto" />
                        </button>

                        <AnimatePresence>
                          {isSubOpen && (
                            <motion.div
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -8 }}
                              transition={{ duration: 0.15 }}
                              className="absolute left-full top-0 ml-1 w-72 dropdown-solid rounded-[var(--radius-md)] p-2 shadow-xl border border-[var(--glass-border)]"
                            >
                              {sub.links.map((link) => {
                                const LinkIcon = link.icon;
                                return (
                                  <a
                                    key={link.href + link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors group"
                                  >
                                    <LinkIcon className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)]" />
                                    <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent)]">
                                      {link.label}
                                    </span>
                                    <ExternalLink className="w-3 h-3 text-[var(--text-tertiary)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </a>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
