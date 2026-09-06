# DevDock

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=700&size=42&duration=3000&pause=900&color=111827&center=true&vCenter=true&width=900&height=80&lines=DevDock;Your+Developer+Workspace;Build.+Debug.+Ship." alt="DevDock" />
</p>

<p align="center">
  <strong>A focused developer workspace for the tools you use every day.</strong>
</p>

<p align="center">
  <a href="https://faizan-khan144.github.io/devdock/">Live Demo</a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="https://github.com/Faizan-khan144/devdock">Repository</a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="#contributing">Contribute</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/Faizan-khan144/devdock?style=flat-square&color=111827" />
  <img src="https://img.shields.io/github/forks/Faizan-khan144/devdock?style=flat-square&color=111827" />
  <img src="https://img.shields.io/github/license/Faizan-khan144/devdock?style=flat-square&color=111827" />
  <img src="https://img.shields.io/github/last-commit/Faizan-khan144/devdock?style=flat-square&color=111827" />
</p>

<br>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=0:ffffff,100:eef4ff&height=2&section=header" width="90%" />
</p>

## Product

DevDock brings frequently used developer utilities into one clean, fast workspace.

Instead of opening multiple websites for JSON formatting, Base64 encoding, UUID generation, password creation, regex testing, color conversion and snippets, DevDock keeps everything together.

**One workspace. Less context switching. More building.**

---

## Preview

> Add your real screenshot here as `preview.png`.

<p align="center">
  <img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/42d79759-c6af-423b-86f6-6ac60cdf8aa4" />
  <img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/893c6268-3338-48fa-a996-1e0d2c619ff9" />

</p>

<p align="center">
  <sub>DevDock — developer utilities inside a focused workspace.</sub>
</p>

---

## Why DevDock?

Most developer tools solve one tiny problem.

DevDock takes a different approach:

```text
                  DEVDOCK
                     │
        ┌────────────┼────────────┐
        │            │            │
      BUILD        DEBUG        FOCUS
        │            │            │
     Utilities     Testing     Productivity
        │            │            │
        └────────────┼────────────┘
                     │
              One workspace
```

The goal is simple:

**Open DevDock → choose a tool → get the job done → keep coding.**

---

## Core Tools

| Tool               | Purpose                               |
| ------------------ | ------------------------------------- |
| JSON Toolkit       | Format, validate and inspect JSON     |
| Base64             | Encode and decode Base64 strings      |
| UUID Generator     | Generate unique UUIDs instantly       |
| Password Generator | Create secure random passwords        |
| Regex Tester       | Test regular expressions against text |
| Color Lab          | Work with colors and color values     |
| Snippets           | Save and reuse frequently used code   |
| Focus Timer        | Stay focused while working            |

---

## Built for Developers

### Fast

No unnecessary pages or complicated workflows.

### Local-first

Your everyday tool interactions are designed to happen directly in the browser whenever possible.

### Focused

The interface is designed around getting the task done instead of surrounding it with unnecessary UI.

### Responsive

Use DevDock across desktop, tablet and smaller screens.

### Keyboard-friendly

Common actions are designed to be quick and accessible while coding.

---

## Interface

DevDock uses a workspace layout designed around a simple hierarchy:

```text
┌─────────────────────────────────────────────────────────────┐
│                         DevDock                             │
├───────────────┬─────────────────────────────────────────────┤
│               │                                             │
│   Navigation  │              Workspace                      │
│               │                                             │
│   Overview    │       ┌─────────────────────┐               │
│   JSON        │       │                     │               │
│   Base64      │       │       TOOL          │               │
│   UUID        │       │                     │               │
│   Password    │       │                     │               │
│   Regex       │       └─────────────────────┘               │
│   Colors      │                                             │
│   Snippets    │                                             │
│   Timer       │                                             │
│               │                                             │
└───────────────┴─────────────────────────────────────────────┘
```

The UI intentionally avoids excessive visual effects, noisy gradients and unnecessary decoration.

---

## Search

DevDock includes global tool search so you can quickly jump to the utility you need.

```text
Search tools...

JSON
Base64
UUID
Password
Regex
Color
Snippets
Focus Timer
```

No digging through menus.

Just search and go.

---

## Themes

DevDock supports both light and dark interfaces.

