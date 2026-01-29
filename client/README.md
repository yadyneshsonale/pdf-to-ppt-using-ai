# PaperToPPT - AI Research Paper to Presentation Converter

Transform your research papers into stunning presentations with the power of AI. Upload a PDF and get a professional PowerPoint-ready presentation in seconds.

## ✨ Features

- 🤖 **AI-Powered Conversion** - Automatically extracts key points, sections, and insights from research papers
- 🎨 **Multiple Templates** - Professional, Academic, Modern, and Minimalist templates
- 📝 **PowerPoint-like Editor** - Drag-and-drop text boxes, resize elements, change fonts and colors
- 🔐 **User Authentication** - Secure login with JWT tokens and bcrypt password hashing
- 📊 **Dashboard** - Track your conversions, manage presentations, view history
- 👨‍💼 **Admin Panel** - Manage users, view analytics, system administration

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React/Vite    │────▶│  Node.js Auth   │     │  FastAPI Python │
│   Frontend      │     │    Server       │     │   API Server    │
│   Port: 3000    │     │   Port: 4000    │     │   Port: 8000    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │                       ▼                       ▼
        │               ┌─────────────────┐     ┌─────────────────┐
        │               │     SQLite      │     │   HuggingFace   │
        │               │   Database      │     │   LLM API       │
        └──────────────▶│  (Prisma ORM)   │     └─────────────────┘
                        └─────────────────┘
```

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **Python** (v3.10+) - [Download](https://www.python.org/)
- **npm** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd pdf-to-ppt-using-ai

# Frontend
cd client && npm install

# Auth Server
cd ../server && npm install

# Python API (from root)
cd ..
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment Setup

**Frontend (`client/.env`):**
```env
VITE_API_URL=http://localhost:8000
VITE_AUTH_API_URL=http://localhost:4000/api
```

**Server (`server/.env`):**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRY="7d"
BCRYPT_SALT_ROUNDS=12
NODE_ENV="development"
PORT=4000
```

**Python API (`token.txt`):**
```
hf_YOUR_HUGGINGFACE_TOKEN
```
Get token from: https://huggingface.co/settings/tokens

### 3. Database Setup

```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

**Default Users:**

| Email | Password | Role |
|-------|----------|------|
| admin@papertoppt.com | admin123 | ADMIN |
| user@example.com | user123 | USER |

### 4. Start All Services

**Terminal 1 - Auth Server:**
```bash
cd server && npm run dev
```

**Terminal 2 - Python API:**
```bash
source .venv/bin/activate && python api.py
```

**Terminal 3 - Frontend:**
```bash
cd client && npm run dev
```

Access at: http://localhost:3000

## 📁 Project Structure

```
pdf-to-ppt-using-ai/
├── client/                 # React frontend (Vite)
│   ├── src/components/     # UI components
│   ├── src/services/       # API clients
│   └── src/context/        # React contexts
├── server/                 # Node.js auth server
│   ├── prisma/             # Database schema & seeds
│   └── src/                # Express routes
├── api.py                  # FastAPI server
├── main.py                 # PDF processing
├── llm_wrapper.py          # LLM integration
└── token.txt               # HuggingFace token
```

## 🐛 Troubleshooting

### "User not found" Error
```bash
cd server && npx prisma migrate reset
```

### CORS Errors
Ensure all 3 servers are running on correct ports.

### Python Import Errors
Run `python api.py` from project root with venv activated.

## 📄 License

MIT License - see [LICENSE](LICENSE)
