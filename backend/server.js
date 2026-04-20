require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId } = require("mongodb");

// ── Config ──────────────────────────────────────────────
const PORT = process.env.PORT || 8001;
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || "apixel_agency";
const JWT_SECRET = process.env.JWT_SECRET || "apixel_super_secret_jwt_key_2024";
const JWT_EXPIRES_IN = "24h";

// ── App Setup ───────────────────────────────────────────
const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));

let db;

// ── Helpers ─────────────────────────────────────────────
const serializeDoc = (doc) => {
  if (!doc) return null;
  const { _id, createdAt, ...rest } = doc;
  return {
    id: _id.toString(),
    ...rest,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
  };
};

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ detail: "Invalid token" });
  }
  try {
    const payload = jwt.verify(authHeader.split(" ")[1], JWT_SECRET);
    req.user = payload.sub;
    next();
  } catch {
    return res.status(401).json({ detail: "Invalid token" });
  }
};

// ── Seed Data ───────────────────────────────────────────
async function seedDatabase() {
  // Services
  if ((await db.collection("services").countDocuments()) === 0) {
    await db.collection("services").insertMany([
      {
        name: "Website Development (MERN)",
        description:
          "Custom web applications built with MongoDB, Express.js, React, and Node.js. Scalable, fast, and modern solutions tailored to your business needs.",
        features: ["Custom React Frontend", "Node.js Backend", "MongoDB Database", "RESTful APIs", "Responsive Design", "SEO Optimized"],
        icon: "Code",
        priceRange: "$2,000 - $15,000",
        order: 1,
        createdAt: new Date(),
      },
      {
        name: "Meta & Google Ads",
        description:
          "Strategic advertising campaigns with advanced Conversion API integration and comprehensive tracking setup for maximum ROI.",
        features: ["Facebook & Instagram Ads", "Google Ads Management", "Conversion API Setup", "Pixel Implementation", "A/B Testing", "Monthly Reports"],
        icon: "Target",
        priceRange: "$500 - $5,000/month",
        order: 2,
        createdAt: new Date(),
      },
      {
        name: "Social Media Management",
        description:
          "Complete social media presence management. Content creation, scheduling, engagement, and growth strategies across all platforms.",
        features: ["Content Calendar", "Daily Posting", "Community Management", "Hashtag Strategy", "Analytics Reports", "Influencer Outreach"],
        icon: "Share2",
        priceRange: "$300 - $2,000/month",
        order: 3,
        createdAt: new Date(),
      },
      {
        name: "Graphic Design",
        description:
          "Eye-catching visual designs for your brand. From logos to marketing materials, we create designs that make an impact.",
        features: ["Logo Design", "Brand Identity", "Social Media Graphics", "Print Materials", "UI/UX Design", "Motion Graphics"],
        icon: "Palette",
        priceRange: "$200 - $3,000",
        order: 4,
        createdAt: new Date(),
      },
    ]);
    console.log("Services seeded");
  }

  // Blogs
  if ((await db.collection("blogs").countDocuments()) === 0) {
    const now = Date.now();
    await db.collection("blogs").insertMany([
      {
        title: "Building Scalable Web Apps with the MERN Stack in 2024",
        slug: "building-scalable-web-apps-mern-stack-2024",
        excerpt: "Learn the best practices for building modern, scalable web applications using MongoDB, Express.js, React, and Node.js.",
        content: `<h2>Introduction to MERN Stack</h2><p>The MERN stack has become one of the most popular choices for building full-stack web applications. It combines four powerful technologies: MongoDB, Express.js, React, and Node.js.</p><h2>Why Choose MERN?</h2><p>MERN offers several advantages:</p><ul><li><strong>JavaScript Everywhere:</strong> Use one language for both frontend and backend</li><li><strong>JSON Data Flow:</strong> Seamless data transfer between all layers</li><li><strong>Rich Ecosystem:</strong> Access to millions of npm packages</li><li><strong>Scalability:</strong> Perfect for building apps that need to grow</li></ul><h2>Best Practices for 2024</h2><p>To build truly scalable applications, follow these practices:</p><ol><li>Use TypeScript for type safety</li><li>Implement proper state management with Redux or Zustand</li><li>Set up CI/CD pipelines early</li><li>Write comprehensive tests</li><li>Use Docker for containerization</li></ol><h2>Conclusion</h2><p>The MERN stack continues to evolve and remains a solid choice for modern web development.</p>`,
        author: "APIXEL Team",
        category: "Web Development",
        tags: ["MERN", "React", "Node.js", "MongoDB", "Web Development"],
        thumbnailUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
        published: true,
        readTime: "8 min read",
        createdAt: new Date(now - 5 * 86400000),
      },
      {
        title: "Mastering Facebook Ads: A Complete Guide to Conversion API",
        slug: "mastering-facebook-ads-conversion-api-guide",
        excerpt: "Discover how to set up and optimize Facebook's Conversion API for better tracking and improved ad performance.",
        content: `<h2>What is Conversion API?</h2><p>Facebook's Conversion API (CAPI) is a business tool that lets you share web and offline events directly from your server to Facebook.</p><h2>Why You Need Conversion API</h2><p>With increasing privacy restrictions and iOS 14+ changes, the Pixel alone isn't enough.</p><h2>Setting Up Conversion API</h2><ol><li>Create a System User in Business Settings</li><li>Generate an Access Token</li><li>Set up server-side event tracking</li><li>Implement event deduplication</li><li>Test with the Events Manager</li></ol><h2>Conclusion</h2><p>Conversion API is essential for accurate tracking and optimal ad performance.</p>`,
        author: "APIXEL Team",
        category: "Digital Marketing",
        tags: ["Facebook Ads", "Conversion API", "Digital Marketing", "Tracking"],
        thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
        published: true,
        readTime: "10 min read",
        createdAt: new Date(now - 10 * 86400000),
      },
      {
        title: "Social Media Trends That Will Dominate 2024",
        slug: "social-media-trends-dominate-2024",
        excerpt: "Stay ahead of the curve with these emerging social media trends that are shaping the digital landscape.",
        content: `<h2>The Social Media Landscape in 2024</h2><p>Social media continues to evolve rapidly.</p><h2>1. Short-Form Video Dominance</h2><p>TikTok, Instagram Reels, and YouTube Shorts continue to dominate.</p><h2>2. AI-Powered Content Creation</h2><p>AI tools are revolutionizing how we create content.</p><h2>3. Social Commerce Growth</h2><p>Shopping directly through social platforms is becoming mainstream.</p><h2>4. Community Building</h2><p>Brands are focusing on building engaged communities.</p><h2>Conclusion</h2><p>Adapting to these trends early will give your brand a competitive edge.</p>`,
        author: "APIXEL Team",
        category: "Social Media",
        tags: ["Social Media", "Trends", "Marketing", "Content Strategy"],
        thumbnailUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800",
        published: true,
        readTime: "7 min read",
        createdAt: new Date(now - 15 * 86400000),
      },
    ]);
    console.log("Blogs seeded");
  }

  // Admin
  const adminExists = await db.collection("admins").findOne({ email: "admin@agency.com" });
  const hashed = await bcrypt.hash("Admin@123", 10);
  if (!adminExists) {
    await db.collection("admins").insertOne({ email: "admin@agency.com", password: hashed, createdAt: new Date() });
    console.log("Admin seeded");
  } else {
    await db.collection("admins").updateOne({ email: "admin@agency.com" }, { $set: { password: hashed } });
  }

  // Templates
  if ((await db.collection("templates").countDocuments()) === 0) {
    const now2 = Date.now();
    await db.collection("templates").insertMany([
      { title: "Agency Pro - Digital Agency Website", slug: "agency-pro-digital-agency", category: "Agency", excerpt: "A sleek, conversion-focused website template built for digital agencies that want to look premium and close deals faster.", description: "Agency Pro is a fully responsive, modern digital agency template designed with conversion in mind.", thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", gallery: ["https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800","https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800","https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"], tags: ["Agency","Dark Theme","MERN Stack"], features: ["Hero with CTA","Service Showcase","Portfolio Gallery","Testimonial Slider","Contact Form","Blog Section"], priceLabel: "$499", status: "Available", techStack: ["React","Node.js","MongoDB","Tailwind CSS"], useCases: ["Digital Agencies","Marketing Firms","Creative Studios","Consulting"], valuePoints: ["Mobile-first responsive design","SEO-optimized structure","Fast load times under 2 seconds"], demoUrl: "https://agencypro-demo.apixel.net", ctaLabel: "Get This Template", published: true, createdAt: new Date(now2 - 2*86400000) },
      { title: "ShopLaunch - E-Commerce Starter", slug: "shoplaunch-ecommerce-starter", category: "E-Commerce", excerpt: "Launch your online store in days, not months. A beautiful e-commerce template with product pages, cart, and checkout flow.", description: "ShopLaunch gives you everything you need to start selling online.", thumbnailUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800", gallery: ["https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800","https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800","https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"], tags: ["E-Commerce","Shopping","Product Store"], features: ["Product Grid","Shopping Cart","Checkout Flow","Search & Filters","Product Detail Pages","Wishlist"], priceLabel: "$699", status: "Available", techStack: ["React","Node.js","MongoDB","Stripe"], useCases: ["Online Stores","Fashion Brands","Handmade Shops","Electronics"], valuePoints: ["Built-in payment integration ready","Inventory management system","Customer reviews section"], demoUrl: "https://shoplaunch-demo.apixel.net", ctaLabel: "Get This Template", published: true, createdAt: new Date(now2 - 5*86400000) },
      { title: "FolioX - Portfolio & Personal Brand", slug: "foliox-portfolio-personal-brand", category: "Portfolio", excerpt: "Stand out from the crowd. A minimal yet bold portfolio template for freelancers, developers, and creatives.", description: "FolioX is a personal branding powerhouse.", thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800", gallery: ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800","https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800","https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800"], tags: ["Portfolio","Minimal","Personal Brand"], features: ["Project Showcase","About Section","Skills Display","Contact Form","Resume Download","Smooth Animations"], priceLabel: "$349", status: "Available", techStack: ["React","Framer Motion","Tailwind CSS"], useCases: ["Freelancers","Developers","Designers","Photographers"], valuePoints: ["Lightning fast performance","Smooth scroll animations","One-page & multi-page layouts"], demoUrl: "https://foliox-demo.apixel.net", ctaLabel: "Get This Template", published: true, createdAt: new Date(now2 - 8*86400000) },
      { title: "SaaSKit - SaaS Landing Page", slug: "saaskit-saas-landing-page", category: "SaaS", excerpt: "Convert visitors into trial users. A high-converting SaaS landing page with pricing tables, feature sections, and CTA blocks.", description: "SaaSKit is engineered for software companies that need to acquire users fast.", thumbnailUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800", gallery: ["https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800","https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800","https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"], tags: ["SaaS","Landing Page","Startup"], features: ["Pricing Table","Feature Grid","Testimonials","FAQ Accordion","Newsletter Signup","Analytics Ready"], priceLabel: "$599", status: "Available", techStack: ["React","Node.js","Tailwind CSS","Framer Motion"], useCases: ["SaaS Products","Startups","Tech Companies","App Landing Pages"], valuePoints: ["A/B test ready structure","Conversion-optimized layout","Integration-ready contact forms"], demoUrl: "https://saaskit-demo.apixel.net", ctaLabel: "Get This Template", published: true, createdAt: new Date(now2 - 12*86400000) },
      { title: "RestroHub - Restaurant & Cafe Website", slug: "restrohub-restaurant-cafe", category: "Restaurant", excerpt: "Make your restaurant irresistible online. A beautiful template with menu display, reservation system, and gallery.", description: "RestroHub brings your restaurant to life online.", thumbnailUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", gallery: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800","https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800"], tags: ["Restaurant","Food","Hospitality"], features: ["Menu Display","Reservation Form","Photo Gallery","Opening Hours","Location Map","Customer Reviews"], priceLabel: "$449", status: "Available", techStack: ["React","Node.js","MongoDB","Tailwind CSS"], useCases: ["Restaurants","Cafes","Bars","Food Trucks"], valuePoints: ["Appetizing food photography layouts","Online reservation system","Google Maps integration"], demoUrl: "https://restrohub-demo.apixel.net", ctaLabel: "Get This Template", published: true, createdAt: new Date(now2 - 15*86400000) },
      { title: "EduLearn - Online Course Platform", slug: "edulearn-online-course-platform", category: "Education", excerpt: "Teach the world. A comprehensive course platform template with lesson pages, enrollment flow, and instructor profiles.", description: "EduLearn is built for educators, coaches, and training companies.", thumbnailUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800", gallery: ["https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800","https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800","https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"], tags: ["Education","Courses","E-Learning"], features: ["Course Listings","Lesson Pages","Instructor Profiles","Enrollment Flow","Progress Tracking","Certificate System"], priceLabel: "$549", status: "Available", techStack: ["React","Node.js","MongoDB","Tailwind CSS"], useCases: ["Online Courses","Coaching","Corporate Training","Tutoring"], valuePoints: ["Student dashboard included","Video lesson support","Payment gateway ready"], demoUrl: "https://edulearn-demo.apixel.net", ctaLabel: "Get This Template", published: true, createdAt: new Date(now2 - 18*86400000) },
    ]);
    console.log("Templates seeded");
  }
}

// ── Routes ───────────────────────────────────────────────

// Health
app.get("/api/health", (_req, res) => res.json({ status: "healthy", service: "APIXEL Agency API" }));

// Auth
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await db.collection("admins").findOne({ email });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ detail: "Invalid credentials" });
  }
  const access_token = jwt.sign({ sub: admin.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.json({ access_token, token_type: "bearer" });
});

