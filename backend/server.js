require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { MongoClient, ObjectId } = require("mongodb");
const createBookingsRoutes = require("./routes/bookings.routes");
const createServicesRoutes = require("./routes/services.routes");
const { SERVICE_CATEGORY_COLLECTION } = require("./models/serviceCategory.model");
const { SERVICE_SUB_CATEGORY_COLLECTION } = require("./models/serviceSubCategory.model");

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

// ── Experts (Team Members) ───────────────────────────────
app.get("/api/experts", async (req, res) => {
  const publishedOnly = req.query.published_only !== "false";
  const query = publishedOnly ? { published: true } : {};
  const experts = await db.collection("experts").find(query).sort({ order: 1 }).toArray();
  res.json(experts.map(serializeDoc));
});

app.post("/api/experts", verifyToken, async (req, res) => {
  const data = { ...req.body, createdAt: new Date() };
  const result = await db.collection("experts").insertOne(data);
  res.json(serializeDoc({ _id: result.insertedId, ...data }));
});

app.put("/api/experts/:id", verifyToken, async (req, res) => {
  const update = Object.fromEntries(Object.entries(req.body).filter(([, v]) => v != null));
  if (!Object.keys(update).length) return res.status(400).json({ detail: "No data to update" });
  const result = await db.collection("experts").findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    { $set: update },
    { returnDocument: "after" }
  );
  if (!result) return res.status(404).json({ detail: "Expert not found" });
  res.json(serializeDoc(result));
});

app.delete("/api/experts/:id", verifyToken, async (req, res) => {
  const result = await db.collection("experts").deleteOne({ _id: new ObjectId(req.params.id) });
  if (result.deletedCount === 0) return res.status(404).json({ detail: "Expert not found" });
  res.json({ message: "Expert deleted successfully" });
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
  const [totalBlogs, totalServiceCategories, totalServiceSubCategories, totalTemplates, totalExperts, totalMessages, unreadMessages, totalBookings] = await Promise.all([
    db.collection("blogs").countDocuments(),
    db.collection(SERVICE_CATEGORY_COLLECTION).countDocuments(),
    db.collection(SERVICE_SUB_CATEGORY_COLLECTION).countDocuments(),
    db.collection("templates").countDocuments(),
    db.collection("experts").countDocuments(),
    db.collection("contacts").countDocuments(),
    db.collection("contacts").countDocuments({ read: false }),
    db.collection("bookings").countDocuments(),
  ]);
  res.json({
    totalBlogs,
    totalServices: totalServiceCategories,
    totalServiceCategories,
    totalServiceSubCategories,
    totalTemplates,
    totalExperts,
    totalMessages,
    unreadMessages,
    totalBookings,
  });
});

// ── Start ────────────────────────────────────────────────
async function start() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  db = client.db(DB_NAME);
  console.log("MongoDB connected");

  await mongoose.connect(MONGO_URL, { dbName: DB_NAME });
  console.log("Mongoose connected");

  app.use("/api/services", createServicesRoutes(db, verifyToken));
  app.use("/api/v1/bookings", createBookingsRoutes(verifyToken));

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`APIXEL API running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
