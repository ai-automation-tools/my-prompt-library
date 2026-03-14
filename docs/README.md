# My Prompt Library Documentation

Complete documentation for the Prompt Library application.

---

## 📚 Documentation Index

### Getting Started
- **[Setup Guide](./SETUP.md)** - Complete setup instructions for local and GitHub modes
- **[Quick Reference](./QUICK_REFERENCE.md)** - Fast toggle guide for switching modes

### Technical Documentation
- **[GitHub API Integration](./GITHUB_MODE.md)** - How the GitHub integration works
- **[Architecture](./ARCHITECTURE.md)** - System architecture and design decisions

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/michaelschecht/my-prompt-library.git
cd my-prompt-library
git checkout mike_desktop

# 2. Install dependencies
npm install

# 3. Start development server
vercel dev

# 4. Open browser
http://localhost:3000
```

**Default mode:** Local filesystem (no GitHub API)

---

## 🔀 Two Operating Modes

### 🏠 Local Mode (Default)
- Reads from local `prompts/` directory
- Fast, no API calls
- Perfect for development
- **Current default**

### ☁️ GitHub Mode
- Fetches from GitHub repository
- Batched API calls (50 at a time)
- 5-minute cache
- Required for production deployment

**Toggle:** Set `USE_GITHUB_MODE=true` in `.env`

---

## 📖 Documentation Files

| File | Description |
|------|-------------|
| `SETUP.md` | Complete setup guide with troubleshooting |
| `QUICK_REFERENCE.md` | One-page toggle guide |
| `GITHUB_MODE.md` | GitHub integration details |
| `ARCHITECTURE.md` | System architecture overview |

---

## 🆘 Common Issues

### Rate Limit Exceeded
**Solution:** Use local mode (`USE_GITHUB_MODE=false`)

### Prompts Not Loading
**Local mode:** Check `prompts/` directory exists  
**GitHub mode:** Verify `GITHUB_TOKEN` is valid

### Slow Loading
**Solution:** Enable local mode for development

Full troubleshooting: See [SETUP.md](./SETUP.md)

---

## 🔗 Links

- **GitHub Repository:** https://github.com/michaelschecht/my-prompt-library
- **Vercel Deployment:** [Your Vercel URL]
- **GitHub API Docs:** https://docs.github.com/en/rest

---

**Last Updated:** March 14, 2026
