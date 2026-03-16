# Major Restructure - March 14, 2026 (Evening)

## 🔄 Complete Content Reorganization

**Time:** 9:42 PM PST  
**Commit:** `49fbb52`  
**Impact:** BREAKING CHANGE

### Summary

Migrated entire prompt collection from `prompts/` to new `library/` folder structure with reorganized categories and improved content hierarchy.

---

## 📁 New Structure Overview

### Root Change
```
OLD: prompts/My_Prompts, prompts/Collections, prompts/System_Prompts, etc.
NEW: library/Agent_Guides, library/Agent_Instructions, library/Prompt_Library, etc.
```

### New Sections (5 total)

#### 1. **Agent_Guides** (📖)
CLI agent documentation for coding assistants
- Claude_Code (flags, slash commands, agent guide)
- Codex (flags, slash commands, agent guide)
- Gemini_CLI (flags, slash commands, agent guide)

**Purpose:** How-to guides for using AI coding agents

---

#### 2. **Agent_Instructions** (👤) ⭐ NEW
Organized agent personas and system instructions by domain

**Subcategories:**
- **Ai_Agents** - Meta-agents for agent development
  - Agent_Development (code review, evaluation)
  - Ethics (AI ethics assessment)
  - Prompt_Engineering (meta-prompt creator)
  - Specs (agent spec generator)

- **Ai_Experts** - Domain-specific AI experts
  - Ai_Art_&_Design (3D asset creator, style transfer)
  - Ai_Education (ML tutor)
  - Ai_Gaming (esports analyst, game AI dev)
  - Ai_Research (benchmark analyst, paper analyst)

- **Ai_Tools** - Tool-specific instructions
  - Claude_Code (architecture review, sub-agents, memory context)
  - Claude_Cowork (priority planner, sprawl risk report)
  - Codex (agent workflow, create agent)
  - Openclaw (AI partnership weekly review)

- **Ax-Platform** - aX Platform specific agents
  - Ax-Platform_Dev
  - Financial (advisor, strategist, market agent)
  - Flavor-Atlas (Asian chef, Chi chef, cookbook coordinator)
  - Meme-Team (meme generator, meme savant)
  - Podcast (coordinator)
  - Sailpoint (IIQ agent)
  - SIEM (incident responder, threat hunter, sec router, intel fusion)

- **Business** - Business domain agents
  - Documentation (operational docs, solution architecture)
  - General (ecommerce specialist, startup founder coach)
  - Growth (partner-led growth operator)
  - Marketing (blog planner, content strategist, webinar invites)

- **Characters** - Persona agents
  - General (50+ characters: Einstein, Elon, Yoda, etc.)
  - Podcast_Personalities (24 personalities: Dr. Vega, Pastor Cole, etc.)

- **Developer** - Software development agents
  - General (fullstack, backend, frontend, AI safety, DevOps, etc.)

- **Enterprise** - Enterprise-specific agents
  - Iam_Engineer (IIQ dev, IIQ engineer)
  - Smes (business analyst, PM, sales engineer, security analyst)

- **Finance** - Financial domain agents
  - Forecasts (runway planner, growth scenario)
  - Other (financial advisor, investment manager)
  - Planning (financial planner, inflation hedge)

- **Images** - Image generation agents
  - Graphics (IT cloud architecture diagrams)
  - Icons (monochrome enterprise favicons)
  - Logos (cloud hosting company logos)

- **It_&_Engineering** - IT and engineering agents
  - Architecture (40+ architecture types)
  - Architecture_&_Design (architecture review)
  - Build_Apps (Electron markdown editor)
  - Code_Generation (cyber security, frontend, fullstack)
  - Development (code optimization, UI design system)
  - Product (IT architect)
  - Security (governance, safety, SOC analyst)

- **Machine_Learning** - ML domain agents
  - General (computer vision, data scientist, ML engineer, MLOps)

- **Other** - Miscellaneous agents
  - General (career advisor, creative writer, fitness coach, language tutor)

- **Social_Media** - Social media agents
  - General (brand community manager, viral content strategist)

- **Specialized** - Niche domain agents
  - Chefs_&_Recipe-Builders (5 specialized chefs)
  - Content_Creators (copywriter, podcast producer, YouTube creator)
  - Fantasy_Football (9 fantasy football agents)
  - Financial_Advisors (5 financial advisor types)
  - Legal_Advisors (8 legal specializations)
  - Meme_Agents (5 meme personalities)
  - Podcast_Personalities (7 podcast hosts)

