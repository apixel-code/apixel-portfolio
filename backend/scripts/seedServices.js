require("dotenv").config();

const { MongoClient } = require("mongodb");
const { SERVICE_CATEGORY_COLLECTION } = require("../models/serviceCategory.model");
const { SERVICE_SUB_CATEGORY_COLLECTION } = require("../models/serviceSubCategory.model");
const { slugify } = require("../controllers/services.controller");

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || "apixel_agency";

const categories = [
  { title: "Web Development", slug: "web-development", icon: "Code", order: 1, description: "Conversion-focused websites, stores, CMS builds, web apps, landing pages, and ongoing support." },
  { title: "Software Development", slug: "software-development", icon: "FaCode", order: 2, description: "We build tailor-made software solutions -- from APIs and SaaS products to ERP systems and legacy migrations." },
  { title: "UI/UX Design", slug: "ui-ux-design", icon: "FaPencilRuler", order: 3, description: "We craft intuitive, beautiful digital experiences that users love and businesses rely on -- from wireframes to pixel-perfect interfaces." },
  { title: "Digital Marketing", slug: "digital-marketing", icon: "FaBullhorn", order: 4, description: "We help businesses grow online through data-driven marketing strategies -- from SEO and paid ads to social media and content marketing." },
  { title: "Creative & Media", slug: "creative-media", icon: "FaPhotoVideo", order: 5, description: "We produce high-quality visual and media content that tells your brand story, captures attention, and drives engagement across every platform." },
  { title: "IT Consulting", slug: "it-consulting", icon: "FaLightbulb", order: 6, description: "We provide expert technology guidance to help businesses make smarter decisions, reduce risk, and accelerate digital growth." },
];

const webDevelopmentSubCategories = [
  {
    title: "Custom Website Development",
    hero: {
      headline: "Custom Websites Built Around Your Business Goals",
      subheadline: "Fast, responsive, SEO-friendly websites designed to communicate clearly and convert visitors into leads.",
    },
    overview: "We design and develop custom websites that match your brand, business model, and growth goals. Every page is structured for clarity, speed, mobile responsiveness, and lead generation.",
    whatsIncluded: ["Responsive website design", "Frontend and backend development", "SEO-friendly page structure", "Contact and lead forms", "Analytics and tracking setup", "Performance optimization"],
    process: ["Discovery and content planning", "Wireframe and visual direction", "Development and CMS setup", "Testing across devices", "Launch and post-launch support"],
    bestFor: "Businesses that need a professional, scalable website built from the ground up instead of a generic template.",
    cta: "Start Your Custom Website",
    order: 1,
  },
  {
    title: "E-commerce Development",
    hero: {
      headline: "Online Stores Designed to Sell More",
      subheadline: "Launch a secure, responsive e-commerce experience with product pages, checkout flows, and conversion-focused design.",
    },
    overview: "We build e-commerce websites that make browsing, buying, and managing products simple. From product structure to checkout flow, every detail is designed to reduce friction and increase sales.",
    whatsIncluded: ["Product catalog setup", "Cart and checkout flow", "Payment gateway integration", "Order management basics", "Mobile shopping optimization", "Sales tracking setup"],
    process: ["Store planning and product mapping", "UX and conversion design", "Development and integrations", "Payment and checkout testing", "Launch and optimization"],
    bestFor: "Retailers, product brands, and entrepreneurs who want a polished online store with room to grow.",
    cta: "Build Your Online Store",
    order: 2,
  },
  {
    title: "CMS Development",
    hero: {
      headline: "CMS Websites Your Team Can Manage Easily",
      subheadline: "Flexible content management systems for blogs, pages, services, portfolios, and recurring updates.",
    },
    overview: "We create CMS-driven websites that let your team manage content without touching code. The admin experience is kept simple, structured, and reliable for day-to-day publishing.",
    whatsIncluded: ["Custom content models", "Admin-friendly editing workflows", "Blog and page management", "Media and image handling", "Role-ready structure", "Training and handoff"],
    process: ["Content structure planning", "Admin workflow design", "CMS implementation", "Content migration support", "Training and launch"],
    bestFor: "Teams that update blogs, services, case studies, or website content regularly.",
    cta: "Create a Manageable Website",
    order: 3,
  },
  {
    title: "Web Application Development",
    hero: {
      headline: "Custom Web Apps for Real Business Workflows",
      subheadline: "Secure, scalable applications for dashboards, portals, internal tools, and customer-facing platforms.",
    },
    overview: "We build web applications that solve practical business problems. From user accounts to dashboards and API integrations, we focus on dependable systems that are easy to use and maintain.",
    whatsIncluded: ["User authentication", "Dashboard interfaces", "Database architecture", "REST API development", "Third-party integrations", "Deployment support"],
    process: ["Requirements and workflow mapping", "Architecture planning", "UI and feature development", "Testing and QA", "Deployment and iteration"],
    bestFor: "Businesses that need more than a static website, such as portals, tools, dashboards, or custom platforms.",
    cta: "Plan Your Web App",
    order: 4,
  },
  {
    title: "Landing Page Development",
    hero: {
      headline: "Landing Pages Built for Campaign Conversion",
      subheadline: "Focused pages for ads, launches, lead magnets, and offers that need fast action from visitors.",
    },
    overview: "We create landing pages with one clear goal: conversion. Each section is planned around the offer, audience, CTA, and tracking needs of your campaign.",
    whatsIncluded: ["Conversion-focused copy structure", "Responsive landing page design", "Lead form integration", "CTA and offer sections", "Tracking pixel support", "Fast launch workflow"],
    process: ["Offer and audience review", "Page structure planning", "Design and build", "Tracking setup", "Launch and performance review"],
    bestFor: "Ad campaigns, product launches, consultation offers, lead magnets, and event promotions.",
    cta: "Launch a Landing Page",
    order: 5,
  },
  {
    title: "Website Maintenance & Support",
    hero: {
      headline: "Reliable Website Support After Launch",
      subheadline: "Keep your website updated, secure, fast, and ready for future changes.",
    },
    overview: "Our maintenance support helps your website stay healthy after launch. We handle updates, fixes, small improvements, monitoring, and technical support so your team can stay focused on business.",
    whatsIncluded: ["Bug fixes and updates", "Content updates", "Speed and uptime checks", "Security review", "Backup coordination", "Monthly improvement support"],
    process: ["Website audit", "Support plan setup", "Regular updates", "Issue resolution", "Monthly recommendations"],
    bestFor: "Businesses that already have a website and need dependable technical support without hiring in-house.",
    cta: "Get Website Support",
    order: 6,
  },
];

