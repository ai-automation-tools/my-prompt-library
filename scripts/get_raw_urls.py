import urllib.request
import json
import sys

def get_skills(query):
    url = f"https://skillsmp.com/api/v1/skills/search?q={query}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            return data.get('data', {}).get('skills', [])
    except Exception as e:
        print(f"Error fetching skills: {e}")
        return []

def main():
    queries = ['data', 'audit', 'cli']
    all_skills = []
    seen_urls = set()

    for q in queries:
        skills = get_skills(q)
        for s in skills:
            url = s.get('githubUrl')
            if url and url not in seen_urls:
                seen_urls.add(url)
                all_skills.append(s)

    all_skills.sort(key=lambda x: x.get('stars', 0), reverse=True)

    for s in all_skills[:15]:
        print(f"Name: {s.get('name')}")
        print(f"Stars: {s.get('stars')}")
        github_url = s.get('githubUrl')
        print(f"GitHub: {github_url}")

        # Construct raw URL
        if github_url and 'github.com' in github_url:
            parts = github_url.replace('https://github.com/', '').split('/')
            if len(parts) >= 4 and parts[2] == 'tree':
                user = parts[0]
                repo = parts[1]
                branch = parts[3]
                path = '/'.join(parts[4:])
                raw_url = f"https://raw.githubusercontent.com/{user}/{repo}/{branch}/{path}/SKILL.md"
            elif len(parts) >= 2: # No branch specified in URL, assume main and no inner path
                user = parts[0]
                repo = parts[1]
                raw_url = f"https://raw.githubusercontent.com/{user}/{repo}/main/SKILL.md"
            print(f"Raw URL: {raw_url}")
        print("-" * 50)

if __name__ == "__main__":
    main()
