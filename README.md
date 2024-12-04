# Academic Learning Platform

A comprehensive online learning platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Multi-role user system (Students, Teachers, Admins)
- Course management and content delivery
- Interactive learning tools
- Progress tracking
- Real-time communication
- Responsive design
- Dark mode support

## Tech Stack

- Frontend: Next.js 14 with TypeScript
- Styling: Tailwind CSS
- Database: PostgreSQL with Prisma ORM
- Authentication: NextAuth.js
- State Management: React Query & Context API
- Payment Processing: Stripe (optional)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your environment variables
4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
academic-platform/
├── src/
│   ├── app/                 # App router pages
│   ├── components/          # Reusable components
│   │   ├── common/         # Shared components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   └── layout/         # Layout components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and configurations
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
└── tests/                 # Test files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run prisma:studio` - Open Prisma Studio

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

MIT
