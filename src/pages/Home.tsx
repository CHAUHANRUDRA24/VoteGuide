import { Link } from 'react-router-dom';
import { ArrowRight, Bot, CheckCircle, Gavel, Accessibility, UserCheck, MapPin, Inbox, ScrollText } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import Lenis from 'lenis';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize Lenis for smooth scroll animation
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, y: 0,
      transition: { stiffness: 100 }
    },
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="flex-grow flex flex-col relative w-full pt-16"
    >
      <div className="absolute top-20 -left-20 w-64 h-64 bg-primary-fixed/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-40 -right-20 w-80 h-80 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Hero Section */}
      <motion.section variants={itemVariants} className="flex flex-col items-center justify-center text-center px-6 min-h-[60vh] max-w-4xl mx-auto z-10 space-y-8">
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <span className="glass-panel px-4 py-2 rounded-full font-bold text-xs text-primary flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Non-Partisan
          </span>
          <span className="glass-panel px-4 py-2 rounded-full font-bold text-xs text-secondary flex items-center gap-2">
            <Gavel className="w-4 h-4" /> ECI-Inspired
          </span>
          <span className="glass-panel px-4 py-2 rounded-full font-bold text-xs text-secondary-container flex items-center gap-2">
            <Accessibility className="w-4 h-4" /> Accessible
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-primary leading-tight">
          Understand Elections,<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary-container">Step by Step</span>
        </h1>
        
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto">
          An AI-powered civic assistant that makes the election process simple, interactive, and easy to follow. Demystifying democracy for everyone.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
          <Link to={isAuthenticated ? "/journey" : "/signin"} className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2">
            Start Learning <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.section>

      {/* The Election Journey Cards */}
      <section className="py-24 px-6 max-w-[1280px] mx-auto w-full relative z-10">
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">The Election Journey</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">Follow the process from confirming your eligibility to verifying your vote.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative pt-4">
          <div className="hidden md:block absolute top-10 left-[12.5%] w-[75%] h-1 bg-surface-variant z-0">
            <motion.div 
              initial={{ width: 0 }} 
              whileInView={{ width: '33.33%' }} 
              viewport={{ once: true }} 
              transition={{ duration: 1, ease: 'easeOut' }} 
              className="absolute top-0 left-0 h-full bg-secondary"
            ></motion.div>
          </div>
          
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="flex flex-col items-center group relative z-10">
            <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center mb-4 shadow-lg shadow-secondary/30 relative">
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="glass-panel p-6 rounded-xl text-center w-full">
              <h3 className="text-xl font-semibold text-primary mb-2">Eligibility</h3>
              <p className="text-sm text-on-surface-variant">Check your voter registration status and requirements.</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="flex flex-col items-center group relative z-10">
            <div className="w-12 h-12 rounded-full bg-surface text-primary border-2 border-secondary flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="glass-panel p-6 rounded-xl text-center w-full">
              <h3 className="text-xl font-semibold text-primary mb-2">Polling Booth</h3>
              <p className="text-sm text-on-surface-variant">Locate your designated voting station securely.</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="flex flex-col items-center group relative z-10">
            <div className="w-12 h-12 rounded-full bg-surface text-outline flex items-center justify-center mb-4 border-2 border-outline-variant hover:border-secondary transition-colors">
              <Inbox className="w-6 h-6 group-hover:text-secondary transition-colors" />
            </div>
            <div className="glass-panel p-6 rounded-xl text-center w-full opacity-80 group-hover:opacity-100 transition-opacity">
              <h3 className="text-xl font-semibold text-outline group-hover:text-secondary transition-colors mb-2">Cast Vote</h3>
              <p className="text-sm text-on-surface-variant">Understand EVM usage and the voting procedure.</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="flex flex-col items-center group relative z-10" role="article" aria-label="Step 4: VVPAT">
            <div className="w-12 h-12 rounded-full bg-surface text-outline border-2 border-outline-variant border-dashed flex items-center justify-center mb-4 hover:border-secondary hover:border-solid transition-all">
              <ScrollText className="w-6 h-6 group-hover:text-secondary transition-colors" />
            </div>
            <div className="glass-panel p-6 rounded-xl text-center w-full opacity-80 group-hover:opacity-100 transition-opacity">
              <h3 className="text-xl font-semibold text-outline group-hover:text-secondary transition-colors mb-2">VVPAT</h3>
              <p className="text-sm text-on-surface-variant">Verify your vote with the paper audit trail.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grids */}
      <section className="py-24 px-6 max-w-[1280px] mx-auto w-full relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Everything You Need to Vote</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">Our platform equips you with the tools and knowledge to participate confidently in the democratic process.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Bot, title: 'AI Assistant', desc: 'Ask complex questions about election laws, candidate backgrounds, and voting procedures in any language.' },
              { icon: MapPin, title: 'Find Your Booth', desc: 'Locate your exact polling station using your voter ID on our interactive map.' },
              { icon: UserCheck, title: 'Check Eligibility', desc: 'Quickly verify if you are registered to vote and find out what documents you need.' },
              { icon: Inbox, title: 'Registration Help', desc: 'Step-by-step guidance on how to register to vote or update your existing details.' },
              { icon: ScrollText, title: 'Candidate Info', desc: 'Unbiased, summarized data on candidates in your constituency.' },
              { icon: Accessibility, title: 'Inclusive Access', desc: 'Information on accessibility features available at your local polling station.' },
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants} className="flex gap-4 p-6 glass-panel rounded-2xl hover:shadow-lg transition-shadow">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg mb-2">{feature.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* NEW: Upcoming Elections Highlights */}
      <section className="py-24 px-6 max-w-[1280px] mx-auto w-full relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-8"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Current Election Events</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">Stay informed about the latest democratic opportunities across the nation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { region: "National", title: "General Elections 2024", date: "April - June", type: "Parliamentary", status: "Upcoming", color: "bg-[#1da1f2]/10 text-[#1da1f2]" },
              { region: "Maharashtra", title: "State Assembly Elections", date: "October 2024", type: "Legislative", status: "Announced", color: "bg-surface-variant text-on-surface" },
              { region: "Haryana", title: "State Assembly Elections", date: "October 2024", type: "Legislative", status: "Announced", color: "bg-surface-variant text-on-surface" }
            ].map((election, i) => (
              <motion.div key={i} variants={itemVariants} className="glass-panel p-6 rounded-2xl border border-surface-variant hover:border-primary transition-colors cursor-default">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${election.color}`}>{election.region}</span>
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{election.status}</span>
                </div>
                <h3 className="font-bold text-xl text-primary mb-1">{election.title}</h3>
                <p className="text-on-surface-variant text-sm mb-4">{election.type} Election</p>
                <div className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/5 px-3 py-2 rounded-lg inline-flex">
                  <MapPin className="w-4 h-4" /> {election.date}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