const softwareDevelopmentCategory = {
  title: "Software Development",
  slug: "software-development",
  description: "We build tailor-made software solutions -- from APIs and SaaS products to ERP systems and legacy migrations.",
  icon: "FaCode",
  order: 2,
  isActive: true,
};

const softwareDevelopmentSubCategories = [
  {
    title: "Custom Software Development",
    slug: "custom-software-development",
    hero: {
      headline: "Software That Fits Your Business -- Not the Other Way Around.",
      subheadline: "We build tailor-made software solutions designed around your exact business processes.",
    },
    overview: "We build tailor-made software solutions designed around your exact business processes. From internal tools to client-facing platforms, we turn complex requirements into clean, scalable software.",
    whatsIncluded: [
      "Requirement analysis & technical planning",
      "Custom architecture design",
      "Frontend + Backend development",
      "Third-party integrations",
      "Testing & quality assurance",
      "Deployment & post-launch support",
    ],
    process: ["Discovery", "Planning", "Design", "Development", "QA", "Deployment"],
    bestFor: "Businesses with unique workflows that off-the-shelf software can't handle.",
    cta: "Tell Us Your Problem -- We'll Build the Solution",
    isActive: true,
    order: 1,
  },
  {
    title: "API Development & Integration",
    slug: "api-development-integration",
    hero: {
      headline: "Connect Everything. Automate Anything.",
      subheadline: "We design and build robust APIs that connect your systems and automate workflows.",
    },
    overview: "We design and build robust APIs that connect your systems, automate workflows, and enable seamless data exchange between platforms.",
    whatsIncluded: [
      "RESTful & GraphQL API design",
      "Third-party API integrations (payment, SMS, social, etc.)",
      "API documentation (Swagger / Postman)",
      "Authentication & authorization (JWT, OAuth2)",
      "Rate limiting & security hardening",
      "API versioning & maintenance",
    ],
    process: ["Requirement Analysis", "API Design", "Development", "Documentation", "Testing", "Integration"],
    bestFor: "Businesses needing to connect multiple platforms, automate data flow, or expose services to partners.",
    cta: "Let's Connect Your Systems -- Get a Free Consultation",
    isActive: true,
    order: 2,
  },
  {
    title: "SaaS Product Development",
    slug: "saas-product-development",
    hero: {
      headline: "Your SaaS Idea Deserves a World-Class Engineering Team.",
      subheadline: "We help startups and businesses build, launch, and scale SaaS products.",
    },
    overview: "We help startups and businesses build, launch, and scale SaaS products -- from MVP to full production-ready platform.",
    whatsIncluded: [
      "Product architecture & tech stack selection",
      "Multi-tenancy setup",
      "Subscription & billing integration (Stripe)",
      "User authentication & role management",
      "Admin dashboard & analytics",
      "CI/CD pipeline & cloud deployment",
    ],
    process: ["Ideation", "MVP Planning", "Design", "Development", "Beta Testing", "Launch & Scale"],
    bestFor: "Startups, entrepreneurs, and businesses looking to productize their service or idea.",
    cta: "Launch Your SaaS -- Start with an MVP",
    isActive: true,
    order: 3,
  },
  {
    title: "ERP & CRM Solutions",
    slug: "erp-crm-solutions",
    hero: {
      headline: "Run Your Entire Business From One Platform.",
      subheadline: "We build custom ERP and CRM systems that streamline your operations and improve team productivity.",
    },
    overview: "We build custom ERP and CRM systems that streamline your operations, improve team productivity, and give you full visibility into your business.",
    whatsIncluded: [
      "Modules: Sales, Inventory, HR, Finance, Procurement",
      "CRM: Lead management, pipeline tracking, customer history",
      "Role-based access & permissions",
      "Reports & business intelligence dashboard",
      "Integration with existing tools",
      "Training & onboarding",
    ],
    process: ["Business Analysis", "Module Planning", "Design", "Development", "User Testing", "Rollout"],
    bestFor: "SMEs and growing businesses that need to centralize and automate their operations.",
    cta: "Streamline Your Business -- Book a Demo",
    isActive: true,
    order: 4,
  },
  {
    title: "Database Design & Management",
    slug: "database-design-management",
    hero: {
      headline: "Your Data Is Your Most Valuable Asset -- We Protect and Optimize It.",
      subheadline: "We design, optimize, and manage databases that are fast, secure, and built to scale.",
    },
    overview: "We design, optimize, and manage databases that are fast, secure, and built to scale with your business.",
    whatsIncluded: [
      "Database architecture design (SQL & NoSQL)",
      "Schema design & optimization",
      "Query performance tuning",
      "Data migration & ETL pipelines",
      "Backup & disaster recovery setup",
      "Database monitoring & maintenance",
    ],
    process: ["Audit / Requirement", "Architecture Design", "Implementation", "Migration", "Optimization", "Ongoing Support"],
    bestFor: "Businesses dealing with large data volumes, slow queries, or planning a system migration.",
    cta: "Optimize Your Database -- Get a Free Audit",
    isActive: true,
    order: 5,
  },
  {
    title: "Legacy System Migration",
    slug: "legacy-system-migration",
    hero: {
      headline: "Leave the Old Behind -- Migrate to Modern Technology Without Losing a Step.",
      subheadline: "We help businesses safely migrate from outdated systems to modern, scalable platforms.",
    },
    overview: "We help businesses safely migrate from outdated systems to modern, scalable platforms -- with zero data loss and minimal downtime.",
    whatsIncluded: [
      "Legacy system audit & documentation",
      "Migration strategy & roadmap",
      "Data extraction, transformation & migration",
      "New system development or integration",
      "Parallel running & testing",
      "Cutover & post-migration support",
    ],
    process: ["Audit", "Strategy", "Data Mapping", "Migration", "Testing", "Cutover"],
    bestFor: "Businesses running on outdated software, spreadsheets, or on-premise systems wanting to move to the cloud.",
    cta: "Modernize Your Systems -- Let's Plan Your Migration",
    isActive: true,
    order: 6,
  },
];