// ── Blogs ────────────────────────────────────────────────
app.get("/api/blogs", async (req, res) => {
  const publishedOnly = req.query.published_only !== "false";
  const query = publishedOnly ? { published: true } : {};
  const blogs = await db.collection("blogs").find(query).sort({ createdAt: -1 }).toArray();
  res.json(blogs.map(serializeDoc));
});

app.get("/api/blogs/:slug", async (req, res) => {
  const blog = await db.collection("blogs").findOne({ slug: req.params.slug });
  if (!blog) return res.status(404).json({ detail: "Blog not found" });
  res.json(serializeDoc(blog));
});

app.post("/api/blogs", verifyToken, async (req, res) => {
  const data = { ...req.body, createdAt: new Date() };
  if (!data.slug) data.slug = slugify(data.title);
  const result = await db.collection("blogs").insertOne(data);
  res.json(serializeDoc({ _id: result.insertedId, ...data }));
});

app.put("/api/blogs/:id", verifyToken, async (req, res) => {
  const update = Object.fromEntries(Object.entries(req.body).filter(([, v]) => v != null));
  if (!Object.keys(update).length) return res.status(400).json({ detail: "No data to update" });
  const result = await db.collection("blogs").findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    { $set: update },
    { returnDocument: "after" }
  );
  if (!result) return res.status(404).json({ detail: "Blog not found" });
  res.json(serializeDoc(result));
});

