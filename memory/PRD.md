# Apixel Portfolio - PRD

## Original Problem Statement
Clone GitHub repo `apixel-code/apixel-portfolio` and make these changes:
1. Phone/WhatsApp: +8801754407239
2. Store page copy: emotional, conversion-focused
3. Store card height: 10% reduced
4. "View Store Item" → "View Details"
5. Template Details page cleanup
6. Dark/Light mode toggle next to "Get Started"

## Iteration 2 Changes (User Request)
1. Toggle button moved to LEFT of "Get Started"
2. Blog card size matched to Store card size
3. 6 demo templates seeded in Store page
4. "Most Popular" / "Best Seller" / "Trending" badges on cards
5. Store page copy updated to: "Skip the Struggle. Start Selling Today."
6. Mobile responsiveness check & fix
7. Admin panel made mobile responsive (hamburger sidebar)
8. Admin login fixed (race condition in AuthContext)

## Architecture
- **Frontend**: React 18 + Tailwind CSS + Framer Motion
- **Backend**: FastAPI + MongoDB
- **Auth**: JWT-based admin auth

## User Personas
- **Visitors**: Browse services, store templates, blog, contact
- **Admin**: Manage blogs, services, templates, messages via /admin

## What's Been Implemented
### Phase 1 (Jan 16, 2026)
- Full repo clone and setup
- Phone/WhatsApp number updated everywhere
- Store page emotional copy
- Card height reduced, "View Details" button
- Template Details page improved
- Dark/Light mode toggle with localStorage persistence

### Phase 2 (Jan 16, 2026)
- Toggle moved to left of "Get Started"
- Blog cards made compact (16/9, reduced padding)
- 6 demo templates seeded: Agency Pro, ShopLaunch, FolioX, SaaSKit, RestroHub, EduLearn
- Social proof badges on template cards (Most Popular, Best Seller, Trending)
- Store copy: "Skip the Struggle. Start Selling Today."
- Admin panel mobile responsive (slide-out sidebar)
- Admin login race condition fixed
- Full mobile responsiveness verified

## Testing: 100% pass rate (backend + frontend) - Both iterations

## Prioritized Backlog
- P0: None
- P1: Add template image gallery/demo URLs from admin
- P2: SEO optimizations, blog pagination improvements
