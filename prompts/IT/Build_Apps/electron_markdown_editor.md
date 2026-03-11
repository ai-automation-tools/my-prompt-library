# Electron Markdown Editor

Build a fast, native-feeling Markdown editor using Electron, featuring a live preview, file system integration, and customizable themes.

---

## Role & Context

You are a desktop application developer specializing in Electron and web technologies, building a robust developer tool.

**Tech Stack (Fixed):**
- **Core:** Electron (Node.js backend, Chromium frontend)
- **Frontend Framework:** React 18 with TypeScript
- **Styling:** CSS Modules or Tailwind CSS
- **Markdown Parsing:** Remark/Rehype or Markdown-It
- **Build Tooling:** Electron Forge or Electron Builder

---

## Product Requirements

### Core Features

#### 1) Text Editing & Live Preview
A seamless writing experience.
- Split-pane interface (Editor on left, live HTML preview on right).
- Syntax highlighting for Markdown and nested code blocks.
- Synchronized scrolling between editor and preview.

#### 2) File System Integration
Manage local files natively.
- Open, save, and "save as" functionality using native OS dialogs.
- Sidebar file explorer for managing a workspace/folder.
- Auto-save feature.

#### 3) Customization & Export
Tailor the app to user preferences.
- Light and dark themes toggled via a settings menu.
- Export Markdown to PDF and raw HTML.
- Customizable font sizes and families.

---

## Technical Requirements

### Architecture
Strict separation of Main process and Renderer process via Inter-Process Communication (IPC). `contextBridge` must be used to expose a secure API to the renderer process (no `nodeIntegration` in the renderer).

### IPC Design (Preload Script)
- `window.api.readFile(filePath)`
- `window.api.saveFile(filePath, content)`
- `window.api.openFileDialog()`
- `window.api.exportToPdf(htmlContent, destPath)`

### Security Requirements
- Ensure `contextIsolation` is enabled.
- Disable `nodeIntegration` in the BrowserWindow configuration.
- Sanitize rendered HTML in the preview pane to prevent XSS attacks if opening untrusted files (e.g., using DOMPurify).

### Performance Requirements
- Application must open in under 2 seconds.
- Typing latency in the editor must remain under 50ms, even with large files (10,000+ words).

---

## Implementation Details

### Editor Implementation
- Use a dedicated code editor component like Monaco Editor or CodeMirror 6 for the editing pane, rather than a plain `<textarea>`, to support advanced features like bracket matching and line numbers.

### Main Process Setup
- Handle application lifecycle events properly (quit when all windows closed, except on macOS).
- Implement custom application menus (File, Edit, View, Window, Help) that trigger IPC messages to the renderer.

---

## UI/UX Requirements

### Key Pages/Views
1. **Main Window:** Contains the sidebar (collapsible), editor pane, and preview pane.
2. **Settings Modal:** UI for changing themes, auto-save toggle, and default export paths.

### Design Principles
- Minimalist, distraction-free writing mode.
- Native feel: use OS-specific window controls and styling hints where appropriate.
- Responsive pane resizing via drag handles.

---

## Testing & Validation

### Unit Tests
- Test Markdown parsing and HTML sanitization utilities using Jest/Vitest.

### E2E Tests
- Use Playwright with Electron support or Spectron (if maintained) to test the native application flow (e.g., clicking 'Save' triggers the IPC bridge).

---

## Deployment & Operations

### Environment Setup
- Configure Electron Forge makers for Windows (Squirrel), macOS (DMG/ZIP), and Linux (AppImage/DEB).

### Deployment Steps
1. Configure code signing certificates for Windows (Authenticode) and macOS (Apple Developer ID).
2. Setup GitHub Actions to build and publish release artifacts on tagging a new version.

### Monitoring & Logging
- Implement `electron-log` for writing application logs to the local file system.

---

## Documentation Requirements

Generate:
- [ ] README.md with developer setup and build instructions
- [ ] Security architecture overview detailing the preload script
- [ ] Release notes template

---

## Constraints & Limitations

- Application size should be kept as small as possible (target under 150MB installer size).
- Must work entirely offline.

---

## Success Criteria

The project is complete when:
- [ ] A user can type Markdown and see a live HTML preview.
- [ ] Files can be opened, edited, and saved back to the disk.
- [ ] IPC communication is secure and context-isolated.
- [ ] The application can be packaged into an executable for at least one major OS.

---

## Tags

`#project` `#electron` `#react` `#desktop` `#markdown` `#build`

---

**Version:** 1.0 | **Created:** 2024-03-05 | **Updated:** 2024-03-05