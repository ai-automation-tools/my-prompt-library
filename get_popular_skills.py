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
    queries = ['a', 'e', 'i', 'o', 'u', 'developer', 'agent', 'marketing', 'data']
    all_skills = []
    seen_urls = set()

    for q in queries:
        skills = get_skills(q)
        for s in skills:
            url = s.get('githubUrl')
            if url and url not in seen_urls:
                seen_urls.add(url)
                all_skills.append(s)

    # Sort by stars descending
    all_skills.sort(key=lambda x: x.get('stars', 0), reverse=True)

    for s in all_skills[:15]:
        print(f"Name: {s.get('name')}")
        print(f"Author: {s.get('author')}")
        print(f"Stars: {s.get('stars')}")
        print(f"Category: {s.get('category', 'None')}")
        print(f"GitHub: {s.get('githubUrl')}")
        print(f"Skill URL: {s.get('skillUrl')}")
        print("-" * 50)

if __name__ == "__main__":
    main()