- **Writing** - Writing domain agents
  - Blogs (blog content planner)
  - Books (draft sprint, self-publishing)
  - Cookbooks (recipe development)
  - Create_Documentation (enterprise doc library)
  - General (business proposal, creative fiction, SEO blog, technical docs)
  - Technical (solution architecture)
  - Technical_Writing (documentation writer)

**Total:** 300+ agent instruction files

---

#### 3. **Prompt_Library** (📚)
Reusable prompt templates organized by use case

**Subcategories:**
- **Ai_Agents** - AI/ML development prompts
  - Data (synthetic data generation)
  - Evaluation (model evaluation)
  - Fine_Tuning (finetuning plan)
  - Guardrails (hallucination detection)
  - Policies (tool calling policy)
  - Prompt_Engineering (prompt generator)
  - RAG (retrieval augmented generation)
  - Safety (prompt safety)

- **Ai_Tools** - Tool-specific workflows
  - Claude_Code (70+ workflows: API contract, auto-document, batch processing, etc.)
  - Claude_Cowork (28+ automation workflows)
  - Codex (6 core workflows)
  - Openclaw (cron jobs, git workflows, MCP setup, project docs)
  - Other (awesome-chatgpt, promptsdotchat)

- **Business** - Business prompt templates
  - Documentation (20+ doc types: pitch deck, white paper, case study, etc.)
  - Ecommerce (business plan)
  - Freelance (gig automation)
  - General (investor deck, quick pitch)
  - Marketing (40+ marketing prompts)
  - Online_Course (market research, niche analysis)
  - Other (30+ misc business prompts)

- **Finance** - Financial analysis prompts
  - Analysis (statement analysis, market sentiment)
  - Budgets (variance analysis)
  - Crypto (tokenomics, rotation report)
  - Forecasts (income portfolio, revenue projection)
  - Investments (DCF valuation, event risk trading)
  - Planning (runway calculator, trade committee)
  - Reports (executive summary, board brief)
  - Risk_Management (portfolio stress test)

- **Images** - Image generation prompts
  - Custom (news collage)
  - Graphics (AI neural network, business dashboard, data analytics, SaaS pricing)
  - Icons (favicon sets, text-initial favicon)
  - Logos (AI startup, B2B SaaS, cybersecurity, fintech)

- **It_&_Engineering** - IT and engineering prompts
  - Api_Design (REST API designer)
  - Architecture (C4 diagrams, data flow, threat modeling, etc.)
  - Architecture_&_Design (API design, CI/CD, load testing, migration, performance)
  - Build_Apps (14 full app templates)
  - Code_Generation (explain code, PR description, web design)
  - Data_Analysis (data analysis, statistician)
  - Development (30+ dev prompts)
  - General (40+ general IT prompts)
  - Governance (data governance)
  - IAM (IAM RBAC design)
  - Incident_Response (playbook, postmortem)
  - Operations (20+ ops prompts)
  - Product (startup ideas, feature brainstorming)
  - Scripting (config validation)
  - Security (20+ security prompts)
  - Testing (test strategy)
  - Threat_Modeling (exercise)
  - Version_Control (CI/CD, code review, commit messages)

- **Mcp_Servers** - MCP server integration prompts
  - Ax-Platform (ax-prompt-pack, ax-workspace)
  - Nano-Banana (image generation)
  - Notion (notion integration)
  - Obsidian (obsidian vault)
  - Other (context7, gifgrep, google-places)

- **Social_Media** - Social media campaign prompts
  - Campaigns (10 campaign templates)
  - Content (content calendar)

- **Video** - Video creation prompts
  - Podcasts (10+ podcast production prompts)

- **Writing** - Writing prompt templates
  - Blogs (blog post)
  - Books (character design, plot beats, marketing funnel, etc.)
  - Content (concept explainer, newsletter, podcast script)
  - Cookbooks (25+ cookbook creation prompts)
  - Create_Documentation (knowledge base, technical docs)
  - Other (novelist, comedian, trivia generator)
  - Technical (case study, white paper, documentation)

**Total:** 500+ prompt templates

---

#### 4. **Skills** (🛠️)
Executable skill workflows with supporting scripts and documentation

**Subcategories:**
- **AX-Platform** - aX Platform workspace skills
  - AX_Workspace_Cookbooks_SKILL

