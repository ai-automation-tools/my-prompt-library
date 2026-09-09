/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useState } from 'react';
import { type Prompt } from '../components/PromptCard';

/**
 * Getting a prompt's real body to the user, and the copy-button state that goes
 * with it.
 *
 * A prompt off `GET /api/prompts?lightweight=true` does not carry its content.
 * It never really did — the listing always truncated to 200 characters — and it
 * now carries none at all for the public library. Three card actions were
 * treating that value as the prompt anyway: Copy put the excerpt on the
 * clipboard, Download wrote the excerpt into the `.md` file, and Edit seeded the
 * editor with it, so saving a My Library prompt from a card truncated it. They
 * all route through `fetchFullContent` now.
 *
 * `PromptDetail` never had the problem — `handlePromptClick` fetches the full
 * prompt before opening it — so it keeps the plain `copyContent(text, id)` path.
 */
export function usePromptContent(showToast: (type: 'success' | 'error', message: string) => void) {
  const [copied, setCopied] = useState<string | null>(null);

  const markCopied = useCallback((promptId: string) => {
    setCopied(promptId);
    setTimeout(() => setCopied(null), 2000);
    showToast('success', 'Copied to clipboard');
  }, [showToast]);

  /** Copy text already in hand. Used by `PromptDetail`, which has the full body. */
  const copyContent = useCallback((content: string, promptId: string) => {
    navigator.clipboard.writeText(content);
    markCopied(promptId);
  }, [markCopied]);

  /** The real body of a prompt. Falls back to whatever the caller had on failure. */
  const fetchFullContent = useCallback(async (prompt: Prompt): Promise<string> => {
    try {
      const response = await fetch(`/api/prompts/${encodeURIComponent(prompt.id)}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const full = await response.json();
        if (typeof full?.content === 'string') {
          return full.content;
        }
      }
    } catch (err) {
      console.error('Failed to fetch full prompt content:', err);
    }
    return prompt.content;
  }, []);

  /** Copy from a card, which only holds a blurb — so the body is fetched first. */
  const copyPrompt = useCallback(async (prompt: Prompt) => {
    const content = fetchFullContent(prompt);
    try {
      // Safari drops the user-gesture clipboard permission across an `await`, so
      // where `ClipboardItem` exists the fetch is handed over as a promise and
      // resolved inside the same gesture. Awaiting first is the fallback.
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': content.then(text => new Blob([text], { type: 'text/plain' })),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(await content);
      }
      markCopied(prompt.id);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
      showToast('error', 'Failed to copy');
    }
  }, [fetchFullContent, markCopied, showToast]);

  return { copied, copyContent, copyPrompt, fetchFullContent };
}
