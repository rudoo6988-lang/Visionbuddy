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
  Instagram
} from 'lucide-react';
import { FirebaseProvider, useAuth } from './components/FirebaseProvider';
import { useWaitlist, useAdminStats } from './lib/waitlist-hook';
import { Countdown } from './components/Countdown';
import { ChatBot } from './components/ChatBot';

// --- Sub-components ---

const InterestCard = () => {
  const { user, login } = useAuth();
  const { hasSignedUp, signUp, loading, totalCount } = useWaitlist();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAction = async () => {
    if (!user) {
      try {
        await login();
        // user will be null in this closure, but useAuth will update and trigger re-render
      } catch (err) {
        console.error("Login failed", err);
      }
      return;
    }
    
    try {
      await signUp();
      setShowSuccess(true);
    } catch (err) {
      console.error("Signup failed", err);
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
              <p className="text-xl font-semibold text-green-400">You are already part of VisionBuddy.</p>
              <p className="text-white/40 text-sm">Welcome to the future.</p>
            </motion.div>
          ) : (
            <motion.button
              key="cta"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAction}
              disabled={loading}
              className="w-full h-20 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-display font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <div className="flex flex-col items-center leading-none">
                  <div className="flex items-center gap-2 mb-1">
                    <Stars size={18} />
                    <span>{user ? "Count Me In" : "Login to Join"}</span>
                    <ArrowRight size={18} />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-mono">
                    {totalCount.toLocaleString()} Joined So Far
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
          <p className="text-white/70 italic mb-6">"{item.text}"</p>
          <div>
            <p className="font-display font-bold text-white">{item.name}</p>
            <p className="text-xs text-white/30 uppercase tracking-widest">{item.role}</p>
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
    <div className="min-h-screen relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[100vh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/4 -left-1/4 w-[50vw] h-[50vw] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-[50vw] h-[50vw] bg-secondary/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-40 glass border-b border-white/5">
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

      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto space-y-32">
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest"
          >
            <Stars size={14} />
            The Future of Vision is Here
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight leading-[1.05]"
          >
            See Beyond The <br /> 
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Visible World.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            VisionBuddy is an AI companion designed to augment human perception. 
            Join the waitlist to be part of the most transformative shift in spatial computing.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pt-10 flex flex-col items-center gap-8"
          >
            <Countdown />
            <div className="flex items-center gap-2 text-white/40 text-sm font-medium uppercase tracking-[0.2em]">
              Launching in Q3 2026
            </div>
          </motion.div>
        </section>

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
          <h2 className="text-4xl font-display font-bold">Join the Movement.</h2>
          <p className="text-white/60 max-w-xl mx-auto text-lg">
            Share Project VisionBuddy with your network and help us shape a more intelligent world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-all font-bold">
              <Twitter size={20} />
              Share on Twitter
            </button>
            <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-bold">
              <Share2 size={20} />
              Copy Link
            </button>
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
             <Twitter size={18} className="hover:text-primary transition-colors cursor-pointer" />
             <Instagram size={18} className="hover:text-primary transition-colors cursor-pointer" />
             <Facebook size={18} className="hover:text-primary transition-colors cursor-pointer" />
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
  const { loading } = useAuth();
  
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
