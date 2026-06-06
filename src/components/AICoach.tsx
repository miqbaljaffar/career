import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Brain, CheckCircle2, ShieldAlert, Cpu, CornerDownLeft, 
  Copy, Check, Info, FileText, ArrowRight, UserCheck, RefreshCw, Send, HelpCircle
} from 'lucide-react';
import { UserProfile, AIReviewResult } from '../types';

interface AICoachProps {
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export function AICoach({ user, onUpdateProfile }: AICoachProps) {
  const [activeTab, setActiveTab] = useState<'resume' | 'optimize' | 'advisor' | 'post'>('resume');

  // Resume ATS state
  const [resumeText, setResumeText] = useState(user.resumeText || '');
  const [analyzingResume, setAnalyzingResume] = useState(false);
  const [reviewResult, setReviewResult] = useState<AIReviewResult | null>(null);

  // Profile Optimizer state
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedHeadline, setOptimizedHeadline] = useState('');
  const [optimizedBio, setOptimizedBio] = useState('');
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<string[]>([]);
  const [appliedOptimization, setAppliedOptimization] = useState(false);

  // Advisor state
  const [advisorQuery, setAdvisorQuery] = useState('');
  const [queryHistory, setQueryHistory] = useState<{ q: string; response: string }[]>([
    {
      q: "What is the typical salary expectation for an Entry-Level React developer inside Singapore?",
      response: `### Tech Salary Estimates (Singapore 2026)\n\nBased on regional recruiting databases, junior developer compensation falls into these guidelines:\n\n* **Bootcamp Grad / Junior Associate**: S$4,200 - S$5,500\n* **NUS/NTU CS Graduate**: S$4,800 - S$6,500\n* **Mid-Weight Software Engineer (2-4 yrs)**: S$6,500 - S$8,800\n\n*Best strategy*: Emphasize your production components, unit writing portfolios, and ability to handle full-stack telemetry (e.g. Express, Node.js, relational databases).`
    }
  ]);
  const [submittingQuery, setSubmittingQuery] = useState(false);

  // Social Post Generator state
  const [postTopic, setPostTopic] = useState<'graduation' | 'promotion' | 'new_job' | 'project'>('graduation');
  const [postContext, setPostContext] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [generatingPost, setGeneratingPost] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // General Notification feedback
  const [alertMsg, setAlertMsg] = useState('');

