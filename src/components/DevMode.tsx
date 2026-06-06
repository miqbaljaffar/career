import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, Star, GitFork, ArrowRight, Code, Trophy, 
  Activity, RefreshCw, StarIcon, CheckCircle2, Link, Disc 
} from 'lucide-react';
import { UserProfile } from '../types';

interface DevModeProps {
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

interface RepoData {
  name: string;
  description: string;
  stars: number;
  forks: number;
  primaryLanguage: string;
  url: string;
}

interface LanguageShare {
  name: string;
  percentage: number;
  color: string;
}

export function DevMode({ user, onUpdateProfile }: DevModeProps) {
  const [gitUsername, setGitUsername] = useState(user.githubUsername || '');
  const [fetching, setFetching] = useState(false);
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [languages, setLanguages] = useState<LanguageShare[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [activityGrid, setActivityGrid] = useState<{ week: number; commits: number }[]>([]);

  // Auto-fetch if user already has a synced githubUsername in session profile
  useEffect(() => {
    if (user.githubUsername) {
      handleFetchGithub(user.githubUsername);
    }
  }, [user.githubUsername]);

  const handleFetchGithub = async (usernameInput: string) => {
    const targetUser = usernameInput.trim();
    if (!targetUser) return;

    setFetching(true);
    try {
      const res = await fetch(`/api/github/${targetUser}`);
      const data = await res.json();
      
      setRepos(data.repositories || []);
      setLanguages(data.languages || []);
      setTotalStars(data.totalStars || 0);
      setActivityGrid(data.activityGrid || []);
      
      // Update the user's profile with this linked username
      onUpdateProfile({ githubUsername: targetUser });
    } catch (err) {
      console.error("Error fetching repository intelligence maps:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleDisconnect = () => {
    setGitUsername('');
    setRepos([]);
    setLanguages([]);
    setTotalStars(0);
    setActivityGrid([]);
    onUpdateProfile({ githubUsername: undefined });
  };

  // Color mappings for commit intensity values (representing git grid)
  const getCommitColor = (commits: number) => {
    if (commits === 0) return 'bg-sleek-input border border-sleek-main/60';
    if (commits < 3) return 'bg-indigo-500/20 border border-indigo-500/10';
    if (commits < 5) return 'bg-indigo-500/50 border border-indigo-500/20';
    return 'bg-indigo-500 border border-indigo-600';
  };

  return (
    <div id="dev_mode_panel" className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Dev Mode Banner info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="text-left font-display">
          <h2 className="text-xl font-bold text-sleek-heading tracking-tight flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-400 animate-pulse" /> Developer Engine
          </h2>
          <p className="text-xs text-sleek-muted font-sans mt-1">Directly sync and showcase live public repository metrics to elite partners.</p>
        </div>
        
        {user.githubUsername && (
          <button
            onClick={handleDisconnect}
            className="px-3 py-1.5 border border-rose-500/10 hover:border-rose-500/30 text-rose-500 text-xs font-semibold rounded-xl hover:bg-rose-500/5 cursor-pointer font-sans transition-all"
          >
            Disconnect GitHub
          </button>
        )}
      </div>

      {/* SYNCHRONIZER BLOCK */}
      <AnimatePresence mode="wait">
        {!user.githubUsername ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-8 text-center bg-sleek-card border border-sleek-main rounded-2xl max-w-xl mx-auto space-y-6 shadow-sm"
          >
            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl w-fit mx-auto text-indigo-400">
              <Github className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-sm text-sleek-heading">Sync with GitHub</h3>
              <p className="text-xs text-sleek-muted mt-2 max-w-sm mx-auto leading-relaxed">
                Connect your public GitHub username. Let hiring officers, founders, and core engineers view your commit frequencies, languages distribution, and project repository files.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 max-w-sm mx-auto font-sans w-full">
              <div className="relative flex-1 w-full">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-sleek-muted">github.com/</span>
                <input
                  type="text"
                  placeholder="username"
                  value={gitUsername}
                  onChange={(e) => setGitUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleFetchGithub(gitUsername);
                  }}
                  className="w-full bg-sleek-input border border-sleek-input focus:border-indigo-500 focus:outline-none text-xs rounded-xl py-3 pl-24 pr-4 text-sleek-main"
                />
              </div>
              <button
                onClick={() => handleFetchGithub(gitUsername)}
                disabled={fetching}
                className="w-full sm:w-auto py-3 px-5 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-sm cursor-pointer hover:bg-indigo-500 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Link profile</span>
                {fetching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            
            {/* Linked profiles summary bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              
              {/* Visual metrics panel */}
              <div className="md:col-span-8 bg-sleek-card border border-sleek-main rounded-2xl p-6 flex flex-col justify-between text-left shadow-sm">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Github className="w-4 h-4" />
                      </div>
                      <span className="font-display font-semibold text-xs sm:text-sm text-sleek-heading">github.com/{user.githubUsername}</span>
                    </div>
                    <span className="text-[10px] text-sleek-muted font-mono flex items-center gap-1.5 uppercase font-bold tracking-wider">
                      <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Live link active
                    </span>
                  </div>
                  
                  {/* Languages breakdown bar */}
                  <div className="mt-6">
                    <span className="text-[10px] text-sleek-muted uppercase font-bold tracking-wider font-display">Languages Distribution</span>
                    <div className="flex h-3.5 rounded-full overflow-hidden bg-sleek-input mt-2.5">
                      {languages.map((lang, index) => (
                        <div
                          key={index}
                          style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                          title={`${lang.name}: ${lang.percentage}%`}
                          className="transition-all hover:scale-x-105"
                        />
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs font-sans">
                      {languages.map((lang, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-sleek-input px-2.5 py-1 rounded-lg border border-sleek-main">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                          <span className="text-sleek-main font-semibold text-[11px]">{lang.name}</span>
                          <span className="text-sleek-muted font-mono text-[10px]">{lang.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* KPI metrics row */}
                <div className="grid grid-cols-3 gap-4 border-t border-sleek-main pt-5 mt-6 text-center">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-sleek-muted">Synced Repos</span>
                    <span className="block text-xl font-display font-bold text-sleek-heading mt-0.5">{repos.length}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-sleek-muted">Total Stars</span>
                    <span className="block text-xl font-display font-bold text-amber-500 mt-0.5 flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {totalStars}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-sleek-muted">Contributions</span>
                    <span className="block text-xl font-display font-bold text-indigo-400 mt-0.5">946/yr</span>
                  </div>
                </div>

              </div>

              {/* Achievements panel */}
              <div className="md:col-span-4 bg-sleek-card border border-sleek-main rounded-2xl p-6 space-y-4 text-left shadow-sm">
                <h3 className="text-[10px] uppercase font-bold text-sleek-muted font-display tracking-widest flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" /> SYNCED MILESTONES
                </h3>

                <div className="space-y-3 font-sans text-xs">
                  <div className="flex items-start gap-3 p-3 bg-sleek-input border border-sleek-main rounded-xl">
                    <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-indigo-400 font-bold font-mono">10+</span>
                    <div className="flex-1">
                      <span className="block text-sleek-heading font-semibold text-xs">React Virtuoso</span>
                      <span className="block text-sleek-muted text-[10px] mt-0.5">High discrete component definition outputs.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-sleek-input border border-sleek-main rounded-xl">
                    <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-500 font-bold font-mono">4.9</span>
                    <div className="flex-1">
                      <span className="block text-sleek-heading font-semibold text-xs">Code Index Density</span>
                      <span className="block text-sleek-muted text-[10px] mt-0.5">High ratio of public repository engagement.</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* COMMIT ACTIVITY DOCK */}
            <div className="bg-sleek-card border border-sleek-main rounded-2xl p-6 text-left shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-semibold text-sleek-heading font-display">Contributions Stream map</h4>
                <span className="text-[10px] text-sleek-muted uppercase font-mono tracking-wider font-bold">Past 52 Weeks telemetry</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {activityGrid.map((gridItem, index) => (
                  <div
                    key={index}
                    className={`w-3.5 h-3.5 rounded-[3px] transition-all hover:scale-125 cursor-pointer ${getCommitColor(gridItem.commits)}`}
                    title={`Week ${gridItem.week}: ${gridItem.commits} commits completed.`}
                  />
                ))}
              </div>
              
              {/* Visual indicators guide */}
              <div className="flex justify-end gap-2 items-center text-[10px] text-sleek-muted mt-4 font-mono">
                <span>Less</span>
                <span className="w-2.5 h-2.5 bg-sleek-input rounded-[2px] border border-sleek-main" />
                <span className="w-2.5 h-2.5 bg-indigo-500/20 rounded-[2px]" />
                <span className="w-2.5 h-2.5 bg-indigo-500/50 rounded-[2px]" />
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-[2px]" />
                <span>More</span>
              </div>
            </div>

            {/* SYNCED REPOSITORIES DISPLAY */}
            <div className="space-y-4 text-left">
              <h4 className="text-xs font-bold text-sleek-heading font-display uppercase tracking-widest">Repository Cards</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repos.map((repo, i) => (
                  <div key={i} className="p-5 bg-sleek-card border border-sleek-main hover:border-indigo-500/30 rounded-2xl transition-all shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-400" />
                          <h5 className="font-display font-semibold text-xs sm:text-sm text-sleek-heading select-none">{repo.name}</h5>
                        </div>
                        <span className="text-[9px] bg-sleek-input border border-sleek-input text-sleek-main px-2 py-0.5 rounded-full font-mono font-bold uppercase">{repo.primaryLanguage}</span>
                      </div>
                      <p className="text-xs text-sleek-muted font-sans mt-3.5 leading-relaxed min-h-[38px]">{repo.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-sleek-main pt-3 mt-4 text-[10px] text-sleek-muted font-mono">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-amber-500 font-bold"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {repo.stars}</span>
                        <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5" /> {repo.forks}</span>
                      </div>

                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 font-bold text-xs font-sans transition-all"
                      >
                        Source <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
