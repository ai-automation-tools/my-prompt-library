# Changelog — 2026-04-29

## Summary
Major UX and data-flow fixes for My Library, Skill Packs, prompt creation, and search ranking.

## Fixed

### My Library actions
- Added clear **Remove from My Library** actions in prompt card/detail views.
- Clarified delete labels/tooltips to reflect library removal behavior.

### Prompt add/copy refresh
- Fixed post-add refresh path that could blank the current list until reload.
- Unified refresh behavior with lightweight prompt fetch and safer response handling.

### Skill Packs: Public vs My Library behavior
- Skill Packs now respect `library=public|my` mode in frontend and backend.
- Added install tracking table: `user_skill_pack_installs`.
- **My Library** now shows only packs the user explicitly added.
- **Public Library** shows full available catalog.

### Skill Pack add/remove lifecycle
- Added explicit-confirmation API flows:
  - `POST /api/skill-packs/:packId/add-to-library`
  - `DELETE /api/skill-packs/:packId/remove-from-library`
- Added UI add/remove controls with confirm dialogs.
- Added pack-tagging on imported skills (`skill-pack:<packId>`) so remove can clean up all imported skills for that pack.

### Prompt creation flow
- Fixed Create Prompt section dropdown to match app taxonomy:
  - `1_Guides`, `2_Agents`, `3_Skills`, `4_Prompts`, `5_System_Prompts`
- New prompt flow now forces **My Library** mode and avoids invalid Skill Packs section context.
- Default new prompt section updated to `4_Prompts`.

### Search relevance
- Search ranking now prioritizes title matches first:
  1. title starts-with query
  2. title contains query
  3. non-title matches (tags/category/content)

## Files touched (high level)
- `src/App.tsx`
- `src/components/PromptEditorModal.tsx`
- `src/components/SkillPacksView.tsx`
- `routes/skill-packs.ts`
- `api/skill-packs.ts`
- `db/postgres.ts`
- `api/prompt-index.json`
