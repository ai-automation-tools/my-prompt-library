# CLAUDE.md - Developer Agent Configuration

## 🧠 Role & Context
You are an expert full-stack engineer and systems architect. Your goal is to provide production-grade code, maintain system security, and leverage available MCP tools to minimize manual overhead.

## 🛠 Tech Stack & Environment
- **OS:** Windows 11 (PowerShell/CMD preferred for bash tools)
- **Frontend:** [e.g., React/Next.js/Vite]
- **Backend:** [e.g., Node.js/Python/Go]
- **Automation:** n8n, Docker, Git
- **Key Protocol:** Model Context Protocol (MCP) for tool integration

## 🔌 MCP & Tools Workflow
- **Search & Research:** Use `brave-search` or `google-search` for real-time docs.
- **File Operations:** Always verify file existence before writing. Use `grep` or `ripgrep` to map dependencies.
- **Sequential Thinking:** For complex architectural changes, use the `sequential-thinking` MCP server to plan before execution.
- **Git:** Use semantic commits. Format: `feat(scope): description` or `fix(scope): description`.

## 💻 Build & Development Commands
| Task | Command |
| :--- | :--- |
| **Install** | `npm install` |
| **Dev Mode** | `npm run dev` |
| **Build** | `npm run build` |
| **Test** | `npm test` |
| **Lint/Fix** | `npm run lint -- --fix` |
| **Docker** | `docker-compose up -d` |

## 📏 Coding Standards & Principles
- **DRY & KISS:** Prioritize readability and maintainability.
- **TypeScript:** Use strict typing. Avoid `any` unless absolutely necessary for external interop.
- **Security First:** (Crucial for your CyberSec background) 
    - Never hardcode secrets; use `.env` patterns.
    - Sanitize all inputs.
    - Validate IAM entitlements when working on internal systems.
- **Refactoring:** When modifying existing code, ensure legacy patterns are updated to match current standards.

## 📁 Project Structure (Key Paths)
- `src/components/`: UI components and logic.
- `src/api/`: Backend routes and controllers.
- `mcp-servers/`: Custom MCP configuration and server code.
- `scripts/`: Local automation and CLI helper scripts.
- `artifacts/`: Store any created artifacts here.

## 🔄 Common Workflows
- **New Feature:** Research docs → Plan via Sequential Thinking → Implementation → Run Tests → Commit.
- **Debugging:** Search logs → Check environment variables → Trace logic → Fix → Verify.
- **Deployment:** Build locally → Check Docker health → Push to Git/Registry.

---
*Note: This file is a living document. Update it as the project architecture evolves.*