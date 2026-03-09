# 🧠 React Quiz Maker

A modern, high-performance web application built with **React 19**, **TypeScript**, and **Vite**. This platform allows users to create, manage, and solve interactive quizzes with a sleek Material Design interface.

---

## ✨ Key Features

- **🚀 Modern UI/UX**: Built with Material UI (MUI) for a premium, responsive look and feel.
- **🏗️ Quiz Creator**: Intuitive interface for building complex quizzes with various question types.
- **✏️ Dynamic Editing**: Seamlessly modify existing quizzes with real-time updates.
- **🎯 Quiz Solver**: Optimized experience for taking quizzes with immediate feedback potential.
- **🛡️ Robust Security**: Protected routes for administrative actions (Create/Edit).
- **✅ Type-Safe Forms**: Comprehensive validation using **Zod** and **React Hook Form**.
- **🌐 Mocked API Layer**: Full development environment independence using **Mock Service Worker (MSW)**.
- **⚡ Performance First**: Implementation of code splitting (Lazy Loading) and virtual list rendering (React Virtuoso).

---

## 🛠️ Technology Stack

| Category | Tools |
| :--- | :--- |
| **Core** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/) |
| **UI & Styling** | [Material UI (v7)](https://mui.com/), [Emotion](https://emotion.sh/) |
| **Routing** | [React Router Dom (v7)](https://reactrouter.com/) |
| **Form Handling** | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) |
| **Development** | [Mock Service Worker (MSW)](https://mswjs.io/), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/) |
| **Optimization** | [React Virtuoso](https://virtuoso.dev/), [Vite Plugin Checker](https://github.com/fi3pq/vite-plugin-checker) |

---

## 📂 Project Architecture

The project follows a modular structure for scalability and maintainability:

```text
src/
├── api/             # API clients and service layers (Axios/Fetch logic)
├── app/             # Main application logic
│   ├── components/  # Feature-specific components (Auth, Layout, Quiz, UI)
│   ├── context/     # React Context providers (Auth, Theme, Notifications)
│   ├── hooks/       # Custom reusable hooks
│   ├── lib/         # Utility functions and shared logic
│   ├── routes/      # Page-level components
│   └── router.tsx   # Centralized routing configuration
├── assets/          # Static assets (images, icons, etc.)
├── mocks/           # MSW handler definitions for local development
└── shared/          # Truly global shared components and constants
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd react-quiz-maker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Adjust `VITE_ENABLE_MOCKS` as needed.

### Development

Start the development server:
```bash
npm run dev
```

### Build

Create a production build:
```bash
npm run build
```

---

## 🛠️ Development Tools

- **Linting**: `npm run lint` - Ensures code quality and consistency.
- **Formatting**: `npm run format` - Automatically formats code using Prettier.
- **Mocking**: Toggle MSW by setting `VITE_ENABLE_MOCKS=true` in your `.env` file.

---

Built with ❤️ by [Ivan Kelava](https://ivankelava.me)  
[![GitHub](https://img.shields.io/badge/GitHub-ivan119-181717?style=flat&logo=github)](https://github.com/ivan119) [![LinkedIn](https://img.shields.io/badge/LinkedIn-kelava--ivan-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/kelava-ivan)
