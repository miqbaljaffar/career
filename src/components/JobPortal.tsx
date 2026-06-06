import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, Search, MapPin, DollarSign, Clock, CheckCircle2, 
  ChevronRight, Plus, Building, Code, Filter, Sparkles, X, Star
} from 'lucide-react';
import { JobListing } from '../types';

interface JobPortalProps {
  jobs: JobListing[];
  onApply: (jobId: string) => void;
  onPostJob: (newJob: Omit<JobListing, 'id' | 'createdAt' | 'applicantsCount' | 'hasApplied'>) => void;
}

export function JobPortal({ jobs, onApply, onPostJob }: JobPortalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All'); // Remote, Hybrid, Onsite, All
  const [filterLevel, setFilterLevel] = useState<string>('All'); // Entry-Level, Mid-Weight, Senior, All
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  
  // Post Job form state
  const [showPostModal, setShowPostModal] = useState(false);
  const [submittingJob, setSubmittingJob] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCompany, setFormCompany] = useState('My Startup');
  const [formLocation, setFormLocation] = useState('Remote');
  const [formType, setFormType] = useState<'Remote' | 'Hybrid' | 'Onsite'>('Remote');
  const [formLevel, setFormLevel] = useState<'Entry-Level' | 'Mid-Weight' | 'Senior' | 'Lead'>('Entry-Level');
  const [formSalary, setFormSalary] = useState('$4,500 - $6,500 / month');
  const [formDescription, setFormDescription] = useState('');
  const [formSkills, setFormSkills] = useState('');
  const [formRequirements, setFormRequirements] = useState('');

  // Toast notifier message
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const displayedJob = selectedJob || jobs[0] || null;

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.skillsRequired.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === 'All' || job.type === filterType;
    const matchesLevel = filterLevel === 'All' || job.experienceLevel === filterLevel;

    return matchesSearch && matchesType && matchesLevel;
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDescription) return;

    setSubmittingJob(true);
    const skillsArray = formSkills.split(',').map(s => s.trim()).filter(Boolean);
    const reqsArray = formRequirements.split('\n').map(r => r.trim()).filter(Boolean);

    onPostJob({
      title: formTitle,
      companyName: formCompany,
      companyLogo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=100",
      location: formLocation,
      type: formType,
      salaryRange: formSalary,
      experienceLevel: formLevel,
      description: formDescription,
      requirements: reqsArray.length > 0 ? reqsArray : ["Demonstrated skill in coding, collaboration & continuous architectural growth."],
      skillsRequired: skillsArray.length > 0 ? skillsArray : ["React", "TypeScript"]
    });

    // Reset states
    setFormTitle('');
    setFormDescription('');
    setFormSkills('');
    setFormRequirements('');
    setSubmittingJob(false);
    setShowPostModal(false);
    triggerToast("Job posted successfully!");
  };

  return (
    <div id="job_portal_panel" className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Toast Alert Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-6 right-6 z-50 bg-indigo-950 border border-indigo-505/30 text-indigo-300 px-4 py-3 rounded-xl shadow-xl text-xs font-sans flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="text-left font-display">
          <h1 className="text-2xl font-bold text-sleek-heading tracking-tight">Active Tech Careers</h1>
          <p className="text-xs text-sleek-muted mt-1 font-sans">Find matched developer, engineering, and PM positions across global tech hubs.</p>
        </div>
        <button
          id="btn_post_job_open"
          onClick={() => setShowPostModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Post Tech Opening
        </button>
      </div>

      {/* Stats indicators bento-style design */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Platform Jobs', val: jobs.length, color: 'text-indigo-400' },
          { label: 'Your Applications', val: jobs.filter(j => j.hasApplied).length, color: 'text-emerald-400' },
          { label: 'Global Reaching', val: '24K+', color: 'text-sky-400' },
          { label: 'Avg Match Index', val: '89.4%', color: 'text-teal-400' }
        ].map((stat, idx) => (
          <div key={idx} className="p-5 bg-sleek-card border border-sleek-main rounded-2xl shadow-sm hover:border-sleek-input transition-all text-left">
            <span className="block text-[10px] uppercase font-bold text-sleek-muted tracking-wider font-display">{stat.label}</span>
            <span className={`block text-2xl font-bold mt-1 tracking-tight ${stat.color}`}>{stat.val}</span>
          </div>
        ))}
      </div>

      {/* Advanced query search bar */}
      <div className="bg-sleek-card border border-sleek-main p-4 rounded-2xl mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-sleek-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role title, companies, or tech skills (React, PostGres...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-sleek-input border border-sleek-input focus:border-indigo-500 focus:outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-sleek-main transition-all placeholder:text-sleek-muted"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-sleek-input border border-sleek-input rounded-xl px-3 py-3 text-xs text-sleek-main focus:outline-none focus:border-indigo-550"
            >
              <option value="All">All Space Layouts</option>
              <option value="Remote">Remote Only</option>
              <option value="Hybrid">Hybrid Office</option>
              <option value="Onsite">Onsite Locations</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full bg-sleek-input border border-sleek-input rounded-xl px-3 py-3 text-xs text-sleek-main focus:outline-none focus:border-indigo-550"
            >
              <option value="All">All Seniorities</option>
              <option value="Entry-Level">Entry-Level</option>
              <option value="Mid-Weight">Mid-Weight / Associate</option>
              <option value="Senior">Senior positions</option>
              <option value="Lead">Lead Principal / Director</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Double Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Left Side: Positions List */}
        <div className="lg:col-span-5 space-y-4">
          {filteredJobs.length === 0 ? (
            /* Elegant empty state */
            <div className="p-12 text-center border border-dashed border-sleek-main bg-sleek-card/30 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center mb-3 mx-auto text-indigo-400">
                <Briefcase className="w-6 h-6 opacity-80" />
              </div>
              <h4 className="text-xs font-bold text-sleek-heading">No careers matched</h4>
              <p className="text-[11px] text-sleek-muted max-w-sm mt-1 leading-relaxed mx-auto">
                Try modifying your query tags or resetting filters to find standard options.
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isSelected = displayedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all relative ${
                    isSelected
                      ? 'bg-sleek-card border-indigo-500/50 shadow-md ring-1 ring-indigo-550/10'
                      : 'bg-sleek-card border-sleek-main hover:border-sleek-input hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <img
                      referrerPolicy="no-referrer"
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-11 h-11 object-cover rounded-xl border border-sleek-input"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-bold text-sleek-muted font-display uppercase tracking-wider">{job.companyName}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                          job.type === 'Remote' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10' :
                          job.type === 'Hybrid' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/10' : 
                          'bg-amber-500/10 text-amber-500 border border-amber-500/10'
                        }`}>
                          {job.type}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-xs sm:text-sm text-sleek-heading mt-1 truncate">{job.title}</h3>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 text-[10px] text-sleek-muted font-mono">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-3" /> {job.salaryRange}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {job.skillsRequired.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-0.5 bg-sleek-input rounded-md text-[10px] font-medium text-sleek-main font-sans border border-sleek-main">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {job.hasApplied && (
                    <div className="mt-4 pt-3 border-t border-sleek-main flex items-center justify-between text-[11px] text-emerald-400 font-semibold font-sans">
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Pitch Registered</span>
                      <span className="bg-emerald-500/10 text-emerald-500 font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-emerald-500/10">{job.status}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Position Details */}
        <div id="job_display_detail" className="lg:col-span-7">
          {displayedJob ? (
            <motion.div 
              layoutId={`job-detail-${displayedJob.id}`}
              className="bg-sleek-card border border-sleek-main rounded-2xl p-6 shadow-sm sticky top-24"
            >
              
              {/* Cover Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sleek-main pb-5">
                <div className="flex items-center gap-4">
                  <img
                    referrerPolicy="no-referrer"
                    src={displayedJob.companyLogo}
                    alt={displayedJob.companyName}
                    className="w-14 h-14 object-cover rounded-2xl border border-sleek-input shadow-inner"
                  />
                  <div>
                    <span className="text-[10px] text-sleek-muted font-bold uppercase tracking-widest block font-display">{displayedJob.companyName}</span>
                    <h2 className="font-display font-medium text-base sm:text-lg text-sleek-heading mt-1 leading-snug">{displayedJob.title}</h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-sleek-muted">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> {displayedJob.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-indigo-400" /> {displayedJob.type}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 text-indigo-400" /> {displayedJob.salaryRange}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="inline-block px-2.5 py-1 bg-sleek-input rounded-full text-[9px] font-bold text-sleek-main font-mono uppercase tracking-wider border border-sleek-main">{displayedJob.experienceLevel}</span>
                  <span className="block text-[10px] text-sleek-muted mt-2 font-mono">{displayedJob.applicantsCount} proposals pitched</span>
                </div>
              </div>

              {/* Requirements & Info */}
              <div className="py-6 space-y-6 border-b border-sleek-main text-xs leading-relaxed">
                
                <div>
                  <h4 className="font-display font-semibold text-[10px] text-sleek-muted uppercase tracking-wider mb-2">Team Mission Statement</h4>
                  <p className="text-sleek-main font-sans text-xs">{displayedJob.description}</p>
                </div>

                <div>
                  <h4 className="font-display font-semibold text-[10px] text-sleek-muted uppercase tracking-wider mb-2">Technical Priorities & Role Fit</h4>
                  <ul className="space-y-2 list-none text-xs text-sleek-main font-sans">
                    {displayedJob.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-400 font-bold select-none">•</span>
                        <span className="flex-1">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-display font-semibold text-[10px] text-sleek-muted uppercase tracking-wider mb-3">Expected Skills Profile Metrics</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {displayedJob.skillsRequired.map((skill, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-sleek-input border border-sleek-input rounded-xl text-sleek-main font-sans font-medium text-xs">
                        <Code className="w-3.5 h-3.5 text-indigo-400" /> {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Call to action proposal pitch bar */}
              <div className="pt-5 flex items-center justify-between gap-4">
                <span className="text-[10px] text-sleek-muted font-mono uppercase tracking-wider">SECURE LINK AGENT ACTIVE</span>
                {displayedJob.hasApplied ? (
                  <button
                    disabled
                    className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-semibold flex items-center gap-2 font-sans"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Application Logged
                  </button>
                ) : (
                  <button
                    id="btn_apply_job"
                    onClick={() => {
                      onApply(displayedJob.id);
                      triggerToast("Quick pitch submitted to hiring desk!");
                    }}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all font-sans"
                  >
                    Submit Quick Pitch
                  </button>
                )}
              </div>

            </motion.div>
          ) : (
            <div className="p-12 text-center text-xs text-sleek-muted bg-sleek-card border border-sleek-main rounded-2xl shadow-sm">
              No technical position selected. Pick a role on the left.
            </div>
          )}
        </div>

      </div>

      {/* MODAL CREATOR FOR POSTING TECH ROLES */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-sleek-card border border-sleek-main w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative"
            >
              
              <div className="flex justify-between items-center px-6 py-4.5 border-b border-sleek-main">
                <div className="text-left font-display">
                  <h2 className="font-semibold text-sm text-sleek-heading">Post Technical Career Openings</h2>
                  <p className="text-[10px] text-sleek-muted mt-0.5">Let sponsors and builders review matches.</p>
                </div>
                <button 
                  id="btn_closing_post_modal"
                  onClick={() => setShowPostModal(false)}
                  className="text-sleek-muted hover:text-sleek-heading p-1.5 rounded-lg hover:bg-sleek-input transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="p-6 space-y-4 max-h-[72vh] overflow-y-auto text-left">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1.5 font-display">Company Branding Name</label>
                    <input
                      type="text"
                      required
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      className="w-full bg-sleek-input border border-sleek-input rounded-xl py-2.5 px-3 text-xs text-sleek-main focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1.5 font-display">Role Title Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Lead TypeScript Engineer"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-sleek-input border border-sleek-input rounded-xl py-2.5 px-3 text-xs text-sleek-main focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1.5 font-display">Workspace Format</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full bg-sleek-input border border-sleek-input rounded-xl py-2.5 px-3 text-xs text-sleek-main focus:outline-none"
                    >
                      <option value="Remote">Remote Only</option>
                      <option value="Hybrid">Hybrid Office</option>
                      <option value="Onsite">On-Site</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1.5 font-display">Expected Seniority</label>
                    <select
                      value={formLevel}
                      onChange={(e) => setFormLevel(e.target.value as any)}
                      className="w-full bg-sleek-input border border-sleek-input rounded-xl py-2.5 px-3 text-xs text-sleek-main focus:outline-none"
                    >
                      <option value="Entry-Level">Entry-Level</option>
                      <option value="Mid-Weight">Mid-Weight</option>
                      <option value="Senior">Senior Lead</option>
                      <option value="Lead">Lead Principal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1.5 font-display">Salary Range</label>
                    <input
                      type="text"
                      placeholder="e.g. S$6,200 - S$9,500 / mo"
                      required
                      value={formSalary}
                      onChange={(e) => setFormSalary(e.target.value)}
                      className="w-full bg-sleek-input border border-sleek-input rounded-xl py-2.5 px-3 text-xs text-sleek-main focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1.5 font-display">Primary Office Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Singapore (Hybrid)"
                      required
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full bg-sleek-input border border-sleek-input rounded-xl py-2.5 px-3 text-xs text-sleek-main focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1.5 font-display">Required Skill Keywords</label>
                    <input
                      type="text"
                      placeholder="React, NestJS, Prisma, SQL"
                      value={formSkills}
                      onChange={(e) => setFormSkills(e.target.value)}
                      className="w-full bg-sleek-input border border-sleek-input rounded-xl py-2.5 px-3 text-xs text-sleek-main focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1.5 font-display">Role objectives description</label>
                  <textarea
                    required
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Provide overview of the tasks, responsibilities, and team requirements."
                    className="w-full bg-sleek-input border border-sleek-input rounded-xl p-3.5 text-xs text-sleek-main focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-sleek-muted uppercase mb-1.5 font-display">Position Prerequisites (one per line)</label>
                  <textarea
                    rows={3}
                    value={formRequirements}
                    onChange={(e) => setFormRequirements(e.target.value)}
                    placeholder="2+ years production node experience&#10;Familiarity with DB indexing models"
                    className="w-full bg-sleek-input border border-sleek-input rounded-xl p-3.5 text-xs text-sleek-main focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-5 border-t border-sleek-main flex justify-end gap-3.5">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="px-4 py-2 border border-sleek-input text-sleek-muted hover:text-sleek-heading hover:bg-sleek-input rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingJob}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    {submittingJob ? 'Publishing...' : 'Publish Career Opening'}
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
