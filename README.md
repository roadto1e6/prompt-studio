# 🎨 Prompt Studio

<div align="center">

A modern, powerful AI prompt management platform built with React and TypeScript.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🗂️ **Prompt Management**
- **Create & Organize** - Create, edit, and manage AI prompts with ease
- **Collections** - Group prompts into customizable collections with color coding
- **Categories** - Support for Text, Image, Audio, and Video prompts
- **Tags** - Flexible tagging system for better organization
- **Search & Filter** - Quick search and advanced filtering capabilities
- **Favorites** - Mark important prompts for quick access

### 🎯 **Advanced Features**
- **Version Control** - Track and restore prompt versions with detailed history
- **Template Variables** - Dynamic prompt templates with `{{variable}}` syntax
- **Model Selection** - Support for multiple AI models (OpenAI, Anthropic, Google, etc.)
- **Share Prompts** - Generate shareable links with import/export functionality
- **Batch Import** - Import prompts from various sources

### 🎨 **User Experience**
- **Dark/Light Theme** - Beautiful dark mode with smooth transitions
- **Internationalization** - Built-in support for English and Chinese (易于扩展)
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Keyboard Shortcuts** - Efficient workflow with keyboard navigation
- **Grid/List Views** - Multiple viewing options for your prompts

### 🔐 **Security & Authentication**
- **User Authentication** - Secure login/registration system
- **Profile Management** - Manage user profiles and preferences
- **OAuth Integration** - Support for Google, GitHub authentication (ready for backend)
- **Password Management** - Secure password change and recovery

### 🛠️ **Developer Experience**
- **TypeScript** - Full type safety and excellent IntelliSense
- **Modern Stack** - React 18, Vite, Zustand for state management
- **Component Library** - Reusable UI components with consistent design
- **Mock Data** - Built-in mock data for development
- **API Ready** - Service layer architecture ready for backend integration

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 or **yarn** >= 1.22.0

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/prompt-studio.git
cd prompt-studio

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
prompt-studio/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (Button, Input, Modal, etc.)
│   │   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   │   ├── auth/           # Authentication components
│   │   └── settings/       # Settings components
│   ├── features/           # Feature-specific components
│   │   ├── prompts/        # Prompt management
│   │   └── collections/    # Collection management
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx
│   │   └── auth/          # Auth pages (Login, Register, etc.)
│   ├── stores/            # Zustand state management
│   │   ├── promptStore.ts
│   │   ├── collectionStore.ts
│   │   ├── authStore.ts
│   │   ├── modelStore.ts
│   │   ├── themeStore.ts
│   │   └── i18nStore.ts
│   ├── services/          # API service layer
│   │   ├── authService.ts
│   │   ├── promptService.ts
│   │   └── shareService.ts
│   ├── types/             # TypeScript type definitions
│   ├── i18n/              # Internationalization
│   │   ├── en.ts
│   │   └── zh.ts
│   ├── utils/             # Utility functions
│   ├── constants/         # App constants
│   ├── data/              # Mock data
│   ├── hooks/             # Custom React hooks
│   ├── App.tsx            # Root component
│   └── main.tsx           # Entry point
├── public/                # Static assets
├── docs/                  # Documentation
│   └── API_DESIGN.md     # Backend API specification
├── dist/                  # Build output
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🎨 Tech Stack

