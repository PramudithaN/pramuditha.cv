# Digital-CV

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

> A professional digital CV designed to showcase my journey as a Software Engineering student and Associate Software Engineer, featuring a responsive design and PDF download functionality.

---

## 📸 Preview

**CV Dashboard**
![Preview](public/PramaCV.png)

---

## 📖 About This Project

This project is a modern, interactive CV platform built with **React 19** and **TypeScript**. It serves as a comprehensive digital portfolio, highlighting my professional background, technical expertise, and academic achievements. The application is optimized for performance and accessibility, featuring a specialized export functionality that allows users to download a high-quality PDF version of the CV directly from their browser.

---

## ✨ Features

- 🔐 **Admin Management Panel** - In-browser and authenticated management of skills, experience, projects, and personal data.
- 🔄 **Cloud & Local Sync** - Direct synchronization with GitHub and local JSON export/import.
- 🚀 **Dynamic Profile** - Interactive presentation of professional experience and skills.
- 🎨 **Modern UI/UX** - Clean, professional aesthetic built with Tailwind CSS.
- 🌙 **Responsive Design** - Fully optimized for seamless viewing on mobile, tablet, and desktop.
- 📄 **PDF Export** - Instant, high-quality PDF generation using `jsPDF` and `html2canvas`.
- 🔍 **Interactive Contact** - One-click access to GitHub, LinkedIn, and Email.
- 💼 **Career Timeline** - Detailed tracking of professional roles and academic history.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [React v19.0.0](https://reactjs.org/) |
| Language | [TypeScript v4.9.5](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v3.3.3](https://tailwindcss.com/) |
| Icons | [Lucide React v0.477.0](https://lucide.dev/) |
| PDF Generation | [jsPDF v3.0.0](https://github.com/parallax/jsPDF) |
| Deployment | [GitHub Pages](https://pages.github.com/) |

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) **v18.0.0 or higher**
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [Git](https://git-scm.com/)

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/PramudithaN/pramuditha_cv.git
cd pramuditha_cv
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the development server

```bash
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm start` | Runs the app in development mode. |
| `pnpm run build` | Builds the app for production to the `build` folder. |
| `pnpm test` | Launches the Jest test runner. |
| `pnpm run deploy` | Deploys the application to GitHub Pages. |

---

## 📁 Project Structure

```text
pramuditha_cv/
├── public/                  # Static assets and entry HTML
│   ├── PramaCV.png          # CV Dashboard preview
│   ├── cvImg.png            # Favicon and icons
│   ├── index.html           # HTML template
│   └── manifest.json        # Web App Manifest
├── src/                     # Source code
│   ├── components/          # Admin UI and interactive components
│   ├── data/                # Initial and fallback CV datasets
│   ├── hooks/               # Custom data fetching and sync hooks
│   ├── types/               # TypeScript type interfaces
│   ├── utils/               # Cryptographic auth and helper functions
│   ├── App.tsx              # Main CV logic and layout
│   ├── index.tsx            # Application entry point
│   ├── App.css              # Component-specific styles
│   └── index.css            # Global Tailwind directives
├── tailwind.config.js       # Styling configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies and scripts
```

---

## 🙋‍♂️ Connect with Me

- **GitHub**: [github.com/PramudithaN](https://github.com/PramudithaN)
- **LinkedIn**: [linkedin.com/in/pramuditha-nadun-612b1b204](https://linkedin.com/in/pramuditha-nadun-612b1b204)
- **Email**: pramudithanadun@gmail.com

---

*Developed with ❤️ by Pramuditha Nadun.*