const uiUxDesignCategory = {
  title: "UI/UX Design",
  slug: "ui-ux-design",
  description: "We craft intuitive, beautiful digital experiences that users love and businesses rely on -- from wireframes to pixel-perfect interfaces.",
  icon: "FaPencilRuler",
  order: 3,
  isActive: true,
};

const uiUxDesignSubCategories = [
  {
    title: "Website UI Design",
    slug: "website-ui-design",
    hero: {
      headline: "First Impressions Are Everything -- Make Yours Unforgettable.",
      subheadline: "We design stunning, conversion-focused website interfaces that reflect your brand and engage your audience.",
    },
    overview: "Your website is your digital storefront. We design visually compelling, user-friendly interfaces that not only look great but are strategically built to convert visitors into customers.",
    whatsIncluded: [
      "Custom visual design aligned with brand identity",
      "Desktop & mobile responsive layouts",
      "Typography, color system & spacing guidelines",
      "Interactive component design",
      "Figma design file with organized layers",
      "Developer handoff with design specs",
    ],
    process: ["Discovery", "Mood board", "Wireframe", "UI Design", "Review", "Handoff"],
    bestFor: "Businesses launching a new website or redesigning an existing one who want a modern, professional look.",
    cta: "Redesign Your Website -- Get a Free Design Consultation",
    isActive: true,
    order: 1,
  },
  {
    title: "Mobile App UI Design",
    slug: "mobile-app-ui-design",
    hero: {
      headline: "Beautiful Apps That Users Actually Enjoy Using.",
      subheadline: "We design mobile interfaces that are intuitive, visually polished, and optimized for the best user experience.",
    },
    overview: "We design mobile app interfaces for iOS and Android that prioritize usability and aesthetics. Every screen is crafted to guide users naturally toward their goals.",
    whatsIncluded: [
      "iOS & Android UI design",
      "User flow & screen mapping",
      "Component library & design system",
      "Gesture-based interaction design",
      "Dark mode & light mode variants",
      "Figma prototype for stakeholder review",
    ],
    process: ["Research", "User Flow", "Wireframe", "UI Design", "Prototype", "Handoff"],
    bestFor: "Startups and businesses building a mobile app who want a polished, market-ready design before development.",
    cta: "Design Your App -- Start with a Free Prototype",
    isActive: true,
    order: 2,
  },
  {
    title: "Wireframing & Prototyping",
    slug: "wireframing-prototyping",
    hero: {
      headline: "Validate Your Idea Before You Build It.",
      subheadline: "We turn your concepts into clickable wireframes and prototypes so you can test, iterate, and build with confidence.",
    },
    overview: "Before writing a single line of code, we map out the full user journey through detailed wireframes and interactive prototypes -- saving time, money, and rework down the line.",
    whatsIncluded: [
      "Low-fidelity wireframes for all key screens",
      "High-fidelity interactive prototype",
      "User flow diagrams",
      "Navigation & interaction mapping",
      "Clickable Figma prototype for testing",
      "Feedback & iteration rounds included",
    ],
    process: ["Brief", "User Flow", "Low-fi Wireframe", "High-fi Wireframe", "Prototype", "User Testing"],
    bestFor: "Founders, product managers, and businesses who want to validate their product idea before committing to full development.",
    cta: "Prototype Your Idea -- Before You Build",
    isActive: true,
    order: 3,
  },
  {
    title: "UX Research & Audit",
    slug: "ux-research-audit",
    hero: {
      headline: "Find Out Why Users Leave -- And Fix It.",
      subheadline: "We audit your existing product and uncover UX issues that are hurting conversions, engagement, and user satisfaction.",
    },
    overview: "We conduct in-depth UX audits and user research to identify friction points, usability issues, and missed opportunities in your existing digital product -- then give you a clear roadmap to fix them.",
    whatsIncluded: [
      "Heuristic evaluation of existing UI",
      "User journey mapping",
      "Competitor UX benchmarking",
      "Usability issue identification & severity rating",
      "Actionable UX improvement report",
      "Prioritized recommendation roadmap",
    ],
    process: ["Kickoff", "Heuristic Review", "User Research", "Journey Mapping", "Analysis", "Report Delivery"],
    bestFor: "Businesses with an existing product that has high bounce rates, low conversions, or poor user retention.",
    cta: "Audit My Product -- Get Actionable UX Insights",
    isActive: true,
    order: 4,
  },
  {
    title: "Brand Identity & Logo Design",
    slug: "brand-identity-logo-design",
    hero: {
      headline: "Your Brand Is More Than a Logo -- It's a Story.",
      subheadline: "We build cohesive brand identities that communicate who you are, what you stand for, and why people should choose you.",
    },
    overview: "We create complete brand identity systems -- from logo design to color palettes, typography, and usage guidelines -- ensuring your brand looks consistent and professional across every touchpoint.",
    whatsIncluded: [
      "Logo design (primary + variations)",
      "Color palette & typography system",
      "Brand voice & personality guidelines",
      "Business card & stationery design",
      "Social media kit",
      "Brand style guide (PDF)",
    ],
    process: ["Discovery", "Mood board", "Logo Concepts", "Refinement", "Brand System", "Final Delivery"],
    bestFor: "Startups, new businesses, and established brands looking for a visual refresh or complete rebranding.",
    cta: "Build Your Brand -- Get a Free Brand Discovery Call",
    isActive: true,
    order: 5,
  },
  {
    title: "Design System Creation",
    slug: "design-system-creation",
    hero: {
      headline: "Scale Your Product Faster With a Unified Design System.",
      subheadline: "We build comprehensive design systems that keep your product consistent, scalable, and easy to maintain.",
    },
    overview: "A design system is the single source of truth for your product's visual language. We create scalable, well-documented design systems that help your team build faster and more consistently.",
    whatsIncluded: [
      "Component library in Figma",
      "Typography & color token system",
      "Icon set & illustration guidelines",
      "Spacing, grid & layout system",
      "Interaction & animation guidelines",
      "Documentation for designers & developers",
    ],
    process: ["Audit", "Token Definition", "Component Design", "Documentation", "Review", "Handoff"],
    bestFor: "Growing product teams, SaaS companies, and businesses with multiple digital products who need design consistency at scale.",
    cta: "Build Your Design System -- Talk to a Designer",
    isActive: true,
    order: 6,
  },
];

