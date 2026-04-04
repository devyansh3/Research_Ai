# ResearchAI

A premium AI-powered research and analysis report generator. Configure parameters, generate structured markdown reports, compare tools side by side, and manage your research history — all in a clean, modern dashboard.

![ResearchAI Dashboard](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-7-007FFF?style=flat&logo=mui&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)

---

## Features

- **Authentication** — Email-based signup and login with localStorage persistence
- **Onboarding** — 4-step guided setup wizard with a dark sidebar progress tracker
- **Dashboard** — Conversational AI-style interface with example prompts and recent reports
- **Report Generation** — Configurable form (sector, stage, tool, audience, weight mode) with animated generation sequence
- **Report Viewer** — Formatted markdown reports with syntax-highlighted tables and code blocks
- **Edit & Regenerate** — Right-side drawer to modify report parameters and regenerate in place
- **Tool Comparison** — Select any competing tool to generate a side-by-side comparison report
- **Reports Library** — Searchable grid of all past reports with metadata chips
- **History** — Activity timeline showing generated, edited, and compared reports grouped by date
- **Profile** — Editable personal information with inline save
- **Settings** — Notifications, appearance, localization, security, and data management controls

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | TypeScript 5.9 |
| UI Components | MUI (Material UI) v7 |
| Icons | MUI Icons Material |
| Routing | React Router DOM v7 |
| Markdown | react-markdown + remark-gfm |
| Auth | Context API + localStorage |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/devyansh3/Research_Ai.git
cd Research_Ai

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   └── AppSidebar.tsx       # Sidebar navigation + TopBar header
├── lib/
│   ├── auth-context.tsx     # Authentication context and hooks
│   └── report-data.ts       # Sample reports, sectors, tools, and form data
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   └── OnboardingPage.tsx
│   └── dashboard/
│       ├── DashboardLayout.tsx
│       ├── DashboardPage.tsx
│       ├── GeneratePage.tsx
│       ├── ReportDetailPage.tsx
│       ├── ReportsPage.tsx
│       ├── HistoryPage.tsx
│       ├── ProfilePage.tsx
│       └── SettingsPage.tsx
├── theme.ts                 # MUI theme configuration (colors, typography, overrides)
├── App.tsx                  # Route definitions and protected route guard
└── main.tsx                 # Entry point with providers
```

---

## Design System

The UI is built on a custom MUI theme with a two-tone design language:

- **Sidebar** — Near-black (`#111111`) with white text and blue active states
- **Primary color** — Indigo-blue (`#5B5BD6`), matching `oklch(0.55 0.25 264)`
- **Background** — Off-white (`#FAFAFA`) with pure white cards
- **Typography** — Inter font stack with consistent weight scale
- **Cards** — 12px border radius, 1px `#E5E5E5` border, subtle shadow

---

## Routes

| Route | Description | Protected |
|---|---|---|
| `/login` | Email login | No |
| `/signup` | Account creation | No |
| `/onboarding` | 4-step setup wizard | No |
| `/dashboard` | Main chat-style home | Yes |
| `/generate` | Report configuration form | Yes |
| `/reports` | All reports grid | Yes |
| `/reports/:id` | Report viewer + comparison | Yes |
| `/history` | Activity timeline | Yes |
| `/profile` | User profile editor | Yes |
| `/settings` | Account preferences | Yes |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

---

## License

MIT
