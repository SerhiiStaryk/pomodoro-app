# 🍅 Pomodoro Timer

A modern, fully-featured Pomodoro timer application built with React, TypeScript, and Vite. Stay focused, take breaks, and boost your productivity with this elegant companion.

![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2-646cff?logo=vite)

## ✨ Features

### 🎯 Core Functionality

- **Three Timer Modes**: Work sessions, short breaks, and long breaks
- **Customizable Durations**: Adjust session lengths to fit your workflow
- **Auto-Transitions**: Optional auto-start for breaks and work sessions
- **Session Tracking**: View your completed sessions with detailed history
- **Task List**: Add tasks, mark them done, and delete them
- **Multiple Timer Profiles**: Create and switch between different settings profiles

### 🌍 Localization

- **English + Ukrainian (EN/UA)**: Built-in i18n with language detection and a quick toggle

### 🎨 User Experience

- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Visual Feedback**: Real-time status indicators and smooth animations
- **Browser Notifications**: Get notified when phases transition
- **Audio Alerts**: Pleasant sound notifications for phase changes
- **Title Updates**: Timer displays in browser tab for easy monitoring
- **How-to Modal**: Built-in recommendations for the Pomodoro technique and app usage
- **Installable PWA**: Add to your home screen with offline support

### 💾 Data Persistence

- **LocalStorage Integration**: Settings, tasks, and session history saved automatically
- **Resume Sessions**: Pick up where you left off after browser restart
- **Session Statistics**: Track daily progress and completed sessions

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone or navigate to the project directory:

```bash
cd /Users/sstary/DEV/Pomodo
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and visit: `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 🌐 Deploy to GitHub Pages (Auto)

This repo is configured to deploy automatically to GitHub Pages via GitHub Actions.

- Push to the `main` branch to trigger a build + deploy
- In GitHub: **Settings → Pages → Source = GitHub Actions**

Notes:

- The Vite `base` path is set automatically in Actions (to `/<repo>/`), so assets and the PWA manifest work correctly on Pages.

## 📖 Usage Guide

### Basic Usage

1. **Start a Session**: Click the "Start" button to begin a work session
2. **Pause/Resume**: Click "Pause" to pause the timer, then "Resume" to continue
3. **Reset**: Click "Reset" to restart the current phase
4. **Skip**: Click "Skip" to move to the next phase

### Customization

1. Click **⚙️ Settings** to open the settings panel
2. Adjust durations for work, short break, and long break
3. Set how many work sessions before a long break
4. Enable/disable auto-start for breaks and work sessions
5. Click "Reset to Defaults" to restore original settings

### Theme Toggle

Click the theme button (🌙/☀️) in the top-right corner to switch between light and dark modes.

### Language Toggle

Use the language button (EN/UA) in the top-right corner to switch between English and Ukrainian.

### Help / Info

Click the ℹ️ button to open a quick guide on the Pomodoro technique and recommended app usage.

### Tasks

- Add a task using the input in the Tasks card
- Mark a task complete using the checkbox
- Delete a task with the Delete button

### Install as an App

1. Open the app in a supported browser (Chrome, Edge, Safari iOS)
2. Look for the **Install** or **Add to Home Screen** option in the browser menu
3. Confirm the installation to get an offline-capable, standalone experience

## 🏗️ Project Structure

```
src/
├── app/
│   └── providers.tsx          # App-level providers (i18n, etc.)
├── features/
│   ├── timer/
│   │   ├── model/useTimer.ts  # Timer logic/state (feature model)
│   │   ├── ui/Timer.tsx       # Timer UI
│   │   ├── ui/Controls.tsx    # Control buttons UI
│   │   └── index.ts           # Feature public API
│   ├── settings/
│   │   ├── model/useSettings.ts
│   │   ├── ui/Settings.tsx
│   │   └── index.ts
│   ├── tasks/
│   │   ├── model/useTasks.ts
│   │   ├── ui/TaskList.tsx
│   │   ├── ui/TaskList.module.css
│   │   └── index.ts
│   ├── history/
│   │   ├── ui/SessionHistory.tsx
│   │   └── index.ts
│   ├── theme/
│   │   ├── model/useTheme.ts
│   │   ├── ui/ThemeToggle.tsx
│   │   └── index.ts
│   └── localization/
│       ├── ui/LanguageToggle.tsx
│       └── index.ts
├── shared/
│   ├── i18n/
│   │   ├── i18n.ts                    # i18next setup
│   │   ├── index.ts
│   │   └── locales/{en,uk}/translation.json
│   ├── lib/
│   │   ├── storage.ts                 # Persistence (localStorage)
│   │   ├── audio.ts                   # Web Audio notifications
│   │   └── notifications.ts           # Browser notifications
│   ├── types/
│   │   └── index.ts                   # Domain types
│   └── types.ts                       # Thin barrel for shared types
├── App.tsx                             # Main page composition
├── App.css                             # Global styles
└── main.tsx                            # Entry point

public/
├── favicon.svg                         # 🍅 favicon
├── favicon.ico
└── (PWA icons...)
```

## 🎨 Design Principles

### Best Practices Implemented

- **Component Composition**: Modular, reusable components
- **Custom Hooks**: Separation of concerns with custom hooks for logic
- **Type Safety**: Full TypeScript coverage for type safety
- **CSS Modules**: Scoped styling to prevent conflicts
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: Semantic HTML and ARIA labels
- **Performance**: Optimized re-renders and memoization where needed

### Feature-First “Clean Architecture” (Pragmatic)

- **app**: wiring + providers (composition root)
- **features**: user-facing units (timer, settings, tasks, history, theme, localization)
- **shared**: cross-cutting utilities/types (storage, notifications, i18n)

### State Management

- React hooks (`useState`, `useEffect`, `useRef`, `useCallback`)
- LocalStorage for persistence
- No external state management library needed for this app size

## 🛠️ Technologies Used

- **React 19.2** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool and dev server
- **CSS Modules** - Scoped styling
- **Web Audio API** - Sound notifications
- **Notification API** - Browser notifications
- **LocalStorage API** - Data persistence
- **Vite Plugin PWA** - Service worker generation and PWA manifest
- **i18next + react-i18next** - Internationalization (EN/UK)

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

Note: Browser notifications require user permission.

## 🔧 Configuration

The default Pomodoro settings follow the classic technique:

- **Work Session**: 25 minutes
- **Short Break**: 5 minutes
- **Long Break**: 15 minutes
- **Sessions until Long Break**: 4

All settings are customizable through the Settings panel.

## 📝 License

This project is open source and available for personal and educational use.

## 🤝 Contributing

Feel free to fork, modify, and enhance this project for your own use!

## 🎯 Roadmap

Potential future enhancements:

- Pomodoro statistics over time
- Task due dates and reminders
- Task ordering and grouping (Today / Backlog)
- Weekly/monthly analytics views
- Export data (CSV/JSON)
- Import/backup (sync across devices)
- Custom notification sounds and volume
- More profile features (duplicate profile, quick presets)
- Accessibility improvements (full keyboard navigation)
- Better PWA icons + splash screens

## 💡 Tips for Effective Pomodoro

1. **Eliminate Distractions**: Close unnecessary apps and notifications
2. **One Task at a Time**: Focus on a single task during work sessions
3. **Take Real Breaks**: Step away from your screen during breaks
4. **Adjust to Your Needs**: Customize durations based on your focus patterns
5. **Track Progress**: Review your session history to stay motivated

---

Built with ⚛️ React + TypeScript + Vite | Made for productive working 📚
