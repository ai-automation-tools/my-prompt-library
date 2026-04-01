#!/usr/bin/env python3
"""Fix skill pack paths to match actual file locations."""

import json
import os
from pathlib import Path

# Base directory
REPO_ROOT = Path(__file__).parent.parent.parent.parent
SKILLS_ROOT = REPO_ROOT / "library" / "3_Skills"
PACKS_DIR = REPO_ROOT / "library" / "3_Skills" / "packs"

def find_skill_file(skill_name: str) -> str | None:
    """Find the actual path to a SKILL.md file by searching the library."""
    # Try to find SKILL.md files that match
    for skill_dir in SKILLS_ROOT.rglob(skill_name):
        if skill_dir.is_dir():
            skill_md = skill_dir / "SKILL.md"
            if skill_md.exists():
                # Return relative path from repo root
                rel_path = skill_md.relative_to(REPO_ROOT)
                return str(rel_path)
    return None

def extract_skill_dir_name(path: str) -> str:
    """Extract the skill directory name from a path."""
    # e.g., "library/3_Skills/Git/gh-address-comments/SKILL.md" -> "gh-address-comments"
    parts = Path(path).parts
    if "SKILL.md" in parts:
        return parts[-2]  # directory before SKILL.md
    return parts[-1]

def fix_pack_file(pack_path: Path):
    """Fix paths in a single pack JSON file."""
    print(f"\n=== Processing {pack_path.name} ===")
    
    with open(pack_path, 'r') as f:
        pack_data = json.load(f)
    
    fixed_count = 0
    not_found = []
    
    for skill in pack_data.get('skills', []):
        old_path = skill['path']
        skill_dir_name = extract_skill_dir_name(old_path)
        
        # Try to find the actual file
        new_path = find_skill_file(skill_dir_name)
        
        if new_path:
            if new_path != old_path:
                print(f"  ✓ {skill_dir_name}")
                print(f"    OLD: {old_path}")
                print(f"    NEW: {new_path}")
                skill['path'] = new_path
                fixed_count += 1
            else:
                print(f"  ✓ {skill_dir_name} (already correct)")
        else:
            print(f"  ✗ {skill_dir_name} - NOT FOUND")
            not_found.append(skill_dir_name)
    
    if fixed_count > 0:
        # Update the updated_at timestamp
        from datetime import date
        pack_data['updated_at'] = str(date.today())
        
        # Write back
        with open(pack_path, 'w') as f:
            json.dump(pack_data, f, indent=2)
        
        print(f"\n✅ Fixed {fixed_count} paths in {pack_path.name}")
    else:
        print(f"\n✅ No changes needed for {pack_path.name}")
    
    if not_found:
        print(f"\n⚠️  Could not find {len(not_found)} skills:")
        for skill_name in not_found:
            print(f"   - {skill_name}")

def main():
    """Fix all pack files."""
    pack_files = list(PACKS_DIR.glob("*.json"))
    pack_files = [p for p in pack_files if p.name != "package.json"]
    
    print(f"Found {len(pack_files)} pack files to process")
    
    for pack_file in pack_files:
        fix_pack_file(pack_file)
    
    print("\n" + "="*60)
    print("✅ All packs processed!")

if __name__ == "__main__":
    main()
