# Mathias — Developer Portfolio

A production-ready, full-stack developer portfolio built with **Next.js 14**, **Express**, and **MongoDB**. Features a dark premium aesthetic, scroll-reveal animations, a contact form with email notifications, and a complete backend API.

---

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18 + TypeScript (strict mode)
- Tailwind CSS 3.4
- Framer Motion (animations)
- React Hook Form + Zod (form validation)
- Axios, React Hot Toast, Lucide Icons

### Backend
- Node.js 20+ / Express 4
- MongoDB + Mongoose 8 (with in-memory fallback)
- Nodemailer (SMTP email notifications)
- Helmet, CORS, express-rate-limit, express-validator

---

## Quick Start

### Prerequisites
- Node.js 20+
- npm 9+
- MongoDB (optional — the app works without it)

### 1. Clone & Install

```bash
git clone https://github.com/Prof-Clergy/portfolio.git
cd portfolio
npm run install:all
```

### 2. Configure Environment (Optional)

Copy the example env file:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your values. **All services are optional** — the app runs with in-memory storage and no email by default.

### 3. Run Development Servers

```bash
npm run dev
```

This starts both:
- **Frontend** → http://localhost:3000
- **Backend** → http://localhost:5000

---

## Environment Variables

### `server/.env`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `MONGODB_URI` | No | — | MongoDB connection string. If empty, uses in-memory store |
| `SMTP_HOST` | No | — | SMTP host (e.g., `smtp.gmail.com`) |
| `SMTP_PORT` | No | `587` | SMTP port |
| `SMTP_USER` | No | — | SMTP username/email |
| `SMTP_PASS` | No | — | SMTP password or app password |
| `CONTACT_EMAIL` | No | — | Email to receive contact form messages |
| `CLIENT_URL` | No | `http://localhost:3000` | Frontend URL for CORS |

### `client/.env.local`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:5000/api` | Backend API URL |

---

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Rate Limit | Description |
|--------|----------|------------|-------------|
| GET | `/health` | 100/15min | Health check with DB & email status |
| GET | `/projects` | 100/15min | Returns featured projects sorted by order |
| POST | `/contact` | 5/hour/IP | Submit contact form message |
| POST | `/track` | 100/15min | Log a visitor page view |
| GET | `/stats` | 100/15min | Visitor, message, and project counts |

### POST `/contact` — Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'd like to discuss a web development project..."
}
```

### Responses
- `201` — `{ "success": true, "message": "Message sent successfully!" }`
- `400` — `{ "errors": [{ "msg": "...", "path": "..." }] }`
- `429` — `{ "error": "Too many messages sent..." }`
- `500` — `{ "error": "Something went wrong..." }`

---

## Project Structure

```
portfolio/
├── client/                     # Next.js 14 frontend
│   ├── app/
│   │   ├── layout.tsx          # Root layout (fonts, metadata, toast)
│   │   ├── page.tsx            # Home — assembles all sections
│   │   └── globals.css         # Tailwind + custom CSS
│   ├── components/
│   │   ├── Navbar.tsx          # Fixed nav, scroll shrink, mobile menu
│   │   ├── Hero.tsx            # Full-screen hero with code window
│   │   ├── About.tsx           # Bio, tech stack, stats, education
│   │   ├── Services.tsx        # 6 service cards
│   │   ├── Projects.tsx        # Project grid (API + fallback)
│   │   ├── Contact.tsx         # Contact form (RHF + Zod)
│   │   ├── Footer.tsx          # Social links + copyright
│   │   └── SectionHeader.tsx   # Reusable animated section header
│   ├── lib/api.ts              # Axios instance
│   ├── types/index.ts          # TypeScript interfaces
│   └── [config files]
│
├── server/
│   ├── index.js                # Express server (routes, models, middleware)
│   ├── .env.example            # Environment template
│   └── package.json
│
├── package.json                # Root scripts (install:all, dev)
├── .gitignore
└── README.md
```

---

## Deployment

### Frontend — Vercel

1. Push your code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Set the root directory to `client`
4. Add environment variable: `NEXT_PUBLIC_API_URL` = your backend URL
5. Deploy

### Backend — Render / Railway

**Render:**
1. Create a new Web Service on [Render](https://render.com)
2. Set root directory to `server`
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add all environment variables from `.env.example`

**Railway:**
1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repo
3. Set root directory to `server`
4. Add environment variables
5. Railway auto-detects Node.js and deploys

### MongoDB — MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Set `MONGODB_URI` in your backend environment

### Email — Gmail SMTP

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password (Google Account → Security → App Passwords)
3. Set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER=your@gmail.com`, `SMTP_PASS=your-app-password`

---

## Customization

### Colors
Edit `client/tailwind.config.ts` — all colors are defined in `theme.extend.colors`.

### Content
- **Bio & About:** Edit `components/About.tsx`
- **Services:** Edit the `services` array in `components/Services.tsx`
- **Projects:** Update seed data in `server/index.js` (memoryStore.projects) and fallback data in `components/Projects.tsx`
- **Contact info:** Edit the `infoCards` array in `components/Contact.tsx`
- **Social links:** Edit the `socials` array in `components/Footer.tsx`
- **Hero text:** Edit `components/Hero.tsx`

### Fonts
Fonts are loaded via `next/font/google` in `app/layout.tsx`. Change the imports and CSS variables to use different fonts.

### Adding Projects
Add new projects to the `memoryStore.projects` array in `server/index.js`, or directly in MongoDB if connected.

---

## License

MIT — feel free to use this as a starting point for your own portfolio.

---

Built with ❤️ by Mathias
