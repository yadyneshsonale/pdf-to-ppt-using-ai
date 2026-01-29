# PaperToPPT Authentication Server

Production-grade authentication backend built with Node.js, Express, PostgreSQL, and Prisma ORM.

## Features

- 🔐 **Secure Authentication**: bcrypt password hashing (12 rounds), JWT tokens
- 👤 **User Management**: Registration, login, profile updates
- 🎫 **Plan System**: FREE, PAID, PREMIUM plans with conversion limits
- 📊 **History Tracking**: Track user PDF→PPT conversions
- 💾 **PPT Storage**: Save and retrieve presentation data
- 👑 **Admin Dashboard**: User management, statistics, role management
- 🛡️ **Role-Based Access**: USER and ADMIN roles with protected routes

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT + bcrypt
- **Validation**: Custom middleware

## Quick Start

### 1. Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your database credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/papertoppt?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV=development
```

### 4. Database Setup

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev --name init
```

Seed the database with default plans and admin user:

```bash
npm run prisma:seed
```

### 5. Start the Server

Development (with auto-reload):

```bash
npm run dev
```

Production:

```bash
npm start
```

## Default Credentials

After seeding, you can login with:

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@papertoppt.com | admin123  |
| User  | user@example.com    | user123   |

## API Endpoints

### Authentication

| Method | Endpoint           | Description        | Auth Required |
|--------|--------------------|--------------------|---------------|
| POST   | /api/auth/register | Register new user  | No            |
| POST   | /api/auth/login    | Login user         | No            |
| POST   | /api/auth/logout   | Logout user        | Yes           |
| GET    | /api/auth/me       | Get current user   | Yes           |
| PUT    | /api/auth/password | Update password    | Yes           |
| GET    | /api/auth/verify   | Verify token       | Yes           |

### User

| Method | Endpoint          | Description         | Auth Required |
|--------|-------------------|---------------------|---------------|
| GET    | /api/users/profile | Get user profile   | Yes           |
| PUT    | /api/users/profile | Update profile     | Yes           |
| GET    | /api/users/plans   | Get available plans | No            |
| POST   | /api/users/upgrade | Upgrade plan       | Yes           |

### History

| Method | Endpoint          | Description            | Auth Required |
|--------|-------------------|------------------------|---------------|
| GET    | /api/history      | Get conversion history | Yes           |
| GET    | /api/history/stats | Get user statistics   | Yes           |
| GET    | /api/history/:id  | Get single entry       | Yes           |
| DELETE | /api/history/:id  | Delete history entry   | Yes           |

### PPT

| Method | Endpoint     | Description        | Auth Required |
|--------|-------------|--------------------|---------------|
| GET    | /api/ppt    | Get user's PPTs    | Yes           |
| POST   | /api/ppt    | Save new PPT       | Yes           |
| GET    | /api/ppt/:id | Get single PPT    | Yes           |
| PUT    | /api/ppt/:id | Update PPT        | Yes           |
| DELETE | /api/ppt/:id | Delete PPT        | Yes           |

### Admin (Admin role required)

| Method | Endpoint               | Description           | Auth Required |
|--------|------------------------|-----------------------|---------------|
| GET    | /api/admin/dashboard   | Get dashboard stats   | Admin         |
| GET    | /api/admin/users       | Get all users         | Admin         |
| GET    | /api/admin/users/:id   | Get user details      | Admin         |
| PUT    | /api/admin/users/:id/role | Update user role   | Admin         |
| DELETE | /api/admin/users/:id   | Delete user           | Admin         |

## Project Structure

```
server/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Database seed script
├── src/
│   ├── config/
│   │   ├── database.js    # Prisma client singleton
│   │   └── jwt.config.js  # JWT configuration
│   ├── middleware/
│   │   ├── auth.middleware.js       # Authentication middleware
│   │   ├── error.middleware.js      # Error handling
│   │   └── validation.middleware.js # Request validation
│   ├── routes/
│   │   ├── auth.routes.js   # Auth endpoints
│   │   ├── user.routes.js   # User endpoints
│   │   ├── history.routes.js # History endpoints
│   │   ├── ppt.routes.js    # PPT endpoints
│   │   └── admin.routes.js  # Admin endpoints
│   ├── services/
│   │   ├── auth.service.js   # Auth business logic
│   │   ├── user.service.js   # User business logic
│   │   ├── history.service.js # History business logic
│   │   ├── ppt.service.js    # PPT business logic
│   │   └── admin.service.js  # Admin business logic
│   └── index.js             # Application entry point
├── .env.example             # Environment variables template
└── package.json             # Dependencies and scripts
```

## Architecture

This server follows a **layered architecture** pattern:

1. **Routes Layer**: HTTP request handling, input validation
2. **Middleware Layer**: Authentication, authorization, error handling
3. **Services Layer**: Business logic, database operations
4. **Database Layer**: Prisma ORM with PostgreSQL

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT tokens with configurable expiration
- HTTP-only cookies for token storage
- Role-based access control (RBAC)
- Input validation on all endpoints
- SQL injection protection via Prisma
- CORS configuration for frontend access

## License

MIT
