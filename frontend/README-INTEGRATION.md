# MediaGuard AI frontend update

## 1. Add to frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Restart the Next.js dev server after changing `.env.local`.

## 2. Copy these files into the same relative paths

- `lib/api.ts`
- `components/dashboard/DashboardOverview.tsx`
- `components/dashboard/UploadWorkspace.tsx`
- `components/dashboard/MediaLibrary.tsx`
- `components/dashboard/SettingsPanel.tsx`
- `app/dashboard/page.tsx`
- `app/dashboard/layout.tsx`
- `app/dashboard/upload/page.tsx`
- `app/dashboard/media/page.tsx`
- `app/dashboard/settings/page.tsx`

## 3. CSS

Append `components/dashboard/dashboard-pages.css` to your existing `app/globals.css`.

Do not replace the existing landing/auth/dashboard CSS.

## 4. Existing components

Your current `DashboardShell`, `Sidebar`, `DashboardHeader`, `StatCard`, and `Navbar` can remain. The new pages use the same dark navy / indigo / cyan visual language.

## 5. Authenticated API requests

The frontend obtains the Clerk session token with `useAuth().getToken()` and sends it as:

`Authorization: Bearer <session-token>`

This matches the Express backend authentication flow.

## 6. Run

Terminal 1:

```bash
cd server
npm run dev
```

Terminal 2:

```bash
npm run dev
```

Then test:

- `/dashboard`
- `/dashboard/upload`
- `/dashboard/media`
- `/dashboard/settings`

## 7. Honest metrics

The current backend returns original `bytes` and an optimized Cloudinary URL, but does not return actual optimized byte size or a measured reduction percentage. The frontend intentionally does not invent those numbers; those dashboard metrics remain `—` until the backend exposes real optimization-size data.
