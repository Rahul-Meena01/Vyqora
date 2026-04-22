# Vyqora

Vyqora is a modern personal finance dashboard built with React + Vite.

## Features

- Dashboard with income, expenses, balance, and savings-rate KPIs
- Analytics charts (bar, area, pie) powered by Recharts
- Transaction management (add, filter, delete)
- Getting Started setup flow to seed dashboard with your own monthly plan
- AI Advisor with Gemini integration and smart local fallback recommendations
- Local persistence via browser localStorage

## Tech Stack

- React 18
- Vite 5
- Recharts

## Project Structure

- `Financeos.jsx`: Main app component and UI logic
- `src/main.jsx`: React entry point
- `index.html`: App shell
- `vite.config.js`: Vite configuration

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Start development server

```bash
npm run dev
```

Open the URL printed by Vite (for example `http://127.0.0.1:4173/`).

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## AI Advisor Notes

- You can add your Gemini API key from the in-app AI panel.
- If Gemini quota is exhausted, the advisor automatically switches to smart local recommendation mode.

## Data Persistence

The app stores data in browser localStorage keys:

- `fos_txns`
- `fos_profile`
- `fos_gemini_key`

## Scripts

- `npm run dev`: Start Vite dev server
- `npm run build`: Production build
- `npm run preview`: Preview production build

## License

Personal project. Add your preferred license if you plan to distribute.