const digitalMarketingCategory = {
  title: "Digital Marketing",
  slug: "digital-marketing",
  description: "We help businesses grow online through data-driven marketing strategies -- from SEO and paid ads to social media and content marketing.",
  icon: "FaBullhorn",
  order: 4,
  isActive: true,
};

const digitalMarketingSubCategories = [
  {
    title: "Search Engine Optimization (SEO)",
    slug: "search-engine-optimization",
    hero: {
      headline: "Rank Higher. Get Found. Grow Organically.",
      subheadline: "We help your business climb to the top of search results and stay there -- with sustainable, white-hat SEO strategies.",
    },
    overview: "We provide end-to-end SEO services that improve your website's visibility on Google and other search engines. From technical audits to content strategy, we build long-term organic growth for your business.",
    whatsIncluded: [
      "Technical SEO audit & fixes",
      "Keyword research & strategy",
      "On-page optimization (meta, headings, content)",
      "Off-page SEO & link building",
      "Local SEO & Google Business Profile optimization",
      "Monthly performance reports",
    ],
    process: ["Audit", "Keyword Research", "On-page Optimization", "Off-page Strategy", "Content Plan", "Monitor & Report"],
    bestFor: "Businesses that want to reduce dependency on paid ads and build sustainable long-term organic traffic.",
    cta: "Boost Your Rankings -- Get a Free SEO Audit",
    isActive: true,
    order: 1,
  },
  {
    title: "Social Media Marketing (SMM)",
    slug: "social-media-marketing",
    hero: {
      headline: "Turn Followers Into Customers -- With Social Media That Actually Works.",
      subheadline: "We manage your social media presence with strategic content, consistent branding, and real engagement.",
    },
    overview: "We create and manage data-driven social media strategies across Facebook, Instagram, LinkedIn, TikTok, and more -- building brand awareness, growing your audience, and driving real business results.",
    whatsIncluded: [
      "Social media strategy & content calendar",
      "Post design & copywriting",
      "Community management & engagement",
      "Hashtag & trend research",
      "Performance analytics & monthly reports",
      "Platform management: Facebook, Instagram, LinkedIn, TikTok",
    ],
    process: ["Audit", "Strategy", "Content Planning", "Design & Copy", "Publish & Engage", "Analyze & Optimize"],
    bestFor: "Businesses that want to build a strong social media presence, grow their audience, and generate leads organically.",
    cta: "Grow Your Social Presence -- Get a Free Strategy Session",
    isActive: true,
    order: 2,
  },
  {
    title: "Pay-Per-Click Advertising (PPC)",
    slug: "pay-per-click-advertising",
    hero: {
      headline: "Every Taka Spent, Accounted For -- Maximum ROI on Every Ad.",
      subheadline: "We run high-converting paid ad campaigns on Google, Meta, and beyond -- so you get results, not just impressions.",
    },
    overview: "We plan, launch, and optimize paid advertising campaigns across Google Ads and Meta Ads (Facebook & Instagram) to drive targeted traffic, leads, and sales with measurable return on investment.",
    whatsIncluded: [
      "Campaign strategy & audience targeting",
      "Google Search, Display & Shopping Ads",
      "Meta Ads (Facebook & Instagram)",
      "Ad copywriting & creative direction",
      "A/B testing & conversion optimization",
      "Weekly performance reports & budget management",
    ],
    process: ["Goal Setting", "Audience Research", "Campaign Setup", "Ad Creation", "Launch", "Optimize & Scale"],
    bestFor: "Businesses that need immediate traffic, leads, or sales and want full control over their advertising budget.",
    cta: "Launch Your Ad Campaign -- Get a Free Ad Audit",
    isActive: true,
    order: 3,
  },
  {
    title: "Content Marketing",
    slug: "content-marketing",
    hero: {
      headline: "Content That Educates, Engages, and Converts.",
      subheadline: "We create strategic content that builds trust with your audience and drives them down the path to purchase.",
    },
    overview: "We develop and execute content marketing strategies that position your brand as an industry authority -- through blog posts, articles, case studies, and more -- while driving SEO and lead generation.",
    whatsIncluded: [
      "Content strategy & editorial calendar",
      "Blog post & article writing",
      "Case study & whitepaper creation",
      "SEO-optimized content",
      "Content distribution strategy",
      "Performance tracking & optimization",
    ],
    process: ["Audit", "Strategy", "Content Planning", "Creation", "Publish & Distribute", "Measure & Optimize"],
    bestFor: "Businesses looking to build long-term brand authority, improve SEO, and generate inbound leads through valuable content.",
    cta: "Start Your Content Strategy -- Book a Free Consultation",
    isActive: true,
    order: 4,
  },
  {
    title: "Email Marketing",
    slug: "email-marketing",
    hero: {
      headline: "Your Audience Is One Email Away -- Make It Count.",
      subheadline: "We design and execute email marketing campaigns that nurture leads, retain customers, and drive repeat revenue.",
    },
    overview: "Email marketing remains one of the highest ROI digital channels. We build automated email sequences, newsletters, and drip campaigns that keep your audience engaged and your business top of mind.",
    whatsIncluded: [
      "Email strategy & audience segmentation",
      "Newsletter design & copywriting",
      "Automated drip campaign setup",
      "Lead nurturing sequences",
      "A/B testing subject lines & content",
      "Open rate, CTR & conversion tracking",
    ],
    process: ["Strategy", "List Segmentation", "Template Design", "Copywriting", "Automation Setup", "Monitor & Optimize"],
    bestFor: "E-commerce stores, SaaS companies, and service businesses that want to nurture leads and retain existing customers.",
    cta: "Launch Your Email Campaign -- Get a Free Template",
    isActive: true,
    order: 5,
  },
  {
    title: "Influencer & Affiliate Marketing",
    slug: "influencer-affiliate-marketing",
    hero: {
      headline: "Reach New Audiences Through Voices They Already Trust.",
      subheadline: "We connect your brand with the right influencers and affiliates to drive awareness, credibility, and sales.",
    },
    overview: "We identify, vet, and manage influencer and affiliate partnerships that align with your brand -- helping you reach highly targeted audiences through authentic, trusted voices in your industry.",
    whatsIncluded: [
      "Influencer research & vetting",
      "Campaign strategy & brief creation",
      "Contract & negotiation management",
      "Content review & approval workflow",
      "Affiliate program setup & management",
      "ROI tracking & performance reporting",
    ],
    process: ["Goal Setting", "Influencer Research", "Outreach & Negotiation", "Campaign Brief", "Execution", "Track & Report"],
    bestFor: "Brands looking to expand reach quickly, build social proof, and drive sales through trusted third-party voices.",
    cta: "Partner With Influencers -- Start Your Campaign Today",
    isActive: true,
    order: 6,
  },
];

