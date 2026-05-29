<div align="center">

<img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
<img src="https://img.shields.io/badge/ASP.NET_Core-8.0-512BD4?style=for-the-badge&logo=dotnet" />
<img src="https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql" />
<img src="https://img.shields.io/badge/OpenAI-GPT--4.1-412991?style=for-the-badge&logo=openai" />
<img src="https://img.shields.io/badge/Cloudflare-Tunnel-F38020?style=for-the-badge&logo=cloudflare" />

# 💳 FinanceThinking

**AI-powered personal finance tracker with real-time analytics**

[🌐 Live Demo](https://danilanet.id.lv) · [📊 Swagger API](https://api.danilanet.id.lv/swagger)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 💰 **Transaction Tracking** | Log income and expenses with categories |
| 📊 **Balance Analytics** | Real-time balance history chart |
| 🤖 **AI Financial Advisor** | Chat with GPT-4.1-mini about your finances |
| 🎯 **Goal Planning** | Create savings goals and track progress |
| 🎨 **Theme Switcher** | Dark, Green, Purple, Beige themes |
| 🔐 **Authentication** | JWT-based login and registration |
| ☁️ **Public URL** | Deployed via Cloudflare Tunnel |

---

## 🏗️ Architecture

```
graph TD
    %% Стилизация узлов
    classDef client fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px;
    classDef proxy fill:#eceff1,stroke:#607d8b,stroke-width:2px;
    classDef frontend fill:#e8f5e9,stroke:#4caf50,stroke-width:2px;
    classDef backend fill:#fff3e0,stroke:#ff9800,stroke-width:2px;
    classDef db fill:#fce4ec,stroke:#e91e63,stroke-width:2px;
    classDef ai fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px;

    %% Узлы сети
    Browser("🌐 Browser<br><b>danilanet.id.lv</b>"):::client
    CF("☁️ Cloudflare Tunnel"):::proxy
    Next("⚛️ Next.js<br><small>Port 3000</small>"):::frontend
    API("⚙️ ASP.NET Core<br><small>Port 5193</small>"):::backend
    DB("🗄️ PostgreSQL<br><small>(Transactions, Cards)</small>"):::db
    OpenAI("🤖 OpenAI API<br><small>(GPT-4.1-mini)</small>"):::ai

    %% Связи
    Browser --> CF
    CF --> Next
    CF --> API
    API --> DB
    API --> OpenAI
```

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 16 + React + TypeScript
- Tailwind CSS
- Framer Motion
- Recharts

**Backend**
- ASP.NET Core 8
- Entity Framework Core + Npgsql
- OpenAI .NET SDK 2.10
- Swagger / OpenAPI

**Infrastructure**
- PostgreSQL 17
- Cloudflare Tunnel
- GitHub Actions CI/CD

---

## 🚀 Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 20+
- PostgreSQL 17
- OpenAI API key

### 1. Clone the repo
```bash
git clone https://github.com/Dalik0v/financethinking.git
cd financethinking
```

### 2. Configure backend
Edit `AIProject/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "Postgres": "Host=localhost;Port=5432;Database=ai_project;Username=postgres;Password=yourpassword"
  },
  "OpenAI": {
    "ApiKey": "sk-...",
    "Model": "gpt-4.1-mini"
  }
}
```

### 3. Run backend
```bash
dotnet run --project AIProject/AIProject.csproj
```

### 4. Run frontend
```bash
cd src
npm install
npm run dev
```

### 5. Open in browser
```
http://localhost:3000
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/transactions` | Get all transactions |
| `POST` | `/transactions` | Create transaction |
| `DELETE` | `/transactions/{id}` | Delete transaction |
| `GET` | `/card` | Get primary card |
| `GET` | `/analytics/balance-history` | Balance chart data |
| `POST` | `/ai` | AI financial advisor |

Full docs available at `/swagger`

---


## 📁 Project Structure

```
financethinking/
├── AIProject/                 # ASP.NET Core backend
│   ├── Controllers/           # API endpoints
│   ├── Domain/                # EF Core entities
│   ├── Services/              # AI service layer
│   ├── Data/                  # DbContext
│   └── appsettings.json       # Configuration
├── src/                       # Next.js frontend
│   ├── app/                   # Pages (App Router)
│   ├── components/            # React components
│   └── lib/                   # API helper
└── README.md
```

---

## 🌐 Deployment

The app is deployed using **Cloudflare Tunnel** — no open ports required.

| URL | Service |
|-----|---------|
| `danilanet.id.lv` | Frontend (Next.js) |
| `api.danilanet.id.lv` | Backend API |

---

<div align="center">

Made with ❤️ by [Dalik0v](https://github.com/Dalik0v)

</div>
