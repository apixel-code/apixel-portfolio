# APIXEL IT Agency - Product Requirements Document

## Original Problem Statement
Build a full-stack IT agency website for APIXEL offering Website Development (MERN), Meta & Google Ads with Conversion API & Tracking Setup, Social Media Management, and Graphic Design.

## Tech Stack
- **Frontend**: React.js with React Router DOM, Tailwind CSS, Framer Motion
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Auth**: JWT-based admin authentication
- **SEO**: React Helmet Async

## User Personas
1. **Potential Clients**: Business owners seeking digital services
2. **Admin Users**: Agency staff managing content and leads

## Core Requirements (Static)
- Dark luxury theme with cyan (#00F5FF), gold (#FFD700), purple (#9333EA)
- Glassmorphism cards, animated counters, typewriter hero effect
- Mobile-first responsive design
- SEO optimized pages
- Admin panel for content management

## What's Been Implemented (March 21, 2026)

### Public Pages
- [x] **Home Page** (`/`)
  - Animated hero with typewriter effect
  - Services section with 4 glassmorphism cards
  - Stats counter animation (150+ Projects, 80+ Clients, 5+ Years, 500K+ Ads)
  - Why Choose Us section
  - Testimonials carousel
  - CTA section
  - Footer with social links, contact info, newsletter

- [x] **Services Page** (`/services`)
  - Hero section
  - Detailed service cards fetched from MongoDB API
  - Features list, price ranges
  - CTA buttons

- [x] **Blog Page** (`/blog`)
  - Blog grid with cards
  - Search functionality
  - Category filter
  - Pagination
  - 3 seeded blog posts

- [x] **Blog Post Page** (`/blog/:slug`)
  - Full article with HTML content
  - SEO meta tags per post
  - Author info, tags
  - Social share buttons
  - Related posts section

- [x] **About Page** (`/about`)
  - Agency story
  - Team member cards (4 members)
  - Mission/Vision/Values
  - Tech stack showcase

- [x] **Contact Page** (`/contact`)
  - Contact form (name, email, phone, service, message)
  - Form submissions saved to MongoDB
  - Google Maps embed
  - Contact details
  - WhatsApp floating button

- [x] **404 Page** - Animated not found page

### Admin Panel
- [x] **Admin Login** (`/admin/login`) - JWT auth with hardcoded credentials
- [x] **Dashboard** (`/admin/dashboard`) - Stats cards, recent messages
- [x] **Blog Management** (`/admin/blogs`) - CRUD operations
- [x] **Service Management** (`/admin/services`) - CRUD operations
- [x] **Messages** (`/admin/messages`) - View/manage contact submissions

### Backend API Endpoints
- [x] `POST /api/auth/login` - Admin authentication
- [x] `GET /api/blogs` - List all published blogs
- [x] `GET /api/blogs/:slug` - Single blog by slug
- [x] `POST /api/blogs` - Create blog (protected)
- [x] `PUT /api/blogs/:id` - Update blog (protected)
- [x] `DELETE /api/blogs/:id` - Delete blog (protected)
- [x] `GET /api/services` - List all services
- [x] `POST /api/services` - Create service (protected)
- [x] `PUT /api/services/:id` - Update service (protected)
- [x] `DELETE /api/services/:id` - Delete service (protected)
- [x] `POST /api/contact` - Submit contact form
- [x] `GET /api/contact` - Get all messages (protected)
- [x] `PUT /api/contact/:id/read` - Mark as read (protected)
- [x] `DELETE /api/contact/:id` - Delete message (protected)
- [x] `GET /api/stats` - Dashboard stats (protected)

### Seed Data
- 4 services (MERN Dev, Ads, Social Media, Graphic Design)
- 3 blog posts (MERN tips, Facebook Ads guide, Social Media trends)
- 1 admin user (admin@agency.com / Admin@123)

### UI/UX Features
- [x] Framer Motion page transitions and scroll animations
- [x] Animated counters
- [x] Typewriter hero effect
- [x] Glassmorphism cards with hover effects
- [x] Mobile hamburger menu
- [x] WhatsApp floating button (+8801325383588)
- [x] Toast notifications
- [x] Loading spinners
- [x] Dark theme with custom scrollbar

## Prioritized Backlog

### P0 (Critical)
- None - Core functionality complete

### P1 (High Priority)
- [ ] Image upload for blogs (currently URL-based)
- [ ] Rich text editor for blog content
- [ ] Password reset functionality

### P2 (Medium Priority)
- [ ] Blog categories management
- [ ] Newsletter subscription backend
- [ ] Analytics integration
- [ ] Multi-language support

### P3 (Nice to Have)
- [ ] Portfolio/Projects showcase page
- [ ] Client testimonials management
- [ ] Pricing packages page
- [ ] Live chat integration

## Contact Information
- Email: contact.apixel@gmail.com
- Phone: +880 1325 383 588
- Address: Baridhara, Dhaka, Bangladesh
- WhatsApp: +8801325383588

## Social Links
- Facebook: https://www.facebook.com/apixelltd
- Instagram: https://www.instagram.com/apixel_net
- LinkedIn: https://linkedin.com/company/apixelnet

## Admin Credentials
- Email: admin@agency.com
- Password: Admin@123