const creativeMediaCategory = {
  title: "Creative & Media",
  slug: "creative-media",
  description: "We produce high-quality visual and media content that tells your brand story, captures attention, and drives engagement across every platform.",
  icon: "FaPhotoVideo",
  order: 5,
  isActive: true,
};

const creativeMediaSubCategories = [
  {
    title: "Video Production & Editing",
    slug: "video-production-editing",
    hero: {
      headline: "Your Story, Told Beautifully -- Through the Power of Video.",
      subheadline: "We produce and edit high-quality videos that capture attention, communicate your message, and drive real results.",
    },
    overview: "From concept to final cut, we handle the full video production process -- scripting, shooting, editing, color grading, and sound design. Whether it's a brand film, product video, or social media content, we make your brand look world-class.",
    whatsIncluded: [
      "Concept development & scripting",
      "Professional video shooting",
      "Video editing & post-production",
      "Color grading & sound design",
      "Motion graphics & text overlays",
      "Final delivery in multiple formats (YouTube, Instagram, Web)",
    ],
    process: ["Brief", "Concept & Script", "Shooting", "Editing", "Review & Revisions", "Final Delivery"],
    bestFor: "Businesses that want brand films, product demo videos, testimonial videos, or social media video content.",
    cta: "Tell Your Story -- Get a Free Video Consultation",
    isActive: true,
    order: 1,
  },
  {
    title: "Motion Graphics & Animation",
    slug: "motion-graphics-animation",
    hero: {
      headline: "Bring Your Brand to Life -- With Motion That Mesmerizes.",
      subheadline: "We create stunning motion graphics and animations that make complex ideas simple and your brand impossible to ignore.",
    },
    overview: "We design and animate motion graphics that elevate your brand communication -- from explainer animations and logo reveals to social media animations and full-scale 2D animated videos.",
    whatsIncluded: [
      "Logo animation & brand reveal",
      "Explainer video animation",
      "Social media animated posts & stories",
      "UI/UX micro-animations",
      "2D character animation",
      "Animated infographics & data visualization",
    ],
    process: ["Brief", "Storyboard", "Design Assets", "Animation", "Sound Design", "Final Export"],
    bestFor: "Brands, startups, and marketers who want to stand out with dynamic visual content that educates and entertains.",
    cta: "Animate Your Brand -- Start with a Free Storyboard",
    isActive: true,
    order: 2,
  },
  {
    title: "Graphic Design",
    slug: "graphic-design",
    hero: {
      headline: "Design That Speaks Before You Say a Word.",
      subheadline: "We create visually powerful graphics that communicate your brand message clearly, consistently, and creatively.",
    },
    overview: "We provide comprehensive graphic design services -- from marketing materials and social media visuals to print design and packaging. Every design is crafted with purpose, precision, and your brand identity in mind.",
    whatsIncluded: [
      "Social media post & banner design",
      "Brochure, flyer & poster design",
      "Presentation design (PowerPoint / Keynote)",
      "Packaging & label design",
      "Infographic design",
      "Print-ready file delivery",
    ],
    process: ["Brief", "Concept", "Design", "Review", "Revisions", "Final Delivery"],
    bestFor: "Businesses needing consistent, professional visual content for marketing, advertising, and brand communication.",
    cta: "Elevate Your Visuals -- Get a Free Design Quote",
    isActive: true,
    order: 3,
  },
  {
    title: "Photography & Photo Editing",
    slug: "photography-photo-editing",
    hero: {
      headline: "Visuals That Stop the Scroll -- Professional Photography for Your Brand.",
      subheadline: "We capture and edit stunning photos that showcase your products, team, and brand in the best possible light.",
    },
    overview: "We offer professional photography and advanced photo editing services tailored for businesses -- including product photography, corporate headshots, event coverage, and post-production retouching.",
    whatsIncluded: [
      "Product & e-commerce photography",
      "Corporate & team headshots",
      "Event & conference photography",
      "Professional photo retouching & color correction",
      "Background removal & compositing",
      "High-resolution image delivery",
    ],
    process: ["Brief", "Shot Planning", "Shooting", "Selection", "Editing & Retouching", "Delivery"],
    bestFor: "E-commerce stores, corporate brands, and businesses that need high-quality imagery for their website, ads, and marketing materials.",
    cta: "Book a Photo Session -- Get a Free Quote",
    isActive: true,
    order: 4,
  },
  {
    title: "Social Media Content Creation",
    slug: "social-media-content-creation",
    hero: {
      headline: "Content That Stops the Scroll and Starts the Conversation.",
      subheadline: "We create scroll-stopping social media content -- designed, written, and optimized for maximum engagement.",
    },
    overview: "We produce a consistent stream of high-quality social media content tailored to your brand voice and platform -- including static posts, reels, stories, carousels, and short-form videos.",
    whatsIncluded: [
      "Monthly content calendar & strategy",
      "Static post & carousel design",
      "Reels & short-form video editing",
      "Story & highlight cover design",
      "Caption writing & hashtag research",
      "Platform-optimized content (Instagram, Facebook, LinkedIn, TikTok)",
    ],
    process: ["Strategy", "Content Calendar", "Design & Production", "Copywriting", "Review", "Schedule & Publish"],
    bestFor: "Brands and businesses that want a consistent, professional social media presence without managing content creation in-house.",
    cta: "Level Up Your Content -- Get a Free Content Plan",
    isActive: true,
    order: 5,
  },
  {
    title: "Explainer Video Production",
    slug: "explainer-video-production",
    hero: {
      headline: "Explain Anything in 90 Seconds -- and Make It Unforgettable.",
      subheadline: "We produce compelling explainer videos that simplify your product or service and convert curious visitors into confident buyers.",
    },
    overview: "We create professional explainer videos that break down complex products, services, or concepts into clear, engaging, and persuasive visual stories -- perfect for your homepage, landing pages, and ad campaigns.",
    whatsIncluded: [
      "Script writing & voiceover",
      "Storyboard & visual concept",
      "2D animation or live-action production",
      "Background music & sound effects",
      "Multiple format delivery (Web, YouTube, Social)",
      "Subtitle & caption file included",
    ],
    process: ["Brief", "Script", "Storyboard", "Voiceover", "Animation / Production", "Final Delivery"],
    bestFor: "SaaS companies, startups, and businesses launching new products or services that need a clear, engaging way to explain their value proposition.",
    cta: "Create Your Explainer Video -- Get a Free Script Consultation",
    isActive: true,
    order: 6,
  },
];

