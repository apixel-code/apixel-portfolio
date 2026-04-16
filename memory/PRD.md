# Apixel Portfolio - PRD

## Original Problem Statement
Clone GitHub repo `apixel-code/apixel-portfolio` and make changes: phone number, store copy, card height, dark/light mode toggle.

## Iteration History

### Iteration 1
- Phone/WhatsApp: +8801754407239
- Store page emotional copy, card height reduced, "View Details" button
- Dark/Light mode toggle, Template Details cleanup

### Iteration 2
- Toggle to left of Get Started, Blog card = Store card size
- 6 demo templates seeded, social proof badges
- Admin login fixed, admin panel mobile responsive

### Iteration 3
- Mobile toggle moved next to hamburger menu button
- ScrollToTop fix - pages now start from top on navigation
- Store copy simplified like Nextive: "Websites and platforms we've shipped."
- Card size 4:3 ratio like Nextive, simpler layout
- "Visit Site" button links to external demo URL (set via admin)
- Template Details page removed - cards link directly to demo
- Admin login inputs cleaned (removed icon overlays)

## Architecture
- **Frontend**: React 18 + Tailwind CSS + Framer Motion
- **Backend**: FastAPI + MongoDB
- **Auth**: JWT-based admin auth

## What's Implemented
- Full portfolio site: Home, Services, Store, Blog, About, Contact
- Admin panel: CRUD for blogs, services, templates, messages
- Dark/Light mode with localStorage persistence
- ScrollToTop on route changes
- Mobile responsive across all pages + admin panel
- 6 demo templates with demo URLs

## Testing: 100% pass rate (3/3 iterations)

## Backlog
- P1: Real demo URLs for templates
- P2: Blog pagination, SEO improvements
