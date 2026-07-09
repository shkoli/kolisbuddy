<div align="center">

<img src="public/favicon.svg" alt="Koli's Buddy Logo" width="80" height="80" />

# Koli's Buddy

**A floating productivity timer for Windows, built for deep work.**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-43-47848F?style=flat-square&logo=electron&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-pink?style=flat-square)

[Features](#features) • [Getting Started](#getting-started) • [Build](#build-for-windows) • [Tech Stack](#tech-stack)

</div>

---

## What is this?

Koli's Buddy is a small always-on-top desktop timer I built for Windows. It floats above everything else on your screen so you can track exactly how long you spend on each task — no alt-tabbing, no switching windows, no losing focus.

I built it because most timer apps are either too minimal (no history, no context) or too bloated (cloud sync, accounts, dashboards you never check). I wanted something that sits quietly on my screen, lets me log what I'm actually doing, and shows me a real total at the end of the day.

---

## Features

- **Always-on-top floating window** — stays visible over every other app
- **Session timer** with Start, Pause, Resume, and Done controls
- **Task types** — Study, Coding, Reading, Revision, or Custom
- **Task description** — write a quick note before you start so you remember what you worked on
- **Daily total** — see your total focused time and session count for the day
- **Session history** — review every completed session at a glance
- **Pink / Blue theme toggle** — switch the color scheme to match your mood
- **Click-to-rename title** — make it yours
- **Fully offline** — no accounts, no cloud, no tracking. Everything saves to localStorage.
- **Windows installer** — packages as a .exe with electron-builder

---

## Getting Started

You need **Node.js v18 or higher**.

```bash
git clone https://github.com/shkoli/kolisbuddy.git
cd kolisbuddy
npm install
```

**Run in browser (React only):**
```bash
npm run dev
```

**Run as desktop app (Electron):**
```bash
npm run electron-dev
```

---

## Build for Windows

```bash
npm run dist
```

Outputs to `dist/`:
- `Koli's Buddy Setup 0.0.0.exe` — Windows installer
- `Koli's Buddy 0.0.0.exe` — portable executable (no install needed)

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Desktop | Electron 43 |
| Packaging | electron-builder |
| Storage | localStorage |

---

## Project Structure
