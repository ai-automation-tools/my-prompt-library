import os
import glob

def main():
    skill_dirs = glob.glob('library/3_Skills/**/*.md', recursive=True)
    skill_names = [os.path.basename(f) for f in skill_dirs]

    check_names = [
        "data-analyst-pro.md",
        "databricks-execution-compute.md",
        "agent-spec-authoring.md",
        "android-apk-audit.md",
        "agencycli.md",
        "popular-web-designs.md",
        "golang-popular-libraries.md"
    ]

    for name in check_names:
        found = False
        for skill in skill_dirs:
            if name.lower() in skill.lower() or name.replace('.md', '').lower() in skill.lower():
                print(f"FOUND: {name} at {skill}")
                found = True
        if not found:
            print(f"NOT FOUND: {name}")

if __name__ == "__main__":
    main()