### Core
- **[React 18](https://reactjs.org/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Build tool & dev server

### State Management
- **[Zustand](https://github.com/pmndrs/zustand)** - Lightweight state management
- **Persist middleware** - State persistence

### Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **Custom Design System** - Consistent UI components

### UI Components
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon set
- **Custom Components** - Modal, Input, Select, Tabs, etc.

### Utilities
- **[date-fns](https://date-fns.org/)** - Date manipulation
- **[uuid](https://github.com/uuidjs/uuid)** - Unique ID generation
- **[clsx](https://github.com/lukeed/clsx)** - Classname utility

---

## 🌍 Internationalization

Prompt Studio supports multiple languages with a flexible i18n system:

```typescript
// Available languages
- English (en)
- 简体中文 (zh)

// Add new language
// 1. Create translation file: src/i18n/your-lang.ts
// 2. Follow the structure from en.ts
// 3. Update i18nStore to include new language
```

**Switching Languages:**
- Click on the language selector in the header
- Or use the theme toggle dropdown

---

## 🔌 API Integration

The frontend is ready for backend integration with a clean service layer architecture.

### Mock Data Mode (Development)

```env
VITE_ENABLE_MOCK_DATA=true
```

### Production API Mode

```env
VITE_ENABLE_MOCK_DATA=false
VITE_API_BASE_URL=https://api.promptstudio.com/api
```

### API Documentation

See [API_DESIGN.md](./docs/API_DESIGN.md) for detailed API specifications including:
- Authentication endpoints
- Prompt CRUD operations
- Collection management
- Share functionality
- Model configuration

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Type check
npx tsc --noEmit

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Style

- **TypeScript** - Strict mode enabled
- **ESLint** - Code linting (can be added)
- **Prettier** - Code formatting (can be added)

### Component Guidelines

1. **Functional Components** - Use function components with hooks
2. **TypeScript** - All components should have proper types
3. **Props Interface** - Define props interface for each component
4. **Styling** - Use Tailwind CSS utility classes
5. **State Management** - Use Zustand stores for global state
6. **i18n** - Use translation keys for all user-facing text

---

## 🎯 Key Features Guide

### Creating a Prompt

1. Click **"New Prompt"** button in the header
2. Fill in the details:
   - **Title** - Name your prompt
   - **Description** - Brief description
   - **Category** - Text, Image, Audio, or Video
   - **Model** - Select AI model
   - **Collection** - Optional organization
   - **System Prompt** - Your AI instructions
3. Click **"Create Prompt"**

### Managing Collections

1. Click **"+" button** next to Collections in sidebar
2. Enter collection name and description
3. Choose a color for visual identification
4. Organize prompts by dragging them to collections

### Version Control

1. Edit a prompt and make changes
2. Click **"Save as New Version"**
3. Add version notes describing changes
4. View version history in the **Versions** tab
5. Restore any previous version when needed

### Sharing Prompts

1. Click the **Share** icon on any prompt
2. Copy the generated share link
3. Recipients can import the prompt with one click
4. Supports duplicate detection

---

## 🎨 Theme Customization

Prompt Studio uses a carefully crafted design system:

### Colors
- **Primary**: Indigo (customizable in tailwind.config.js)
- **Dark Mode**: Slate-based dark palette
- **Accents**: Category-specific colors

### Customization

Edit `tailwind.config.js` to customize:
```js
theme: {
  extend: {
    colors: {
      // Your custom colors
    }
  }
}
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

1. **Report Bugs** - Open an issue with bug details
2. **Suggest Features** - Share your ideas for new features
3. **Submit PRs** - Fix bugs or add features
4. **Improve Docs** - Help improve documentation
5. **Translations** - Add support for new languages

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Setup

```bash
# Fork and clone your fork
git clone https://github.com/YOUR_USERNAME/prompt-studio.git

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/prompt-studio.git

# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push and create PR
git push origin feature/my-feature
```

---

## 📝 Roadmap

### Upcoming Features
- [ ] Real-time collaboration
- [ ] Prompt templates marketplace
- [ ] Advanced analytics
- [ ] API playground
- [ ] Plugin system
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] VS Code extension

### Backend Integration
- [ ] RESTful API implementation
- [ ] Database schema (PostgreSQL/MongoDB)
- [ ] Authentication & authorization
- [ ] Rate limiting & security
- [ ] File upload & storage
- [ ] Email service integration

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[React](https://reactjs.org/)** - The amazing UI library
- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon set
- **[Zustand](https://github.com/pmndrs/zustand)** - Simple state management
- All contributors and supporters

---

## 📧 Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/prompt-studio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/prompt-studio/discussions)

---

<div align="center">

**[⬆ Back to Top](#-prompt-studio)**

Made with ❤️ by the Prompt Studio Team

</div>
