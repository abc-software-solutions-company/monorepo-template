# Monorepo Project

This is a monorepo containing multiple applications and packages built with modern web technologies. The project includes an admin portal, API
backend, mobile app, and website components.

## Repository Structure

The repository is organized as follows:

```shell
├── apps/                               # Application packages
│   ├── admin-portal/                   # Admin dashboard application
│   ├── api/                            # NestJS API backend
│   ├── mobile-app/                     # React Native mobile application
│   └── website/                        # Next.js website frontend
│
├── packages/                           # Shared packages
│   ├── config-prettier/                # Prettier configuration
│   ├── config-tailwindcss/             # Tailwind CSS configuration
│   ├── config-typescript/              # TypeScript configuration
│   ├── eslint-config/                  # ESLint configuration
│   ├── react-native-design-system/     # React Native design system
│   ├── react-native-ui-core/           # React Native UI core components
│   ├── react-web-ui-shadcn/            # Web UI components using shadcn
│   ├── shared-universal/               # Universal shared utilities
│   └── shared-web/                     # Web-specific shared utilities
│
└── docs/                               # Project documentation
```

## Core Features

- Full TypeScript support across all packages
- Authentication with multiple providers (Firebase, Google, Facebook, Apple)
- Access token & refresh token auth system
- Content management features (posts, users, files, etc)
- Settings & preferences management
- Push notifications
- Full test coverage (unit testing & E2E testing)
- API documentation with Swagger

## Key Technologies

- **Backend**: NestJS, TypeORM, PostgreSQL Firebase (Optional)
- **Frontend**: React, Next.js, Vite
- **Mobile**: React Native
- **UI**: TailwindCSS, shadcn/ui
- **Testing**: Jest, Playwright
- **API Documentation**: Swagger

## Getting Started

### Install dependencies:

```bash
yarn install
```

**Set up API Backend:** Please refer to the <a href="apps/api/README.md" target="\_blank">API documentation</a> for more information.

**Set up Admin Portal:** Please refer to the <a href="apps/admin-portal/README.md" target="\_blank">Admin Portal documentation</a> for more
information.

**Set up Website:** Please refer to the <a href="apps/website/README.md" target="\_blank">Website documentation</a> for more information.

**Set up Mobile App:** Please refer to the <a href="apps/mobile-app/README.md" target="\_blank">Mobile App documentation</a> for more information.

## Documentation

- Additional documentation available in the `docs/` directory
