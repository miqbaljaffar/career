import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');

  // 1. Clean existing records to avoid conflicts during seed runs
  await prisma.notification.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.postLike.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.connection.deleteMany({});
  await prisma.jobApplication.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.portfolio.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.education.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Cleaned old records. Seeding new database entries...');

  // 2. Create Users
  const sarah = await prisma.user.create({
    data: {
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
      githubUsername: "sarahtan",
      isPremium: false,
      profileStrength: 85,
      certifications: [
        "AWS Certified Cloud Practitioner",
        "Google UX Design Certificate"
      ],
      achievements: [
        "1st Place Winner - NUS Hack & Roll Hackathon 2024",
        "Dean's List Honoree (Academic Year 2023/2024)"
      ],
      socials: {
        github: "sarahtan",
        linkedin: "sarah-tan-tech",
        twitter: "sarah_codes",
        website: "https://sarahtan.dev"
      }
    }
  });

  const daniel = await prisma.user.create({
    data: {
      id: "user_daniel_lim",
      fullName: "Daniel Lim",
      email: "daniel.lim@grab.careers",
      headline: "Staff Engineer @ Grab | Dev Evangelist",
      location: "Singapore",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      coverBanner: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200",
      skills: ["React", "TypeScript", "Node.js", "Webpack", "Performance Optimization"],
      languages: ["English"],
      profileStrength: 95,
      isPremium: true
    }
  });

  const audrey = await prisma.user.create({
    data: {
      id: "user_audrey_chen",
      fullName: "Audrey Chen",
      email: "audrey.chen@shopee.sg",
      headline: "Lead Product Manager @ Shopee | Tech Advisory Board",
      location: "Singapore",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      coverBanner: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      skills: ["Product Strategy", "Growth Planning", "Agile Roadmap"],
      languages: ["English", "Mandarin"],
      profileStrength: 90,
      isPremium: false
    }
  });

  const chandra = await prisma.user.create({
    data: {
      id: "user_chandra",
      fullName: "Chandra Wijaya",
      email: "chandra.w@shopee.sg",
      headline: "Data Scientist @ Shopee",
      location: "Jakarta, Indonesia",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
      skills: ["Python", "Machine Learning", "SQL"],
      languages: ["Indonesian", "English"]
    }
  });

  const david = await prisma.user.create({
    data: {
      id: "user_david",
      fullName: "David Kim",
      email: "david.kim@spaceventure.co",
      headline: "Founder @ SpaceVenture",
      location: "Remote",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
      skills: ["Startups", "Venture Capital", "Product Design"]
    }
  });

  const melissa = await prisma.user.create({
    data: {
      id: "user_melissa",
      fullName: "Melissa Wong",
      email: "melissa.wong@canva.com",
      headline: "UI/UX Specialist @ Canva",
      location: "Sydney, Australia",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
      skills: ["Figma", "UI Design", "Prototyping"]
    }
  });

  // 3. User Sub-attributes (Education, Experience, Portfolio for Sarah)
  await prisma.education.create({
    data: {
      id: "edu_1",
      userId: sarah.id,
      school: "National University of Singapore",
      degree: "Bachelor of Computing",
      fieldOfStudy: "Computer Science",
      startYear: "2021",
      endYear: "2025"
    }
  });

  await prisma.experience.createMany({
    data: [
      {
        id: "exp_1",
        userId: sarah.id,
        company: "Grab",
        role: "Frontend Developer Intern",
        location: "Singapore (Hybrid)",
        startDate: "May 2024",
        endDate: "Nov 2024",
        description: "Assisted in building highly reusable React components for the GrabMerchant portal. Optimized Core Web Vitals resulting in 14% lower initial paint times. Worked with UI/UX designers to implement pixel-perfect Figma screens."
      },
      {
        id: "exp_2",
        userId: sarah.id,
        company: "NUS Hacker Club",
        role: "Lead Full-Stack Webmaster",
        location: "Singapore",
        startDate: "Jan 2023",
        endDate: "Present",
        description: "Engineered and maintained the annual NUS hackathon registration platform. Set up serverless functions, database queries and responsive landing pages."
      }
    ]
  });

  await prisma.portfolio.createMany({
    data: [
      {
        id: "port_1",
        userId: sarah.id,
        title: "DynaCalendar - Event Scheduler",
        description: "An intuitive collaborative calendar tool featuring sub-second dragging actions, recurring patterns, and high contrast offline state.",
        techStack: ["React", "TypeScript", "Tailwind CSS", "LocalForage"],
        imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=400",
        liveUrl: "https://dynacalendar.example.com",
        githubUrl: "https://github.com/sarahtan/dynacalendar",
        status: "Completed"
      },
      {
        id: "port_2",
        userId: sarah.id,
        title: "PixelBoard - Real-time Collaborative Board",
        description: "A server-authoritative graphics whiteboard using canvas rendering where 50+ engineers can sketch, brainstorm, and create user wireframes simultaneously.",
        techStack: ["React", "HTML5 Canvas", "WebSockets", "Node.js"],
        imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400",
        liveUrl: "https://pixelboard.example.com",
        githubUrl: "https://github.com/sarahtan/pixelboard",
        status: "Completed"
      }
    ]
  });

  // 4. Create Connections
  await prisma.connection.createMany({
    data: [
      { senderId: daniel.id, receiverId: sarah.id, status: "ACCEPTED" },
      { senderId: audrey.id, receiverId: sarah.id, status: "ACCEPTED" },
      { senderId: chandra.id, receiverId: sarah.id, status: "PENDING" }
    ]
  });

  // 5. Create Companies
  const compGrab = await prisma.company.create({
    data: {
      id: "comp_grab",
      name: "Grab",
      logo: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=100",
      coverBanner: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200",
      about: "Grab is Southeast Asia's leading superapp, providing daily services that matter most to consumers like food delivery, ride-hailing, and digital financial payments. Headquartered in Singapore.",
      website: "https://grab.careers",
      industry: "Technology / Superapp",
      employeeCount: "10,000+ employees",
      locations: ["Singapore", "Kuala Lumpur", "Jakarta", "Manila", "Bangkok"]
    }
  });

  const compShopee = await prisma.company.create({
    data: {
      id: "comp_shopee",
      name: "Shopee",
      logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100",
      coverBanner: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      about: "Shopee is the leading e-commerce platform in Southeast Asia and Taiwan. It is a platform tailored for the region, providing customers with an easy, secure and fast online shopping experience.",
      website: "https://careers.shopee.sg",
      industry: "E-Commerce",
      employeeCount: "8,000+ employees",
      locations: ["Singapore", "Jakarta", "Ho Chi Minh City", "Bangkok"]
    }
  });

  const compGovtech = await prisma.company.create({
    data: {
      id: "comp_govtech",
      name: "GovTech Singapore",
      logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=100",
      coverBanner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
      about: "The Government Technology Agency of Singapore (GovTech) designs and builds key digital public infrastructure services ensuring a Smart Nation that empowers secure, delightful lives.",
      website: "https://www.tech.gov.sg",
      industry: "Public Sector / Technology",
      employeeCount: "3,000+ employees",
      locations: ["Singapore"]
    }
  });

  const compNotion = await prisma.company.create({
    data: {
      id: "comp_notion",
      name: "Notion",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=100",
      coverBanner: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
      about: "A new tool that blends your everyday work apps into one. It's the all-in-one workspace for you and your team to collaborate, take notes, compile wikis, and organize roadmap charts.",
      website: "https://notion.so/careers",
      industry: "Productivity Software",
      employeeCount: "500+ employees",
      locations: ["San Francisco", "Tokyo", "Dublin", "Remote"]
    }
  });

  // 6. Create Jobs
  await prisma.job.create({
    data: {
      id: "job_1",
      companyId: compGrab.id,
      title: "Junior Frontend Engineer (React/Next.js)",
      location: "Singapore",
      type: "Hybrid",
      salaryRange: "S$4,500 - S$6,200 / month",
      experienceLevel: "Entry-Level",
      description: "Join Grab's core consumer experience team in Singapore! You will contribute to high-performance customer-facing workflows, maintain our styled system component library, and write robust integration tests with Cypress.",
      requirements: [
        "1+ years of React development experience, preferably utilizing TypeScript.",
        "Excellent understanding of Tailwind CSS grid systems, modern DOM hooks, and custom state management.",
        "Familiarity with performance profiling tools, lazy loading strategies, and SEO meta setups."
      ],
      skillsRequired: ["React", "TypeScript", "Tailwind CSS", "Next.js"]
    }
  });

  await prisma.job.create({
    data: {
      id: "job_2",
      companyId: compShopee.id,
      title: "Full-Stack Software Engineer Intern",
      location: "Jakarta, Indonesia",
      type: "Remote",
      salaryRange: "IDR 8,000,000 - IDR 12,000,000 / month",
      experienceLevel: "Entry-Level",
      description: "Shopee's regional logistics product division wants dedicated web Interns! You will develop restful server routes, maintain relational PostgreSQL databases, and refine the internal analytics telemetry dashboards.",
      requirements: [
        "Present student or recent grad in Computer Science, Software Engineering or equivalent.",
        "Demonstrated project work with Node.js Express servers and React.",
        "Basic knowledge of Prisma ORM, SQL databases, and Git workflows."
      ],
      skillsRequired: ["React", "Node.js", "Express", "PostgreSQL", "Prisma"]
    }
  });

  await prisma.job.create({
    data: {
      id: "job_3",
      companyId: compNotion.id,
      title: "Senior Full Stack Dev (GenAI Integrations)",
      location: "Remote",
      type: "Remote",
      salaryRange: "$8,500 - $12,500 / month",
      experienceLevel: "Senior",
      description: "Help craft the future of Notion's integrated AI workspace helper! Lead efforts to pipe LLM vectors safely, optimize multi-turn document conversations, and design robust React editing layers with smooth animations.",
      requirements: [
        "4+ years building full-scale TypeScript web applications in production.",
        "In-depth background with LLM orchestrations (Gemini API, embeddings, RAG architectures).",
        "Passionate about pixel purity, motion physics, and user flow ergonomics."
      ],
      skillsRequired: ["React", "TypeScript", "Next.js", "Gemini API", "PostgreSQL"]
    }
  });

  await prisma.job.create({
    data: {
      id: "job_4",
      companyId: compGovtech.id,
      title: "Assistant Cybersecurity Architect",
      location: "Singapore",
      type: "Onsite",
      salaryRange: "S$6,800 - S$9,200 / month",
      experienceLevel: "Mid-Weight",
      description: "Help safeguard public digital platforms for Singapore's Smart Nation. Ensure robust identity policies, lead vulnerability assessments, and evaluate server configurations against modern threat actors.",
      requirements: [
        "Degree in Cybersecurity, Computer Engineering, or allied computing sciences.",
        "Familiarity with OAuth flows, JSON Web Tokens, SSL/TLS handshakes, and OWASP guides.",
        "Willingness to coordinate closely with developers on code hygiene audits."
      ],
      skillsRequired: ["Cybersecurity", "OAuth", "Node.js", "Network Defense"]
    }
  });

  // 7. Create Posts
  const post1 = await prisma.post.create({
    data: {
      id: "post_1",
      userId: daniel.id,
      content: "Just migrated our restaurant tracking page in Singapore to dynamic React architecture. Reduced hydration errors to exactly zero and shaved off 250kb of initial page load bundles! The virtual DOM feels so streamlined! If you are a junior engineer seeking to learn optimization, explore standard performance profiling in Chrome DevTools first. Speed is a feature of his own! 🚀",
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
      createdAt: new Date("2026-06-05T14:15:00Z")
    }
  });

  const post2 = await prisma.post.create({
    data: {
      id: "post_2",
      userId: audrey.id,
      content: "What builds a product that survives market shifts? It is not the quantity of technical specifications, but the absolute focus on structural boundaries. Solve one real pain-point perfectly. That is the Linear and Stripe way. Honored to speak to fresh engineering cohorts this morning!",
      createdAt: new Date("2026-06-04T18:00:00Z")
    }
  });

  // 8. Create Comments & Likes
  await prisma.comment.create({
    data: {
      id: "p1c_1",
      postId: post1.id,
      userId: sarah.id,
      content: "This is a great achievement Daniel! Shaving off 250kb is extremely noticeable, especially for customers using cellular connections on the road.",
      createdAt: new Date("2026-06-05T15:10:00Z")
    }
  });

  await prisma.postLike.createMany({
    data: [
      { postId: post1.id, userId: sarah.id },
      { postId: post1.id, userId: audrey.id },
      { postId: post2.id, userId: daniel.id }
    ]
  });

  // 9. Create Messages
  await prisma.message.createMany({
    data: [
      {
        id: "msg_1",
        senderId: daniel.id,
        recipientId: sarah.id,
        content: "Hi Sarah! Thanks for connecting. I saw your post sharing DynaCalendar last week. Excellent UI design! You selected a very elegant color scheme.",
        timestamp: new Date("2026-06-05T11:00:00Z"),
        isRead: true
      },
      {
        id: "msg_2",
        senderId: sarah.id,
        recipientId: daniel.id,
        content: "Hi Daniel! Thank you so much, that means a lot coming from you. I focused heavily on ensuring responsive layouts and sub-second drag-and-drop feedback.",
        timestamp: new Date("2026-06-05T11:15:00Z"),
        isRead: true
      },
      {
        id: "msg_3",
        senderId: daniel.id,
        recipientId: sarah.id,
        content: "Splendid. Let me know if you are open to junior contract alignments at Grab. We always appreciate developers who value refined user interactions.",
        timestamp: new Date("2026-06-05T11:45:00Z"),
        isRead: false
      }
    ]
  });

  // 10. Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        id: "notif_1",
        userId: sarah.id,
        type: "message",
        senderName: "Daniel Lim",
        senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        message: "sent you a direct message regarding possible openings.",
        createdAt: new Date("2026-06-05T11:45:00Z"),
        isRead: false
      },
      {
        id: "notif_2",
        userId: sarah.id,
        type: "connection_request",
        senderName: "Chandra Wijaya",
        senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
        message: "invited you to connect.",
        createdAt: new Date("2026-06-05T09:12:00Z"),
        isRead: false
      },
      {
        id: "notif_3",
        userId: sarah.id,
        type: "like",
        senderName: "Audrey Chen",
        senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
        message: "liked your post about Project PixelBoard.",
        targetId: "post_1",
        createdAt: new Date("2026-06-04T19:30:00Z"),
        isRead: true
      }
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding errored:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