const itConsultingCategory = {
  title: "IT Consulting",
  slug: "it-consulting",
  description: "We provide expert technology guidance to help businesses make smarter decisions, reduce risk, and accelerate digital growth.",
  icon: "FaLightbulb",
  order: 6,
  isActive: true,
};

const itConsultingSubCategories = [
  {
    title: "Tech Stack Consulting",
    slug: "tech-stack-consulting",
    hero: {
      headline: "Build on the Right Foundation -- Choose the Right Tech Stack.",
      subheadline: "We help businesses select the most suitable technologies for their goals, budget, and long-term scalability.",
    },
    overview: "Choosing the wrong tech stack can cost you months of rework and thousands in wasted budget. We analyze your business requirements, team capacity, and growth plans to recommend the most suitable and future-proof technology stack for your project.",
    whatsIncluded: [
      "Business requirement analysis",
      "Tech stack evaluation & comparison",
      "Frontend, backend & database recommendations",
      "Cloud & infrastructure planning",
      "Scalability & performance considerations",
      "Detailed tech stack recommendation report",
    ],
    process: ["Discovery", "Requirement Analysis", "Stack Evaluation", "Recommendation", "Review Session", "Final Report"],
    bestFor: "Startups, product teams, and businesses planning a new digital product who want expert guidance before committing to a technology.",
    cta: "Choose the Right Stack -- Book a Free Consultation",
    isActive: true,
    order: 1,
  },
  {
    title: "Project Planning & Architecture Review",
    slug: "project-planning-architecture-review",
    hero: {
      headline: "Great Software Starts With a Great Plan.",
      subheadline: "We review your project architecture and create a clear technical roadmap so your team builds fast, clean, and scalable.",
    },
    overview: "Poor planning leads to technical debt, missed deadlines, and blown budgets. We work with your team to review your system architecture, identify risks early, and create a detailed technical roadmap that keeps your project on track from day one.",
    whatsIncluded: [
      "System architecture review & design",
      "Technical risk assessment",
      "Sprint & milestone planning",
      "Team structure & role recommendations",
      "API design & data flow planning",
      "Architecture documentation",
    ],
    process: ["Kickoff", "Architecture Review", "Risk Identification", "Roadmap Creation", "Team Alignment", "Documentation"],
    bestFor: "Development teams, CTOs, and founders who want an expert second opinion on their architecture before or during development.",
    cta: "Review My Architecture -- Get a Free Technical Assessment",
    isActive: true,
    order: 2,
  },
  {
    title: "Code Audit & Quality Assurance",
    slug: "code-audit-quality-assurance",
    hero: {
      headline: "Is Your Codebase Holding You Back? Let's Find Out.",
      subheadline: "We audit your existing codebase to uncover bugs, security vulnerabilities, performance issues, and technical debt.",
    },
    overview: "We perform thorough code audits to evaluate the quality, security, and maintainability of your existing software. You get a clear picture of what's working, what's broken, and a prioritized plan to fix it.",
    whatsIncluded: [
      "Full codebase review & analysis",
      "Security vulnerability assessment",
      "Performance bottleneck identification",
      "Code quality & best practices review",
      "Technical debt mapping",
      "Prioritized improvement report with recommendations",
    ],
    process: ["Codebase Access", "Static Analysis", "Manual Review", "Security Scan", "Report Writing", "Findings Presentation"],
    bestFor: "Businesses inheriting an existing codebase, preparing for a product launch, or experiencing recurring bugs and performance issues.",
    cta: "Audit My Code -- Get a Free Initial Assessment",
    isActive: true,
    order: 3,
  },
  {
    title: "Cybersecurity Consulting",
    slug: "cybersecurity-consulting",
    hero: {
      headline: "Your Business Is Only as Strong as Your Security.",
      subheadline: "We identify vulnerabilities in your systems before attackers do -- and build a security strategy that protects your business.",
    },
    overview: "Cyber threats are growing every day. We provide practical cybersecurity consulting services -- from vulnerability assessments and penetration testing to security policy creation and staff training -- keeping your business, data, and customers safe.",
    whatsIncluded: [
      "Vulnerability assessment & penetration testing",
      "Security architecture review",
      "Data protection & compliance guidance (GDPR, ISO)",
      "Security policy & procedure creation",
      "Incident response planning",
      "Staff security awareness training",
    ],
    process: ["Assessment", "Threat Modeling", "Penetration Testing", "Risk Analysis", "Remediation Plan", "Ongoing Monitoring"],
    bestFor: "Businesses handling sensitive customer data, financial transactions, or those operating in regulated industries.",
    cta: "Secure Your Business -- Get a Free Security Assessment",
    isActive: true,
    order: 4,
  },
  {
    title: "Digital Transformation Strategy",
    slug: "digital-transformation-strategy",
    hero: {
      headline: "The Future of Your Business Is Digital -- Let's Build It Together.",
      subheadline: "We help traditional businesses embrace technology to streamline operations, reduce costs, and unlock new growth opportunities.",
    },
    overview: "Digital transformation is not just about technology -- it's about rethinking how your business operates. We work with leadership teams to create a practical, phased digital transformation roadmap that delivers real business value at every step.",
    whatsIncluded: [
      "Current state assessment & gap analysis",
      "Digital maturity evaluation",
      "Transformation roadmap & phased plan",
      "Technology selection & vendor evaluation",
      "Change management strategy",
      "KPI framework & success metrics",
    ],
    process: ["Discovery", "Current State Audit", "Vision Setting", "Roadmap Creation", "Pilot Planning", "Execution Support"],
    bestFor: "Traditional businesses, SMEs, and enterprises looking to modernize their operations, adopt new technologies, and stay competitive.",
    cta: "Start Your Transformation -- Book a Free Strategy Session",
    isActive: true,
    order: 5,
  },
  {
    title: "IT Support & Managed Services",
    slug: "it-support-managed-services",
    hero: {
      headline: "Focus on Your Business -- We'll Handle Your IT.",
      subheadline: "We provide reliable, proactive IT support and managed services so your team stays productive and your systems stay running.",
    },
    overview: "We act as your dedicated IT team -- monitoring your systems, resolving issues before they impact your business, managing your infrastructure, and providing on-demand support whenever you need it.",
    whatsIncluded: [
      "24/7 system monitoring & alerting",
      "Help desk & on-demand IT support",
      "Server & network management",
      "Software updates & patch management",
      "Backup & disaster recovery management",
      "Monthly IT health report",
    ],
    process: ["Onboarding", "System Audit", "Monitoring Setup", "Support Plan Activation", "Ongoing Management", "Monthly Reporting"],
    bestFor: "Small to mid-sized businesses that need reliable IT support without the cost of a full-time in-house IT team.",
    cta: "Get Dedicated IT Support -- View Our Support Plans",
    isActive: true,
    order: 6,
  },
];

