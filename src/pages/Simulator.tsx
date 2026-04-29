import { useState, useEffect } from 'react';
import { Leaf, Lightbulb, Scale, Ban, EyeOff, Info, Check, MousePointerClick, Volume2, ShieldCheck, Fingerprint, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Simulator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [votingState, setVotingState] = useState<'idle' | 'voting' | 'printed' | 'done'>('idle');
  const [voteTimestamp, setVoteTimestamp] = useState<Date | null>(null);

  const candidates = [
    { id: 1, name: 'Arjun Mehta', party: 'GREEN EARTH PARTY', icon: Leaf, color: 'text-primary' },
    { id: 2, name: 'Priya Sharma', party: 'PROGRESSIVE ALLIANCE', icon: Lightbulb, color: 'text-secondary' },
    { id: 3, name: 'David Chen', party: 'CIVIC DUTY FRONT', icon: Scale, color: 'text-on-tertiary-container' },
    { id: 4, name: 'NOTA', party: 'NONE OF THE ABOVE', icon: Ban, color: 'text-outline' },
  ];

  const handleVote = (id: number) => {
    if (votingState !== 'idle') return;
    
    setSelectedCandidate(id);
    setVotingState('voting');

    // Simulate VVPAT processing delay
    setTimeout(() => {
      setVotingState('printed');
      setVoteTimestamp(new Date());
      
      // VVPAT is visible for 7 seconds
      setTimeout(() => {
        setVotingState('done');
      }, 7000);
    }, 1500); 
  };

  const activeCandidate = candidates.find(c => c.id === selectedCandidate);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow pt-8 pb-24 lg:pb-12 px-6 max-w-[1280px] mx-auto w-full flex flex-col lg:flex-row gap-6"
    >
      {/* Interactive Canvas Area */}
      <section className="flex-grow flex flex-col gap-6">
        {/* Step Header */}
        <header className="glass-panel rounded-xl p-6 shadow-sm mb-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary">Polling Station Simulator</h1>
            <div className="flex items-center gap-2 text-secondary">
              <span className="font-bold uppercase tracking-wider text-xs">Step {currentStep} of 5</span>
            </div>
          </div>
          <p className="text-lg text-on-surface-variant">
            {currentStep === 1 && "Start by verifying your Voter ID with the Polling Officer."}
            {currentStep === 2 && "The officer will mark your left index finger with indelible ink."}
            {currentStep >= 3 && "Experience the electronic voting process. Cast your simulated vote below."}
          </p>
          
          {/* Progress Tracker */}
          <div className="w-full bg-surface-container-highest rounded-full h-2 mt-4 overflow-hidden flex">
            <div className={`h-full w-1/5 border-r border-background transition-colors duration-1000 ${currentStep >= 1 ? 'bg-secondary' : 'bg-surface-dim'}`}></div>
            <div className={`h-full w-1/5 border-r border-background transition-colors duration-1000 ${currentStep >= 2 ? 'bg-secondary' : 'bg-surface-dim'}`}></div>
            <div className={`h-full w-1/5 border-r border-background transition-colors duration-1000 ${currentStep >= 3 ? 'bg-secondary' : 'bg-surface-dim'} shadow-[0_0_8px_rgba(113,42,226,0.6)]`}></div>
            <div className={`h-full w-1/5 border-r border-background transition-colors duration-1000 ${votingState === 'printed' || votingState === 'done' ? 'bg-secondary' : 'bg-surface-dim'}`}></div>
            <div className={`h-full w-1/5 transition-colors duration-1000 ${votingState === 'done' ? 'bg-secondary' : 'bg-surface-dim'}`}></div>
          </div>
          <div className="flex justify-between text-on-surface-variant font-bold text-xs mt-2 px-1">
            <span className={currentStep >= 1 ? 'text-secondary' : ''}>ID</span>
            <span className={currentStep >= 2 ? 'text-secondary' : ''}>Ink</span>
            <span className={currentStep >= 3 ? 'text-secondary' : ''}>Vote</span>
            <span className={votingState === 'printed' || votingState === 'done' ? 'text-secondary' : ''}>VVPAT</span>
            <span className={votingState === 'done' ? 'text-secondary' : ''}>Done</span>
          </div>
        </header>

        <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-panel rounded-xl shadow-lg border-outline-variant p-6 md:p-10 flex-grow flex flex-col items-center justify-center relative bg-gradient-to-br from-surface to-surface-container-low text-center min-h-[400px]"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-4">Identity Verification</h2>
            <p className="text-on-surface-variant max-w-md mb-8">
              At the polling station, the First Polling Officer checks your name on the voter list and verifies your ID document.
            </p>
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-primary text-white px-8 py-3 rounded-full text-base font-bold shadow-md flex items-center gap-2 hover:scale-105 transition-all"
            >
              Present Voter ID <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-panel rounded-xl shadow-lg border-outline-variant p-6 md:p-10 flex-grow flex flex-col items-center justify-center relative bg-gradient-to-br from-surface to-surface-container-low text-center min-h-[400px]"
          >
            <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
              <Fingerprint className="w-12 h-12 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-4">Indelible Ink</h2>
            <p className="text-on-surface-variant max-w-md mb-8">
              The Second Polling Officer marks your left index finger with indelible ink, asks you to sign the register, and issues a voter slip.
            </p>
            <button
              onClick={() => setCurrentStep(3)}
              className="bg-secondary text-white px-8 py-3 rounded-full text-base font-bold shadow-md flex items-center gap-2 hover:scale-105 transition-all"
            >
              Get Inked & Proceed <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {currentStep === 3 && (
        <motion.div 
          key="step3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="glass-panel rounded-xl shadow-lg border-outline-variant p-6 md:p-10 flex-grow flex items-center justify-center relative bg-gradient-to-br from-surface to-surface-container-low overflow-hidden"
        >
          {/* Main Interactive Component: EVM Machine */}
          {/* EVM Body */}
          <div className="bg-[#e0e0e0] w-full max-w-2xl rounded border-4 border-[#b0b0b0] shadow-2xl relative p-6 font-sans text-on-surface flex flex-col gap-4">
            
            {/* EVM Header */}
            <div className="bg-[#d0d0d0] border-b-2 border-[#a0a0a0] -mx-6 -mt-6 p-4 flex justify-between items-center mb-2">
              <div className="text-xl font-bold text-primary-fixed-variant tracking-wider uppercase">Ballot Unit</div>
              <div className="flex gap-2">
                <div className={`w-3 h-3 rounded-full ${votingState !== 'idle' ? 'bg-error shadow-[0_0_8px_red]' : 'bg-error/30'}`}></div>
                <div className={`w-3 h-3 rounded-full ${votingState === 'done' ? 'bg-[green] shadow-[0_0_8px_green]' : 'bg-[green]/30'}`}></div>
              </div>
            </div>

            {/* Candidate List Grid */}
            <div className="flex flex-col gap-2">
              {candidates.map((cand) => (
                <div key={cand.id} className={`flex items-center gap-4 bg-white border border-outline-variant rounded p-2 transition-colors ${cand.id === 4 ? 'mt-2 border-t-4 border-t-outline-variant' : ''}`}>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-surface-container-highest rounded flex items-center justify-center text-lg md:text-xl font-bold border border-outline-variant shrink-0">
                    {cand.id}
                  </div>
                  <div className="flex-grow flex items-center gap-3 md:gap-4 border-l border-r border-outline-variant px-2 md:px-4 shrink min-w-0">
                    <cand.icon className={`w-6 h-6 md:w-8 md:h-8 shrink-0 ${cand.color}`} />
                    <div className="truncate">
                      <h3 className="text-lg md:text-xl font-semibold leading-none truncate">{cand.name}</h3>
                      <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase truncate block">{cand.party}</span>
                    </div>
                  </div>
                  <div className="w-16 md:w-24 flex justify-center items-center shrink-0">
                    <motion.button 
                      whileTap={votingState === 'idle' ? { scale: 0.9, backgroundColor: '#0d47a1' } : {}}
                      onClick={() => handleVote(cand.id)}
                      disabled={votingState !== 'idle'}
                      className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer shadow-[inset_0px_2px_4px_rgba(255,255,255,0.3),inset_0px_-2px_4px_rgba(0,0,0,0.2),0px_4px_6px_rgba(0,0,0,0.1)] ${
                        votingState !== 'idle' 
                          ? 'bg-[#1a73e8]/50 border-primary-container/50 cursor-not-allowed' 
                          : 'bg-[#1a73e8] border-primary-container hover:brightness-110'
                      }`}
                      aria-label={`Vote for ${cand.name}, ${cand.party}`}
                    >
                      <div className="w-4 h-4 rounded-full bg-[#0d47a1]"></div>
                    </motion.button>
                  </div>
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-outline-variant bg-[#d0d0d0] flex items-center justify-center overflow-hidden shrink-0">
                     <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all ${selectedCandidate === cand.id && votingState === 'voting' ? 'bg-error shadow-[0_0_8px_red]' : 'bg-error opacity-20'}`}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* EVM Footer */}
            <div className="mt-2 md:mt-4 flex justify-between items-end text-outline text-[10px] md:text-sm font-bold uppercase">
              <span>ECI Standard Design</span>
              <div className="w-24 md:w-32 h-3 md:h-4 bg-surface-container-highest border border-outline-variant rounded-sm flex gap-1 p-0.5">
                <div className="w-full h-full bg-on-surface-variant opacity-10"></div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {votingState === 'idle' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-full text-xs font-bold shadow-md flex items-center gap-2"
              >
                <MousePointerClick className="w-4 h-4" />
                Select a candidate by pressing the blue button
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        )}
        </AnimatePresence>
      </section>

      {/* Right Side Context Panel (VVPAT & Instructions) */}
      <aside className="w-full lg:w-96 flex flex-col gap-6 shrink-0">
        {/* Instructions Card */}
        <div className="glass-panel rounded-xl p-6 shadow-sm border-outline-variant">
          <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
            <Info className="w-6 h-6" />
            How to Vote
          </h2>
          <ol className="list-decimal list-outside ml-4 space-y-3 text-sm text-on-surface-variant">
            <li className={currentStep === 1 ? "font-bold text-primary" : ""}>Show your Voter ID to the First Polling Officer.</li>
            <li className={currentStep === 2 ? "font-bold text-primary" : ""}>Get your finger inked and sign the register.</li>
            <li className={currentStep >= 3 ? "font-bold text-primary" : ""}>Review the list of candidates and their symbols on the Ballot Unit.</li>
            <li className={currentStep >= 3 ? "font-bold text-primary" : ""}>Press the <strong className="text-primary-fixed-variant">Blue Button</strong> next to your choice.</li>
            <li className={currentStep >= 3 ? "font-bold text-primary" : ""}>Verify the red light and check the VVPAT window. Listen for the beep.</li>
          </ol>
        </div>

        {/* VVPAT Preview Area */}
        <AnimatePresence mode="wait">
        {currentStep === 3 && (
        <motion.div 
          key="vvpat"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="glass-panel rounded-xl p-6 shadow-sm border-outline-variant bg-gradient-to-b from-surface to-surface-container-low flex flex-col items-center justify-center min-h-[300px] relative"
        >
          <h2 className="text-2xl font-semibold text-primary mb-2 self-start w-full border-b border-outline-variant pb-2">VVPAT Preview</h2>
          <div className="w-48 h-56 bg-inverse-surface rounded-lg border-[6px] border-surface-dim shadow-inner flex flex-col items-center justify-start p-4 relative overflow-hidden mt-4">
            
            <AnimatePresence>
              {votingState === 'printed' && activeCandidate && (
                <motion.div 
                  initial={{ y: '-100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '100%', opacity: 0 }}
                  transition={{ 
                    y: { type: 'tween', ease: 'easeOut', duration: 1.5 },
                    opacity: { duration: 0.2 }
                  }}
                  className="bg-[#f9f9f9] text-black w-[90%] h-44 flex flex-col items-center justify-start shadow-[0_2px_10px_rgba(0,0,0,0.5)] border-x border-b border-gray-300 relative z-0"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 19px, #e0e0e0 20px)',
                    backgroundSize: '100% 20px'
                  }}
                >
                  <div className="w-full h-2 bg-gradient-to-b from-gray-300 to-transparent absolute top-0 left-0"></div>
                  
                  <div className="flex-1 flex flex-col items-center justify-center pt-2">
                    <span className="text-[9px] text-gray-500 mb-1 border-b border-dashed border-gray-300 w-full text-center pb-1">VOTER VERIFIABLE PAPER AUDIT TRAIL</span>
                    <activeCandidate.icon className="w-10 h-10 mb-2 text-black" />
                    <span className="font-bold text-sm uppercase leading-tight">{activeCandidate.name}</span>
                    <span className="text-[10px] mt-1 font-mono tracking-tighter bg-gray-200 px-1 rounded-sm">{activeCandidate.party}</span>
                  </div>
                  
                  <div className="absolute top-8 w-full flex justify-between px-2">
                    <span className="text-[9px] font-mono font-bold bg-black text-white px-1">Sl. {activeCandidate.id}</span>
                  </div>

                  {voteTimestamp && (
                    <div className="absolute bottom-4 right-2 text-[7px] font-mono text-gray-600">
                      {voteTimestamp.toLocaleDateString()} {voteTimestamp.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                    </div>
                  )}
                  
                  <div className="w-full h-3 border-b-4 border-dashed border-gray-400 absolute bottom-0 left-0"></div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glass glare effect layered over everything */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none z-10 border border-white/10 rounded-sm"></div>
            
            {votingState === 'done' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white/80"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                 <Volume2 className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-xs font-bold text-green-400 uppercase tracking-widest">BEEP!</span>
                <span className="text-[10px] mt-2 bg-black/50 px-2 py-1 rounded text-center">Vote Recorded</span>
              </motion.div>
            )}

            {votingState === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <EyeOff className="w-10 h-10 text-outline-variant opacity-50 mb-2" />
                <p className="font-bold text-outline-variant text-sm text-center">Awaiting Vote</p>
                <p className="text-outline-variant text-center text-[10px] mt-1 px-4 opacity-70">Slip will appear here for 7 seconds after button press.</p>
              </div>
            )}
            
            {votingState === 'voting' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <div className="w-8 h-8 rounded-full border-2 border-outline-variant border-t-white animate-spin mb-2"></div>
                <p className="font-bold text-outline-variant text-sm text-center">Printing...</p>
              </div>
            )}
          </div>
          
          <AnimatePresence>
            {votingState === 'done' && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCurrentStep(1);
                  setVotingState('idle');
                  setSelectedCandidate(null);
                }}
                className="mt-6 bg-primary text-white px-6 py-2 rounded-full text-sm font-bold shadow-md hover:bg-primary/90 hover:scale-105 transition-all"
              >
                Restart Simulation
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
        )}
        </AnimatePresence>
      </aside>
    </motion.div>
  );
}
