import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GenAI Lazily
let aiClient: GoogleGenAI | null = null;
function getGenAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// SIMULATED DATABASE STORE IN-MEMORY
// This matches the prisma models defined below so the UI renders fully operational state

const db = {
  currentUser: {
    id: "user_sarah_tan",
    fullName: "Sarah Tan",
    email: "sarah.tan@careerverse.app",
    headline: "Full-Stack Engineer & Tech Advocate | Seeking Junior-to-Mid Roles",
    about: "Passionate developer specialized in React, TypeScript, and modern Serverless stacks. Love building products that solve real problems. Graduate of National University of Singapore (NUS) with a major in Computer Science.",
    location: "Singapore",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    coverBanner: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1200",
    skills: ["React", "TypeScript", "Node.js", "Express", "Tailwind CSS", "Prisma", "PostgreSQL", "Next.js", "Gemini API"],
    languages: ["English", "Mandarin"],
    resumeText: "Sarah Tan. Full Stack Engineer. Skills: React, Node, Webdev, UI Design. Exp: Tech intern at Grab, developed React dashboards. Education: NUS Computer Science, 2025. Proactive problem solver.",
    resumeFileName: "sarah_tan_resume_2026.pdf",
    education: [
      {
        id: "edu_1",
        school: "National University of Singapore",
        degree: "Bachelor of Computing",
        fieldOfStudy: "Computer Science",
        startYear: "2021",
        endYear: "2025"
      }
    ],
    experience: [
      {
        id: "exp_1",
        company: "Grab",
        role: "Frontend Developer Intern",
        location: "Singapore (Hybrid)",
        startDate: "May 2024",
        endDate: "Nov 2024",
        description: "Assisted in building highly reusable React components for the GrabMerchant portal. Optimized Core Web Vitals resulting in 14% lower initial paint times. Worked with UI/UX designers to implement pixel-perfect Figma screens."
      },
      {
        id: "exp_2",
        company: "NUS Hacker Club",
        role: "Lead Full-Stack Webmaster",
        location: "Singapore",
        startDate: "Jan 2023",
        endDate: "Present",
        description: "Engineered and maintained the annual NUS hackathon registration platform. Set up serverless functions, database queries and responsive landing pages."
      }
    ],
    certifications: [
      "AWS Certified Cloud Practitioner",
      "Google UX Design Certificate"
    ],
    achievements: [
      "1st Place Winner - NUS Hack & Roll Hackathon 2024",
      "Dean's List Honoree (Academic Year 2023/2024)"
    ],
    portfolio: [
      {
        id: "port_1",
        title: "DynaCalendar - Event Scheduler",
        description: "An intuitive collaborative calendar tool featuring sub-second dragging actions, recurring patterns, and high contrast offline state.",
        techStack: ["React", "TypeScript", "Tailwind CSS", "LocalForage"],
        imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=400",
        liveUrl: "https://dynacalendar.example.com",
        githubUrl: "https://github.com/sarahtan/dynacalendar",
        status: "Completed" as const
      },
      {
        id: "port_2",
        title: "PixelBoard - Real-time Collaborative Board",
        description: "A server-authoritative graphics whiteboard using canvas rendering where 50+ engineers can sketch, brainstorm, and create user wireframes simultaneously.",
        techStack: ["React", "HTML5 Canvas", "WebSockets", "Node.js"],
        imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400",
        liveUrl: "https://pixelboard.example.com",
        githubUrl: "https://github.com/sarahtan/pixelboard",
        status: "Completed" as const
      }
    ],
    socials: {
      github: "sarahtan",
      linkedin: "sarah-tan-tech",
      twitter: "sarah_codes",
      website: "https://sarahtan.dev"
    },
    githubUsername: "sarahtan",
    isPremium: false,
    profileStrength: 85,
    followersCount: 382,
    followingCount: 219,
    connectionsCount: 142
  },

  companies: [
    {
      id: "comp_grab",
      name: "Grab",
      logo: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=100",
      coverBanner: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200",
      about: "Grab is Southeast Asia's leading superapp, providing daily services that matter most to consumers like food delivery, ride-hailing, and digital financial payments. Headquartered in Singapore.",
      website: "https://grab.careers",
      industry: "Technology / Superapp",
      employeeCount: "10,000+ employees",
      locations: ["Singapore", "Kuala Lumpur", "Jakarta", "Manila", "Bangkok"],
      openPositionsCount: 3
    },
    {
      id: "comp_shopee",
      name: "Shopee",
      logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100",
      coverBanner: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      about: "Shopee is the leading e-commerce platform in Southeast Asia and Taiwan. It is a platform tailored for the region, providing customers with an easy, secure and fast online shopping experience.",
      website: "https://careers.shopee.sg",
      industry: "E-Commerce",
      employeeCount: "8,000+ employees",
      locations: ["Singapore", "Jakarta", "Ho Chi Minh City", "Bangkok"],
      openPositionsCount: 2
    },
    {
      id: "comp_govtech",
      name: "GovTech Singapore",
      logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=100",
      coverBanner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
      about: "The Government Technology Agency of Singapore (GovTech) designs and builds key digital public infrastructure services ensuring a Smart Nation that empowers secure, delightful lives.",
      website: "https://www.tech.gov.sg",
      industry: "Public Sector / Technology",
      employeeCount: "3,000+ employees",
      locations: ["Singapore"],
      openPositionsCount: 1
    },
    {
      id: "comp_notion",
      name: "Notion",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=100",
      coverBanner: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
      about: "A new tool that blends your everyday work apps into one. It's the all-in-one workspace for you and your team to collaborate, take notes, compile wikis, and organize roadmap charts.",
      website: "https://notion.so/careers",
      industry: "Productivity Software",
      employeeCount: "500+ employees",
      locations: ["San Francisco", "Tokyo", "Dublin", "Remote"],
      openPositionsCount: 1
    }
  ],

  jobs: [
    {
      id: "job_1",
      title: "Junior Frontend Engineer (React/Next.js)",
      companyName: "Grab",
      companyLogo: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=100",
      location: "Singapore",
      type: "Hybrid" as const,
      salaryRange: "S$4,500 - S$6,200 / month",
      experienceLevel: "Entry-Level" as const,
      description: "Join Grab's core consumer experience team in Singapore! You will contribute to high-performance customer-facing workflows, maintain our styled system component library, and write robust integration tests with Cypress.",
      requirements: [
        "1+ years of React development experience, preferably utilizing TypeScript.",
        "Excellent understanding of Tailwind CSS grid systems, modern DOM hooks, and custom state management.",
        "Familiarity with performance profiling tools, lazy loading strategies, and SEO meta setups."
      ],
      skillsRequired: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
      createdAt: "2026-06-04T12:00:00Z",
      applicantsCount: 34,
      hasApplied: false,
      status: undefined as "Applied" | "Reviewing" | "Interviewing" | "Decided" | undefined
    },
    {
      id: "job_2",
      title: "Full-Stack Software Engineer Intern",
      companyName: "Shopee",
      companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100",
      location: "Jakarta, Indonesia",
      type: "Remote" as const,
      salaryRange: "IDR 8,000,000 - IDR 12,000,000 / month",
      experienceLevel: "Entry-Level" as const,
      description: "Shopee's regional logistics product division wants dedicated web Interns! You will develop restful server routes, maintain relational PostgreSQL databases, and refine the internal analytics telemetry dashboards.",
      requirements: [
        "Present student or recent grad in Computer Science, Software Engineering or equivalent.",
        "Demonstrated project work with Node.js Express servers and React.",
        "Basic knowledge of Prisma ORM, SQL databases, and Git workflows."
      ],
      skillsRequired: ["React", "Node.js", "Express", "PostgreSQL", "Prisma"],
      createdAt: "2026-06-05T08:30:00Z",
      applicantsCount: 18,
      hasApplied: false
    },
    {
      id: "job_3",
      title: "Senior Full Stack Dev (GenAI Integrations)",
      companyName: "Notion",
      companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=100",
      location: "Remote",
      type: "Remote" as const,
      salaryRange: "$8,500 - $12,500 / month",
      experienceLevel: "Senior" as const,
      description: "Help craft the future of Notion's integrated AI workspace helper! Lead efforts to pipe LLM vectors safely, optimize multi-turn document conversations, and design robust React editing layers with smooth animations.",
      requirements: [
        "4+ years building full-scale TypeScript web applications in production.",
        "In-depth background with LLM orchestrations (Gemini API, embeddings, RAG architectures).",
        "Passionate about pixel purity, motion physics, and user flow ergonomics."
      ],
      skillsRequired: ["React", "TypeScript", "Next.js", "Gemini API", "PostgreSQL"],
      createdAt: "2026-06-03T15:45:00Z",
      applicantsCount: 42,
      hasApplied: false
    },
    {
      id: "job_4",
      title: "Assistant Cybersecurity Architect",
      companyName: "GovTech Singapore",
      companyLogo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=100",
      location: "Singapore",
      type: "Onsite" as const,
      salaryRange: "S$6,800 - S$9,200 / month",
      experienceLevel: "Mid-Weight" as const,
      description: "Help safeguard public digital platforms for Singapore's Smart Nation. Ensure robust identity policies, lead vulnerability assessments, and evaluate server configurations against modern threat actors.",
      requirements: [
        "Degree in Cybersecurity, Computer Engineering, or allied computing sciences.",
        "Familiarity with OAuth flows, JSON Web Tokens, SSL/TLS handshakes, and OWASP guides.",
        "Willingness to coordinate closely with developers on code hygiene audits."
      ],
      skillsRequired: ["Cybersecurity", "OAuth", "Node.js", "Network Defense"],
      createdAt: "2026-06-01T10:15:00Z",
      applicantsCount: 11,
      hasApplied: false
    }
  ],

  posts: [
    {
      id: "post_1",
      userId: "user_daniel_lim",
      userName: "Daniel Lim",
      userHeadline: "Staff Engineer @ Grab | Dev Evangelist",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      content: "Just migrated our restaurant tracking page in Singapore to dynamic React architecture. Reduced hydration errors to exactly zero and shaved off 250kb of initial page load bundles! The virtual DOM feels so streamlined! If you are a junior engineer seeking to learn optimization, explore standard performance profiling in Chrome DevTools first. Speed is a feature of his own! 🚀",
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
      createdAt: "2026-06-05T14:15:00Z",
      likes: ["user_sarah_tan", "user_audrey_chen"],
      repostCount: 5,
      comments: [
        {
          id: "p1c_1",
          userId: "user_sarah_tan",
          userName: "Sarah Tan",
          userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
          userHeadline: "Full-Stack Scholar & Builder",
          content: "This is a great achievement Daniel! Shaving off 250kb is extremely noticeable, especially for customers using cellular connections on the road.",
          createdAt: "2026-06-05T15:10:00Z"
        }
      ]
    },
    {
      id: "post_2",
      userId: "user_audrey_chen",
      userName: "Audrey Chen",
      userHeadline: "Lead Product Manager @ Shopee | Tech Advisory Board",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      content: "What builds a product that survives market shifts? It is not the quantity of technical specifications, but the absolute focus on structural boundaries. Solve one real pain-point perfectly. That is the Linear and Stripe way. Honored to speak to fresh engineering cohorts this morning!",
      createdAt: "2026-06-04T18:00:00Z",
      likes: ["user_daniel_lim"],
      repostCount: 12,
      comments: []
    }
  ],

  messages: [
    {
      id: "msg_1",
      senderId: "user_daniel_lim",
      recipientId: "user_sarah_tan",
      content: "Hi Sarah! Thanks for connecting. I saw your post sharing DynaCalendar last week. Excellent UI design! You selected a very elegant color scheme.",
      timestamp: "2026-06-05T11:00:00Z",
      isRead: true
    },
    {
      id: "msg_2",
      senderId: "user_sarah_tan",
      recipientId: "user_daniel_lim",
      content: "Hi Daniel! Thank you so much, that means a lot coming from you. I focused heavily on ensuring responsive layouts and sub-second drag-and-drop feedback.",
      timestamp: "2026-06-05T11:15:00Z",
      isRead: true
    },
    {
      id: "msg_3",
      senderId: "user_daniel_lim",
      recipientId: "user_sarah_tan",
      content: "Splendid. Let me know if you are open to junior contract alignments at Grab. We always appreciate developers who value refined user interactions.",
      timestamp: "2026-06-05T11:45:00Z",
      isRead: false
    }
  ],

  connections: [
    { id: "conn_1", userId: "user_daniel_lim", fullName: "Daniel Lim", headline: "Staff Engineer @ Grab", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150", mutualConnections: 14, status: "Connected" as "Connected" | "PendingIncoming" | "PendingOutgoing" | "None" },
    { id: "conn_2", userId: "user_audrey_chen", fullName: "Audrey Chen", headline: "Product Lead @ Shopee", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150", mutualConnections: 29, status: "Connected" },
    { id: "conn_3", userId: "user_chandra", fullName: "Chandra Wijaya", headline: "Data Scientist @ Shopee", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150", mutualConnections: 3, status: "PendingIncoming" },
    { id: "conn_4", userId: "user_david", fullName: "David Kim", headline: "Founder @ SpaceVenture", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150", mutualConnections: 0, status: "None" },
    { id: "conn_5", userId: "user_melissa", fullName: "Melissa Wong", headline: "UI/UX Specialist @ Canva", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150", mutualConnections: 8, status: "None" }
  ],

  notifications: [
    {
      id: "notif_1",
      type: "message" as "message" | "connection_request" | "connection_accept" | "like" | "job_match",
      senderName: "Daniel Lim",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      message: "sent you a direct message regarding possible openings.",
      createdAt: "2026-06-05T11:45:00Z",
      isRead: false
    },
    {
      id: "notif_2",
      type: "connection_request" as const,
      senderName: "Chandra Wijaya",
      senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
      message: "invited you to connect.",
      createdAt: "2026-06-05T09:12:00Z",
      isRead: false
    },
    {
      id: "notif_3",
      type: "like" as const,
      senderName: "Audrey Chen",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      message: "liked your post about Project PixelBoard.",
      targetId: "post_1",
      createdAt: "2026-06-04T19:30:00Z",
      isRead: true
    }
  ]
};

// ==========================================
// PRISMA SCHEMA & ERD DEFINITIONS (INTERACTIVE READ)
// ==========================================

const prismaSchemaCode = `// This is your Prisma schema file.
// Learn more in the docs: https://pris.ly/d/prisma-schema

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id               String       @id @default(uuid())
  email            String       @unique
  fullName         String
  headline         String
  about            String?
  location         String?
  avatar           String?
  coverBanner      String?
  skills           String[]     @default([])
  languages        String[]     @default([])
  isPremium        Boolean      @default(false)
  githubUsername   String?
  profileStrength  Int          @default(10)
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  // Connections
  connectionsSent     Connection[] @relation("SentConnections")
  connectionsReceived Connection[] @relation("ReceivedConnections")

  // Social feed
  posts            Post[]
  comments         Comment[]
  postLikes        PostLike[]

  // Messages
  messagesSent     Message[]    @relation("SenderMessages")
  messagesReceived Message[]    @relation("RecipientMessages")

  // Portfolio
  portfolio        Portfolio[]

  // Professional Stats
  education        Education[]
  experience       Experience[]
  applications     JobApplication[]
  notifications    Notification[]
}

model Education {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  school       String
  degree       String
  fieldOfStudy String
  startYear    String
  endYear      String
}

model Experience {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  company     String
  role        String
  location    String
  startDate   String
  endDate     String
  description String
}

model Portfolio {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String
  description String
  techStack   String[]
  imageUrl    String
  liveUrl     String?
  githubUrl   String?
  status      String   @default("Completed")
}

model Connection {
  id          String   @id @default(uuid())
  senderId    String
  sender      User     @relation("SentConnections", fields: [senderId], references: [id], onDelete: Cascade)
  receiverId  String
  receiver    User     @relation("ReceivedConnections", fields: [receiverId], references: [id], onDelete: Cascade)
  status      String   @default("PENDING") // PENDING, ACCEPTED, REJECTED
  createdAt   DateTime @default(now())

  @@unique([senderId, receiverId])
}

model Post {
  id          String     @id @default(uuid())
  userId      String
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  content     String
  imageUrl    String?
  videoUrl    String?
  repostCount Int        @default(0)
  createdAt   DateTime   @default(now())
  comments    Comment[]
  likes       PostLike[]
}

model PostLike {
  id        String   @id @default(uuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([postId, userId])
}

model Comment {
  id        String   @id @default(uuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  content   String
  createdAt DateTime @default(now())
}

model Message {
  id          String   @id @default(uuid())
  senderId    String
  sender      User     @relation("SenderMessages", fields: [senderId], references: [id], onDelete: Cascade)
  recipientId String
  recipient   User     @relation("RecipientMessages", fields: [recipientId], references: [id], onDelete: Cascade)
  content     String
  isRead      Boolean  @default(false)
  timestamp   DateTime @default(now())
}

model Company {
  id          String   @id @default(uuid())
  name        String   @unique
  logo        String
  coverBanner String
  about       String
  website     String
  industry    String
  employeeCount String
  locations   String[]
  jobs        Job[]
}

model Job {
  id             String           @id @default(uuid())
  companyId      String
  company        Company          @relation(fields: [companyId], references: [id], onDelete: Cascade)
  title          String
  location       String
  type           String           @default("Onsite") // Onsite, Hybrid, Remote
  salaryRange    String
  experienceLevel String          @default("Entry-Level") // Entry-Level, Mid-Weight, Senior
  description    String
  requirements   String[]
  skillsRequired String[]
  createdAt      DateTime         @default(now())
  applications   JobApplication[]
}

model JobApplication {
  id        String   @id @default(uuid())
  jobId     String
  job       Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  status    String   @default("APPLIED") // APPLIED, REVIEWING, INTERVIEWING, DECIDED
  createdAt DateTime @default(now())

  @@unique([jobId, userId])
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String
  senderName String
  senderAvatar String
  message   String
  targetId  String?
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}`;

// ==========================================
// API REST ENDPOINTS
// ==========================================

// Auth and User Profile Routes
app.get("/api/profile", (req, res) => {
  res.json(db.currentUser);
});

app.post("/api/profile/update", (req, res) => {
  db.currentUser = { ...db.currentUser, ...req.body };
  res.json({ success: true, user: db.currentUser });
});

app.post("/api/profile/skills/add", (req, res) => {
  const { skill } = req.body;
  if (skill && !db.currentUser.skills.includes(skill)) {
    db.currentUser.skills.push(skill);
  }
  res.json({ success: true, skills: db.currentUser.skills });
});

app.post("/api/profile/skills/remove", (req, res) => {
  const { skill } = req.body;
  db.currentUser.skills = db.currentUser.skills.filter(s => s !== skill);
  res.json({ success: true, skills: db.currentUser.skills });
});

// Social Feed Routes
app.get("/api/posts", (req, res) => {
  // Sort posts by date descending
  const sorted = [...db.posts].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(sorted);
});

app.post("/api/posts/create", (req, res) => {
  const { content, imageUrl } = req.body;
  const newPost = {
    id: `post_${Date.now()}`,
    userId: db.currentUser.id,
    userName: db.currentUser.fullName,
    userHeadline: db.currentUser.headline,
    userAvatar: db.currentUser.avatar,
    content,
    imageUrl: imageUrl || undefined,
    createdAt: new Date().toISOString(),
    likes: [],
    repostCount: 0,
    comments: []
  };
  db.posts.unshift(newPost);
  res.json({ success: true, post: newPost });
});

app.post("/api/posts/:id/like", (req, res) => {
  const { id } = req.params;
  const post = db.posts.find(p => p.id === id);
  if (post) {
    const isLiked = post.likes.includes(db.currentUser.id);
    if (isLiked) {
      post.likes = post.likes.filter(uid => uid !== db.currentUser.id);
    } else {
      post.likes.push(db.currentUser.id);
    }
    return res.json({ success: true, likes: post.likes });
  }
  res.status(404).json({ error: "Post not found" });
});

app.post("/api/posts/:id/comment", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const post = db.posts.find(p => p.id === id);
  if (post && content) {
    const newComment = {
      id: `comment_${Date.now()}`,
      userId: db.currentUser.id,
      userName: db.currentUser.fullName,
      userAvatar: db.currentUser.avatar,
      userHeadline: db.currentUser.headline,
      content,
      createdAt: new Date().toISOString()
    };
    post.comments.push(newComment);
    return res.json({ success: true, comment: newComment, comments: post.comments });
  }
  res.status(404).json({ error: "Post not found or content vacant" });
});

// Professional Connections/Networking Routes
app.get("/api/connections", (req, res) => {
  res.json(db.connections);
});

app.post("/api/connections/:id/action", (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'connect' (outgoing), 'accept' (incoming), 'disconnect', 'reject'
  const conn = db.connections.find(c => c.id === id);
  if (conn) {
    if (action === 'connect') {
      conn.status = 'PendingOutgoing';
    } else if (action === 'accept') {
      conn.status = 'Connected';
      db.currentUser.connectionsCount += 1;
      // Add notification for confirmation
      db.notifications.unshift({
        id: `notif_${Date.now()}`,
        type: 'connection_accept',
        senderName: conn.fullName,
        senderAvatar: conn.avatar,
        message: "accepted your connection request.",
        createdAt: new Date().toISOString(),
        isRead: false
      });
    } else if (action === 'reject' || action === 'disconnect') {
      if (conn.status === 'Connected') {
        db.currentUser.connectionsCount = Math.max(0, db.currentUser.connectionsCount - 1);
      }
      conn.status = 'None';
    }
    return res.json({ success: true, connection: conn });
  }
  res.status(404).json({ error: "Contact not found" });
});

// Job Board Portal Routes
app.get("/api/jobs", (req, res) => {
  res.json(db.jobs);
});

app.post("/api/jobs/:id/apply", (req, res) => {
  const { id } = req.params;
  const job = db.jobs.find(j => j.id === id);
  if (job) {
    job.hasApplied = true;
    job.applicantsCount += 1;
    job.status = 'Applied';
    return res.json({ success: true, job });
  }
  res.status(404).json({ error: "Job opening not found" });
});

// Direct Messages Chat Routes
app.get("/api/messages", (req, res) => {
  res.json(db.messages);
});

app.post("/api/messages/send", (req, res) => {
  const { recipientId, content, imageUrl, fileName } = req.body;
  const newMsg = {
    id: `msg_${Date.now()}`,
    senderId: db.currentUser.id,
    recipientId,
    content,
    imageUrl: imageUrl || undefined,
    fileName: fileName || undefined,
    timestamp: new Date().toISOString(),
    isRead: false
  };
  db.messages.push(newMsg);

  // Auto-respond simulation if messaging a contact to provide high-fidelity interactive chat feeling!
  if (recipientId === 'user_daniel_lim') {
    setTimeout(() => {
      const respMsg = {
        id: `msg_auto_${Date.now()}`,
        senderId: 'user_daniel_lim',
        recipientId: db.currentUser.id,
        content: `Hi ${db.currentUser.fullName}! Thanks for the message. I am currently reviewing our engineering roadmap. Let's touch base on Monday! Meanwhile, have you tried optimizing your CV with our CareerVerse AI Career Coach? It has an incredible ATS scanner.`,
        timestamp: new Date(Date.now() + 1500).toISOString(),
        isRead: false
      };
      db.messages.push(respMsg);
      db.notifications.unshift({
        id: `notif_auto_${Date.now()}`,
        type: 'message',
        senderName: "Daniel Lim",
        senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        message: "sent you a reply regarding your inquiry.",
        createdAt: new Date().toISOString(),
        isRead: false
      });
    }, 4000);
  }

  res.json({ success: true, message: newMsg });
});

// Live Notifications
app.get("/api/notifications", (req, res) => {
  res.json(db.notifications);
});

app.post("/api/notifications/read-all", (req, res) => {
  db.notifications.forEach(n => n.isRead = true);
  res.json({ success: true });
});

// Interactive Prisma Schema Developer Route
app.get("/api/dev/prisma", (req, res) => {
  res.json({ schema: prismaSchemaCode });
});

// ==========================================
// GEMINI INTELLIGENT CAREER SERVICES
// ==========================================

// 1. Resume Reviewer & ATS Score Analyzer
app.post("/api/ai/resume-review", async (req, res) => {
  const { resumeText } = req.body;
  const textToAnalyze = resumeText || db.currentUser.resumeText || "";
  
  if (!textToAnalyze.trim()) {
    return res.status(400).json({ error: "Please enter or upload some resume text to review." });
  }

  const ai = getGenAI();
  if (!ai) {
    // Elegant system recommendation fallback during offline/missing key scenarios
    const lengthFactor = Math.min(15, Math.floor(textToAnalyze.length / 50));
    return res.json({
      atsScore: 68 + lengthFactor,
      missingSkills: ["Next.js (App Router)", "CI/CD Orchestration", "SEO Optimization Core Web Vitals"],
      weakSections: ["About Me section needs more concrete performance numbers.", "Work achievements lack clear quantitative metrics like revenue or speed improvements."],
      suggestions: [
        "Include impact verbs like ' Spearheaded', 'Optimized', and 'De-bottlenecked'.",
        "Add measurable accomplishments instead of vague descriptions (e.g. 'Improved speed by 14%').",
        "Introduce modern cloud infrastructure listings such as Docker, AWS cloud, or serverless routing."
      ]
    });
  }

  try {
    const prompt = `You are an elite silicon valley executive recruiter and ATS algorithm architect. 
Analyze the following resume text and provide a comprehensive structured feedback as JSON.
Resume Content:
"""
${textToAnalyze}
"""

Return EXCLUSIVELY a JSON object adhering exactly to this TypeScript schema:
{
  "atsScore": number (out of 100),
  "missingSkills": string[],
  "weakSections": string[],
  "suggestions": string[]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.INTEGER, description: "A realistic ATS match score between 0 and 100 based on standard tech roles." },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific technical skills or tools missing for modern stacks." },
            weakSections: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Sections needing quantitative improvement." },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable concrete items to boost impact." }
          },
          required: ["atsScore", "missingSkills", "weakSections", "suggestions"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);

  } catch (error: any) {
    console.error("Gemini ATS review failed:", error);
    res.status(500).json({ error: "AI Review failed momentarily, utilizing sandbox engine defaults.", details: error.message });
  }
});

// 2. Profile Optimizer (Headlines, Bio and Skill lists Generator)
app.post("/api/ai/profile-optimize", async (req, res) => {
  const { currentHeadline, currentAbout, currentSkills } = req.body;
  
  const ai = getGenAI();
  if (!ai) {
    return res.json({
      optimizedHeadline: "Full-Stack Software Engineer | React, TypeScript & Node.js Specialized | Smart Web Automation Architect",
      optimizedBio: "Hi, I am Sarah! A self-driven Computer Science graduate from NUS who designs performant web apps. I engineered React portals for 10M+ users at Grab, optimizing Web Vitals by 14% and setting up low-latency restful servers. Committed to clean code and elegant UI interactions.",
      suggestions: ["Elevate your headline by combining role state with main impact parameters.", "Keep about section highly scannable using a bullet format for core highlights."]
    });
  }

  try {
    const prompt = `You are a world-class professional brand developer who optimizes LinkedIn profiles for maximum talent scout reach.
Optimize this student/professional profile:
Headline: "${currentHeadline}"
About: "${currentAbout}"
Skills: "${(currentSkills || []).join(", ")}"

Provide optimized variants and brands.
Return EXCLUSIVELY a JSON object with this schema:
{
  "optimizedHeadline": "string (ultra catchy, job-boosting modern headline with keywords, separators)",
  "optimizedBio": "string (impactful, warm 3-paragraph summary of values with skills, drive, ready to copy)",
  "suggestions": [string]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedHeadline: { type: Type.STRING, description: "Highly professional recruiter-optimized LinkedIn headline." },
            optimizedBio: { type: Type.STRING, description: "A high-impact, captivating brand statement for the 'About' summary." },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tips to further optimize profile visual clout." }
          },
          required: ["optimizedHeadline", "optimizedBio", "suggestions"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);

  } catch (error: any) {
    res.status(500).json({ error: "Profile optimization failed", details: error.message });
  }
});

// 3. AI Direct Career Advisor (salary expectations, learning roadmap, roadmaps)
app.post("/api/ai/career-advice", async (req, res) => {
  const { question, userProfile } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Please ask a question." });
  }

  const ai = getGenAI();
  if (!ai) {
    return res.json({
      answer: `### Modern Software Engineering Learning Path\n\nSince you are specialized in **React** and **TypeScript**, here is a recommended path:\n\n1. **Advanced CSS Layouts & Container Queries** (Refine visual polish)\n2. **System Database Performance & Indexing** (Understand Prisma queries deeply)\n3. **Modern Gemini LLM Vector Stores & RAG** (Build next-generation AI apps with LangChain/SDK)\n\n*Tip: Apply to Junior roles at Grab or Shopee soon, as they align perfectly with your technical profile! Salary expectations are around $4,500 - $6,000 SGD/mo.*`
    });
  }

  try {
    const context = userProfile ? `User Profile context: Headline: "${userProfile.headline}", Skills: "${(userProfile.skills || []).join(', ')}", Location: "${userProfile.location}".` : "";
    const prompt = `You are a warm, highly-knowledgeable tech career advisor and executive coach inspired by tech leaders.
Answer this professional career question:
Question: "${question}"
${context}

Provide a comprehensive response in markdown. Be clear, detailed, encouraging, and highly specific to tech markets (especially Singapore and Southeast Asia). Include concrete bullet points and roadmaps where applicable.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ answer: response.text });

  } catch (error: any) {
    res.status(500).json({ error: "Advisor consultation errored", details: error.message });
  }
});

// 4. AI Post Generator (Graduation, Promotion, Launch)
app.post("/api/ai/generate-post", async (req, res) => {
  const { topic, contextInfo } = req.body; // topic: 'graduation' | 'promotion' | 'new_job' | 'project'

  const ai = getGenAI();
  if (!ai) {
    let mockPost = "";
    if (topic === 'graduation') {
      mockPost = "🎓 Thrilled to announce that I have officially graduated with a Bachelor's in Computer Science from NUS! \n\nFour years of intense algorithms, late-night debugging, and building real connections. Huge thanks to my mentors, peers, and family. Ready to tackle the next chapter in Full-Stack Engineering! Let's build! 🚀\n\n#NUS #Graduation #TechGraduate #SoftwareEngineer";
    } else if (topic === 'project') {
      mockPost = "🚀 Proud to launch CareerVerse - a modern professional networking and AI career advisor platform!\n\nI engineered this with React 19, TypeScript, and live Gemini ATS matching. It helps fresh talents and grads audit resumes, get instant learning roadmaps, and connect with lead recruiters. \n\nCheck out the demo: dynacalendar.example.com\n\n#ReactDeveloper #PortfolioShowcase #AISaaS #WebDevelopment";
    } else {
      mockPost = "💼 I’m excited to share that I’m starting a new position as a Software Engineer! \n\nLooking forward to collaborating with an incredible team, shipping refined user experiences, and learning every day. Grateful for everyone who supported me throughout this journey! ✨\n\n#NewBeginning #CareerGrowth #SoftwareEngineer #TechJobs";
    }
    return res.json({ post: mockPost });
  }

  try {
    const prompt = `You are an elite tech personal branding expert. Generate an engaging, authentic, and perfectly spaced professional post for LinkedIn.
Topic Type: "${topic}"
Topic Details/Context: "${contextInfo || 'No extra context provided. Keep it highly inspiring, authentic, and professionally curated.'}"

Rules:
- High readability. Use spacious newline separators.
- Start with a strong Hook.
- Keep the tone humble but genuinely exciting. 
- Use 3-5 relevant emojis maximum (no emoji slop).
- End with 4-5 high-impact hashtags.
- Do NOT output any system text or wrapping blocks. Just return the raw generated post.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ post: response.text });

  } catch (error: any) {
    res.status(500).json({ error: "Post generation failed", details: error.message });
  }
});

// 5. GitHub Repository Showcase Simulator (Interactive Dev-Mode)
app.get("/api/github/:username", async (req, res) => {
  const { username } = req.params;
  
  // Real or mock fallback to make the applet interactive immediately
  // Mock excellent details representing actual software engineer repositories
  res.json({
    username,
    profileUrl: `https://github.com/${username}`,
    totalStars: 42,
    totalForks: 14,
    languages: [
      { name: "TypeScript", percentage: 55, color: "#3178c6" },
      { name: "JSX / React", percentage: 25, color: "#61dafb" },
      { name: "CSS / Tailwind", percentage: 15, color: "#38bdf8" },
      { name: "Shell", percentage: 5, color: "#89e051" }
    ],
    repositories: [
      {
        name: "careerverse-platform",
        description: "AI-Powered Career & Professional Networking space for Gen-Z builders in Southeast Asia.",
        stars: 12,
        forks: 3,
        primaryLanguage: "TypeScript",
        url: `https://github.com/${username}/careerverse-platform`
      },
      {
        name: "react-frictionless-carousel",
        description: "An ultra-smooth hardware-accelerated carousel slider built in standard React 19.",
        stars: 18,
        forks: 5,
        primaryLanguage: "TypeScript",
        url: `https://github.com/${username}/react-frictionless-carousel`
      },
      {
        name: "node-gemini-stream-proxy",
        description: "A simple microservice wrapping server-sent-events for low-latency LLM stream outputs.",
        stars: 12,
        forks: 6,
        primaryLanguage: "TypeScript",
        url: `https://github.com/${username}/node-gemini-stream-proxy`
      }
    ],
    // Activity graph simulation dataset (last 12 weeks of commits)
    activityGrid: Array.from({ length: 52 }, (_, i) => ({
      week: i,
      commits: Math.floor(Math.random() * 8)
    }))
  });
});

// Serve Vite Assets & Handle SPA Fallback
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets from dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CareerVerse Server listening on http://localhost:${PORT}`);
  });
}

startServer();