app.delete("/api/blogs/:id", verifyToken, async (req, res) => {
  const result = await db.collection("blogs").deleteOne({ _id: new ObjectId(req.params.id) });
  if (result.deletedCount === 0) return res.status(404).json({ detail: "Blog not found" });
  res.json({ message: "Blog deleted successfully" });
});

// ── Services ─────────────────────────────────────────────
app.get("/api/services", async (_req, res) => {
  const services = await db.collection("services").find().sort({ order: 1 }).toArray();
  res.json(services.map(serializeDoc));
});

app.post("/api/services", verifyToken, async (req, res) => {
  const data = { ...req.body, createdAt: new Date() };
  const result = await db.collection("services").insertOne(data);
  res.json(serializeDoc({ _id: result.insertedId, ...data }));
});

app.put("/api/services/:id", verifyToken, async (req, res) => {
  const update = Object.fromEntries(Object.entries(req.body).filter(([, v]) => v != null));
  if (!Object.keys(update).length) return res.status(400).json({ detail: "No data to update" });
  const result = await db.collection("services").findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    { $set: update },
    { returnDocument: "after" }
  );
  if (!result) return res.status(404).json({ detail: "Service not found" });
  res.json(serializeDoc(result));
});

app.delete("/api/services/:id", verifyToken, async (req, res) => {
  const result = await db.collection("services").deleteOne({ _id: new ObjectId(req.params.id) });
  if (result.deletedCount === 0) return res.status(404).json({ detail: "Service not found" });
  res.json({ message: "Service deleted successfully" });
});

