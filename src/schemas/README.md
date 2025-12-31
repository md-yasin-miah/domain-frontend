# Schemas Directory

This directory contains all Zod validation schemas for the application, organized by feature.

## Structure

```
schemas/
├── auth/             # Authentication schemas
│   ├── login.schema.ts
│   ├── register.schema.ts
│   └── index.ts
├── user/             # User schemas
│   ├── profile.schema.ts
│   ├── user.schema.ts
│   └── index.ts
├── marketplace/      # Marketplace schemas
│   ├── listing.schema.ts
│   ├── offer.schema.ts
│   ├── order.schema.ts
│   └── index.ts
├── blog/             # Blog schemas
│   ├── post.schema.ts
│   └── index.ts
├── common/           # Common schemas
│   ├── pagination.schema.ts
│   └── index.ts
└── index.ts          # Barrel export
```

## Usage

```typescript
// Import from barrel export
import { loginSchema, registerSchema } from '@/schemas/auth';
import { profileSchema } from '@/schemas/user';

// Use with react-hook-form
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const form = useForm({
  resolver: zodResolver(loginSchema),
});
```

## Guidelines

1. **One schema per file**: Keep schemas focused and organized
2. **Export types**: Always export the inferred type alongside the schema
3. **Barrel Exports**: Export from `index.ts` for clean imports
4. **Naming**: Use descriptive names ending with `.schema.ts`
5. **Validation**: Keep validation rules consistent across the app

## Example

```typescript
// schemas/auth/login.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