Theme preference is persisted locally so your workspace stays consistent between sessions.

---

## Architecture

```text
React Application
       │
       ├── App Shell
       │    ├── Sidebar
       │    ├── Topbar
       │    └── Workspace
       │
       ├── Developer Tools
       │    ├── JSON
       │    ├── Base64
       │    ├── UUID
       │    ├── Password
       │    ├── Regex
       │    └── Colors
       │
       ├── Productivity
       │    ├── Focus Timer
       │    └── Snippets
       │
       └── Browser Storage
            └── Local Preferences
```

---

## Technology

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,vite,js,html,css,git,github" />
</p>

### Stack

* React
* Vite
* JavaScript
* HTML5
* CSS3
* Lucide Icons
* Browser APIs
* Local Storage

---

## Project Structure

```text
devdock/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── public/
│
├── src/
│   ├── main.jsx
│   ├── styles.css
│   │
│   └── components/
│       ├── Overview
│       ├── FocusTimer
│       ├── Snippets
│       ├── JsonTool
│       ├── Base64Tool
│       ├── UuidTool
│       ├── PasswordTool
│       ├── RegexTool
│       └── ColorLab
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Getting Started

### Clone

```bash
git clone https://github.com/Faizan-khan144/devdock.git
cd devdock
```

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Keyboard Workflow

| Action       | Shortcut         |
| ------------ | ---------------- |
| Search tools | `Ctrl / Cmd + K` |
| Copy output  | `Ctrl / Cmd + C` |
| Navigate     | Mouse / Keyboard |
| Toggle theme | Theme control    |

> Shortcut availability may vary depending on the active browser and tool.

---

## Privacy

DevDock is designed around a simple principle:

> **Your developer utilities should not need your data to be useful.**

Where functionality can run directly inside the browser, DevDock keeps processing client-side rather than requiring a backend.

No account is required for the core workspace.

---

## Roadmap

```text
[x] Developer workspace
[x] Global tool search
[x] JSON toolkit
[x] Base64 tools
[x] UUID generator
[x] Password generator
[x] Regex tester
[x] Color tools
[x] Snippets
[x] Focus timer
[x] Light / dark themes
[x] GitHub Pages deployment

[ ] Improved snippet management
[ ] More developer utilities
[ ] Import / export workspace data
[ ] Custom keyboard shortcuts
[ ] Advanced JSON inspection
[ ] Workspace customization
```

---

## Design Principles

DevDock follows a few simple principles:

```text
01  Simple
    Remove unnecessary complexity.

02  Fast
    Get from idea to result quickly.

03  Focused
    Keep the interface quiet.

04  Useful
    Every feature should solve a real problem.

05  Local-first
    Prefer browser-side processing whenever practical.
```

---

## Contributing

Contributions are welcome.

If you have an idea for a useful developer utility:

1. Fork the repository
2. Create a feature branch
3. Build your improvement
4. Test it locally
5. Commit your changes
6. Open a pull request

```bash
git checkout -b feature/new-tool
git add .
git commit -m "add new developer tool"
git push origin feature/new-tool
```

---

## Support the Project

If DevDock is useful to you, consider giving the repository a ⭐.

It helps the project get discovered by other developers.

<p align="center">
  <a href="https://github.com/Faizan-khan144/devdock">
    <img src="https://img.shields.io/badge/View_on_GitHub-111827?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="https://faizan-khan144.github.io/devdock/">
    <img src="https://img.shields.io/badge/Open_DevDock-2563eb?style=for-the-badge&logo=googlechrome&logoColor=white" />
  </a>
</p>

---

## Developer

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=18&duration=2500&pause=800&color=2563EB&center=true&vCenter=true&width=650&height=40&lines=Built+by+Faizan+Khan;Frontend+Developer;MERN+Stack+Developer" />
</p>

<p align="center">
  <a href="https://github.com/Faizan-khan144">GitHub</a>
  &nbsp;•&nbsp;
  <a href="https://faizan-portfolio-kappa.vercel.app/">Portfolio</a>
</p>

---

## License

This project is licensed under the MIT License.

See the `LICENSE` file for details.

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:111827,100:2563eb&height=120&section=footer" />
</p>

<p align="center">
  <strong>DevDock</strong>
  <br>
  <sub>Build. Debug. Ship.</sub>
</p>
