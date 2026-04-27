# Vestrapay Frontend

This monorepo contains the Vestrapay frontend applications: merchant dashboard, admin back-office, web app, and hosted checkout.

## Prerequisites

- Node.js `>=20`
- `pnpm` `>=10`

## Installation Guide

1. Clone the repository:

```bash
git clone <your-repository-url>
cd vestrapay-fe
```

2. Install dependencies:

```bash
pnpm install
```

3. Run all apps in development mode:

```bash
pnpm dev
```

4. Run one app only (examples):

```bash
pnpm dev:merchant
pnpm dev:admin
pnpm dev:checkout
pnpm dev:web
```

5. Validate before shipping:

```bash
pnpm lint
pnpm type-check
pnpm build
```

## Folder Structure

```text
vestrapay-fe/
├── apps/
│   ├── merchant/        # Merchant dashboard frontend
│   ├── admin/           # Internal back-office/admin app
│   ├── web/             # Public-facing web app
│   └── checkout/        # Hosted checkout payment experience
├── packages/
│   ├── ui/              # Shared UI components, styles, and design primitives
│   └── eslint-config/   # Shared linting rules used by apps/packages
├── pnpm-workspace.yaml  # Workspace package configuration
├── turbo.json           # Turborepo task pipeline and caching config
└── README.md            # Project onboarding and usage guide
```

## Useful Commands

- `pnpm dev` - run all apps
- `pnpm lint` - lint all workspaces
- `pnpm type-check` - run TypeScript checks
- `pnpm build` - build all workspaces