async function seedServices() {
  if (!MONGO_URL) {
    throw new Error("MONGO_URL is required in backend/.env");
  }

  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db(DB_NAME);
  const categoryCollection = db.collection(SERVICE_CATEGORY_COLLECTION);
  const subCategoryCollection = db.collection(SERVICE_SUB_CATEGORY_COLLECTION);

  try {
    const categoryResult = await categoryCollection.findOneAndUpdate(
      { slug: itConsultingCategory.slug },
      {
        $setOnInsert: { subCategories: [], createdAt: new Date() },
        $set: { ...itConsultingCategory, updatedAt: new Date() },
      },
      { upsert: true, returnDocument: "after" }
    );

    const subCategoryIds = [];

    for (const subCategory of itConsultingSubCategories) {
      const slug = subCategory.slug || slugify(subCategory.title);
      const result = await subCategoryCollection.findOneAndUpdate(
        { slug },
        {
          $setOnInsert: { createdAt: new Date() },
          $set: {
            ...subCategory,
            slug,
            category: categoryResult._id,
            updatedAt: new Date(),
          },
        },
        { upsert: true, returnDocument: "after" }
      );
      subCategoryIds.push(result._id);
    }

    await categoryCollection.updateOne(
      { _id: categoryResult._id },
      { $set: { subCategories: subCategoryIds, updatedAt: new Date() } }
    );

    console.log("IT Consulting service seed completed");
  } finally {
    await client.close();
  }
}

seedServices().catch((error) => {
  console.error(error);
  process.exit(1);
});
