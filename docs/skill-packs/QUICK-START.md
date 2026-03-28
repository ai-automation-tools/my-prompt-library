# Quick Start: Creating a Skill Pack

Fast guide to creating your first skill pack.

---

## 1. Find Skills

List all available skills:

```bash
find library/Skills -name "SKILL.md" -type f | sort
```

Or browse specific categories:

```bash
ls -R library/Skills/Development/
ls -R library/Skills/Finance/
ls -R library/Skills/Security/
```

---

## 2. Copy Template

```bash
cp docs/skill-packs/PACK-TEMPLATE.json library/Skills/packs/my-pack.json
```

---

## 3. Edit Manifest

Open `library/Skills/packs/my-pack.json` and fill in:

**Required Changes:**
- `name` - Your pack's display name
- `id` - Lowercase-with-hyphens identifier  
- `description` - What the pack does (1-2 sentences)
- `icon` - Relevant emoji
- `category` - Primary category
- `tags` - 3-6 relevant keywords
- `skills` array - Add your selected skills

**Skill Entry Format:**
```json
{
  "path": "library/Skills/Category/skill-folder/SKILL.md",
  "name": "Skill Display Name",
  "description": "What it does"
}
```

**Optional but Recommended:**
- `prerequisites` - Tools and knowledge needed
- `use_cases` - Common scenarios
- `installation_notes` - Setup help

---

## 4. Verify Paths

Make sure all skill paths exist:

```bash
# Test each skill path
cat library/Skills/Git/gh-address-comments/SKILL.md
cat library/Skills/Development/API/backend-api-design/SKILL.md
```

---

## 5. Validate JSON

```bash
# Check for syntax errors
node -e "console.log(JSON.parse(require('fs').readFileSync('library/Skills/packs/my-pack.json')))"
```

If successful, you'll see your pack object printed.

---

## 6. Test Locally

```bash
# Start dev server
npm run dev

# Open browser
open http://localhost:3010

# Navigate to Skill Packs tab
# Find your pack and click it
# Click Download ZIP to test
```

---

## 7. Commit and Deploy

```bash
git add library/Skills/packs/my-pack.json
git commit -m "Add [Pack Name] skill pack"
git push origin main
```

Vercel will automatically deploy in ~2 minutes.

---

## Quick Tips

**Ideal Pack Size:** 5-15 skills

**Naming:**
- ID: `web-dev-essentials-pack`
- Name: `Web Dev Essentials Pack`

**Icon Selection:**
- 💻 Development
- 💰 Finance  
- 📋 Planning
- 🎨 Design
- 🔐 Security
- 📊 Analytics
- 🤖 AI/ML

**Categories:**
Use existing: Development, Finance, Productivity, Engineering, Business, Security, Science, Documentation

**Testing Checklist:**
- [ ] Pack appears in list
- [ ] All skills load in detail view
- [ ] ZIP download works
- [ ] ZIP contains all files

---

## Common Mistakes

❌ **Wrong Path:** `library/Skills/Git/gh-address-comments`  
✅ **Correct:** `library/Skills/Git/gh-address-comments/SKILL.md`

❌ **Invalid JSON:** Missing comma, trailing comma, unquoted strings  
✅ **Valid:** Run node validation command above

❌ **Nonexistent Skill:** Path doesn't exist in repo  
✅ **Verify:** Use `cat` or `ls` to check path

---

## Example Pack

Minimal working pack:

```json
{
  "name": "Git Essentials Pack",
  "id": "git-essentials-pack",
  "description": "Core Git skills for version control and collaboration",
  "icon": "🔀",
  "version": "1.0.0",
  "author": "my-prompt-library",
  "tags": ["git", "version-control", "collaboration"],
  "category": "Development",
  "skills": [
    {
      "path": "library/Skills/Git/gh-address-comments/SKILL.md",
      "name": "GitHub PR Comment Handler",
      "description": "Address review comments on PRs"
    },
    {
      "path": "library/Skills/Git/git-commit-helper/SKILL.md",
      "name": "Git Commit Helper",
      "description": "Write clear conventional commits"
    }
  ],
  "prerequisites": {
    "required_tools": ["git", "gh"],
    "optional_tools": [],
    "recommended_knowledge": ["Git basics", "GitHub workflow"]
  },
  "installation_notes": "Ensure GitHub CLI (gh) is installed and authenticated.",
  "use_cases": [
    "Contributing to open source projects",
    "Team code review workflows",
    "Maintaining clean commit history"
  ],
  "related_packs": ["developer-essentials-pack"],
  "created_at": "2026-03-28",
  "updated_at": "2026-03-28"
}
```

---

## Need Help?

See full documentation: [README.md](README.md)
