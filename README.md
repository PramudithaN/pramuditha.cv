# Digital CV

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

> An interactive, responsive digital curriculum vitae web application built with React, TypeScript, and Tailwind CSS, featuring in-browser PDF export, dynamic data management, and cryptographic authentication.

---

## Preview

![Preview](public/PramaCV.png)

---

## Overview

This application serves as a centralized digital resume and portfolio platform. It provides a modern, high-contrast user interface showcasing professional experience, technical competencies, project portfolios, and academic credentials. The system includes an administrative console with client-side SHA-256 authentication for managing CV datasets and synchronization with remote repository storage.

---

## Key Features

- **Dynamic Data Management**: Authenticated administrative dashboard to edit personal details, technical skill categories, employment history, projects, and education.
- **Data Synchronization & Backup**: Direct JSON export/import and GitHub repository content synchronization.
- **Client-Side PDF Generation**: High-fidelity vector/canvas PDF export using `jsPDF` and `html2canvas` with interactive clickable hyperlinks.
- **Responsive Architecture**: Fully responsive grid and flex layouts optimized across desktop, tablet, and mobile displays.
- **Security & Integrity**: Session-based administrative authorization with SHA-256 cryptographic password hashing and decoupled credential handling.
- **Automated Testing & Type Safety**: Comprehensive TypeScript type definitions and Jest unit test coverage for core utilities and data models.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend Framework | [React 19](https://reactjs.org/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) / PostCSS |
| Icons | [Lucide React](https://lucide.dev/) |
| PDF Export Engine | [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/) |
| Testing Framework | [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/) |
| Deployment | [GitHub Pages](https://pages.github.com/) / GitHub Actions |

---

## Prerequisites

- [Node.js](https://nodejs.org/) version 18.0.0 or higher
- [pnpm](https://pnpm.io/) package manager (or npm)
- [Git](https://git-scm.com/)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/PramudithaN/pramuditha.cv.git
cd pramuditha_cv
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development Server

```bash
pnpm start
```

The application will be available at `http://localhost:3000`.

---

## Available Scripts

| Script | Purpose |
|---|---|
| `pnpm start` | Runs the development server on `http://localhost:3000`. |
| `pnpm run build` | Builds an optimized production bundle in the `build/` directory. |
| `pnpm test` | Executes the Jest unit test suite. |
| `pnpm run deploy` | Builds and deploys the production bundle to GitHub Pages. |

---

## Project Structure

```text
pramuditha_cv/
├── .github/
│   └── workflows/
│       └── deploy.yml        # CI/CD GitHub Pages deployment workflow
├── public/
│   ├── PramaCV.png           # Preview media asset
│   ├── cvImg.png             # Favicon asset
│   ├── index.html            # Application entry HTML template
│   └── manifest.json         # Web application manifest
├── src/
│   ├── components/           # Reusable UI and administrative components
│   │   ├── AdminAuthModal.tsx
│   │   ├── AdminPanel.tsx
│   │   └── AdminToggle.tsx
│   ├── data/                 # Datasets, defaults, and integrity test suites
│   │   ├── __tests__/
│   │   ├── cv-data.json
│   │   └── defaultCV.ts
│   ├── hooks/                # Custom React state and data synchronization hooks
│   │   └── useCVData.ts
│   ├── types/                # TypeScript interface declarations
│   │   └── cv.ts
│   ├── utils/                # Authentication, hashing, and helper utilities
│   │   ├── __tests__/
│   │   └── auth.ts
│   ├── App.css               # Application-level styling
│   ├── App.tsx               # Main layout and PDF rendering logic
│   ├── index.css             # Tailwind CSS directives
│   ├── index.tsx             # React root mounting point
│   └── setupTests.ts         # Jest and DOM test environment configuration
├── pnpm-workspace.yaml       # Workspace dependencies and overrides
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript compiler settings
└── package.json              # Project dependencies and script declarations
```

---

## Contact

- **GitHub**: [github.com/PramudithaN](https://github.com/PramudithaN)
- **LinkedIn**: [linkedin.com/in/pramuditha-nadun-612b1b204](https://linkedin.com/in/pramuditha-nadun-612b1b204)
- **Email**: [pramudithanadun@gmail.com](mailto:pramudithanadun@gmail.com)

---

## License

This project is open source and available under the [MIT License](LICENSE).
