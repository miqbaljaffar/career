import { useState } from 'react';
import { Sparkles, Briefcase, ArrowRight, UserCheck, Shield, ChevronDown, Check, Globe, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onStartApp: () => void;
}

export function LandingPage({ onStartApp }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { value: "450K+", label: "Verified Developers" },
    { value: "1,200+", label: "Recruiters Online" },
    { value: "140,000+", label: "Matches Sparked" },
    { value: "94.2%", label: "ATS Improvement" }
  ];

  const features = [
    {
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      title: "Interactive AI Career Mentorship",
      desc: "Instant resume evaluations, customized interview prep simulations, and structural roadmap generators powered by real-time Gemini LLM feeds."
    },
    {
      icon: <Briefcase className="w-5 h-5 text-blue-400" />,
      title: "Geographical Job Portal",
      desc: "Highly-granular search filtering across Southeast Asia tech hubs for hybrid, remote, and onsite developer openings."
    },
    {
      icon: <Globe className="w-5 h-5 text-indigo-400" />,
      title: "Visual Portfolios & Dev Mode",
      desc: "Connect your GitHub profile to immediately compile stellar language infographics, commit activity maps, and interactive displays."
    }
  ];

  const testimonials = [
    {
      quote: "CareerVerse made updating my profile fun. The AI optimizer generated three headlines that immediately brought in double the recruiter responses inside Grab!",
      author: "Irwan Syah",
      role: "Junior React Dev, Jakarta"
    },
    {
      quote: "The ATS Score reviewer was spot-on. It pointed out three missing metrics in my engineering intern descriptions that saved my application process.",
      author: "Clara Nguyen",
      role: "NUS Graduate 25, Singapore"
    }
  ];

  const faqs = [
    {
      q: "How does the AI Career Coach help me?",
      a: "It acts as a private, 24/7 technical recruiter. You upload your resume metadata or copy your current text, and it immediately highlights spelling errors, missing keywords based on industry standard postings, and suggests powerful replacements to bypass corporate filters."
    },
    {
      q: "Can I use CareerVerse to hire other professionals?",
      a: "Absolutely! Recruiter or Company accounts can instantly toggle on 'Employer Mode' to publish new job descriptions, look up applicant CV matches, and check automatic compatibility index points."
    },
    {
      q: "Is there a charge to integrate my GitHub profile?",
      a: "No, GitHub Integration is 100% free! Entering your public username visualizes language contributions, repo statistics, and charts. Premium plans are strictly for advanced career telemetry, unlimited AI calls, and seeing who viewed your credentials."
    }
  ];

  return (
    <div id="landing_container" className="min-h-screen bg-sleek-main text-sleek-main overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-300">
      
      {/* Visual background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Modern navigation header */}
      <header id="landing_header" className="border-b border-sleek-main bg-sleek-main/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-emerald-600 to-indigo-600 rounded-lg shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-semibold text-lg tracking-tight bg-gradient-to-r from-sleek-heading via-indigo-400 to-indigo-500 bg-clip-text text-transparent">
              CareerVerse
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              id="btn_launch_platform"
              onClick={onStartApp}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-97 cursor-pointer"
            >
              Enter App <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero_section" className="relative pt-20 pb-16 px-4 md:px-8 text-center max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sleek-card border border-sleek-main rounded-full text-xs text-sleek-muted mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            AI-Driven Professional Network & Recruiter Portal
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-sleek-heading leading-tight mb-6">
            The Hub for Next-Gen <br />
            <span className="bg-gradient-to-r from-emerald-500 via-indigo-400 to-indigo-600 bg-clip-text text-transparent">
              Southeast Asian Software Talents
            </span>
          </h1>

          <p className="text-sleek-muted md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            Build your professional identity, showcase live projects with live GitHub stats, find career opportunities, and level-up your resume with an interactive 24/7 AI Mentor.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              id="get_started_hero"
              onClick={onStartApp}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              Start Building Identity <ArrowRight className="w-5 h-5" />
            </button>
            <a 
              href="#faqs_section"
              className="w-full sm:w-auto px-6 py-4 bg-sleek-input hover:bg-sleek-active text-sleek-main border border-sleek-input font-medium rounded-xl transition-all flex items-center justify-center"
            >
              See FAQ
            </a>
          </div>
        </motion.div>
      </section>

      {/* Stats counter */}
      <section id="stats_section" className="border-y border-sleek-main bg-sleek-card/20 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-semibold text-sleek-heading mb-2 bg-gradient-to-r from-sleek-heading to-sleek-muted bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs text-sleek-muted tracking-wider uppercase font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Companies hiring section */}
      <section id="companies_section" className="py-12 text-center text-sleek-muted text-sm max-w-4xl mx-auto px-4">
        <p className="mb-6 uppercase tracking-widest text-[10px] font-bold text-sleek-muted/60">Leading Recruiters Hiring On-Platform</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
          <span className="font-display font-bold text-lg text-sleek-heading">Grab</span>
          <span className="font-display font-bold text-lg text-sleek-heading">Shopee</span>
          <span className="font-display font-medium text-lg text-sleek-heading">GovTech</span>
          <span className="font-display font-extrabold text-lg text-sleek-heading">Canva</span>
          <span className="font-display font-semibold text-lg text-sleek-heading">NOTION</span>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features_section" className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-sleek-heading mb-4">
            A Billion-dollar Suite for Early Tech Careers
          </h2>
          <p className="text-sleek-muted font-sans max-w-lg mx-auto">Everything you need to showcase project files, connect with teammates, and automate your resume keyword optimizations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div key={idx} className="p-6 bg-sleek-card border border-sleek-main hover:border-indigo-500/20 rounded-2xl transition-all shadow-sm">
              <div className="p-3 bg-sleek-input rounded-xl w-fit mb-6 border border-sleek-input">
                {feat.icon}
              </div>
              <h3 className="font-display font-medium text-lg text-sleek-heading mb-3">
                {feat.title}
              </h3>
              <p className="text-sleek-muted text-sm leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Coach Showcase Module */}
      <section id="ai_showcase" className="py-12 bg-sleek-card/30 border-y border-sleek-main px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 text-left">
            <div className="inline-flex gap-1 items-center text-xs text-indigo-400 font-medium px-2.5 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 mb-4">
              <Sparkles className="w-3 h-3" /> Real-time Gemini LLM
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-sleek-heading mb-4">
              Instant Profile and Resume Optimization
            </h2>
            <p className="text-sleek-muted text-sm leading-relaxed mb-6">
              Our full-stack AI career module will scan your raw headline, bio descriptions and experiences to produce concrete ATS improvement scores. Avoid corporate filter rejection, identify missing skills, and instantly generate cohesive personal brands.
            </p>
            <div className="space-y-3 text-xs text-sleek-muted">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" /> ATS Compatibility Score (0 - 100)
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" /> Custom Headline & Bio optimization suggestions
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" /> Gemini API-driven learning roadmaps
              </div>
            </div>
          </div>
          <div className="md:col-span-7 bg-sleek-card border border-sleek-main rounded-2xl p-6 relative overflow-hidden shadow-inner">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between border-b border-sleek-main pb-3 mb-4 text-xs font-mono text-sleek-muted">
              <span>CareerVerse AI Copilot v2.4</span>
              <span className="text-emerald-500 font-semibold">● Gemini Active</span>
            </div>
            
            <div className="space-y-4 text-left">
              <div className="p-3 bg-sleek-input border border-sleek-input rounded-xl text-xs font-mono">
                <span className="text-indigo-400 font-semibold">[Input] Current Headline:</span>
                <p className="text-sleek-muted mt-1">"CS Graduate looking for an entry web job"</p>
              </div>
              
              <div className="text-center py-1">
                <div className="h-6 w-[2px] bg-emerald-550 mx-auto opacity-70" />
              </div>

              <div className="p-4 bg-sleek-input border border-sleek-input rounded-xl shadow-md">
                <div className="flex items-center gap-1 text-xs text-indigo-400 font-medium mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> High-Impact Suggestion:
                </div>
                <p className="text-sm text-sleek-heading font-sans font-medium mb-3">
                  "Full-Stack Engineer & NUS Scholar | Frontend Specialized (React, Node.js) | Developed systems for 200k+ global active users at Grab"
                </p>
                <div className="flex gap-4">
                  <div className="text-[11px] text-sleek-muted">
                    <span className="text-emerald-500 font-bold block">↑ 18%</span> Recruiter Reach
                  </div>
                  <div className="text-[11px] text-sleek-muted">
                    <span className="text-emerald-500 font-bold block">↑ 92</span> Match Score
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials_section" className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl text-center font-semibold text-sleek-heading mb-16">
          Loved by Engineers & Grads
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((test, index) => (
            <div key={index} className="p-6 bg-sleek-card border border-sleek-main rounded-2xl relative">
              <div className="text-indigo-500/10 text-6xl absolute top-4 left-4 font-serif pointer-events-none">“</div>
              <p className="text-sleek-main relative z-10 italic text-sm leading-relaxed mb-6 font-medium">
                {test.quote}
              </p>
              <div>
                <span className="block text-sleek-heading font-semibold text-sm">{test.author}</span>
                <span className="block text-sleek-muted text-xs mt-0.5">{test.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Matrix */}
      <section id="pricing_section" className="py-16 bg-sleek-card/10 border-t border-sleek-main px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-sleek-heading mb-4">Elevate with Premium</h2>
          <p className="text-sleek-muted text-sm max-w-md mx-auto mb-12">Level up with infinite AI assessments, complete resume score telemetry, priority recruiter messages, and visitor insights.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch text-left">
            <div className="p-8 bg-sleek-card border border-sleek-main rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-sleek-muted font-bold">Standard Candidate</span>
                <div className="text-3xl font-display font-semibold text-sleek-heading mt-2 mb-4">$0 <span className="text-xs text-sleek-muted font-normal">/ Always Free</span></div>
                <p className="text-sleek-muted text-xs leading-relaxed mb-6">Create visual identity pages, showcase 2 projects, look up Southeast Asia job directories, and perform 3 AI coaching cycles daily.</p>
                
                <ul className="space-y-3 text-xs text-sleek-muted mb-8">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Complete visual profile builder</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Interactive job applications</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Live personal direct messages</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> GitHub Repo metrics engine</li>
                </ul>
              </div>
              <button onClick={onStartApp} className="w-full py-3 bg-sleek-input hover:bg-sleek-active text-sleek-heading border border-sleek-input rounded-xl text-xs font-semibold cursor-pointer text-center">Get Free Access</button>
            </div>

            <div className="p-8 bg-sleek-card border border-indigo-500/30 rounded-2xl relative shadow-md flex flex-col justify-between">
              <span className="absolute top-4 right-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-bold px-2 py-0.5 rounded-full">POPULAR</span>
              <div>
                <span className="text-xs uppercase tracking-wider text-indigo-500 font-bold">CareerVerse Advanced</span>
                <div className="text-3xl font-display font-semibold text-sleek-heading mt-2 mb-4">$19 <span className="text-xs text-sleek-muted font-normal">/ month</span></div>
                <p className="text-sleek-muted text-xs leading-relaxed mb-6">Designed for ambitious graduates and contractors. Get complete telemetries, priority submissions, and unlimited AI coaching modules.</p>
                
                <ul className="space-y-3 text-xs text-sleek-muted mb-8">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> EVERYTHING in Standard Free</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> <strong>Unlimited Gemini AI</strong> consultation</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Advanced profile visitor insights</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> VIP priority tagging on job apps</li>
                </ul>
              </div>
              <button onClick={onStartApp} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer text-center">Subscribe Premium</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs_section" className="py-20 max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-2xl md:text-3xl text-center font-semibold text-sleek-heading mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-sleek-card border border-sleek-main rounded-xl overflow-hidden transition-all">
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-medium text-sm text-sleek-heading select-none cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-sleek-muted transition-transform ${activeFaq === idx ? 'transform rotate-180 text-indigo-400' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="p-5 pt-0 border-t border-sleek-main text-xs text-sleek-muted leading-relaxed font-sans">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Landing Footer */}
      <footer id="landing_footer" className="border-t border-sleek-main py-12 px-4 bg-sleek-card/20 text-center text-xs text-sleek-muted">
        <p className="mb-4">© 2026 CareerVerse Platform. Built with Google GenAI & Vite Express Web-containers.</p>
        <div className="flex justify-center gap-6">
          <a href="#" className="hover:text-sleek-heading">Privacy Policy</a>
          <a href="#" className="hover:text-sleek-heading">Terms of Service</a>
          <a href="#" className="hover:text-sleek-heading">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}