// ── Templates ────────────────────────────────────────────
app.get("/api/templates", async (req, res) => {
  const publishedOnly = req.query.published_only !== "false";
  const query = publishedOnly ? { published: true } : {};
  const templates = await db.collection("templates").find(query).sort({ createdAt: -1 }).toArray();
  res.json(templates.map(serializeDoc));
});

app.get("/api/templates/:slug", async (req, res) => {
  const template = await db.collection("templates").findOne({ slug: req.params.slug, published: true });
  if (!template) return res.status(404).json({ detail: "Template not found" });
  res.json(serializeDoc(template));
});

app.post("/api/templates", verifyToken, async (req, res) => {
  const data = { ...req.body, createdAt: new Date() };
  if (!data.slug) data.slug = slugify(data.title);
  const result = await db.collection("templates").insertOne(data);
  res.json(serializeDoc({ _id: result.insertedId, ...data }));
});

app.put("/api/templates/:id", verifyToken, async (req, res) => {
  const update = Object.fromEntries(Object.entries(req.body).filter(([, v]) => v != null));
  if (update.title && !update.slug) update.slug = slugify(update.title);
  if (!Object.keys(update).length) return res.status(400).json({ detail: "No data to update" });
  const result = await db.collection("templates").findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    { $set: update },
    { returnDocument: "after" }
  );
  if (!result) return res.status(404).json({ detail: "Template not found" });
  res.json(serializeDoc(result));
});

