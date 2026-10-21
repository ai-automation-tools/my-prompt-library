declare const __READ_ONLY__: boolean;

/**
 * True on the hosted demo: the Public Library only, and nothing that writes to
 * My Library is shown. Set at build time by vite.config.ts.
 */
export const READ_ONLY: boolean = __READ_ONLY__;
