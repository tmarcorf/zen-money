# ZenMoney

> A full-stack personal finance management application — track income, expenses, categories, and visualize your financial health with interactive dashboards.

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## Features

### Financial management
- **Incomes** — create, edit, delete, and duplicate income records (fixed and variable)
- **Expenses** — create, edit, delete, and duplicate expenses with categories and payment methods
- **Categories** — custom organization for expenses (e.g., Food, Transport, Leisure)
- **Payment Methods** — credit card, debit card, PIX, cash, and more

### Dashboard & reports
- **Monthly summary** — cards showing total income vs. expenses for the current month
- **Bar chart** — income × expenses by month
- **Pie chart** — expenses grouped by category
- **Analytics table** — expenses by payment method

### User experience
- **Secure authentication** — JWT stored in HttpOnly cookies (XSS protection)
- **Dark/light mode** — toggleable theme with system preference detection
- **Value visibility toggle** — hide/show all monetary amounts with one click
- **BRL currency formatting** — monetary inputs with Brazilian Real (R$) mask and formatting
- **Quick duplicate** — one-click button to duplicate an existing record as a new entry
- **Search & filters** — text search and filters by date, category, and payment method
- **Pagination** — server-side paginated tables for performance

---

## Tech Stack

### Backend (.NET 8)
| Technology | Purpose |
|---|---|
| ASP.NET Core 8 Web API | HTTP framework and controllers |
| Entity Framework Core 8 | ORM — object-relational mapping |
| PostgreSQL (Npgsql) | Relational database |
| ASP.NET Core Identity | User and password management |
| JWT Bearer Authentication | Stateless token-based authentication |
| FluentValidation | Input data validation |
| Swagger (Swashbuckle) | Interactive API documentation |
| xUnit | Unit testing |

### Frontend (React 18 + Vite)
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI library with static typing |
| Vite 5 + SWC | Fast build tool and compiler |
| Tailwind CSS 3 | Utility-first styling |
| shadcn/ui (Radix Primitives) | Accessible, customizable UI components |
| TanStack React Query 5 | Server state management and caching |
| React Router 6 | Client-side routing |
| Recharts + Chart.js | Charts and data visualization |
| React Hook Form + Zod | Form management with schema validation |
| date-fns | Date manipulation |
| Lucide React | Icons |

---

## Architecture

The backend follows **Clean Architecture** principles with 4 layers:

```
┌─────────────────────────────────────────────┐
│                  ZenMoney.API                │  ← Controllers, Program.cs, Swagger
│              (Presentation Layer)            │
├─────────────────────────────────────────────┤
│              ZenMoney.Application            │  ← Services, DTOs, Validators, Interfaces
│              (Application Layer)             │
├─────────────────────────────────────────────┤
│                ZenMoney.Core                 │  ← Entities, Enums, Repository Interfaces
│                (Domain Layer)                │
├─────────────────────────────────────────────┤
│            ZenMoney.Infrastructure           │  ← EF Core DbContext, Repositories, JWT
│            (Infrastructure Layer)            │     Migrations, IoC/DI
└─────────────────────────────────────────────┘
```

**Dependency rule:** outer layers depend on inner layers. `Core` depends on nothing. `Infrastructure` implements interfaces defined in `Core`.

The frontend follows a page-based architecture with data hooks:

```
Pages → React Query Hooks → Services → API Client (fetch) → Backend
         ↑
    Custom Hooks (useAuth, useTheme, useValueVisibility)
         ↑
    Shared Components (FormModal, DataTable, CurrencyInput, etc.)
```

---

## Prerequisites

- **[.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)**
- **[Node.js 18+](https://nodejs.org/)** (20 LTS recommended)
- **[PostgreSQL 16](https://www.postgresql.org/download/)** (or Docker container)

> **Tip:** If you have Docker, spin up PostgreSQL quickly:
> ```bash
> docker run -d --name zenmoney-db \
>   -e POSTGRES_USER=postgres \
>   -e POSTGRES_PASSWORD=postgres \
>   -e POSTGRES_DB=ZenMoneyDB \
>   -p 5432:5432 postgres:16
> ```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/tmarcorf/zen-money.git
cd zen-money
```

### 2. Set up the backend

#### 2.1. Configure the JWT secret (User Secrets)

```bash
cd src/api/ZenMoney.API
dotnet user-secrets set "Jwt:SecretKey" "your-secret-key-with-at-least-32-characters"
```

#### 2.2. Check the connection string

The file `src/api/ZenMoney.API/appsettings.json` contains the default connection:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=ZenMoneyDB;Username=postgres;Password=postgres"
}
```

Adjust if needed for your environment.

#### 2.3. Run migrations and start the API

```bash
dotnet run
```

The API starts at `https://localhost:7109`. Database migrations are applied automatically on startup.

Swagger UI available at: [https://localhost:7109/swagger](https://localhost:7109/swagger)

### 3. Set up the frontend

```bash
cd src/web-app
npm install
```

Create a `.env` file (optional — the default already points to the local API):

```env
VITE_API_URL=https://localhost:7109
```

#### 3.1. Start the dev server

```bash
npm run dev
```

The frontend starts at `http://localhost:8080`.

### 4. Open the app

1. Go to [http://localhost:8080](http://localhost:8080)
2. Create an account via **Create Account**
3. Log in and start managing your finances!

---

## Environment Variables

### Backend

| Variable | Location | Default | Required |
|---|---|---|---|
| `Jwt:SecretKey` | User Secrets | — | ✅ Yes |
| `ConnectionStrings:DefaultConnection` | `appsettings.json` | `Host=localhost;Port=5432;Database=ZenMoneyDB;Username=postgres;Password=postgres` | ✅ Yes |

> The `Jwt:SecretKey` must **never** be committed. Use `dotnet user-secrets` in development and environment variables in production.


## Authentication

ZenMoney uses **JWT stored in HttpOnly cookies** — a more secure approach than localStorage:

1. User logs in via `POST /api/users/auth`
2. Backend validates credentials and generates a JWT
3. The token is stored in an `auth_token` cookie with flags:
   - `HttpOnly` — inaccessible via JavaScript (XSS protection)
   - `Secure` — sent only over HTTPS
   - `SameSite=Lax` — basic CSRF protection
4. The frontend sends the cookie automatically on every request (`credentials: "include"`)
5. The backend reads the JWT from the cookie in the `OnMessageReceived` middleware
6. On 401 (unauthorized), the frontend redirects to `/login`

---


## License

MIT — see [LICENSE](LICENSE) for details.

---

Made by [Marco Tulio](https://github.com/tmarcorf)
