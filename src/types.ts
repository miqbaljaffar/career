export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  headline: string;
  about: string;
  location: string;
  avatar: string;
  coverBanner: string;
  skills: string[];
  languages: string[];
  resumeText?: string;
  resumeFileName?: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  certifications: string[];
  achievements: string[];
  portfolio: PortfolioProject[];
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  githubUsername?: string;
  isPremium: boolean;
  profileStrength: number;
  followersCount: number;
  followingCount: number;
  connectionsCount: number;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string; // "Present" or date
  description: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  status: 'In Progress' | 'Completed' | 'Beta';
}

export interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  userHeadline: string;
  userAvatar: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
  likes: string[]; // User IDs who liked
  comments: CommentItem[];
  repostCount: number;
  isBookmarked?: boolean;
}

export interface CommentItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userHeadline: string;
  content: string;
  createdAt: string;
}

export interface JobListing {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  location: string;
  type: 'Remote' | 'Hybrid' | 'Onsite';
  salaryRange: string;
  experienceLevel: 'Entry-Level' | 'Mid-Weight' | 'Senior' | 'Lead';
  description: string;
  requirements: string[];
  skillsRequired: string[];
  createdAt: string;
  applicantsCount: number;
  hasApplied?: boolean;
  status?: 'Applied' | 'Reviewing' | 'Interviewing' | 'Decided';
}

export interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  coverBanner: string;
  about: string;
  website: string;
  industry: string;
  employeeCount: string;
  locations: string[];
  openPositionsCount: number;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
}

export interface NetworkConnection {
  id: string;
  userId: string;
  fullName: string;
  headline: string;
  avatar: string;
  mutualConnections: number;
  status: 'Connected' | 'PendingIncoming' | 'PendingOutgoing' | 'None';
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'connection_request' | 'connection_accept' | 'message' | 'job_match';
  senderName: string;
  senderAvatar: string;
  message: string;
  targetId?: string; // post ID or job ID
  createdAt: string;
  isRead: boolean;
}

export interface AIReviewResult {
  atsScore: number;
  missingSkills: string[];
  weakSections: string[];
  suggestions: string[];
  optimizedBio?: string;
  optimizedHeadline?: string;
}
