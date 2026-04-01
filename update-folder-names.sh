#!/bin/bash
# Update app to use new reorganized folder names

echo "Updating src/App.tsx with new folder names..."

# Update folder mappings in App.tsx
sed -i "s|activeTab === 'agent-guides' ? 'Agent_Guides'|activeTab === 'guides' ? '1_Guides'|g" src/App.tsx
sed -i "s|activeTab === 'agents' ? 'Agents'|activeTab === 'agents' ? '2_Agents'|g" src/App.tsx  
sed -i "s|activeTab === 'prompt-library' ? 'Prompt_Library'|activeTab === 'prompts' ? '4_Prompts'|g" src/App.tsx
sed -i "s|activeTab === 'system-prompts' ? 'System_Prompts'|activeTab === 'system-prompts' ? '5_System_Prompts'|g" src/App.tsx
sed -i "s|'Skills'|'3_Skills'|g" src/App.tsx

# Update filter checks
sed -i "s|!prompt.id.startsWith('Agent_Guides/')|!prompt.id.startsWith('1_Guides/')|g" src/App.tsx
sed -i "s|!prompt.id.startsWith('Agents/')|!prompt.id.startsWith('2_Agents/')|g" src/App.tsx
sed -i "s|!prompt.id.startsWith('Prompt_Library/')|!prompt.id.startsWith('4_Prompts/')|g" src/App.tsx
sed -i "s|!prompt.id.startsWith('System_Prompts/')|!prompt.id.startsWith('5_System_Prompts/')|g" src/App.tsx
sed -i "s|!prompt.id.startsWith('Skills/')|!prompt.id.startsWith('3_Skills/')|g" src/App.tsx

# Update section checks
sed -i "s|prompt.section === 'Skills'|prompt.section === '3_Skills'|g" src/App.tsx
sed -i "s|prompt.section === 'Agent_Guides'|prompt.section === '1_Guides'|g" src/App.tsx
sed -i "s|prompt.section === 'Agents'|prompt.section === '2_Agents'|g" src/App.tsx
sed -i "s|prompt.section === 'Prompt_Library'|prompt.section === '4_Prompts'|g" src/App.tsx
sed -i "s|prompt.section === 'System_Prompts'|prompt.section === '5_System_Prompts'|g" src/App.tsx

# Update URL params (optional - keep old names for backward compat)
sed -i "s|'agent-guides' : 'agent-guides'|'guides' : 'guides'|g" src/App.tsx
sed -i "s|'prompt-library' : 'prompt-library'|'prompts' : 'prompts'|g" src/App.tsx

# Update display names (keep user-friendly)
sed -i "s|'Agent Guides'|'Guides'|g" src/App.tsx

echo "✅ App.tsx updated!"
echo "✅ server.ts already updated!"
echo "✅ PromptEditorModal.tsx already updated!"
echo ""
echo "Summary of changes:"
echo "  - Agent_Guides → 1_Guides"
echo "  - Agents → 2_Agents"
echo "  - Skills → 3_Skills"
echo "  - Prompt_Library → 4_Prompts"
echo "  - System_Prompts → 5_System_Prompts"
echo ""
echo "Next steps:"
echo "  1. Review changes: git diff"
echo "  2. Test locally: npm run dev"
echo "  3. Commit changes: git add . && git commit -m 'feat: update app to use reorganized folder structure'"
