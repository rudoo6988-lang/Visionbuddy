/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Users, 
  Search, 
  Download, 
  LogOut, 
  ArrowRight, 
  Stars, 
  ShieldCheck, 
  Zap, 
  Globe,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Link2
} from 'lucide-react';
import { FirebaseProvider, useAuth } from './components/FirebaseProvider';
import { useWaitlist, useAdminStats } from './lib/waitlist-hook';
import { Countdown } from './components/Countdown';
import { ChatBot } from './components/ChatBot';

// --- Sub-components ---

const FuturisticBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Dynamic Grid */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] brightness-150 contrast-150 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-grid-white bg-[size:64px_64px]"></div>
      
      {/* Glow lines */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-dark via-transparent to-dark"></div>
      <motion.div 
        animate={{ 
          y: [0, -40, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-20 w-[40vw] h-[40vw] bg-primary/20 blur-[120px] rounded-full"
      />
      <motion.div 
        animate={{ 
          y: [0, 50, 0],
          x: [0, -30, 0],
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 -right-20 w-[50vw] h-[50vw] bg-secondary/20 blur-[150px] rounded-full"
      />
      <motion.div 
        animate={{ 
          y: [0, -60, 0],
          x: [0, -40, 0],
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute top-3/4 left-1/2 -translate-x-1/2 w-[30vw] h-[30vw] bg-accent/15 blur-[100px] rounded-full"
      />

      {/* Floating Glass Squares */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            y: [-20, 20, -20],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{ 
            duration: 10 + i * 2, 
            repeat: Infinity, 
            ease: "linear",
            delay: i * 1.5
          }}
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          className="w-12 h-12 glass border border-white/10 rounded-xl"
        />
      ))}
    </div>
  );
};

const InterestCard = () => {
  const { hasSignedUp, signUp, loading, totalCount } = useWaitlist();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAction = async () => {
    setLocalError(null);
    try {
      await signUp();
    } catch (err: any) {
      setLocalError("Something went wrong. Please try again.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative group lg:max-w-xl mx-auto"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative glass rounded-3xl p-8 md:p-12 text-center space-y-8 neon-border shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-display font-bold leading-tight">
          Yes, I’m interested in Project <span className="text-primary italic">VisionBuddy</span>.
        </h2>
        
        {localError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm">
            {localError}
          </div>
        )}

        <p className="text-white/60 text-lg">
          Join a growing community of visionaries paving the way for the future.
        </p>

        <AnimatePresence mode="wait">
          {hasSignedUp ? (
            <motion.div 
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4 py-4"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                <CheckCircle2 size={48} />
              </div>
              <p className="text-xl font-semibold text-green-400">Already Counted!</p>
              <p className="text-white/40 text-sm">Thank you for joining the movement.</p>
            </motion.div>
          ) : (
            <motion.button
              key="cta"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAction}
              disabled={loading}
              className="w-full h-20 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-display font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <div className="flex flex-col items-center leading-none">
                  <div className="flex items-center gap-2 mb-1">
                    <Stars size={18} />
                    <span>Count Me In</span>
                    <ArrowRight size={18} />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-mono">
                    {totalCount.toLocaleString()} Visionaries So Far
                  </div>
                </div>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/5">
          <div className="flex -space-x-3">
             {[1,2,3,4].map(i => (
               <img 
                 key={i}
                 src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`}
                 className="w-8 h-8 rounded-full border-2 border-dark"
                 alt="Avatar"
               />
             ))}
          </div>
          <span className="text-xs text-white/40 font-medium uppercase tracking-widest">Global Community</span>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const items = [
    { name: "Sarah Chen", role: "AI Ethicist", text: "VisionBuddy is the interface between human perception and digital wisdom I've been waiting for." },
    { name: "Marcus Thorne", role: "Futurist", text: "The most seamless integration of AI into daily vision I've seen. Truly Tesla-level innovation." },
    { name: "Elena Rossi", role: "Product Designer", text: "Elegant, intuitive, and emotionally resonant. This is the future of assisted living." }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="glass p-8 rounded-3xl border border-white/5 hover:bg-white/5 transition-colors"
        >
          <div className="flex gap-1 mb-4 text-primary">
            {[1,2,3,4,5].map(j => <Stars key={j} size={14} fill="currentColor" />)}
          </div>
          <p className="text-white/70 italic mb-6 leading-relaxed">"{item.text}"</p>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center font-bold text-xs border border-white/5">
              {item.name.charAt(0)}
            </div>
            <div>
              <p className="font-display font-bold text-white">{item.name}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">{item.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- Page Components ---

const LandingPage = () => {
  const { login, user } = useAuth();

  return (
    <div className="min-h-screen relative bg-dark">
      <FuturisticBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-40 glass border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Zap className="text-white" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">VisionBuddy</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#" className="hover:text-white transition-colors">Vision</a>
            <a href="#" className="hover:text-white transition-colors">Safety</a>
            <a href="#" className="hover:text-white transition-colors">Company</a>
          </div>

          <div className="flex items-center gap-4">
            {user?.email === 'rudoo6988@gmail.com' && (
              <Link to="/admin" className="text-xs font-bold uppercase tracking-widest text-primary hover:neon-text transition-all">
                Dashboard
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-3 bg-white/5 pr-4 rounded-full border border-white/10">
                <img src={user.photoURL || ''} className="w-8 h-8 rounded-full" alt="Profile" />
                <span className="text-sm font-medium hidden sm:inline">{user.displayName?.split(' ')[0]}</span>
              </div>
            ) : (
              <button 
                onClick={login}
                className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/5 transition-all text-sm font-semibold"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto space-y-32 relative z-10">
        {/* Hero Section */}
        <motion.section 
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.1 } }
          }}
          className="text-center space-y-8 max-w-4xl mx-auto relative shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)]"
        >
          {/* Scanning Ray Detail */}
          <motion.div 
            animate={{ 
              top: ["0%", "100%", "0%"],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm pointer-events-none z-20"
          />

          <motion.div
            variants={{
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 }
            }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest backdrop-blur-md"
          >
            <Stars size={14} />
            The Future of Vision is Here
          </motion.div>
          
          <motion.h1 
            variants={{
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0 }
            }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight leading-[1.05]"
          >
            See Beyond The <br /> 
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent italic">Visible World.</span>
          </motion.h1>

          <motion.p 
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 }
            }}
            className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            VisionBuddy is an AI companion designed to augment human perception. 
            Join the waitlist to be part of the most transformative shift in spatial computing.
          </motion.p>
          
          <motion.div 
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 }
            }}
            className="pt-10 flex flex-col items-center gap-8"
          >
            <Countdown />
            <div className="flex items-center gap-2 text-white/40 text-sm font-medium uppercase tracking-[0.2em]">
              Launching in Q3 2026
            </div>
          </motion.div>
        </motion.section>

        {/* Interest Section */}
        <section id="waitlist" className="py-20 relative">
          <InterestCard />
        </section>

        {/* Features / Testimonials */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
             <h2 className="text-3xl md:text-4xl font-display font-bold">Trusted by the Future.</h2>
             <p className="text-white/40 max-w-lg mx-auto">Industry leaders and early adopters are already talking about the VisionBuddy impact.</p>
          </div>
          <Testimonials />
        </section>

        {/* Share Section */}
        <section className="glass rounded-[3rem] p-12 md:p-20 text-center space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-primary/10">
            <Globe size={120} />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold">Join the Movement.</h2>
          <p className="text-white/60 max-w-xl mx-auto text-lg leading-relaxed">
            Share Project VisionBuddy with your network and help us shape a more intelligent world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const text = encodeURIComponent("I just joined the VisionBuddy waitlist! The future of augmented vision is coming. 👁️⚡ #VisionBuddy #AI #Tech");
                const url = encodeURIComponent(window.location.href);
                window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
              }}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-all font-bold shadow-lg shadow-[#1DA1F2]/5"
            >
              <Twitter size={20} />
              Twitter
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const url = encodeURIComponent(window.location.href);
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
              }}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#1877F2]/10 border border-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2]/20 transition-all font-bold shadow-lg shadow-[#1877F2]/5"
            >
              <Facebook size={20} />
              Facebook
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const url = encodeURIComponent(window.location.href);
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
              }}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-all font-bold shadow-lg shadow-[#0A66C2]/5"
            >
              <Linkedin size={20} />
              LinkedIn
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.open(`https://www.instagram.com/visionbuddy_india/`, '_blank');
              }}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#E4405F]/10 border border-[#E4405F]/20 text-[#E4405F] hover:bg-[#E4405F]/20 transition-all font-bold shadow-lg shadow-[#E4405F]/5"
            >
              <Instagram size={20} />
              Instagram
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                const btn = document.activeElement as HTMLButtonElement;
                const originalText = btn.innerHTML;
                btn.innerHTML = '<span class="flex items-center gap-2"><CheckCircle2 size={20} /> Copied!</span>';
                setTimeout(() => {
                  btn.innerHTML = originalText;
                }, 2000);
              }}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-bold min-w-[160px]"
            >
              <Link2 size={20} />
              Copy Link
            </motion.button>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2 grayscale brightness-200 opacity-50">
            <Zap size={20} fill="currentColor" />
            <span className="font-display font-bold text-lg">VisionBuddy</span>
          </div>
          <p className="text-white/30 text-xs font-medium uppercase tracking-widest">
            © 2026 Project VisionBuddy. All rights reserved.
          </p>
          <div className="flex gap-6 text-white/30">
             <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
               <Twitter size={18} />
             </a>
             <a href="https://www.instagram.com/visionbuddy_india/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
               <Instagram size={18} />
             </a>
             <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
               <Facebook size={18} />
             </a>
          </div>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
};

const AdminDashboard = () => {
  const { isAdmin, logout, loading: authLoading } = useAuth();
  const { data, loading: statsLoading } = useAdminStats();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-white/30 text-xs uppercase tracking-widest animate-pulse font-medium">Syncing Admin Access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  const filteredData = useMemo(() => {
    return data.filter(s => 
      s.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'UID', 'Timestamp'];
    const rows = filteredData.map(s => [s.displayName, s.email, s.uid, s.timestamp]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + "\n"
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `visionbuddy_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black">
        <div className="flex items-center gap-4">
          <Link to="/" className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5">
             <ArrowRight className="rotate-180" size={18} />
          </Link>
          <h1 className="text-xl font-display font-bold">Admin <span className="text-primary">Dashboard</span></h1>
        </div>
        <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-500 transition-all text-sm font-bold">
           <LogOut size={16} />
           Sign Out
        </button>
      </nav>

      <main className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-2xl border border-white/5">
            <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-2">Total Interested</p>
            <p className="text-4xl font-display font-bold text-primary">{data.length.toLocaleString()}</p>
          </div>
          <div className="md:col-span-2 glass p-6 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
             <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all"
                />
             </div>
             <button 
               onClick={exportCSV}
               className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:opacity-90 transition-all font-bold whitespace-nowrap"
             >
                <Download size={18} />
                Export CSV
             </button>
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          {statsLoading ? (
            <div className="p-20 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <p className="text-white/40 animate-pulse">Syncing with neural link...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-xs text-white/40 uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Signed Up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredData.map((s, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={s.photoURL} alt="" className="w-10 h-10 rounded-lg border border-white/10" />
                          <span className="font-medium group-hover:text-primary transition-colors">{s.displayName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/60 text-sm">{s.email}</td>
                      <td className="px-6 py-4 text-white/30 font-mono text-xs">{s.uid.slice(0, 8)}...</td>
                      <td className="px-6 py-4 text-white/60 text-sm whitespace-nowrap">{s.timestamp}</td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center text-white/30 italic">
                        No entries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const LandingPageWrapper = () => {
  const { loading, error } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-display font-bold animate-pulse">VisionBuddy</h2>
          <p className="text-white/30 text-xs uppercase tracking-widest">Initializing Neural Interface...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-6 p-6">
        <div className="text-red-500 font-bold text-center">Initialization Error</div>
        <p className="text-white/40 text-center max-w-sm">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 font-bold"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return <LandingPage />;
};

// --- Main Root ---

export default function App() {
  return (
    <FirebaseProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPageWrapper />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </FirebaseProvider>
  );
}
