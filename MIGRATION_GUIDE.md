# Migration Guide - Component Refactoring

This guide helps you update your code after the major refactoring of the components structure.

## Quick Reference: Import Changes

### Layout Components

```typescript
// Before
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Footer";
import NavbarUser from "@/components/navbarUser";
import NavbarUserDropdown from "@/components/navbarUserDropdown";

// After
import { Navbar } from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";
import NavbarUser from "@/components/layout/navbarUser";
import NavbarUserDropdown from "@/components/layout/navbarUserDropdown";
```

### Shared Components

```typescript
// Before
import { Logo } from "@/components/Logo";
import { DiscordIcon, GithubIcon } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { SignIn } from "@/components/signinButton";
import { GuildInput } from "@/components/status/GuildInput";

// After
import { Logo } from "@/components/shared/Logo";
import { DiscordIcon, GithubIcon } from "@/components/shared/icons";
import { ThemeSwitch } from "@/components/shared/theme-switch";
import { SignIn } from "@/components/shared/signinButton";
import { GuildInput } from "@/components/shared/status/GuildInput";
```

### UI Components

```typescript
// Before
import EmbedsAccordionWrapper from "@/components/Accordion/EmbedsAccordionWrapper";
import EmbedsFieldsAccordionWrapper from "@/components/Accordion/EmbedsFieldsAccordionWrapper";
import GuildCardLoader from "@/components/loader/guildCardLoader";

// After
import EmbedsAccordionWrapper from "@/components/ui/Accordion/EmbedsAccordionWrapper";
import EmbedsFieldsAccordionWrapper from "@/components/ui/Accordion/EmbedsFieldsAccordionWrapper";
import GuildCardLoader from "@/components/ui/loader/guildCardLoader";
```

### Admin Components

```typescript
// Before
import CompleteGuildCard from "@/components/Admin/CompleteGuildCard";
import UserSearch from "@/components/Admin/UserSearch";
import GuildCard from "@/components/Admin/GuildCard";

// After
import CompleteGuildCard from "@/components/admin/CompleteGuildCard";
import UserSearch from "@/components/admin/UserSearch";
import GuildCard from "@/components/admin/GuildCard";
```

### Providers

```typescript
// Before
import { Providers } from "./providers";
import { SidebarContext } from "@/app/providers";

// After
import { Providers } from "@/providers/providers";
import { SidebarContext } from "@/providers/providers";
```

### Utilities

```typescript
// Before
import { formatDiscordMessage } from "@/utils/formatter";

// After
import { formatDiscordMessage } from "@/lib/utils";
```

### Types

```typescript
// Before
type StatsDictionary = {
  [key in Period]: GuildStats | null;
};

// After
import type { StatsDictionary } from "@/types";
```

## Component Categories

### When to use each directory:

#### `components/ui/`
Use for reusable, generic UI components that could be used in any project:
- Accordion wrappers
- Loading spinners
- Generic cards
- Tailwind variant utilities

#### `components/layout/`
Use for components that define the page structure:
- Navbar
- Footer
- Sidebar
- Page headers

#### `components/shared/`
Use for components shared across multiple features:
- Logo
- Icons
- Theme switcher
- Status indicators
- Sign in buttons

#### `components/dashboard/`
Use for dashboard and guild-specific components:
- Guild management buttons
- Module editors
- Statistics viewers
- Guild-specific cards

#### `components/admin/`
Use for admin panel components:
- Admin guild cards
- User search
- Admin controls

## Creating New Components

### Server Components (Default)

```typescript
// components/shared/MyServerComponent.tsx
import { ReactNode } from "react";

interface MyServerComponentProps {
  children: ReactNode;
}

// Server components can be async!
export async function MyServerComponent({ children }: MyServerComponentProps) {
  // Can fetch data directly
  const data = await fetch('...');
  
  return (
    <div>{children}</div>
  );
}
```

### Client Components (When Needed)

```typescript
// components/shared/MyClientComponent.tsx
// client - uses useState for form state
"use client";

import { useState } from "react";

export function MyClientComponent() {
  const [state, setState] = useState("");
  
  return (
    <input value={state} onChange={(e) => setState(e.target.value)} />
  );
}
```

**Always add a `// client - <reason>` comment before `"use client"` to document why it's needed.**

## Common Reasons for "use client"

1. **Uses React Hooks**
   ```typescript
   // client - uses useState for local state
   "use client";
   ```

2. **Event Handlers**
   ```typescript
   // client - uses onClick event handler
   "use client";
   ```

3. **Browser APIs**
   ```typescript
   // client - uses window.localStorage
   "use client";
   ```

4. **Third-party Client Libraries**
   ```typescript
   // client - uses react-toastify
   "use client";
   ```

5. **Context Consumers**
   ```typescript
   // client - uses useContext hook
   "use client";
   ```

## Breaking Changes

### Removed Components

- ❌ `components/ui/Accordion/AccordionItemWrapper.tsx` - Not used anywhere, removed

### Removed Directories

- ❌ `utils/` - Merged into `lib/utils.ts`

### Renamed Directories

- `components/Admin/` → `components/admin/` (lowercase for consistency)

## Server Actions vs Client Event Handlers

### ✅ Prefer Server Actions (Server Component)

```typescript
// components/myForm.tsx
import { myServerAction } from "@/lib/actions";

export function MyForm() {
  return (
    <form action={myServerAction}>
      <button type="submit">Submit</button>
    </form>
  );
}
```

### 🤔 Use Client Component only when necessary

```typescript
// components/myForm.tsx
// client - needs client-side validation before submit
"use client";

import { useState } from "react";
import { myServerAction } from "@/lib/actions";

export function MyForm() {
  const [isValid, setIsValid] = useState(false);
  
  return (
    <form action={myServerAction}>
      <input onChange={(e) => setIsValid(validate(e.target.value))} />
      <button type="submit" disabled={!isValid}>Submit</button>
    </form>
  );
}
```

## Testing Your Changes

After updating imports, verify:

1. ✅ No TypeScript errors
2. ✅ All imports resolve correctly
3. ✅ Server components don't use hooks or browser APIs
4. ✅ Client components have `// client` comment
5. ✅ Build succeeds: `npm run build`

## Getting Help

If you encounter issues:

1. Check `ARCHITECTURE.md` for the complete structure
2. Check `REFACTORING_SUMMARY.md` for detailed changes
3. Look at similar components for examples
4. Ensure you're using the correct import path

## Tips

- Use your IDE's "Find and Replace" to update multiple imports at once
- Search for `@/components/` to find all component imports
- Use absolute imports (`@/`) instead of relative imports for better refactoring
- Keep the component categorization in mind when creating new files