- **Cooking** - Recipe and food skills
  - generate-recipe-images
  - new-recipe

- **Development** - Software development skills
  - backend-api-design
  - claude-api (multi-language SDK examples)
  - docker-compose-generator
  - frontend-design
  - mcp-builder (with evaluation scripts)
  - react-component-generator
  - skill-creator (comprehensive skill authoring system)
  - sql-query-optimizer
  - web-artifacts-builder (with bundling scripts)
  - webapp-testing (Playwright automation)

- **Finance** - Financial skills
  - financial-analysis

- **News** - News aggregation skills
  - ai-news-digest
  - daily-news-collage

- **Podcasts** - Podcast production skills
  - end-daily-podcast-topic
  - podcast-topic-picker

- **SIEM** - Security skills
  - siem-cve-workflow

**Total:** 20+ executable skills with 100+ supporting files

---

#### 5. **System_Prompts** (⚙️)
LLM system prompts and configurations

**Subcategories:**
- **Ai_Experts** - AI expert system prompts
  - Ai_Art_&_Design (UI/UX designer)
  - Ai_Education (AI ethics educator, Python teacher)
  - Ai_Gaming (game designer)
  - Ai_Research (experiment designer)

- **Ax-Platform** - aX Platform system prompts
  - Fantasy-Football (DFS assistant)
  - Prompt-Engineering (prompt organizer)
  - Religious-Researcher
  - Thread-Detection (anomaly scout, compliance guard, fraud investigator, threat intel)

- **Business** - Business system prompts
  - General (B2B sales consultant, process optimizer)

- **Gemini_Gems** - Google Gemini gem prompts
  - General (brainstormer, career guide, coding partner, learning coach, writing editor)

- **Llm_Instructions** - Official LLM system prompt leaks/documentation
  - Anthropic (Claude variants: 3, 3.5, 4, 4.5, Opus, Sonnet, Haiku, Chrome extension, Cowork, Computer Use)
  - Atlassian (Rovo dev)
  - Augment_Code
  - Brave (Leo)
  - Copilot (GitHub Copilot CLI, VS, VSCode, Web, Microsoft Copilot variants)
  - Cursor.Com
  - Databricks (DBRX)
  - Deepseek
  - Docker (Docker AI)
  - Google (Gemini variants: 1.5, 2.0, 2.5, 3.0, NotebookLM, Jules)
  - Hume.Ai
  - Meta.Ai (Llama 3, Llama 4)
  - Misc (Cluely, Codium Windsurf, Limitless AI, Manus, Providence, Vogent)
  - Mistral (LeChat)
  - Openai (GPT-3.5, GPT-4 variants, GPT-4o, GPT-4.5, GPT-5, Canvas, DALL-E, Voice, Tasks)
  - Perplexity.Ai (Desktop, Pro, Spaces)
  - Proton (Lumo)
  - Quillbot
  - Qwen
  - Rabbit-R1
  - Sleephq (Darth assistant)
  - V0.Dev
  - Venice.Ai
  - Voilà
  - Xai (Grok variants: Grok, Grok 2, Grok 4, Grok 4 Fast, Grok 4 Expert)

**Total:** 100+ system prompt configurations

---

## 🎯 Changes Made

### Code Changes

#### Frontend (src/App.tsx)
1. **Updated activeTab type:**
   ```typescript
   OLD: 'my-prompts' | 'collections' | 'system-prompts' | 'agent-guides' | 'skills'
   NEW: 'agent-guides' | 'agent-instructions' | 'prompt-library' | 'skills' | 'system-prompts'
   ```

2. **Changed default tab:**
   ```typescript
   OLD: useState('my-prompts')
   NEW: useState('prompt-library')
   ```

3. **Updated section mapping:**
   - Removed: My_Prompts, Collections
   - Added: Agent_Instructions, Prompt_Library
   - Kept: Agent_Guides, Skills, System_Prompts

4. **Updated navigation dropdown:**
   ```typescript
   📚 Prompt Library (default)
   👤 Agent Instructions (new)
   📖 Agent Guides
   ⚙️ System Prompts
   🛠️ Skills
   ```

5. **Updated all display text:**
   - Hero section heading
   - Breadcrumb navigation
   - Section headings
   - Filter labels

#### Backend (server.ts, api/index.ts)
1. **Changed root folder:**
   ```typescript
   OLD: path.join(__dirname, "prompts")
   NEW: path.join(__dirname, "library")
   ```

