# Home Service Marketplace — MVP Implementation Plan

Build a fully functional **Home Service Marketplace** demo (like Urban Company) with an **Expo React Native** app and a **Node.js/Express + Prisma/PostgreSQL** backend, covering the MVP features defined in [initial.md](file:///c:/Users/user/Desktop/prject/initial.md).

## User Review Required

> [!IMPORTANT]
> **Database**: The plan assumes your PostgreSQL is running locally on `localhost:5432` with database `db_3` (from your `.env`). Please confirm this is accessible.

> [!IMPORTANT]
> **Android build**: Your Expo project uses SDK 56 with `expo run:android`. I'll ensure the project builds and runs correctly. You'll need an Android emulator or device connected.

> [!WARNING]
> **No bottom tab navigation library**: The current `package.json` doesn't include `@react-navigation/bottom-tabs`. I'll need to install it along with a few other missing packages (`@tanstack/react-query`, `expo-linear-gradient`).

## Open Questions

1. **Seed data** — Should I create a seed script with sample service categories (Plumbing, Electrician, Cleaning, etc.) and a few demo providers, or do you want to enter data manually?
2. **JWT secret** — I'll add a `JWT_SECRET` to the `.env` file. Is using a hardcoded dev secret like `"homeservice-dev-secret-2026"` fine for now?

---

## Proposed Changes

### Phase 1: Backend — Database Schema & Auth

#### [MODIFY] [schema.prisma](file:///c:/Users/user/Desktop/prject/server/prisma/schema.prisma)
Expand the schema with all MVP models:
- **User** — add `avatar`, `address`, `bio` fields
- **ServiceCategory** — `id`, `name`, `icon`, `description`
- **ProviderProfile** — links to User, has `skills`, `experience`, `rating`, `hourlyRate`, `serviceArea`, relation to ServiceCategory
- **Booking** — `homeownerId`, `providerId`, `serviceCategoryId`, `date`, `timeSlot`, `address`, `notes`, `status` (PENDING → ACCEPTED → IN_PROGRESS → COMPLETED / REJECTED / CANCELLED)
- **Review** — `bookingId`, `homeownerId`, `providerId`, `rating`, `comment`

#### [MODIFY] [.env](file:///c:/Users/user/Desktop/prject/server/.env)
Add `JWT_SECRET` and `PORT` variables.

#### [NEW] `server/src/config/db.js`
Prisma client singleton.

#### [MODIFY] [auth.routes.js](file:///c:/Users/user/Desktop/prject/server/src/routes/auth.routes.js)
Wire up `POST /register`, `POST /login`, `GET /me`.

#### [NEW] `server/src/controllers/auth.controller.js`
Register (hash password with bcrypt, store user), Login (verify password, return JWT), Get current user.

#### [NEW] `server/src/middleware/auth.middleware.js`
JWT verification middleware, role-based guard (`requireRole('HOMEOWNER')`, `requireRole('PROVIDER')`).

---

### Phase 2: Backend — Service, Booking & Review APIs

#### [NEW] `server/src/routes/service.routes.js`
- `GET /api/services/categories` — list all categories
- `GET /api/services/providers?categoryId=X` — list providers for a category
- `GET /api/services/providers/:id` — provider details with reviews

#### [NEW] `server/src/controllers/service.controller.js`
Business logic for service browsing.

#### [NEW] `server/src/routes/booking.routes.js`
- `POST /api/bookings` — create booking (homeowner)
- `GET /api/bookings/my` — my bookings (role-aware)
- `PATCH /api/bookings/:id/accept` — accept (provider)
- `PATCH /api/bookings/:id/reject` — reject (provider)
- `PATCH /api/bookings/:id/complete` — mark complete (provider)
- `PATCH /api/bookings/:id/cancel` — cancel (homeowner)

#### [NEW] `server/src/controllers/booking.controller.js`

#### [NEW] `server/src/routes/review.routes.js`
- `POST /api/reviews` — create review (homeowner, after completed booking)
- `GET /api/reviews/provider/:id` — reviews for a provider

#### [NEW] `server/src/controllers/review.controller.js`

#### [NEW] `server/src/routes/profile.routes.js`
- `GET /api/profile` — get current user profile
- `PUT /api/profile` — update profile

#### [NEW] `server/src/controllers/profile.controller.js`

#### [MODIFY] [app.js](file:///c:/Users/user/Desktop/prject/server/src/app.js)
Register all new route groups.

#### [NEW] `server/prisma/seed.js`
Seed script with 8 service categories and 6 demo providers.

---

### Phase 3: App — Theme, Types & Core Setup

#### [MODIFY] [theme/index.ts](file:///c:/Users/user/Desktop/prject/app/src/theme/index.ts)
Complete design system: color palette (dark-mode-friendly with vibrant accents), typography scale, spacing, border radii, shadows.

#### [MODIFY] [types/index.ts](file:///c:/Users/user/Desktop/prject/app/src/types/index.ts)
TypeScript interfaces: `User`, `ServiceCategory`, `ProviderProfile`, `Booking`, `Review`, `AuthState`, navigation param lists.

#### [MODIFY] [api/index.ts](file:///c:/Users/user/Desktop/prject/app/src/api/index.ts)
Axios instance with base URL, interceptor to attach JWT from AsyncStorage, all API functions (`login`, `register`, `getCategories`, `getProviders`, `createBooking`, etc.).

#### [MODIFY] [store/index.ts](file:///c:/Users/user/Desktop/prject/app/src/store/index.ts)
Zustand auth store: `user`, `token`, `isAuthenticated`, `login()`, `logout()`, `loadToken()` (from AsyncStorage).

---

### Phase 4: App — Navigation

#### [MODIFY] [navigation/index.ts](file:///c:/Users/user/Desktop/prject/app/src/navigation/index.ts) → rename to `navigation/AppNavigator.tsx`
Root navigator: conditionally render Auth stack or Main stack based on auth state.

#### [NEW] `app/src/navigation/AuthStack.tsx`
Login → Register screens.

#### [NEW] `app/src/navigation/HomeownerTabs.tsx`
Bottom tabs: Home, Bookings, Profile.

#### [NEW] `app/src/navigation/ProviderTabs.tsx`
Bottom tabs: Job Requests, My Jobs, Profile.

---

### Phase 5: App — Auth Screens

#### [NEW] `app/src/screens/auth/LoginScreen.tsx`
Polished login with email/password, role toggle, animated branding, React Hook Form + Yup validation.

#### [NEW] `app/src/screens/auth/RegisterScreen.tsx`
Registration with name, email, phone, password, role selection, form validation.

#### [NEW] `app/src/screens/common/SplashScreen.tsx`
Animated splash with logo and loading indicator.

---

### Phase 6: App — Homeowner Screens

#### [NEW] `app/src/screens/homeowner/HomeScreen.tsx`
Welcome banner, service category grid (with icons), popular providers carousel.

#### [NEW] `app/src/screens/homeowner/ServiceListScreen.tsx`
Providers list for a selected category with rating, price, and experience info.

#### [NEW] `app/src/screens/homeowner/ProviderDetailScreen.tsx`
Full provider profile, reviews, "Book Now" button.

#### [NEW] `app/src/screens/homeowner/BookingFormScreen.tsx`
Date picker, time slot selector, address input, notes field, confirm button.

#### [NEW] `app/src/screens/homeowner/MyBookingsScreen.tsx`
Tabbed list (Upcoming / Completed / Cancelled), booking cards with status badges.

#### [NEW] `app/src/screens/homeowner/ProfileScreen.tsx`
User info, edit profile, logout button.

---

### Phase 7: App — Provider Screens

#### [NEW] `app/src/screens/provider/JobRequestsScreen.tsx`
Pending booking requests with Accept/Reject actions.

#### [NEW] `app/src/screens/provider/MyJobsScreen.tsx`
Accepted jobs list with "Mark Complete" action.

#### [NEW] `app/src/screens/provider/ProviderProfileScreen.tsx`
Provider's own profile with stats, skills, logout.

---

### Phase 8: App — Shared Components

#### [NEW] `app/src/components/Button.tsx`
Reusable gradient/solid button with loading state.

#### [NEW] `app/src/components/Input.tsx`
Styled text input with error display.

#### [NEW] `app/src/components/Card.tsx`
Reusable card wrapper with shadow/elevation.

#### [NEW] `app/src/components/BookingCard.tsx`
Booking status card with color-coded badges.

#### [NEW] `app/src/components/ProviderCard.tsx`
Provider summary card with avatar, rating stars, price.

#### [NEW] `app/src/components/CategoryCard.tsx`
Service category tile with icon.

#### [NEW] `app/src/components/RatingStars.tsx`
Star rating display and input component.

#### [NEW] `app/src/components/StatusBadge.tsx`
Colored status pill (Pending, Accepted, Completed, etc.).

---

### Phase 9: App Entry Point & Package Updates

#### [MODIFY] [App.tsx](file:///c:/Users/user/Desktop/prject/app/App.tsx)
Wrap with NavigationContainer, QueryClientProvider, load auth state on startup.

#### Install additional packages
```
npm install @react-navigation/bottom-tabs @tanstack/react-query expo-linear-gradient
```

---

## Verification Plan

### Automated Tests
```bash
# Server: Test API endpoints
cd server && npm run dev
# Verify in separate terminal:
curl http://localhost:5000/api/auth/register -X POST -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","password":"test123","role":"HOMEOWNER"}'
curl http://localhost:5000/api/services/categories
```

### Manual Verification
1. **Server**: Start with `npm run dev`, test all endpoints with curl/Postman
2. **Database**: Run `npx prisma db push` and `node prisma/seed.js` to verify schema and seed data
3. **App**: Run `npx expo run:android` on emulator/device
4. **Demo flow**: Walk through the full homeowner and provider flows as described in initial.md
   - Register homeowner → Browse services → Select provider → Book → View booking
   - Register provider → View requests → Accept → Complete
   - Homeowner rates provider
