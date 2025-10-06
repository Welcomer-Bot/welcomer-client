# Project Architecture

## Directory Structure

```
welcomer-client/
│
├── app/                          # Next.js 14 App Router
│   ├── (home)/                   # Route group for home pages
│   │   ├── dashboard/
│   │   │   ├── page.tsx         # Server Component
│   │   │   ├── layout.tsx       # Server Component
│   │   │   ├── loading.tsx      # Loading UI
│   │   │   └── error.tsx        # Error boundary
│   │   ├── layout.tsx           # Home layout (uses Navbar, Footer)
│   │   └── page.tsx             # Landing page
│   │
│   ├── dashboard/[guildId]/     # Dynamic routes
│   │   ├── layout.tsx           # Guild layout (uses Sidebar)
│   │   ├── page.tsx             # Guild overview
│   │   ├── welcome/
│   │   └── leave/
│   │
│   ├── admin/                    # Admin routes
│   │   ├── layout.tsx
│   │   └── guilds/page.tsx
│   │
│   └── layout.tsx               # Root layout (uses Providers)
│
├── components/                   # React Components
│   ├── ui/                      # Generic UI Components
│   │   ├── Accordion/           # Accordion wrappers (client)
│   │   ├── loader/              # Loading components
│   │   └── primitives.ts        # Tailwind variants
│   │
│   ├── layout/                  # Layout Components
│   │   ├── navbar.tsx           # Main navbar (server)
│   │   ├── navbarUser.tsx       # Async user menu (server)
│   │   ├── navbarUserDropdown.tsx  # User dropdown (client)
│   │   └── Footer.tsx           # Footer (server)
│   │
│   ├── shared/                  # Shared Components
│   │   ├── Logo.tsx             # Logo component (server)
│   │   ├── icons.tsx            # Icon components (server)
│   │   ├── theme-switch.tsx     # Theme switcher (client)
│   │   ├── signinButton.tsx     # Sign in button (client)
│   │   └── status/              # Status components
│   │
│   ├── dashboard/               # Dashboard Components
│   │   ├── InviteBotButton.tsx  # Client component
│   │   ├── ManageGuildButton.tsx # Client component
│   │   ├── RequestBetaAccesButton.tsx # Client component
│   │   └── guild/               # Guild-specific components
│   │       ├── sideBar.tsx      # Sidebar (client - uses context)
│   │       ├── guildCard.tsx    # Guild card (server)
│   │       ├── editor/          # Message editor components
│   │       ├── imageEditor/     # Image editor components
│   │       └── stats/           # Statistics components
│   │
│   └── admin/                   # Admin Components
│       ├── CompleteGuildCard.tsx # Client component
│       ├── GuildCard.tsx        # Client component
│       └── UserSearch.tsx       # Client component
│
├── providers/                   # React Context Providers
│   ├── providers.tsx           # Main providers wrapper (client)
│   ├── imageStoreProvider.tsx  # Image state provider
│   └── sourceStoreProvider.tsx # Source state provider
│
├── lib/                        # Library & Utilities
│   ├── actions.ts             # Server Actions
│   ├── dal.ts                 # Data Access Layer
│   ├── dto.ts                 # Data Transfer Objects
│   ├── utils.ts               # Utility functions
│   ├── validator.ts           # Validation schemas
│   ├── session.ts             # Session management
│   ├── discord/               # Discord API integration
│   └── admin/                 # Admin utilities
│
├── types/                      # TypeScript Types
│   ├── index.ts               # Main type definitions
│   └── prisma.ts              # Prisma-specific types
│
├── state/                      # Zustand State Management
│   ├── guild.ts
│   ├── image.ts
│   └── source.ts
│
├── config/                     # Configuration
│   ├── site.ts
│   └── fonts.ts
│
└── prisma/                     # Database
    └── schema.prisma

## Component Classification

### Server Components (70% - 52 components)
These components:
- Run on the server only
- Can directly access databases and APIs
- Don't use React hooks or browser APIs
- Can be async functions

Examples:
- `components/layout/navbar.tsx`
- `components/layout/Footer.tsx`
- `components/layout/navbarUser.tsx` (async)
- `components/shared/Logo.tsx`
- `components/dashboard/guild/guildCard.tsx`

### Client Components (23% - 17 components)
Marked with `// client - <reason>` comment
These components need "use client" because they:
- Use React hooks (useState, useEffect, useContext)
- Use browser APIs (window, localStorage)
- Have event handlers (onClick, onPress)
- Use third-party client-only libraries

Examples:
- `components/shared/theme-switch.tsx` - uses useTheme
- `components/dashboard/guild/sideBar.tsx` - uses useState, useContext
- `components/ui/Accordion/EmbedsAccordionWrapper.tsx` - uses useStore

## Data Flow

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │         Client Components                    │  │
│  │  (with "use client" directive)               │  │
│  │                                               │  │
│  │  - Event handlers                            │  │
│  │  - React hooks                               │  │
│  │  - Browser APIs                              │  │
│  └────────────┬─────────────────────────────────┘  │
│               │                                     │
│               │ Server Actions                      │
│               ▼                                     │
└───────────────┼─────────────────────────────────────┘
                │
┌───────────────┼─────────────────────────────────────┐
│               │            Server                   │
│               │                                     │
│  ┌────────────▼─────────────────────────────────┐  │
│  │         Server Components                    │  │
│  │  (default - no "use client")                 │  │
│  │                                               │  │
│  │  - Async data fetching                       │  │
│  │  - Direct DB access                          │  │
│  │  - Environment variables                     │  │
│  └────────────┬─────────────────────────────────┘  │
│               │                                     │
│               │                                     │
│  ┌────────────▼─────────────────────────────────┐  │
│  │         Data Access Layer (DAL)              │  │
│  │                                               │  │
│  │  - lib/dal.ts                                │  │
│  │  - lib/actions.ts (Server Actions)           │  │
│  └────────────┬─────────────────────────────────┘  │
│               │                                     │
│               │                                     │
│  ┌────────────▼─────────────────────────────────┐  │
│  │         Database (Prisma)                    │  │
│  │                                               │  │
│  │  - PostgreSQL                                │  │
│  │  - Prisma ORM                                │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Import Patterns

### ✅ Recommended Patterns

```typescript
// Use absolute imports with @/ alias
import { Navbar } from "@/components/layout/navbar";
import { Logo } from "@/components/shared/Logo";
import { getUser } from "@/lib/dal";
import type { IconSvgProps } from "@/types";

// Relative imports only within the same directory
import NavbarUser from "./navbarUser";
```

### ❌ Avoid These Patterns

```typescript
// Don't use old paths
import { Navbar } from "@/components/navbar"; // WRONG
import Footer from "@/components/Footer"; // WRONG
import { Providers } from "../../../app/providers"; // WRONG
```

## Best Practices

1. **Default to Server Components**
   - Only add "use client" when necessary
   - Document why with `// client - <reason>` comment

2. **Component Placement**
   - `components/ui/` - Reusable UI primitives
   - `components/layout/` - Page layouts and navigation
   - `components/shared/` - Shared across features
   - `components/dashboard/` - Dashboard-specific
   - `components/admin/` - Admin-specific

3. **State Management**
   - Server state: Server Components + Server Actions
   - Client state: Zustand stores in `state/`
   - Context: Providers in `providers/`

4. **Type Safety**
   - All types in `types/` directory
   - Use Prisma-generated types when possible
   - Export reusable types from `types/index.ts`

5. **Code Organization**
   - Group related components together
   - Keep components focused and small
   - Extract reusable logic to utilities
   - Use Server Actions for mutations