2. **Updated all path references:**
   - Replaced all `"prompts"` with `"library"`
   - Updated GitHub tree filtering: `prompts/` → `library/`
   - Updated path replacements: `prompts/` → `library/`

### File Statistics

**Total changes:** 932 files
- **Added:** 800+ markdown files
- **Modified:** 3 code files (App.tsx, server.ts, api/index.ts)
- **Insertions:** 241,335 lines
- **Deletions:** 38 lines

**Content breakdown:**
- Agent Instructions: ~300 files
- Prompt Library: ~500 files
- Skills: ~100 files (including scripts/references)
- System Prompts: ~100 files
- Agent Guides: ~10 files

---

## 🚀 Migration Benefits

### Better Organization
- **Domain-based hierarchy** - Content grouped by functional area
- **Clearer naming** - "Agent Instructions" vs vague "Collections"
- **Separation of concerns** - Instructions vs Templates vs Executables

### Improved Navigation
- **Logical sections** - Agent Instructions (who), Prompt Library (what), Skills (how)
- **Consistent structure** - Every section has clear subcategories
- **Scalability** - Easy to add new content without structural changes

### Future-Ready
- **"Library" vs "My Library"** - Foundation for public vs personal collections
- **My_Prompts preserved** - User's personal collection folder backed up
- **Clean slate** - Public library is now the default experience

---

## 📝 Backwards Compatibility

### Breaking Changes
❌ **Old paths no longer work:**
- `prompts/My_Prompts/*` → Not accessible in UI
- `prompts/Collections/*` → Migrated to `library/Prompt_Library/*`
- `prompts/System_Prompts/*` → Migrated to `library/System_Prompts/*`
- `prompts/Agent_Guides/*` → Migrated to `library/Agent_Guides/*`
- `prompts/Skills/*` → Migrated to `library/Skills/*`

### Preserved Content
✅ **Backup retained:**
- Original `prompts/` folder still exists in repo
- Will be removed after verification
- My_Prompts backed up for future "My Library" feature

---

## 🎨 User Experience Changes

### Default View
**Before:** My Prompts (often empty for new users)  
**After:** Prompt Library (full of curated templates)

### Navigation Flow
**Before:**
1. Select "My Prompts" → Empty
2. Select "Collections" → Some content
3. Select "System Prompts" → More content

**After:**
1. Land on "Prompt Library" → Immediate value
2. Browse "Agent Instructions" → Find personas
3. Check "Skills" → Executable workflows

### Visual Changes
- **Icons updated** - New emoji icons for each section
- **Labels improved** - More descriptive names
- **Order optimized** - Most useful sections first

---

## 🔮 Future Plans

### Phase 1 (Completed) ✅
- Reorganize content into `library/` structure
- Update UI to use new sections
- Preserve My_Prompts for future use

### Phase 2 (Upcoming)
- Add "Library" vs "My Library" toggle button
- Implement user's personal collection (My_Prompts)
- Add save/bookmark functionality from Library to My Library

### Phase 3 (Future)
- User authentication
- Personal cloud storage for My Library
- Sharing/collaboration features
- Community-contributed content

---

## 📊 Impact Summary

### Content Statistics
- **800+ files** reorganized
- **5 main sections** (was 5 but different)
- **40+ subcategories** (was ~10)
- **300+ agent instructions** (new category)
- **500+ prompt templates** (reorganized from Collections)
- **20+ executable skills** (preserved)
- **100+ system prompts** (reorganized)

### Code Statistics
- **3 files modified** (App.tsx, server.ts, api/index.ts)
- **~200 lines changed** (mostly search/replace)
- **TypeScript clean** - No compilation errors
- **Build successful** - All changes validated

### User Impact
- **Better discovery** - Content easier to find
- **Clearer purpose** - Each section has defined role
- **More value** - Default view shows curated templates
- **Future-ready** - Foundation for personal collections

---

**Migration Date:** March 14, 2026  
**Completed:** 9:42 PM PST  
**Commit:** `49fbb52`  
**Status:** ✅ Deployed to mike_desktop branch  
**Breaking:** Yes - requires fresh pull for local dev

---

## 🔗 Related Documentation
- Original Changelog: `CHANGELOG-2026-03-14.md`
- Local Setup: `LOCAL_SETUP.md`
- Debug Guide: `DEBUG_UI.md`
