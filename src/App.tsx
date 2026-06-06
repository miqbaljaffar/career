import { useState, useEffect } from 'react';
import { 
  Sparkles, Briefcase, User, MessageSquare, Code, Database, Bell, LayoutDashboard, LogOut,
  MapPin, Globe, Award, BookOpen, Plus, Trash2, ArrowUpRight, Github, Linkedin, ShieldAlert,
  Loader2, BadgeCheck, CheckCircle2, ChevronRight, Check, Sun, Moon
} from 'lucide-react';
import { UserProfile, FeedPost, JobListing, DirectMessage, NetworkConnection, NotificationItem } from './types';

// Import modular panels
import { LandingPage } from './components/LandingPage';
import { JobPortal } from './components/JobPortal';
import { AICoach } from './components/AICoach';
import { DevMode } from './components/DevMode';
import { DatabaseVisualizer } from './components/DatabaseVisualizer';
import { SocialFeed } from './components/SocialFeed';
import { Messaging } from './components/Messaging';

export default function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'feed' | 'jobs' | 'coach' | 'dev' | 'network' | 'messages' | 'database' | 'profile'>('landing');

  // Dynamic Full-Stack states
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [connections, setConnections] = useState<NetworkConnection[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Local visuals
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('careerverse_theme');
      return saved ? saved === 'dark' : true;
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('careerverse_theme', isDarkMode ? 'dark' : 'light');
    } catch (e) {}
  }, [isDarkMode]);
  
  // Custom states for editing profile sub-items
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newLanguageInput, setNewLanguageInput] = useState('');
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [editAboutContent, setEditAboutContent] = useState('');
  const [isEditingHeadline, setIsEditingHeadline] = useState(false);
  const [editHeadlineContent, setEditHeadlineContent] = useState('');

  // Portfolio addition states
  const [showAddProject, setShowAddProject] = useState(false);
  const [pTitle, setPTitle] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pTech, setPTech] = useState('');
  const [pLive, setPLive] = useState('');
  const [pGit, setPGit] = useState('');

  // Experience addition states
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [expCompany, setExpCompany] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expLoc, setExpLoc] = useState('');
  const [expStart, setExpStart] = useState('');
  const [expEnd, setExpEnd] = useState('Present');
  const [expDesc, setExpDesc] = useState('');

  // Fetch initial system datasets on launch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [profileRes, postsRes, jobsRes, msgsRes, connsRes, notifsRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/posts'),
          fetch('/api/jobs'),
          fetch('/api/messages'),
          fetch('/api/connections'),
          fetch('/api/notifications')
        ]);

        const [profile, posts, jobs, msgs, conns, notifs] = await Promise.all([
          profileRes.json(),
          postsRes.json(),
          jobsRes.json(),
          msgsRes.json(),
          connsRes.json(),
          notifsRes.json()
        ]);

        setUser(profile);
        setEditAboutContent(profile.about);
        setEditHeadlineContent(profile.headline);
        setPosts(posts);
        setJobs(jobs);
        setMessages(msgs);
        setConnections(conns);
        setNotifications(notifs);
      } catch (err) {
        console.error("Failed fetching live REST components:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Set up rapid poll simulation to check new incoming chat messages & notifications
    const interval = setInterval(async () => {
      try {
        const msgsRes = await fetch('/api/messages');
        const msgs = await msgsRes.json();
        setMessages(msgs);

        const notifsRes = await fetch('/api/notifications');
        const notifs = await notifsRes.json();
        setNotifications(notifs);
        
        const jobsRes = await fetch('/api/jobs');
        const updatedJobs = await jobsRes.json();
        setJobs(updatedJobs);
      } catch (err) {
        // fail silently
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 3000);
  };

  // Sync profile edits back to full-stack Express Memory DB
  const handleSyncProfile = async (updatedFields: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      }
    } catch (err) {
      // fallback local update
      setUser({ ...user, ...updatedFields });
    }
  };

  // Handle new post share
  const handleCreatePost = async (content: string, imageUrl?: string) => {
    try {
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, imageUrl })
      });
      const data = await res.json();
      if (data.success) {
        setPosts([data.post, ...posts]);
        triggerToast("Post successfully shared on global feed!");
      }
    } catch (err) {
      triggerToast("Error sharing post.");
    }
  };

  // Handle post like
  const handleLikePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.map(p => p.id === postId ? { ...p, likes: data.likes } : p));
      }
    } catch (err) {
      // fail silently
    }
  };

  // Handle post comment
  const handleAddComment = async (postId: string, content: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.map(p => p.id === postId ? { ...p, comments: data.comments } : p));
        triggerToast("Comment registered.");
      }
    } catch (err) {
      // fail silently
    }
  };

  // Connections actions: connect, accept, reject
  const handleConnectionAction = async (id: string, action: 'connect' | 'accept' | 'disconnect' | 'reject') => {
    try {
      const res = await fetch(`/api/connections/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        // update connections list
        setConnections(connections.map(c => c.id === id ? data.connection : c));
        
        // If connecting/accepting, adjust connection stats locally
        if (action === 'accept' && user) {
          setUser({ ...user, connectionsCount: user.connectionsCount + 1 });
          triggerToast("Connection approved! You can now exchange direct pitches.");
        } else if (action === 'connect') {
          triggerToast("Connection request sent.");
        } else if (action === 'disconnect' && user) {
          setUser({ ...user, connectionsCount: Math.max(0, user.connectionsCount - 1) });
        }
      }
    } catch (e) {
      triggerToast("Action failed.");
    }
  };

  // Job quick applying
  const handleApplyJob = async (jobId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setJobs(jobs.map(j => j.id === jobId ? data.job : j));
        triggerToast("Pitch submitted! Recruiters have been notified.");
      }
    } catch (err) {
      triggerToast("Failed filing application.");
    }
  };

  const handlePostJob = async (details: any) => {
    try {
      // Since it's a full-stack demo, we'll append it directly to layout jobs list
      const mockNewJob = {
        id: `job_${Date.now()}`,
        ...details,
        createdAt: new Date().toISOString(),
        applicantsCount: 0,
        hasApplied: false
      };
      setJobs([mockNewJob, ...jobs]);
      triggerToast("Startup position successfully posted online!");
    } catch (e) {
      triggerToast("Failed publishing position.");
    }
  };

  // Message sending
  const handleSendMessage = async (recipientId: string, content: string, imageUrl?: string, fileName?: string) => {
    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId, content, imageUrl, fileName })
      });
      const data = await res.json();
      if (data.success) {
        setMessages([...messages, data.message]);
      }
    } catch (err) {
      triggerToast("Failed delivering message.");
    }
  };

  const clearNotifications = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setShowNotificationDrawer(false);
    } catch (e) {}
  };

  // Interactive profile edits
  const handleAddSkill = async () => {
    if (!newSkillInput.trim() || !user) return;
    try {
      const res = await fetch('/api/profile/skills/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill: newSkillInput.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, skills: data.skills, profileStrength: Math.min(100, user.profileStrength + 3) });
        setNewSkillInput('');
        triggerToast("Skill tag registered!");
      }
    } catch (e) {}
  };

  const handleRemoveSkill = async (skill: string) => {
    if (!user) return;
    try {
      const res = await fetch('/api/profile/skills/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill })
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, skills: data.skills });
      }
    } catch (e) {}
  };

  const handleAddLanguage = () => {
    if (!newLanguageInput.trim() || !user) return;
    const upd = [...user.languages, newLanguageInput.trim()];
    handleSyncProfile({ languages: upd });
    setNewLanguageInput('');
    triggerToast("Language listing indexed.");
  };

  const handleUpdateAbout = () => {
    handleSyncProfile({ about: editAboutContent });
    setIsEditingAbout(false);
    triggerToast("About Bio details updated!");
  };

  const handleUpdateHeadline = () => {
    handleSyncProfile({ headline: editHeadlineContent });
    setIsEditingHeadline(false);
    triggerToast("Headline metrics adjusted!");
  };

  // Project Adder
  const handleAddProject = () => {
    if (!pTitle || !pDesc || !user) return;
    const techArray = pTech.split(',').map(t => t.trim()).filter(Boolean);
    const newProject = {
      id: `port_${Date.now()}`,
      title: pTitle,
      description: pDesc,
      techStack: techArray.length > 0 ? techArray : ["React"],
      imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400",
      liveUrl: pLive || undefined,
      githubUrl: pGit || undefined,
      status: "Completed" as const
    };

    const upd = [...user.portfolio, newProject];
    handleSyncProfile({ portfolio: upd, profileStrength: Math.min(100, user.profileStrength + 5) });
    
    // reset states
    setPTitle('');
    setPDesc('');
    setPTech('');
    setPLive('');
    setPGit('');
    setShowAddProject(false);
    triggerToast("Showcase project integrated into your visual bento grid!");
  };

  // Experience Adder
  const handleAddExperience = () => {
    if (!expCompany || !expRole || !user) return;
    const newExp = {
      id: `exp_${Date.now()}`,
      company: expCompany,
      role: expRole,
      location: expLoc || "Remote",
      startDate: expStart,
      endDate: expEnd,
      description: expDesc
    };

    const upd = [...user.experience, newExp];
    handleSyncProfile({ experience: upd, profileStrength: Math.min(100, user.profileStrength + 5) });

    setExpCompany('');
    setExpRole('');
    setExpLoc('');
    setExpStart('');
    setExpEnd('Present');
    setExpDesc('');
    setShowAddExperience(false);
    triggerToast("Work experience listed.");
  };

  // Upgrade premium simulator
  const handleUpgradePremium = () => {
    if (!user) return;
    setUser({ ...user, isPremium: true });
    // Sync to backend DB too
    handleSyncProfile({ isPremium: true });
    triggerToast("🎉 Congratulations! Welcome to CareerVerse Premium! Unlimited AI & Advanced Recruit metrics enabled.");
  };

  // Loading wrapper
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-[#ededed] font-sans">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <span className="text-xs uppercase tracking-widest font-semibold text-gray-400">Setting up CareerVerse Server Environment...</span>
      </div>
    );
  }

  // Pure static Landing page view if selected
  if (activeTab === 'landing') {
    return <LandingPage onStartApp={() => setActiveTab('feed')} />;
  }

  return (
    <div className={`min-h-screen bg-sleek-main text-sleek-main flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-300 ${!isDarkMode ? 'light-theme' : ''}`}>
      
      {/* Dynamic alerts */}
      {notificationMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-sleek-card border border-indigo-500/30 text-indigo-400 p-4 rounded-xl shadow-2xl flex items-center gap-2 text-xs">
          <Check className="w-4 h-4" /> {notificationMsg}
        </div>
      )}

      {/* Main SaaS App Bar Header */}
      <header className="sticky top-0 z-40 border-b border-sleek-main bg-sleek-main/80 backdrop-blur-md px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('landing')}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md">
            C
          </div>
          <span className="font-display font-semibold text-lg tracking-tight text-sleek-heading">CareerVerse</span>
        </div>

        {/* Global Search input from Sleek Interface */}
        <div className="hidden md:flex flex-1 max-w-sm mx-10">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search connections, jobs, or skills..." 
              className="w-full bg-sleek-input border border-sleek-input rounded-full py-1.5 pl-10 pr-4 text-xs focus:outline-none focus:border-indigo-500 transition-all text-sleek-main placeholder:text-sleek-muted"
            />
            <Briefcase className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-sleek-muted" />
          </div>
        </div>

        {/* Action metrics (Notifications, profile avatar, exit button) */}
        <div className="flex items-center gap-4">

          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-sleek-input hover:bg-sleek-active border border-sleek-input text-sleek-muted hover:text-sleek-heading transition-all cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500 animate-pulse" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>
          
          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
              className="p-2 rounded-lg bg-sleek-input hover:bg-sleek-active border border-sleek-input text-sleek-muted hover:text-sleek-heading transition-all cursor-pointer"
            >
              <Bell className="w-4.5 h-4.5" />
              {notifications.some(n => !n.isRead) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
              )}
            </button>

            {/* Notifications panel drawer */}
            {showNotificationDrawer && (
              <div className="absolute right-0 mt-2 w-72 bg-sleek-card border border-sleek-main rounded-xl p-4 shadow-2xl space-y-3 z-50 text-left">
                <div className="flex justify-between items-center border-b border-sleek-main pb-2">
                  <span className="text-[10px] uppercase font-bold text-sleek-muted">Activity Alerts</span>
                  <button onClick={clearNotifications} className="text-[9px] text-indigo-400 hover:underline cursor-pointer">Mark all read</button>
                </div>
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div key={n.id} className="flex gap-2.5 items-start text-xs border-b border-transparent pb-1">
                      <img
                        referrerPolicy="no-referrer"
                        src={n.senderAvatar}
                        alt={n.senderName}
                        className="w-7 h-7 rounded-full object-cover mt-0.5 border border-sleek-main"
                      />
                      <div>
                        <span className="font-semibold text-sleek-heading">{n.senderName}</span>{' '}
                        <span className="text-sleek-muted font-sans text-[11px]">{n.message}</span>
                        <span className="block text-[8px] text-sleek-muted font-mono mt-0.5">Just now</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 cursor-pointer p-1 rounded-lg border border-transparent hover:border-sleek-main transition-all"
          >
            <img
              referrerPolicy="no-referrer"
              src={user?.avatar}
              alt={user?.fullName}
              className="w-7.5 h-7.5 rounded-full object-cover border border-sleek-main"
            />
            <span className="hidden sm:inline font-sans text-xs font-semibold text-sleek-muted hover:text-sleek-heading">{user?.fullName}</span>
          </div>

          <button
            onClick={() => setActiveTab('landing')}
            className="p-2 text-sleek-muted hover:text-sleek-heading rounded-lg hover:bg-sleek-input transition-all cursor-pointer"
            title="Landing Home"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>
      </header>

      {/* Main double column screen: Sidebar + Active Module Tab */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto items-stretch">
        
        {/* SIDE BAR NAVIGATION */}
        <aside id="app_sibebar_nav" className="w-full md:w-64 border-r border-sleek-main bg-sleek-sidebar p-6 shrink-0 flex flex-col justify-between">
          <div className="space-y-1.5 text-left text-xs font-medium font-sans">
            <span className="block text-[9px] uppercase font-bold text-sleek-muted px-3.5 mb-4">Workspace</span>

            <button
              onClick={() => setActiveTab('feed')}
              className={`w-full py-2 px-3 rounded-md flex items-center gap-3 transition-colors text-xs font-semibold cursor-pointer border ${
                activeTab === 'feed' ? 'bg-sleek-active text-sleek-heading border-sleek-input' : 'text-sleek-muted hover:text-sleek-heading hover:bg-sleek-input border-transparent'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 text-indigo-400" /> Social Feed
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`w-full py-2 px-3 rounded-md flex items-center gap-3 transition-colors text-xs font-semibold cursor-pointer border ${
                activeTab === 'jobs' ? 'bg-sleek-active text-sleek-heading border-sleek-input' : 'text-sleek-muted hover:text-sleek-heading hover:bg-sleek-input border-transparent'
              }`}
            >
              <Briefcase className="w-5 h-5 text-indigo-400" /> Career Openings
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full py-2 px-3 rounded-md flex items-center justify-between transition-colors text-xs font-semibold cursor-pointer border ${
                activeTab === 'messages' ? 'bg-sleek-active text-sleek-heading border-sleek-input' : 'text-sleek-muted hover:text-sleek-heading hover:bg-sleek-input border-transparent'
              }`}
            >
              <span className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-indigo-400" /> Chat Recruiter</span>
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            </button>

            <button
              onClick={() => setActiveTab('coach')}
              className={`w-full py-2 px-3 rounded-md flex items-center justify-between transition-colors text-xs font-semibold cursor-pointer border ${
                activeTab === 'coach' ? 'bg-sleek-active text-sleek-heading border-sleek-input' : 'text-sleek-muted hover:text-sleek-heading hover:bg-sleek-input border-transparent'
              }`}
            >
              <span className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-indigo-400" /> AI Career Coach</span>
              <span className="ml-auto bg-indigo-500/10 text-indigo-400 text-[10px] px-1.5 py-0.5 rounded border border-indigo-500/20">AI</span>
            </button>

            <button
              onClick={() => setActiveTab('dev')}
              className={`w-full py-2 px-3 rounded-md flex items-center gap-3 transition-colors text-xs font-semibold cursor-pointer border ${
                activeTab === 'dev' ? 'bg-sleek-active text-sleek-heading border-sleek-input' : 'text-sleek-muted hover:text-sleek-heading hover:bg-sleek-input border-transparent'
              }`}
            >
              <Code className="w-5 h-5 text-indigo-400" /> Developer Mode
            </button>

            <button
              onClick={() => setActiveTab('network')}
              className={`w-full py-2 px-3 rounded-md flex items-center gap-3 transition-colors text-xs font-semibold cursor-pointer border ${
                activeTab === 'network' ? 'bg-sleek-active text-sleek-heading border-sleek-input' : 'text-sleek-muted hover:text-sleek-heading hover:bg-sleek-input border-transparent'
              }`}
            >
              <User className="w-5 h-5 text-indigo-400" /> My Network
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`w-full py-2 px-3 rounded-md flex items-center gap-3 transition-colors text-xs font-semibold cursor-pointer border ${
                activeTab === 'database' ? 'bg-sleek-active text-sleek-heading border-sleek-input' : 'text-sleek-muted hover:text-sleek-heading hover:bg-sleek-input border-transparent'
              }`}
            >
              <Database className="w-5 h-5 text-indigo-400" /> Postgres Model
            </button>

          </div>

          {/* Premium Promotion Box updated to beautiful styling match */}
          {user && (
            <div className="mt-auto p-4 bg-gradient-to-br from-indigo-900/10 to-purple-900/5 rounded-xl border border-indigo-500/20 text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Premium Access</p>
              <p className="text-[11px] text-sleek-muted mb-3">Unlock AI insights and priority job matching.</p>
              {user.isPremium ? (
                <span className="block w-full py-2 bg-indigo-950/20 border border-indigo-500/20 text-indigo-400 text-[10px] font-semibold tracking-wider uppercase text-center rounded">⭐ Premium Member</span>
              ) : (
                <button
                  id="btn_pricing_trigger_nav"
                  onClick={handleUpgradePremium}
                  className="w-full py-2 bg-indigo-600 text-white text-xs font-semibold rounded-md shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-colors uppercase tracking-wider block text-center cursor-pointer"
                >
                  Upgrade Now
                </button>
              )}
            </div>
          )}
        </aside>

        {/* WORKSPACE CONTENT MODULE BOX */}
        <main id="app_main_module" className="flex-1 bg-sleek-main overflow-y-auto">
          
          {user && (
            <>
              {/* SOCIAL FEED MODULE */}
              {activeTab === 'feed' && (
                <SocialFeed
                  posts={posts}
                  currentUserId={user.id}
                  onLikePost={handleLikePost}
                  onAddComment={handleAddComment}
                  onCreatePost={handleCreatePost}
                />
              )}

              {/* JOB DIRECTORY BOARD MODULE */}
              {activeTab === 'jobs' && (
                <JobPortal
                  jobs={jobs}
                  onApply={handleApplyJob}
                  onPostJob={handlePostJob}
                />
              )}

              {/* MESSAGING DISPATCH THREAD MODULE */}
              {activeTab === 'messages' && (
                <Messaging
                  messages={messages}
                  contacts={connections}
                  currentUserId={user.id}
                  onSendMessage={handleSendMessage}
                />
              )}

              {/* AI INTEGRATIONS COACH MODULE */}
              {activeTab === 'coach' && (
                <AICoach
                  user={user}
                  onUpdateProfile={handleSyncProfile}
                />
              )}

              {/* DEVELOPER MODE GITHUB SYNC */}
              {activeTab === 'dev' && (
                <DevMode
                  user={user}
                  onUpdateProfile={handleSyncProfile}
                />
              )}

              {/* RELATIONAL PRISMA SCHEMAS COPIER */}
              {activeTab === 'database' && <DatabaseVisualizer />}

              {/* NETWORKING SYSTEM CONNECTIONS DIRECTORY */}
              {activeTab === 'network' && (
                <div className="max-w-4xl mx-auto py-6 px-4 text-left">
                  <div className="mb-6 flex justify-between items-center pb-4 border-b border-slate-900">
                    <div>
                      <h2 className="text-xl font-display font-semibold text-white">Professional Connections</h2>
                      <p className="text-xs text-gray-500 mt-1 font-sans">Accept requests and connect with leading software contributors inside Singapore.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {connections.map((conn) => (
                      <div key={conn.id} className="p-4 bg-slate-950/50 border border-slate-900 rounded-2xl flex items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <img
                            referrerPolicy="no-referrer"
                            src={conn.avatar}
                            alt={conn.fullName}
                            className="w-12 h-12 object-cover rounded-full border border-slate-800"
                          />
                          <div className="min-w-0">
                            <h3 className="font-display font-semibold text-sm text-white truncate">{conn.fullName}</h3>
                            <span className="text-[10px] text-gray-500 mt-0.5 block truncate max-w-[170px] font-sans">{conn.headline}</span>
                            <span className="text-[9px] text-[#10b981] mt-2 block font-mono font-bold uppercase tracking-wider">{conn.mutualConnections} mutual connections</span>
                          </div>
                        </div>

                        {/* Network control button */}
                        <div>
                          {conn.status === 'Connected' && (
                            <button
                              onClick={() => handleConnectionAction(conn.id, 'disconnect')}
                              className="px-2.5 py-1.5 border border-slate-800 hover:border-red-500/20 text-gray-500 hover:text-rose-400 rounded-lg text-[10px] font-bold cursor-pointer font-sans transition-all"
                            >
                              Message
                            </button>
                          )}

                          {conn.status === 'PendingIncoming' && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleConnectionAction(conn.id, 'accept')}
                                className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-[10px] font-bold cursor-pointer font-sans"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleConnectionAction(conn.id, 'reject')}
                                className="px-2 py-1.5 border border-slate-800 hover:border-gray-700 text-gray-400 rounded-lg text-[10px] cursor-pointer"
                              >
                                Skip
                              </button>
                            </div>
                          )}

                          {conn.status === 'PendingOutgoing' && (
                            <span className="text-[10px] text-gray-500 italic block mt-2">Request Outstanding</span>
                          )}

                          {conn.status === 'None' && (
                            <button
                              onClick={() => handleConnectionAction(conn.id, 'connect')}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-850 rounded-lg text-xs font-semibold text-gray-300 font-sans cursor-pointer"
                            >
                              Connect
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* USER PROFILE VISUAL IDENTITY CARD VIEW */}
              {activeTab === 'profile' && (
                <div id="visual_identity_card" className="max-w-4xl mx-auto py-6 px-4 text-left font-sans text-xs">
                  
                  {/* Visual Header banner */}
                  <div className="relative border border-slate-900 bg-slate-950/40 rounded-2xl overflow-hidden mb-6">
                    <img
                      src={user.coverBanner}
                      alt="Banner background"
                      className="w-full h-36 object-cover opacity-60"
                    />
                    
                    {/* User main info wrap */}
                    <div className="p-6 relative pt-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                      
                      <div className="absolute -top-12 left-6">
                        <img
                          referrerPolicy="no-referrer"
                          src={user.avatar}
                          alt={user.fullName}
                          className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-950 shadow-lg"
                        />
                      </div>
                      
                      {/* Name/Headline metrics */}
                      <div className="pt-2">
                        <div className="flex items-center gap-2">
                          <h1 className="font-display text-xl font-bold text-white leading-none">{user.fullName}</h1>
                          {user.isPremium && (
                            <span className="bg-emerald-950/50 border border-emerald-500/20 text-[#10b981] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Premium Member</span>
                          )}
                        </div>

                        {isEditingHeadline ? (
                          <div className="flex gap-2 mt-2 items-center">
                            <input
                              type="text"
                              value={editHeadlineContent}
                              onChange={(e) => setEditHeadlineContent(e.target.value)}
                              className="bg-slate-950 border border-slate-800 rounded py-1 px-2.5 text-xs text-white focus:outline-none"
                            />
                            <button onClick={handleUpdateHeadline} className="px-2 py-1 bg-emerald-500 text-slate-950 font-bold rounded text-[10px] cursor-pointer">Save</button>
                          </div>
                        ) : (
                          <p className="text-gray-400 mt-1.5 max-w-xl text-[11px] font-medium leading-relaxed">
                            {user.headline}{' '}
                            <button onClick={() => setIsEditingHeadline(true)} className="text-[#10b981] text-[10px] hover:underline font-semibold ml-1 cursor-pointer">✍ Edit</button>
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-gray-500 text-[11px]">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {user.location}</span>
                          <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {user.connectionsCount} connections</span>
                          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {user.followersCount} followers</span>
                        </div>
                      </div>

                      {/* Disconnect context */}
                      <button 
                        onClick={() => setActiveTab('coach')} 
                        className="px-4 py-2 bg-slate-900 border border-slate-850 hover:border-gray-700 text-emerald-400 rounded-lg text-xs font-semibold cursor-pointer shrink-0 font-sans flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Optimize Profile with AI
                      </button>

                    </div>
                  </div>

                  {/* DOUBLE COLUMN: Left specifics, Right skills/Languages */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left details panel: About me & Portfolio showcased bento */}
                    <div className="lg:col-span-8 space-y-6">
                      
                      {/* About section */}
                      <div className="bg-slate-950/50 border border-slate-900 p-6 rounded-2xl">
                        <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-gray-400 mb-3 block">Professional Bio</h4>
                        {isEditingAbout ? (
                          <div className="space-y-3">
                            <textarea
                              rows={4}
                              value={editAboutContent}
                              onChange={(e) => setEditAboutContent(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-xs text-white focus:outline-none"
                            />
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setIsEditingAbout(false)} className="px-3 py-1 border border-slate-800 rounded text-gray-400 text-[11px]">Cancel</button>
                              <button onClick={handleUpdateAbout} className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded text-[11px]">Save Bio</button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-400 leading-relaxed text-[11px] font-sans">
                            {user.about}{' '}
                            <button onClick={() => setIsEditingAbout(true)} className="text-[#10b981] hover:underline font-semibold ml-1 cursor-pointer">✍ Rewrite</button>
                          </p>
                        )}
                      </div>

                      {/* PORTFOLIO SYSTEM SHOWCASE BENTO GRID */}
                      <div className="p-6 bg-slate-950/40 border border-slate-900 rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-gray-400">Portfolio Project Showcases</h4>
                          <button
                            id="btn_add_project_open"
                            onClick={() => setShowAddProject(!showAddProject)}
                            className="flex items-center gap-1 px-3 py-1 bg-slate-900 border border-slate-800 hover:border-gray-700 rounded text-[10px] font-semibold text-[#10b981] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Integrate Project
                          </button>
                        </div>

                        {/* Add project form box if open */}
                        {showAddProject && (
                          <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl mb-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                placeholder="Project Title"
                                value={pTitle}
                                onChange={(e) => setPTitle(e.target.value)}
                                className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none"
                              />
                              <input
                                type="text"
                                placeholder="Tech Stack (comma separated)"
                                value={pTech}
                                onChange={(e) => setPTech(e.target.value)}
                                className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="Live Demo Address URL"
                              value={pLive}
                              onChange={(e) => setPLive(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none"
                            />
                            <input
                              type="text"
                              placeholder="GitHub Repository URL"
                              value={pGit}
                              onChange={(e) => setPGit(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none"
                            />
                            <textarea
                              rows={2.5}
                              placeholder="Objective description..."
                              value={pDesc}
                              onChange={(e) => setPDesc(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none resize-none"
                            />
                            <div className="flex justify-end gap-2 text-[11px] font-semibold">
                              <button onClick={() => setShowAddProject(false)} className="px-3 py-1 border border-slate-800 rounded text-gray-400">Cancel</button>
                              <button onClick={handleAddProject} className="px-3 py-1 bg-emerald-500 text-slate-900 rounded">Add Project</button>
                            </div>
                          </div>
                        )}

                        {/* Bento Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {user.portfolio.map((project) => (
                            <div key={project.id} className="p-4 bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-xl transition-all flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start gap-4">
                                  <h5 className="font-display font-semibold text-xs text-white">{project.title}</h5>
                                  <span className="text-[8px] bg-slate-900 text-gray-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">{project.status}</span>
                                </div>
                                <p className="text-gray-500 text-xs leading-relaxed mt-2.5 font-sans min-h-[48px]">{project.description}</p>
                                
                                <div className="flex flex-wrap gap-1 mt-3">
                                  {project.techStack.map((tech, i) => (
                                    <span key={i} className="px-1.5 py-0.5 bg-slate-900/60 rounded text-[9px] text-gray-500 font-mono">{tech}</span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-end gap-3 border-t border-slate-900/80 pt-3 mt-4 text-[10px] font-sans font-semibold">
                                {project.githubUrl && (
                                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white flex items-center gap-0.5"><Github className="w-3.5 h-3.5" /> Code</a>
                                )}
                                {project.liveUrl && (
                                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5">Demo <ArrowUpRight className="w-3 h-3" /></a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* EXPERIENCE LOGS SYSTEM */}
                      <div className="p-6 bg-slate-950/40 border border-slate-900 rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-gray-400">Work Experience log</h4>
                          <button
                            onClick={() => setShowAddExperience(!showAddExperience)}
                            className="flex items-center gap-1 px-3 py-1 bg-slate-900 border border-slate-800 hover:border-gray-700 rounded text-[10px] font-semibold text-[#10b981] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Log Experience
                          </button>
                        </div>

                        {showAddExperience && (
                          <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl mb-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                placeholder="Company (e.g. Grab)"
                                value={expCompany}
                                onChange={(e) => setExpCompany(e.target.value)}
                                className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none"
                              />
                              <input
                                type="text"
                                placeholder="Role (e.g. Frontend Intern)"
                                value={expRole}
                                onChange={(e) => setExpRole(e.target.value)}
                                className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <input
                                type="text"
                                placeholder="Location"
                                value={expLoc}
                                onChange={(e) => setExpLoc(e.target.value)}
                                className="bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none"
                              />
                              <input
                                type="text"
                                placeholder="Start Date"
                                value={expStart}
                                onChange={(e) => setExpStart(e.target.value)}
                                className="bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none"
                              />
                              <input
                                type="text"
                                placeholder="End Date"
                                value={expEnd}
                                onChange={(e) => setExpEnd(e.target.value)}
                                className="bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <textarea
                              rows={2.5}
                              placeholder="Role goals & metrics compiled..."
                              value={expDesc}
                              onChange={(e) => setExpDesc(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none resize-none"
                            />
                            <div className="flex justify-end gap-2 text-[11px] font-semibold">
                              <button onClick={() => setShowAddExperience(false)} className="px-3 py-1 border border-slate-800 rounded text-gray-400">Cancel</button>
                              <button onClick={handleAddExperience} className="px-3 py-1 bg-emerald-500 text-slate-900 rounded">Log Experience</button>
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          {user.experience.map((exp) => (
                            <div key={exp.id} className="p-4 bg-slate-950/40 border-l-2 border-emerald-500/20 rounded-r-xl space-y-2">
                              <div className="flex justify-between items-baseline">
                                <h5 className="font-display font-semibold text-xs text-white">{exp.role} <span className="text-gray-500 font-normal">at</span> {exp.company}</h5>
                                <span className="text-[10px] text-gray-500 font-mono">{exp.startDate} - {exp.endDate}</span>
                              </div>
                              <span className="block text-[10px] text-gray-500 font-sans font-medium">{exp.location}</span>
                              <p className="text-gray-400 font-sans text-xs leading-relaxed pt-1.5">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Right side credentials panel: Skills & Languages */}
                    <div className="lg:col-span-4 space-y-6">
                      
                      {/* Skills lists manager */}
                      <div className="bg-slate-950/50 border border-slate-900 p-6 rounded-2xl">
                        <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-gray-400 mb-4 block">Verified Skill Matrix</h4>
                        
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {user.skills.map((skill) => (
                            <span key={skill} className="flex items-center gap-1 px-2.5 py-1 bg-slate-950 border border-slate-850 rounded-lg text-gray-300 font-sans font-semibold text-[11px]">
                              {skill}
                              <button onClick={() => handleRemoveSkill(skill)} className="text-gray-600 hover:text-rose-400 font-bold ml-1.5 cursor-pointer text-[10px]">✕</button>
                            </span>
                          ))}
                        </div>

                        {/* Skill addition input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add skill (e.g. Docker)"
                            value={newSkillInput}
                            onChange={(e) => setNewSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddSkill();
                            }}
                            className="bg-slate-950 border border-slate-900 focus:border-slate-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none flex-1 font-sans"
                          />
                          <button
                            onClick={handleAddSkill}
                            className="p-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded-lg border border-slate-850 cursor-pointer text-xs font-semibold"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Languages metrics */}
                      <div className="bg-slate-950/50 border border-slate-900 p-6 rounded-2xl">
                        <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-gray-400 mb-4 block">Languages Indexed</h4>
                        
                        <div className="space-y-2 mb-5 font-sans">
                          {user.languages.map((lang) => (
                            <div key={lang} className="flex justify-between items-center text-xs border-b border-slate-900 pb-1.5 text-gray-300">
                              <span>{lang}</span>
                              <span className="text-[10px] text-gray-500 font-mono">Professional Literacy</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add language..."
                            value={newLanguageInput}
                            onChange={(e) => setNewLanguageInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddLanguage();
                            }}
                            className="bg-slate-950 border border-slate-900 focus:border-slate-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none flex-1 font-sans"
                          />
                          <button
                            onClick={handleAddLanguage}
                            className="p-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded-lg border border-slate-850 cursor-pointer text-xs font-semibold"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Certifications and achievements list highlights */}
                      <div className="bg-slate-950/50 border border-slate-900 p-6 rounded-2xl space-y-4">
                        <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-gray-400">Achievements Highlight</h4>
                        <div className="space-y-2 font-sans text-xs">
                          {user.achievements.map((ach, idx) => (
                            <div key={idx} className="flex gap-2 items-start text-gray-400 leading-relaxed">
                              <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{ach}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

            </>
          )}

        </main>

      </div>

    </div>
  );
}
