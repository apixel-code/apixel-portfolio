# Apixel Portfolio - PRD

## Original Problem Statement
Clone GitHub repo `apixel-code/apixel-portfolio`. Make the following changes:
1. Replace phone/WhatsApp number with +8801754407239
2. Update Store page copy with emotional, reptilian-brain-targeting copy
3. Reduce Store page card height by 10%
4. Change "View Store Item" button to "View Details"
5. Clean up Template Details page for clarity
6. Add Dark/Light mode toggle next to "Get Started" button on Home page navbar

## Architecture
- **Frontend**: React 18 + Tailwind CSS + Framer Motion
- **Backend**: FastAPI + MongoDB
- **Auth**: JWT-based admin auth (admin@agency.com / Admin@123)

## User Personas
- **Visitors**: Browse services, store templates, blog, contact
- **Admin**: Manage blogs, services, templates, messages via /admin

## Core Requirements (Static)
- Portfolio website for Apixel digital agency
- Services: Web Dev, Ads, Social Media, Graphic Design
- Blog system with CRUD
- Template/Store marketplace (admin-managed)
- Contact form
- WhatsApp floating button

## What's Been Implemented (Jan 16, 2026)
- Cloned and set up full repo from GitHub
- Phone/WhatsApp number updated to +8801754407239 in WhatsAppButton, Footer, Contact
- Store page copy rewritten with emotional, conversion-focused messaging
- Store card height reduced by 10% (tighter padding, 16/9 aspect ratio)
- "View Store Item" -> "View Details" button text
- Template Details page cleaned up with clearer sections and better CTA
- Dark/Light mode toggle added next to "Get Started" in Navbar
- Theme persists via localStorage
- Light mode CSS overrides for all components

## Testing: 100% pass rate (backend + frontend)

## Prioritized Backlog
- P0: None (all required changes complete)
- P1: Add template seed data for store demos
- P2: SEO optimizations, image lazy loading improvements