app.delete("/api/templates/:id", verifyToken, async (req, res) => {
  const result = await db.collection("templates").deleteOne({ _id: new ObjectId(req.params.id) });
  if (result.deletedCount === 0) return res.status(404).json({ detail: "Template not found" });
  res.json({ message: "Template deleted successfully" });
});

// ── Contacts ─────────────────────────────────────────────
app.post("/api/contact", async (req, res) => {
  const data = { ...req.body, read: false, createdAt: new Date() };
  const result = await db.collection("contacts").insertOne(data);
  res.json(serializeDoc({ _id: result.insertedId, ...data }));
});

app.get("/api/contact", verifyToken, async (_req, res) => {
  const contacts = await db.collection("contacts").find().sort({ createdAt: -1 }).toArray();
  res.json(contacts.map(serializeDoc));
});

app.put("/api/contact/:id/read", verifyToken, async (req, res) => {
  const result = await db.collection("contacts").findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    { $set: { read: true } },
    { returnDocument: "after" }
  );
  if (!result) return res.status(404).json({ detail: "Contact not found" });
  res.json(serializeDoc(result));
});

app.delete("/api/contact/:id", verifyToken, async (req, res) => {
  const result = await db.collection("contacts").deleteOne({ _id: new ObjectId(req.params.id) });
  if (result.deletedCount === 0) return res.status(404).json({ detail: "Contact not found" });
  res.json({ message: "Contact deleted successfully" });
});

// ── Stats ────────────────────────────────────────────────
app.get("/api/stats", verifyToken, async (_req, res) => {
  const [totalBlogs, totalServices, totalTemplates, totalMessages, unreadMessages] = await Promise.all([
    db.collection("blogs").countDocuments(),
    db.collection("services").countDocuments(),
    db.collection("templates").countDocuments(),
    db.collection("contacts").countDocuments(),
    db.collection("contacts").countDocuments({ read: false }),
  ]);
  res.json({ totalBlogs, totalServices, totalTemplates, totalMessages, unreadMessages });
});

// ── Start ────────────────────────────────────────────────
async function start() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  db = client.db(DB_NAME);
  console.log("MongoDB connected");

  await seedDatabase();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`APIXEL API running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