  const triggerNotification = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(''), 3000);
  };

  // 1. Send Resume ATS Review
  const handleAnalyzeResume = async () => {
    if (!resumeText.trim()) {
      triggerNotification("Please fill in some CV details to scan!");
      return;
    }
    setAnalyzingResume(true);
    // Mimic multi-stage telemetry scanning steps for exceptional user delight
    try {
      const res = await fetch('/api/ai/resume-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText })
      });
      const data = await res.json();
      if (data.error) {
        triggerNotification(`Error: ${data.error}`);
      } else {
        setReviewResult(data);
        onUpdateProfile({ resumeText });
        triggerNotification("ATS Review Complete!");
      }
    } catch (err) {
      triggerNotification("Resume audit error.");
    } finally {
      setAnalyzingResume(false);
    }
  };

  // 2. Profile Copywriting Optimizer
  const handleOptimizeProfile = async () => {
    setOptimizing(true);
    setAppliedOptimization(false);
    try {
      const res = await fetch('/api/ai/profile-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentHeadline: user.headline,
          currentAbout: user.about,
          currentSkills: user.skills
        })
      });
      const data = await res.json();
      setOptimizedHeadline(data.optimizedHeadline);
      setOptimizedBio(data.optimizedBio);
      setOptimizationSuggestions(data.suggestions || []);
      triggerNotification("Profile Brand Strategies Generated!");
    } catch (err) {
      triggerNotification("Failed optimizing profile.");
    } finally {
      setOptimizing(false);
    }
  };

  const handleApplyOptimizer = () => {
    if (!optimizedHeadline || !optimizedBio) return;
    onUpdateProfile({
      headline: optimizedHeadline,
      about: optimizedBio,
      profileStrength: Math.min(100, user.profileStrength + 15)
    });
    setAppliedOptimization(true);
    triggerNotification("Optimization applied directly to your live profile card!");
  };

  // 3. Advisor Mentoring Form
  const handleAskAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisorQuery.trim()) return;

    setSubmittingQuery(true);
    const userQ = advisorQuery;
    setAdvisorQuery('');

    try {
      const res = await fetch('/api/ai/career-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userQ,
          userProfile: {
            headline: user.headline,
            location: user.location,
            skills: user.skills
          }
        })
      });
      const data = await res.json();
      setQueryHistory(prev => [{ q: userQ, response: data.answer }, ...prev]);
      triggerNotification("Advice loaded!");
    } catch (err) {
      triggerNotification("Consultation failed.");
    } finally {
      setSubmittingQuery(false);
    }
  };

  // 4. LinkedIn Post Assembler
  const handleGeneratePost = async () => {
    setGeneratingPost(true);
    setGeneratedDraft('');
    setCopiedDraft(false);
    try {
      const res = await fetch('/api/ai/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: postTopic,
          contextInfo: postContext
        })
      });
      const data = await res.json();
      setGeneratedDraft(data.post);
      triggerNotification("Draft Post Crafted!");
    } catch (err) {
      triggerNotification("Post generator errored.");
    } finally {
      setGeneratingPost(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    triggerNotification("Copied to clipboard!");
  };

  return (
    <div id="ai_coach_container" className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Alert toast helper */}
      <AnimatePresence>
        {alertMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-indigo-950 border border-indigo-500/30 text-indigo-300 px-4 py-3 rounded-xl shadow-xl text-xs font-sans flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {alertMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header visual banner */}
      <div className="relative overflow-hidden bg-sleek-card border border-sleek-main p-6 sm:p-8 rounded-2xl mb-8 shadow-sm">
        <div className="absolute top-0 right-10 w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl text-left relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 mb-4 uppercase">
            <Cpu className="w-3.5 h-3.5 animate-spin-slow" /> AGENT CO-PILOT
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-sleek-heading">
            AI Interactive Studio
          </h1>
          <p className="text-xs sm:text-sm text-sleek-muted mt-2 leading-relaxed">
            Harness instant analytical intelligence powered directly by Gemini neural engines. Audit resumes for ATS score match, generate executive professional bio headlines, ask high-value queries on salaries, and draft impactful project launches.
          </p>
        </div>
      </div>

      {/* Modern custom select tabs line style */}
      <div className="flex border-b border-sleek-main mb-8 overflow-x-auto whitespace-nowrap scrollbar-none items-center">
        {[
          { id: 'resume', label: 'ATS Resume Auditor', icon: FileText },
          { id: 'optimize', label: 'Branding Bio Optimizer', icon: Sparkles },
          { id: 'advisor', label: 'Tech Advises Hub', icon: Brain },
          { id: 'post', label: 'LinkedIn Post Generator', icon: CornerDownLeft }
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-xs font-semibold px-5 tracking-tight transition-all border-b-2 flex items-center gap-2 cursor-pointer relative ${
                isActive 
                  ? 'text-indigo-400 border-indigo-500 font-bold' 
                  : 'text-sleek-muted border-transparent hover:text-sleek-heading'
              }`}
            >
              <IconComponent className={`w-4 h-4 transition-all ${isActive ? 'scale-110' : 'opacity-70'}`} />
              {tab.label}
              {isActive && (
                <motion.span 
                  layoutId="activeTabUnderline" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" 
                />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB PANEL CONTENT */}
      <div id="ai_tab_pnl_wrapper" className="min-h-[420px]">
        
        {/* ATS REVIEWS */}
        {activeTab === 'resume' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 bg-sleek-card border border-sleek-main rounded-2xl shadow-sm text-left">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <FileText className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase text-sleek-heading font-display tracking-wider">Configure Resume</h3>
                    <p className="text-[10px] text-sleek-muted">Paste your markdown or standard resume text parameters.</p>
                  </div>
                </div>

                <textarea
                  id="cv_text_input"
                  rows={8}
                  placeholder={`Sarah Tan | Singapore | Software Developer
• 2 Years React, TS experience at high growth startups
• Built micro-interactions using Framer Motion
• Optimized Postgres query performance by 40%`}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full bg-sleek-input border border-sleek-input rounded-xl p-4 text-xs text-sleek-main focus:outline-none focus:border-indigo-500/50 resize-none font-sans placeholder:text-sleek-muted leading-relaxed"
                />
                
                <button
                  id="btn_trigger_ats_review"
                  onClick={handleAnalyzeResume}
                  disabled={analyzingResume}
                  className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-sleek-input disabled:text-sleek-muted text-white text-xs font-semibold rounded-xl font-sans transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  {analyzingResume ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Evaluating CV Matrix...
                    </>
                  ) : (
                    <>
                      <span>Scan ATS Match Score</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              {analyzingResume ? (
                /* Sophisticated scanning skeleton loading states */
                <div className="p-6 bg-sleek-card border border-sleek-main rounded-2xl space-y-6 text-left">
                  <div className="flex items-center gap-5 pb-5 border-b border-sleek-main">
                    <div className="w-20 h-20 bg-sleek-input animate-pulse rounded-full flex items-center justify-center" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-sleek-input animate-pulse rounded w-1/3" />
                      <div className="h-3 bg-sleek-input animate-pulse rounded w-2/3" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="h-3 bg-sleek-input animate-pulse rounded w-1/4" />
                      <div className="h-3 bg-sleek-input animate-pulse rounded w-full" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-sleek-input animate-pulse rounded w-1/3" />
                      <div className="h-3 bg-sleek-input animate-pulse rounded w-5/6" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-sleek-input animate-pulse rounded w-1/2" />
                      <div className="h-3 bg-sleek-input animate-pulse rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ) : reviewResult ? (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-sleek-card border border-sleek-main rounded-2xl space-y-6 text-left shadow-sm"
                >
                  {/* ATS circle display */}
                  <div className="flex items-center gap-5 pb-5 border-b border-sleek-main">
                    <div className="relative w-20 h-20 flex items-center justify-center bg-sleek-input rounded-full border-2 border-indigo-500/20 shadow-inner">
                      <span className="font-display font-medium text-3xl text-indigo-400">{reviewResult.atsScore}</span>
                      <span className="absolute -bottom-2 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-bold uppercase rounded-md tracking-wider">ATS</span>
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-sm text-sleek-heading">Resume Match Index</h4>
                      <p className="text-xs text-sleek-muted mt-1 leading-snug">Evaluated against general Singapore & Southeast Asia enterprise standards.</p>
                    </div>
                  </div>

                  {/* Highlights listing */}
                  <div className="space-y-5">
                    
                    <div>
                      <h5 className="text-[10px] uppercase font-bold text-rose-500 flex items-center gap-1.5 mb-2 font-display">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Essential Missing Keyphrase Flags
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {reviewResult.missingSkills.length === 0 ? (
                          <span className="text-xs text-sleek-muted">Perfect keyword density matched.</span>
                        ) : (
                          reviewResult.missingSkills.map((skill, index) => (
                            <span key={index} className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-semibold rounded-lg font-mono">{skill}</span>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-[10px] uppercase font-bold text-amber-500 flex items-center gap-1.5 mb-2 font-display">
                        <Info className="w-3.5 h-3.5 text-amber-400" /> Flagged Weak Structural layout Areas
                      </h5>
                      <ul className="space-y-1.5 text-xs text-sleek-muted list-disc list-inside leading-relaxed font-sans">
                        {reviewResult.weakSections.map((sect, i) => (
                          <li key={i}>{sect}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-[10px] uppercase font-bold text-emerald-500 flex items-center gap-1.5 mb-2 font-display">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Actionable Copywriting Fixes
                      </h5>
                      <ul className="space-y-2 text-xs text-sleek-main list-inside leading-relaxed font-sans">
                        {reviewResult.suggestions.map((sug, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold select-none mt-0.5">•</span>
                            <span className="flex-1">{sug}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </motion.div>
              ) : (
                /* Elegant empty state with structural graphics */
                <div className="h-full flex flex-col items-center justify-center p-12 text-center border border-dashed border-sleek-input bg-sleek-card/30 rounded-2xl min-h-[340px]">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center mb-4 shadow-sm text-indigo-400">
                    <FileText className="w-8 h-8 opacity-75" />
                  </div>
                  <h4 className="text-sm font-semibold text-sleek-heading">Awaiting Credentials Audit</h4>
                  <p className="text-xs text-sleek-muted max-w-sm mt-1.5 leading-relaxed">
                    Paste raw text of your CV portfolio in the input panel to compile a smart ATS Match Index report.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* BRAND OPTIMIZATION BIOGRAPHY */}
        {activeTab === 'optimize' && (
          <div className="p-6 bg-sleek-card border border-sleek-main rounded-2xl shadow-sm text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sleek-main pb-5 mb-6 gap-3">
              <div>
                <h3 className="font-display font-semibold text-sm text-sleek-heading">Profile Metadata Copywriter</h3>
                <p className="text-xs text-sleek-muted mt-0.5">Let Gemini craft an optimization pitch to drive recruiter contacts.</p>
              </div>
              <button
                onClick={handleOptimizeProfile}
                disabled={optimizing}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-sleek-input disabled:text-sleek-muted text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-center"
              >
                {optimizing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                {optimizing ? 'Generating copies...' : 'Audit Headline & Portfolio'}
              </button>
            </div>

            {optimizing ? (
              /* Upgraded beautiful layout skeleton loader */
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="h-3 bg-sleek-input animate-pulse rounded w-1/4" />
                  <div className="h-10 bg-sleek-input animate-pulse rounded-lg" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-sleek-input animate-pulse rounded w-1/3" />
                  <div className="h-20 bg-sleek-input animate-pulse rounded-lg" />
                </div>
              </div>
            ) : optimizedHeadline ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="space-y-6"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase font-bold text-sleek-muted font-display tracking-wider">Alternative Title Headline</span>
                    <button
                      onClick={() => handleCopyToClipboard(optimizedHeadline)}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                  </div>
                  <div className="p-4 bg-sleek-input border border-sleek-input rounded-xl text-xs text-sleek-heading font-medium tracking-tight">
                    {optimizedHeadline}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase font-bold text-sleek-muted font-display tracking-wider font-semibold">Executive About Biography</span>
                    <button
                      onClick={() => handleCopyToClipboard(optimizedBio)}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                  </div>
                  <div className="p-4 bg-sleek-input border border-sleek-input rounded-xl text-xs leading-relaxed text-sleek-main whitespace-pre-wrap">
                    {optimizedBio}
                  </div>
                </div>

                {optimizationSuggestions.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-sleek-muted block mb-2.5 font-display">Tactical Optimization Advice</span>
                    <ul className="space-y-2 text-xs text-sleek-muted list-inside">
                      {optimizationSuggestions.map((tip, index) => (
                        <li key={index} className="flex items-start gap-1.5">
                          <span className="text-indigo-400 font-bold font-sans">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-5 border-t border-sleek-main flex items-center justify-between">
                  <span className="text-[10px] text-sleek-muted">Apply optimizes user strengths directly securely.</span>
                  {appliedOptimization ? (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Live Bio Updated</span>
                  ) : (
                    <button
                      onClick={handleApplyOptimizer}
                      className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-500/20 dark:text-indigo-400 rounded-xl text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/10 cursor-pointer"
                    >
                      Apply directly to profile card
                    </button>
                  )}
                </div>

              </motion.div>
            ) : (
              /* Beautiful empty status */
              <div className="h-full flex flex-col items-center justify-center p-12 text-center border border-dashed border-sleek-input bg-sleek-card/30 rounded-2xl min-h-[300px]">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center mb-4 shadow-sm text-indigo-400">
                  <Sparkles className="w-8 h-8 opacity-75" />
                </div>
                <h4 className="text-sm font-semibold text-sleek-heading">Ready for Copy Optimization</h4>
                <p className="text-xs text-sleek-muted max-w-sm mt-1.5 leading-relaxed">
                  Click 'Audit Headline & Portfolio' above. Gemini extracts insights from your current skills to write standard brand bio materials.
                </p>
              </div>
            )}
          </div>
        )}

        {/* CAREER ADVISING ROUTER */}
        {activeTab === 'advisor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
            
            <div className="lg:col-span-4 p-6 bg-sleek-card border border-sleek-main rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <Brain className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-sleek-heading font-display tracking-wider">Salary & Advisory</h3>
                  <p className="text-[10px] text-sleek-muted">Pose queries on local tech compensation indices.</p>
                </div>
              </div>

              <form onSubmit={handleAskAdvisor} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Compensation levels at Grab Singapore?"
                    required
                    value={advisorQuery}
                    onChange={(e) => setAdvisorQuery(e.target.value)}
                    className="w-full bg-sleek-input border border-sleek-input rounded-xl pl-3 pr-10 py-3 text-xs text-sleek-main focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={submittingQuery}
                    className="absolute right-2 top-1.5 p-1.5 text-indigo-400 hover:text-indigo-300 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    "Hanoi Junior React Salary?",
                    "SRE Certs for AWS?",
                    "Postgres database index advice"
                  ].map((preset, pidx) => (
                    <button
                      key={pidx}
                      type="button"
                      onClick={() => setAdvisorQuery(preset)}
                      className="text-[10px] text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 px-2 py-1 rounded-md font-medium cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </form>
            </div>

            <div className="lg:col-span-8 space-y-4 max-h-[520px] overflow-y-auto pr-1">
              {submittingQuery && (
                <div className="p-5 bg-sleek-card border border-sleek-main rounded-xl space-y-3 animate-pulse">
                  <div className="h-3 bg-sleek-input rounded w-1/3" />
                  <div className="space-y-1.5">
                    <div className="h-3 bg-sleek-input rounded w-full" />
                    <div className="h-3 bg-sleek-input rounded w-5/6" />
                  </div>
                </div>
              )}

              {queryHistory.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className="p-5 bg-sleek-card border border-sleek-main rounded-2xl space-y-3 text-left shadow-sm"
                >
                  <div className="flex justify-between items-center text-xs font-semibold text-indigo-400 font-sans">
                    <span>Q: {item.q}</span>
                    <HelpCircle className="w-4 h-4 opacity-50" />
                  </div>
                  <div className="text-xs font-sans text-sleek-main leading-relaxed whitespace-pre-wrap border-t border-sleek-main pt-3">
                    {item.response}
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        )}

        {/* POST GENERATOR FOR LINKEDIN */}
        {activeTab === 'post' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
            
            <div className="lg:col-span-5 p-6 bg-sleek-card border border-sleek-main rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <CornerDownLeft className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-sleek-heading font-display tracking-wider">Draft Professional Milestones</h3>
                  <p className="text-[10px] text-sleek-muted">Craft high-impact social project posts.</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-sleek-muted uppercase tracking-wide mb-2 font-display">Event Category</label>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-sans">
                  {[
                    { id: 'graduation', label: '🎓 CS Graduation' },
                    { id: 'project', label: '🚀 Project Launch' },
                    { id: 'new_job', label: '💼 Tech Position' },
                    { id: 'promotion', label: '✨ Promotion' }
                  ].map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setPostTopic(category.id as any)}
                      className={`py-2.5 px-3 rounded-xl border text-center font-semibold truncate transition-all cursor-pointer ${
                        postTopic === category.id 
                          ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400 shadow-sm' 
                          : 'bg-sleek-input border-sleek-input text-sleek-muted hover:border-sleek-main hover:text-sleek-heading'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-sleek-muted uppercase tracking-wide mb-2 font-display">Personal Context highlights</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Launched CareerVerse full stack portal with responsive dark mode."
                  value={postContext}
                  onChange={(e) => setPostContext(e.target.value)}
                  className="w-full bg-sleek-input border border-sleek-input rounded-xl p-3.5 text-xs text-sleek-main focus:outline-none focus:border-indigo-500 resize-none font-sans"
                />
              </div>

              <button
                type="button"
                onClick={handleGeneratePost}
                disabled={generatingPost}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-sleek-input disabled:text-sleek-muted text-white text-xs font-semibold rounded-xl font-sans transition-all active:scale-98 cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                {generatingPost && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                {generatingPost ? 'Assembling Draft...' : 'Write Social Announcement'}
              </button>
            </div>

            <div className="lg:col-span-7">
              {generatingPost ? (
                /* Elegant Skeleton mockup loader */
                <div className="p-6 bg-sleek-card border border-sleek-main rounded-2xl space-y-4">
                  <div className="h-3 bg-sleek-input animate-pulse rounded w-1/4" />
                  <div className="space-y-2">
                    <div className="h-20 bg-sleek-input animate-pulse rounded-lg" />
                  </div>
                </div>
              ) : generatedDraft ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 bg-sleek-card border border-sleek-main rounded-2xl space-y-4 shadow-sm"
                >
                  <div className="flex justify-between items-center pb-3 border-b border-sleek-main">
                    <span className="text-[10px] font-mono text-sleek-muted uppercase tracking-wider">Social Feed Preview Mockup</span>
                    <button
                      onClick={() => handleCopyToClipboard(generatedDraft)}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                    >
                      {copiedDraft ? (
                        <span className="flex items-center gap-1"><CheckCard className="w-3.5 h-3.5" /> Copied</span>
                      ) : (
                        <span className="flex items-center gap-1"><Copy className="w-3.5 h-3.5" /> Copy Draft</span>
                      )}
                    </button>
                  </div>
                  
                  {/* Visual card mockup layout representing genuine LinkedIn-style presentation */}
                  <div className="bg-sleek-input border border-sleek-input rounded-xl p-4 text-left">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center font-display font-bold text-xs text-indigo-400">
                        {user.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-sleek-heading">{user.fullName}</div>
                        <div className="text-[10px] text-sleek-muted leading-none mt-0.5">{user.headline}</div>
                      </div>
                    </div>
                    <div className="font-sans text-xs max-h-[300px] overflow-y-auto whitespace-pre-wrap leading-relaxed text-sleek-main">
                      {generatedDraft}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Elegant empty status */
                <div className="h-full flex flex-col items-center justify-center p-12 text-center border border-dashed border-sleek-input bg-sleek-card/30 rounded-2xl min-h-[320px]">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center mb-4 shadow-sm text-indigo-400">
                    <CornerDownLeft className="w-8 h-8 opacity-75" />
                  </div>
                  <h4 className="text-sm font-semibold text-sleek-heading">Draft Preview Board</h4>
                  <p className="text-xs text-sleek-muted max-w-sm mt-1.5 leading-relaxed">
                    Set up your achievement markers, choose a theme on the left, and trigger generation to assemble copy variations.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

// Minimal stub components to prevent runtime crashes if misspelled in other loops
function CheckCard(props: any) {
  return <CheckCircle2 className="w-3.5 h-3.5" />;
}
