import os
from datetime import datetime, timezone, timedelta
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
from jose import JWTError, jwt
from passlib.context import CryptContext
import re

load_dotenv()

app = FastAPI(title="APIXEL Agency API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME", "apixel_agency")
JWT_SECRET = os.environ.get("JWT_SECRET", "apixel_super_secret_jwt_key_2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

client = MongoClient(MONGO_URL)
db = client[DB_NAME]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Pydantic Models
class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class BlogBase(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    author: str
    category: str
    tags: List[str] = []
    thumbnailUrl: str = ""
    published: bool = True
    readTime: str = "5 min read"

class BlogCreate(BlogBase):
    pass

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    thumbnailUrl: Optional[str] = None
    published: Optional[bool] = None
    readTime: Optional[str] = None

class BlogResponse(BlogBase):
    id: str
    createdAt: str

class ServiceBase(BaseModel):
    name: str
    description: str
    features: List[str] = []
    icon: str = ""
    priceRange: str = ""
    order: int = 0

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    icon: Optional[str] = None
    priceRange: Optional[str] = None
    order: Optional[int] = None

class ServiceResponse(ServiceBase):
    id: str
    createdAt: str

class TemplateBase(BaseModel):
    title: str
    slug: str
    category: str
    excerpt: str
    description: str
    thumbnailUrl: str = ""
    gallery: List[str] = []
    tags: List[str] = []
    features: List[str] = []
    priceLabel: str = ""
    status: str = "Available"
    techStack: List[str] = []
    useCases: List[str] = []
    valuePoints: List[str] = []
    demoUrl: str = ""
    ctaLabel: str = "Get This Template"
    published: bool = True

class TemplateCreate(TemplateBase):
    pass

class TemplateUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    excerpt: Optional[str] = None
    description: Optional[str] = None
    thumbnailUrl: Optional[str] = None
    gallery: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    features: Optional[List[str]] = None
    priceLabel: Optional[str] = None
    status: Optional[str] = None
    techStack: Optional[List[str]] = None
    useCases: Optional[List[str]] = None
    valuePoints: Optional[List[str]] = None
    demoUrl: Optional[str] = None
    ctaLabel: Optional[str] = None
    published: Optional[bool] = None

class TemplateResponse(TemplateBase):
    id: str
    createdAt: str

class ContactBase(BaseModel):
    name: str
    email: str
    phone: str = ""
    service: str = ""
    message: str

class ContactCreate(ContactBase):
    pass

class ContactResponse(ContactBase):
    id: str
    read: bool
    createdAt: str

# Helper functions
def serialize_doc(doc: dict) -> dict:
    if doc is None:
        return None
    doc["id"] = str(doc.pop("_id"))
    if "createdAt" in doc and isinstance(doc["createdAt"], datetime):
        doc["createdAt"] = doc["createdAt"].isoformat()
    return doc

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

# Seed data function
def seed_database():
    # Check if data already exists
    if db.services.count_documents({}) == 0:
        services = [
            {
                "name": "Website Development (MERN)",
                "description": "Custom web applications built with MongoDB, Express.js, React, and Node.js. Scalable, fast, and modern solutions tailored to your business needs.",
                "features": ["Custom React Frontend", "Node.js Backend", "MongoDB Database", "RESTful APIs", "Responsive Design", "SEO Optimized"],
                "icon": "Code",
                "priceRange": "$2,000 - $15,000",
                "order": 1,
                "createdAt": datetime.now(timezone.utc)
            },
            {
                "name": "Meta & Google Ads",
                "description": "Strategic advertising campaigns with advanced Conversion API integration and comprehensive tracking setup for maximum ROI.",
                "features": ["Facebook & Instagram Ads", "Google Ads Management", "Conversion API Setup", "Pixel Implementation", "A/B Testing", "Monthly Reports"],
                "icon": "Target",
                "priceRange": "$500 - $5,000/month",
                "order": 2,
                "createdAt": datetime.now(timezone.utc)
            },
            {
                "name": "Social Media Management",
                "description": "Complete social media presence management. Content creation, scheduling, engagement, and growth strategies across all platforms.",
                "features": ["Content Calendar", "Daily Posting", "Community Management", "Hashtag Strategy", "Analytics Reports", "Influencer Outreach"],
                "icon": "Share2",
                "priceRange": "$300 - $2,000/month",
                "order": 3,
                "createdAt": datetime.now(timezone.utc)
            },
            {
                "name": "Graphic Design",
                "description": "Eye-catching visual designs for your brand. From logos to marketing materials, we create designs that make an impact.",
                "features": ["Logo Design", "Brand Identity", "Social Media Graphics", "Print Materials", "UI/UX Design", "Motion Graphics"],
                "icon": "Palette",
                "priceRange": "$200 - $3,000",
                "order": 4,
                "createdAt": datetime.now(timezone.utc)
            }
        ]
        db.services.insert_many(services)
        print("Services seeded successfully")

    if db.blogs.count_documents({}) == 0:
        blogs = [
            {
                "title": "Building Scalable Web Apps with the MERN Stack in 2024",
                "slug": "building-scalable-web-apps-mern-stack-2024",
                "excerpt": "Learn the best practices for building modern, scalable web applications using MongoDB, Express.js, React, and Node.js.",
                "content": """<h2>Introduction to MERN Stack</h2>
<p>The MERN stack has become one of the most popular choices for building full-stack web applications. It combines four powerful technologies: MongoDB, Express.js, React, and Node.js.</p>

<h2>Why Choose MERN?</h2>
<p>MERN offers several advantages:</p>
<ul>
<li><strong>JavaScript Everywhere:</strong> Use one language for both frontend and backend</li>
<li><strong>JSON Data Flow:</strong> Seamless data transfer between all layers</li>
<li><strong>Rich Ecosystem:</strong> Access to millions of npm packages</li>
<li><strong>Scalability:</strong> Perfect for building apps that need to grow</li>
</ul>

<h2>Best Practices for 2024</h2>
<p>To build truly scalable applications, follow these practices:</p>
<ol>
<li>Use TypeScript for type safety</li>
<li>Implement proper state management with Redux or Zustand</li>
<li>Set up CI/CD pipelines early</li>
<li>Write comprehensive tests</li>
<li>Use Docker for containerization</li>
</ol>

<h2>Conclusion</h2>
<p>The MERN stack continues to evolve and remains a solid choice for modern web development. Start your next project with MERN and experience the power of JavaScript across your entire stack.</p>""",
                "author": "APIXEL Team",
                "category": "Web Development",
                "tags": ["MERN", "React", "Node.js", "MongoDB", "Web Development"],
                "thumbnailUrl": "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
                "published": True,
                "readTime": "8 min read",
                "createdAt": datetime.now(timezone.utc) - timedelta(days=5)
            },
            {
                "title": "Mastering Facebook Ads: A Complete Guide to Conversion API",
                "slug": "mastering-facebook-ads-conversion-api-guide",
                "excerpt": "Discover how to set up and optimize Facebook's Conversion API for better tracking and improved ad performance.",
                "content": """<h2>What is Conversion API?</h2>
<p>Facebook's Conversion API (CAPI) is a business tool that lets you share web and offline events directly from your server to Facebook. It's designed to work alongside the Facebook Pixel.</p>

<h2>Why You Need Conversion API</h2>
<p>With increasing privacy restrictions and iOS 14+ changes, the Pixel alone isn't enough:</p>
<ul>
<li><strong>Better Data Accuracy:</strong> Server-side tracking bypasses browser limitations</li>
<li><strong>Improved Attribution:</strong> Capture events that pixels miss</li>
<li><strong>Enhanced Privacy:</strong> Control what data you share</li>
<li><strong>Reliable Tracking:</strong> Less affected by ad blockers</li>
</ul>

<h2>Setting Up Conversion API</h2>
<p>Follow these steps to implement CAPI:</p>
<ol>
<li>Create a System User in Business Settings</li>
<li>Generate an Access Token</li>
<li>Set up server-side event tracking</li>
<li>Implement event deduplication</li>
<li>Test with the Events Manager</li>
</ol>

<h2>Best Practices</h2>
<p>To maximize your CAPI implementation:</p>
<ul>
<li>Always deduplicate events between Pixel and CAPI</li>
<li>Include user parameters for better matching</li>
<li>Test thoroughly before going live</li>
<li>Monitor event quality scores regularly</li>
</ul>

<h2>Conclusion</h2>
<p>Conversion API is no longer optional—it's essential for accurate tracking and optimal ad performance. Implement it today to stay ahead of the competition.</p>""",
                "author": "APIXEL Team",
                "category": "Digital Marketing",
                "tags": ["Facebook Ads", "Conversion API", "Digital Marketing", "Tracking"],
                "thumbnailUrl": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
                "published": True,
                "readTime": "10 min read",
                "createdAt": datetime.now(timezone.utc) - timedelta(days=10)
            },
            {
                "title": "Social Media Trends That Will Dominate 2024",
                "slug": "social-media-trends-dominate-2024",
                "excerpt": "Stay ahead of the curve with these emerging social media trends that are shaping the digital landscape.",
                "content": """<h2>The Social Media Landscape in 2024</h2>
<p>Social media continues to evolve rapidly. Here are the trends that will define the year ahead.</p>

<h2>1. Short-Form Video Dominance</h2>
<p>TikTok, Instagram Reels, and YouTube Shorts continue to dominate. Key points:</p>
<ul>
<li>Videos under 60 seconds get the most engagement</li>
<li>Authentic, raw content outperforms polished productions</li>
<li>Trending sounds and challenges drive visibility</li>
</ul>

<h2>2. AI-Powered Content Creation</h2>
<p>AI tools are revolutionizing how we create content:</p>
<ul>
<li>AI-assisted copywriting for captions</li>
<li>Automated video editing tools</li>
<li>AI-generated graphics and images</li>
</ul>

<h2>3. Social Commerce Growth</h2>
<p>Shopping directly through social platforms is becoming mainstream:</p>
<ul>
<li>Instagram and TikTok Shop integration</li>
<li>Live shopping events</li>
<li>One-click purchasing from posts</li>
</ul>

<h2>4. Community Building</h2>
<p>Brands are focusing on building engaged communities:</p>
<ul>
<li>Discord servers for brand communities</li>
<li>Exclusive content for loyal followers</li>
<li>User-generated content campaigns</li>
</ul>

<h2>Conclusion</h2>
<p>Adapting to these trends early will give your brand a competitive edge. Start experimenting with these strategies to stay relevant in the ever-changing social media landscape.</p>""",
                "author": "APIXEL Team",
                "category": "Social Media",
                "tags": ["Social Media", "Trends", "Marketing", "Content Strategy"],
                "thumbnailUrl": "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800",
                "published": True,
                "readTime": "7 min read",
                "createdAt": datetime.now(timezone.utc) - timedelta(days=15)
            }
        ]
        db.blogs.insert_many(blogs)
        print("Blogs seeded successfully")

    # Seed admin user if not exists
    if db.admins.count_documents({}) == 0:
        admin = {
            "email": "admin@agency.com",
            "password": pwd_context.hash("Admin@123"),
            "createdAt": datetime.now(timezone.utc)
        }
        db.admins.insert_one(admin)
        print("Admin user seeded successfully")
    else:
        # Always ensure admin password is correct
        db.admins.update_one(
            {"email": "admin@agency.com"},
            {"$set": {"password": pwd_context.hash("Admin@123")}},
            upsert=True
        )

    # Seed templates if none exist
    if db.templates.count_documents({}) == 0:
        templates = [
            {
                "title": "Agency Pro - Digital Agency Website",
                "slug": "agency-pro-digital-agency",
                "category": "Agency",
                "excerpt": "A sleek, conversion-focused website template built for digital agencies that want to look premium and close deals faster.",
                "description": "Agency Pro is a fully responsive, modern digital agency template designed with conversion in mind. Every section is crafted to guide visitors from curiosity to contact. Dark-themed with bold accents, this template communicates authority and professionalism.",
                "thumbnailUrl": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
                "gallery": [
                    "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800",
                    "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800",
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"
                ],
                "tags": ["Agency", "Dark Theme", "MERN Stack"],
                "features": ["Hero with CTA", "Service Showcase", "Portfolio Gallery", "Testimonial Slider", "Contact Form", "Blog Section"],
                "priceLabel": "$499",
                "status": "Available",
                "techStack": ["React", "Node.js", "MongoDB", "Tailwind CSS"],
                "useCases": ["Digital Agencies", "Marketing Firms", "Creative Studios", "Consulting"],
                "valuePoints": ["Mobile-first responsive design", "SEO-optimized structure", "Fast load times under 2 seconds"],
                "demoUrl": "",
                "ctaLabel": "Get This Template",
                "published": True,
                "createdAt": datetime.now(timezone.utc) - timedelta(days=2)
            },
            {
                "title": "ShopLaunch - E-Commerce Starter",
                "slug": "shoplaunch-ecommerce-starter",
                "category": "E-Commerce",
                "excerpt": "Launch your online store in days, not months. A beautiful e-commerce template with product pages, cart, and checkout flow.",
                "description": "ShopLaunch gives you everything you need to start selling online. With built-in product grids, filter options, a smooth cart experience, and checkout flow — this template is designed to turn browsers into buyers.",
                "thumbnailUrl": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
                "gallery": [
                    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800",
                    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800",
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"
                ],
                "tags": ["E-Commerce", "Shopping", "Product Store"],
                "features": ["Product Grid", "Shopping Cart", "Checkout Flow", "Search & Filters", "Product Detail Pages", "Wishlist"],
                "priceLabel": "$699",
                "status": "Available",
                "techStack": ["React", "Node.js", "MongoDB", "Stripe"],
                "useCases": ["Online Stores", "Fashion Brands", "Handmade Shops", "Electronics"],
                "valuePoints": ["Built-in payment integration ready", "Inventory management system", "Customer reviews section"],
                "demoUrl": "",
                "ctaLabel": "Get This Template",
                "published": True,
                "createdAt": datetime.now(timezone.utc) - timedelta(days=5)
            },
            {
                "title": "FolioX - Portfolio & Personal Brand",
                "slug": "foliox-portfolio-personal-brand",
                "category": "Portfolio",
                "excerpt": "Stand out from the crowd. A minimal yet bold portfolio template for freelancers, developers, and creatives.",
                "description": "FolioX is a personal branding powerhouse. Showcase your work, share your story, and let potential clients reach you effortlessly. Minimal design with maximum impact — built to make you look like the expert you are.",
                "thumbnailUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
                "gallery": [
                    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800"
                ],
                "tags": ["Portfolio", "Minimal", "Personal Brand"],
                "features": ["Project Showcase", "About Section", "Skills Display", "Contact Form", "Resume Download", "Smooth Animations"],
                "priceLabel": "$349",
                "status": "Available",
                "techStack": ["React", "Framer Motion", "Tailwind CSS"],
                "useCases": ["Freelancers", "Developers", "Designers", "Photographers"],
                "valuePoints": ["Lightning fast performance", "Smooth scroll animations", "One-page & multi-page layouts"],
                "demoUrl": "",
                "ctaLabel": "Get This Template",
                "published": True,
                "createdAt": datetime.now(timezone.utc) - timedelta(days=8)
            },
            {
                "title": "SaaSKit - SaaS Landing Page",
                "slug": "saaskit-saas-landing-page",
                "category": "SaaS",
                "excerpt": "Convert visitors into trial users. A high-converting SaaS landing page with pricing tables, feature sections, and CTA blocks.",
                "description": "SaaSKit is engineered for software companies that need to acquire users fast. With pricing comparison tables, feature highlights, social proof sections, and strategically placed CTAs — every pixel is designed to drive sign-ups.",
                "thumbnailUrl": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
                "gallery": [
                    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
                    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"
                ],
                "tags": ["SaaS", "Landing Page", "Startup"],
                "features": ["Pricing Table", "Feature Grid", "Testimonials", "FAQ Accordion", "Newsletter Signup", "Analytics Ready"],
                "priceLabel": "$599",
                "status": "Available",
                "techStack": ["React", "Node.js", "Tailwind CSS", "Framer Motion"],
                "useCases": ["SaaS Products", "Startups", "Tech Companies", "App Landing Pages"],
                "valuePoints": ["A/B test ready structure", "Conversion-optimized layout", "Integration-ready contact forms"],
                "demoUrl": "",
                "ctaLabel": "Get This Template",
                "published": True,
                "createdAt": datetime.now(timezone.utc) - timedelta(days=12)
            },
            {
                "title": "RestroHub - Restaurant & Cafe Website",
                "slug": "restrohub-restaurant-cafe",
                "category": "Restaurant",
                "excerpt": "Make your restaurant irresistible online. A beautiful template with menu display, reservation system, and gallery.",
                "description": "RestroHub brings your restaurant to life online. Showcase your menu with stunning imagery, accept table reservations, display opening hours, and let your food photography do the talking. Designed to make visitors hungry and ready to book.",
                "thumbnailUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
                "gallery": [
                    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
                    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
                    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800"
                ],
                "tags": ["Restaurant", "Food", "Hospitality"],
                "features": ["Menu Display", "Reservation Form", "Photo Gallery", "Opening Hours", "Location Map", "Customer Reviews"],
                "priceLabel": "$449",
                "status": "Available",
                "techStack": ["React", "Node.js", "MongoDB", "Tailwind CSS"],
                "useCases": ["Restaurants", "Cafes", "Bars", "Food Trucks"],
                "valuePoints": ["Appetizing food photography layouts", "Online reservation system", "Google Maps integration"],
                "demoUrl": "",
                "ctaLabel": "Get This Template",
                "published": True,
                "createdAt": datetime.now(timezone.utc) - timedelta(days=15)
            },
            {
                "title": "EduLearn - Online Course Platform",
                "slug": "edulearn-online-course-platform",
                "category": "Education",
                "excerpt": "Teach the world. A comprehensive course platform template with lesson pages, enrollment flow, and instructor profiles.",
                "description": "EduLearn is built for educators, coaches, and training companies who want to sell courses online. With course listings, lesson pages, instructor profiles, and enrollment flow — it's everything you need to start your online education business.",
                "thumbnailUrl": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800",
                "gallery": [
                    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
                    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
                    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"
                ],
                "tags": ["Education", "Courses", "E-Learning"],
                "features": ["Course Listings", "Lesson Pages", "Instructor Profiles", "Enrollment Flow", "Progress Tracking", "Certificate System"],
                "priceLabel": "$549",
                "status": "Available",
                "techStack": ["React", "Node.js", "MongoDB", "Tailwind CSS"],
                "useCases": ["Online Courses", "Coaching", "Corporate Training", "Tutoring"],
                "valuePoints": ["Student dashboard included", "Video lesson support", "Payment gateway ready"],
                "demoUrl": "",
                "ctaLabel": "Get This Template",
                "published": True,
                "createdAt": datetime.now(timezone.utc) - timedelta(days=18)
            }
        ]
        db.templates.insert_many(templates)
        print("Templates seeded successfully")

# Run seed on startup
@app.on_event("startup")
async def startup_event():
    seed_database()

# Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "APIXEL Agency API"}

# Auth Routes
@app.post("/api/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    admin = db.admins.find_one({"email": request.email})
    if not admin or not pwd_context.verify(request.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": admin["email"]})
    return TokenResponse(access_token=access_token)

# Blog Routes
@app.get("/api/blogs", response_model=List[BlogResponse])
async def get_blogs(published_only: bool = True):
    query = {"published": True} if published_only else {}
    blogs = list(db.blogs.find(query).sort("createdAt", -1))
    return [serialize_doc(blog) for blog in blogs]

@app.get("/api/blogs/{slug}", response_model=BlogResponse)
async def get_blog(slug: str):
    blog = db.blogs.find_one({"slug": slug})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return serialize_doc(blog)

@app.post("/api/blogs", response_model=BlogResponse)
async def create_blog(blog: BlogCreate, user: str = Depends(verify_token)):
    blog_dict = blog.model_dump()
    blog_dict["slug"] = slugify(blog_dict["title"]) if not blog_dict["slug"] else blog_dict["slug"]
    blog_dict["createdAt"] = datetime.now(timezone.utc)
    result = db.blogs.insert_one(blog_dict)
    blog_dict["_id"] = result.inserted_id
    return serialize_doc(blog_dict)

@app.put("/api/blogs/{id}", response_model=BlogResponse)
async def update_blog(id: str, blog: BlogUpdate, user: str = Depends(verify_token)):
    update_data = {k: v for k, v in blog.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = db.blogs.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": update_data},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Blog not found")
    return serialize_doc(result)

@app.delete("/api/blogs/{id}")
async def delete_blog(id: str, user: str = Depends(verify_token)):
    result = db.blogs.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog deleted successfully"}

# Service Routes
@app.get("/api/services", response_model=List[ServiceResponse])
async def get_services():
    services = list(db.services.find().sort("order", 1))
    return [serialize_doc(service) for service in services]

@app.post("/api/services", response_model=ServiceResponse)
async def create_service(service: ServiceCreate, user: str = Depends(verify_token)):
    service_dict = service.model_dump()
    service_dict["createdAt"] = datetime.now(timezone.utc)
    result = db.services.insert_one(service_dict)
    service_dict["_id"] = result.inserted_id
    return serialize_doc(service_dict)

@app.put("/api/services/{id}", response_model=ServiceResponse)
async def update_service(id: str, service: ServiceUpdate, user: str = Depends(verify_token)):
    update_data = {k: v for k, v in service.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = db.services.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": update_data},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Service not found")
    return serialize_doc(result)

@app.delete("/api/services/{id}")
async def delete_service(id: str, user: str = Depends(verify_token)):
    result = db.services.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service deleted successfully"}

# Template Routes
@app.get("/api/templates", response_model=List[TemplateResponse])
async def get_templates(published_only: bool = True):
    query = {"published": True} if published_only else {}
    templates = list(db.templates.find(query).sort("createdAt", -1))
    return [serialize_doc(template) for template in templates]

@app.get("/api/templates/{slug}", response_model=TemplateResponse)
async def get_template(slug: str):
    template = db.templates.find_one({"slug": slug, "published": True})
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return serialize_doc(template)

@app.post("/api/templates", response_model=TemplateResponse)
async def create_template(template: TemplateCreate, user: str = Depends(verify_token)):
    template_dict = template.model_dump()
    template_dict["slug"] = slugify(template_dict["title"]) if not template_dict["slug"] else template_dict["slug"]
    template_dict["createdAt"] = datetime.now(timezone.utc)
    result = db.templates.insert_one(template_dict)
    template_dict["_id"] = result.inserted_id
    return serialize_doc(template_dict)

@app.put("/api/templates/{id}", response_model=TemplateResponse)
async def update_template(id: str, template: TemplateUpdate, user: str = Depends(verify_token)):
    update_data = {k: v for k, v in template.model_dump().items() if v is not None}
    if "title" in update_data and ("slug" not in update_data or not update_data["slug"]):
        update_data["slug"] = slugify(update_data["title"])
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")

    result = db.templates.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": update_data},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Template not found")
    return serialize_doc(result)

@app.delete("/api/templates/{id}")
async def delete_template(id: str, user: str = Depends(verify_token)):
    result = db.templates.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"message": "Template deleted successfully"}

# Contact Routes
@app.post("/api/contact", response_model=ContactResponse)
async def create_contact(contact: ContactCreate):
    contact_dict = contact.model_dump()
    contact_dict["read"] = False
    contact_dict["createdAt"] = datetime.now(timezone.utc)
    result = db.contacts.insert_one(contact_dict)
    contact_dict["_id"] = result.inserted_id
    return serialize_doc(contact_dict)

@app.get("/api/contact", response_model=List[ContactResponse])
async def get_contacts(user: str = Depends(verify_token)):
    contacts = list(db.contacts.find().sort("createdAt", -1))
    return [serialize_doc(contact) for contact in contacts]

@app.put("/api/contact/{id}/read")
async def mark_contact_read(id: str, user: str = Depends(verify_token)):
    result = db.contacts.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": {"read": True}},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Contact not found")
    return serialize_doc(result)

@app.delete("/api/contact/{id}")
async def delete_contact(id: str, user: str = Depends(verify_token)):
    result = db.contacts.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact deleted successfully"}

# Stats for admin dashboard
@app.get("/api/stats")
async def get_stats(user: str = Depends(verify_token)):
    return {
        "totalBlogs": db.blogs.count_documents({}),
        "totalServices": db.services.count_documents({}),
        "totalTemplates": db.templates.count_documents({}),
        "totalMessages": db.contacts.count_documents({}),
        "unreadMessages": db.contacts.count_documents({"read": False})
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
