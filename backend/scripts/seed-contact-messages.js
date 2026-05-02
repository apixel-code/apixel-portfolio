require("dotenv").config();

const { MongoClient } = require("mongodb");

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || "apixel_agency";
const SEED_SOURCE = "admin-message-export-test";

const contactMessages = [
  {
    name: "Ayesha Rahman",
    email: "ayesha@example.com",
    phone: "+8801711000001",
    service: "Website Development (MERN)",
    message: "I need a MERN website for my fashion brand with product pages and a contact flow.",
    read: false,
    createdAt: new Date("2026-05-01T04:15:00.000Z"),
  },
  {
    name: "Tanvir Hasan",
    email: "tanvir@example.com",
    phone: "+8801711000002",
    service: "Meta & Google Ads",
    message: "Please share a proposal for Google Ads and Meta retargeting for a new campaign.",
    read: true,
    createdAt: new Date("2026-05-01T10:40:00.000Z"),
  },
  {
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    phone: "+8801711000003",
    service: "Social Media Management",
    message: "We need monthly social media management for Facebook, Instagram, and LinkedIn.",
    read: false,
    createdAt: new Date("2026-05-02T03:30:00.000Z"),
  },
  {
    name: "Mahmudul Karim",
    email: "mahmudul@example.com",
    phone: "+8801711000004",
    service: "Graphic Design",
    message: "Looking for logo redesign, brand guideline, and social media templates.",
    read: true,
    createdAt: new Date("2026-05-02T12:05:00.000Z"),
  },
  {
    name: "Farhana Akter",
    email: "farhana@example.com",
    phone: "+8801711000005",
    service: "Website Development (MERN)",
    message: "Can you build a landing page and admin dashboard for a consultancy business?",
    read: false,
    createdAt: new Date("2026-05-03T05:50:00.000Z"),
  },
  {
    name: "Rafi Chowdhury",
    email: "rafi@example.com",
    phone: "",
    service: "Other",
    message: "I want to discuss a custom automation project for lead capture.",
    read: false,
    createdAt: new Date("2026-05-04T09:20:00.000Z"),
  },
  {
    name: "Sabrina Islam",
    email: "sabrina@example.com",
    phone: "+8801711000006",
    service: "Meta & Google Ads",
    message: "We want to launch Eid campaign ads and need conversion tracking for purchases.",
    read: false,
    createdAt: new Date("2026-05-04T14:10:00.000Z"),
  },
  {
    name: "Arif Hossain",
    email: "arif@example.com",
    phone: "+8801711000007",
    service: "Website Development (MERN)",
    message: "Need a custom booking platform with admin login and payment integration.",
    read: true,
    createdAt: new Date("2026-05-05T04:45:00.000Z"),
  },
  {
    name: "Mithila Roy",
    email: "mithila@example.com",
    phone: "+8801711000008",
    service: "Graphic Design",
    message: "Please quote for pitch deck design and a complete brand refresh.",
    read: false,
    createdAt: new Date("2026-05-05T11:25:00.000Z"),
  },
  {
    name: "Sajid Ahmed",
    email: "sajid@example.com",
    phone: "+8801711000009",
    service: "Social Media Management",
    message: "Looking for reels planning, captions, and community management for a restaurant.",
    read: true,
    createdAt: new Date("2026-05-06T06:35:00.000Z"),
  },
  {
    name: "Lamisa Chowdhury",
    email: "lamisa@example.com",
    phone: "+8801711000010",
    service: "Other",
    message: "Can you audit our website and recommend improvements before redesign?",
    read: false,
    createdAt: new Date("2026-05-06T13:55:00.000Z"),
  },
  {
    name: "Imran Kabir",
    email: "imran@example.com",
    phone: "+8801711000011",
    service: "Meta & Google Ads",
    message: "Need monthly Google Ads management for a local education consultancy.",
    read: false,
    createdAt: new Date("2026-05-07T05:05:00.000Z"),
  },
  {
    name: "Tania Sultana",
    email: "tania@example.com",
    phone: "+8801711000012",
    service: "Website Development (MERN)",
    message: "We need a SaaS marketing website with blog, pricing, and lead forms.",
    read: true,
    createdAt: new Date("2026-05-07T16:15:00.000Z"),
  },
  {
    name: "Hasib Rahman",
    email: "hasib@example.com",
    phone: "+8801711000013",
    service: "Graphic Design",
    message: "Need product packaging design and social media launch creatives.",
    read: false,
    createdAt: new Date("2026-05-08T03:25:00.000Z"),
  },
  {
    name: "Rumana Akter",
    email: "rumana@example.com",
    phone: "+8801711000014",
    service: "Social Media Management",
    message: "Can you handle content planning for a boutique clothing store?",
    read: true,
    createdAt: new Date("2026-05-08T12:30:00.000Z"),
  },
  {
    name: "Nayeem Uddin",
    email: "nayeem@example.com",
    phone: "+8801711000015",
    service: "Website Development (MERN)",
    message: "Need an ecommerce website with inventory management and order dashboard.",
    read: false,
    createdAt: new Date("2026-05-09T04:00:00.000Z"),
  },
  {
    name: "Priyanka Das",
    email: "priyanka@example.com",
    phone: "+8801711000016",
    service: "Meta & Google Ads",
    message: "Need lead generation ads for real estate with landing page tracking.",
    read: true,
    createdAt: new Date("2026-05-09T10:45:00.000Z"),
  },
  {
    name: "Fahim Bari",
    email: "fahim@example.com",
    phone: "+8801711000017",
    service: "Other",
    message: "Interested in a complete digital strategy consultation for a new startup.",
    read: false,
    createdAt: new Date("2026-05-10T05:30:00.000Z"),
  },
  {
    name: "Maliha Noor",
    email: "maliha@example.com",
    phone: "+8801711000018",
    service: "Graphic Design",
    message: "Looking for event banners, invitation cards, and social cover designs.",
    read: false,
    createdAt: new Date("2026-05-10T15:20:00.000Z"),
  },
  {
    name: "Zubair Alam",
    email: "zubair@example.com",
    phone: "+8801711000019",
    service: "Social Media Management",
    message: "Need TikTok and Instagram short-form content support for a tech brand.",
    read: true,
    createdAt: new Date("2026-05-11T07:10:00.000Z"),
  },
  {
    name: "Samia Ferdous",
    email: "samia@example.com",
    phone: "+8801711000020",
    service: "Website Development (MERN)",
    message: "Can you rebuild our outdated company website with better SEO and speed?",
    read: false,
    createdAt: new Date("2026-05-11T13:40:00.000Z"),
  },
  {
    name: "Rashidul Islam",
    email: "rashidul@example.com",
    phone: "+8801711000021",
    service: "Meta & Google Ads",
    message: "We need a performance marketing setup with analytics and monthly reporting.",
    read: false,
    createdAt: new Date("2026-05-12T06:00:00.000Z"),
  },
  {
    name: "Elora Khan",
    email: "elora@example.com",
    phone: "",
    service: "Other",
    message: "Please contact me about a custom website maintenance package.",
    read: true,
    createdAt: new Date("2026-05-12T14:35:00.000Z"),
  },
  {
    name: "Khalid Mahmud",
    email: "khalid@example.com",
    phone: "+8801711000022",
    service: "Graphic Design",
    message: "Need a brand kit, business card, and presentation template.",
    read: false,
    createdAt: new Date("2026-05-13T08:15:00.000Z"),
  },
  {
    name: "Mehjabin Hossain",
    email: "mehjabin@example.com",
    phone: "+8801711000023",
    service: "Social Media Management",
    message: "Looking for a three-month content growth plan for an online course brand.",
    read: false,
    createdAt: new Date("2026-05-13T16:50:00.000Z"),
  },
  {
    name: "Omar Faruk",
    email: "omar@example.com",
    phone: "+8801711000024",
    service: "Website Development (MERN)",
    message: "Need a portfolio website with case studies and contact tracking.",
    read: true,
    createdAt: new Date("2026-05-14T09:05:00.000Z"),
  },
];

async function run() {
  if (!MONGO_URL) {
    throw new Error("MONGO_URL is required in backend/.env");
  }

  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    if (process.argv.includes("--reset")) {
      const result = await db.collection("contacts").deleteMany({ seedSource: SEED_SOURCE });
      console.log(`Removed ${result.deletedCount} existing seeded contact messages.`);
    }

    const docs = contactMessages.map((message) => ({
      ...message,
      seedSource: SEED_SOURCE,
    }));

    const result = await db.collection("contacts").insertMany(docs);
    console.log(`Inserted ${result.insertedCount} seeded contact messages into ${DB_NAME}.contacts`);
  } finally {
    await client.close();
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
