import { Check, Info, Map, MousePointerClick, BarChart, Download, Bell, BellRing, Calendar, Trash2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { useState, useEffect, FormEvent } from 'react';

type Reminder = {
  id: string;
  electionName: string;
  date: string;
  notifyBefore: string;
};

export default function Journey() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [newReminder, setNewReminder] = useState({ electionName: '', date: '', notifyBefore: '1 day' });
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [expandedStep, setExpandedStep] = useState<number | null>(null);


  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    const saved = localStorage.getItem('voteGuide_reminders');
    if (saved) {
      try {
        setReminders(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse reminders");
      }
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm === 'granted') {
      new Notification('VoteGuide Reminders Enabled', {
        body: 'You will now receive alerts for your upcoming elections.',
        icon: '/favicon.ico' // fallback icon
      });
    }
  };

  const saveReminders = (newReminders: Reminder[]) => {
    setReminders(newReminders);
    localStorage.setItem('voteGuide_reminders', JSON.stringify(newReminders));
    window.dispatchEvent(new Event('voteGuide_reminders_updated'));
  };

  const handleAddReminder = (e: FormEvent) => {
    e.preventDefault();
    if (!newReminder.electionName || !newReminder.date) return;
    
    if (permission === 'default') {
      requestNotificationPermission();
    }
    
    const reminder: Reminder = {
      id: Date.now().toString(),
      ...newReminder
    };
    
    saveReminders([...reminders, reminder]);
    setNewReminder({ electionName: '', date: '', notifyBefore: '1 day' });
    setShowReminderForm(false);
  };

  const handleDeleteReminder = (id: string) => {
    saveReminders(reminders.filter(r => r.id !== id));
  };


  const steps = [
    {
      id: 1,
      title: 'Eligibility Check',
      desc: 'Check age and citizenship requirements to ensure you are legally permitted to vote.',
      longDesc: 'To be eligible to vote in India, you must be a citizen of India, be 18 years of age or older on the qualifying date (usually January 1st of the year of revision of electoral roll), and be an ordinary resident of the polling area.',
      status: 'completed',
      icon: Check
    },
    {
      id: 2,
      title: 'Voter Registration',
      desc: 'Submit Form 6 online or offline to get your name officially on the electoral roll.',
      longDesc: 'You can register online through the Voter Helpline App or the regular NVSP portal. You will need to upload proof of age, proof of residence, and a passport-size photograph.',
      status: 'completed',
      icon: Check
    },
    {
      id: 3,
      title: 'Roll Verification',
      desc: 'Confirm your details are correctly listed in the official Electoral Roll database.',
      longDesc: 'It is crucial to verify your name, age, and address in the electoral roll well before the election. You can do this online to ensure there are no spelling mistakes or incorrect details.',
      status: 'active',
      icon: Search
    },
    {
      id: 4,
      title: 'Candidate Information',
      desc: 'Research candidates, their platforms, and key issues in your specific constituency.',
      longDesc: 'Make an informed choice by checking the affidavits filed by candidates, which contain information about their criminal antecedents, assets, liabilities, and educational qualifications (accessible via the Know Your Candidate app).',
      status: 'upcoming',
      icon: Info
    },
    {
      id: 5,
      title: 'Prep & Polling Booth',
      desc: 'Locate your designated polling booth and gather the required valid ID documents.',
      longDesc: 'Find out the exact location of your polling booth in advance. Carry your EPIC (Voter ID card) or any of the other 11 alternative photo identity documents specified by the Election Commission.',
      status: 'upcoming',
      icon: Map
    },
    {
      id: 6,
      title: 'The Voting Process',
      desc: 'Cast your choice securely using the EVM and verify your selection via the VVPAT slip.',
      longDesc: 'At the booth, your identity will be verified. You will proceed to the voting compartment, press the button against the candidate of your choice on the EVM, and listen for the beep. Ensure the VVPAT prints a slip showing your choice for 7 seconds.',
      status: 'upcoming',
      icon: MousePointerClick
    },
    {
      id: 7,
      title: 'Results & Outcome',
      desc: 'Understand how the counting process leads to the final, transparent democratic outcome.',
      longDesc: 'After polling, EVMs are sealed and stored securely in strong rooms. Counting is done publicly under the supervision of the Returning Officer and candidate agents to ensure transparency.',
      status: 'upcoming',
      icon: BarChart
    }
  ];

  const handleDownloadChecklist = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("My Voting Journey Checklist", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    let yPos = 40;
    
    steps.forEach((step, index) => {
      const isCompleted = step.status === 'completed';
      
      // Draw checkbox
      doc.rect(20, yPos - 4, 5, 5);
      if (isCompleted) {
        doc.text("X", 21, yPos);
      }

      doc.setFont("helvetica", "bold");
      doc.text(step.title, 30, yPos);
      
      doc.setFont("helvetica", "normal");
      const splitDesc = doc.splitTextToSize(step.desc, 150);
      doc.text(splitDesc, 30, yPos + 6);
      
      yPos += 12 + (splitDesc.length * 6);
    });

    doc.save('Voting_Journey_Checklist.pdf');
  };

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow pt-16 pb-24 px-6 max-w-[1280px] mx-auto w-full"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center max-w-3xl mx-auto mb-16 mt-8"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 leading-tight">Your Election Journey</h1>
        <p className="text-lg text-on-surface-variant">
          Click on any step for details. Track your progress and understand exactly what happens at every stage of the democratic process.
        </p>

        {/* Overall Progress Bar */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="flex justify-between text-sm font-bold text-on-surface-variant mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full h-3 bg-surface-variant rounded-full overflow-hidden border border-outline-variant">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${progressPercentage}%` }} 
              transition={{ duration: 1, ease: "easeOut" }} 
              className="h-full bg-secondary"
            />
          </div>
        </div>
      </motion.div>

      <div className="relative w-full max-w-5xl mx-auto mb-24">
        {/* Desktop Central Line - Animated based on progress */}
        <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-1 bg-surface-variant transform -translate-x-1/2 z-0 rounded-full overflow-hidden">
             <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="w-full bg-secondary"
             />
        </div>

        {/* Mobile Left Line */}
        <div className="md:hidden absolute left-[28px] top-4 bottom-4 w-1 bg-surface-variant z-0 rounded-full overflow-hidden">
            <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="w-full bg-secondary"
             />
        </div>

        {steps.map((step, index) => {
          const isLeft = index % 2 === 0;
          const isExpanded = expandedStep === step.id;
          
          return (
            <motion.div 
              key={step.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row justify-between items-center w-full mb-16 z-10 group`}
            >
              
              {/* Left Side Box (Desktop) */}
              <div className={`hidden md:block w-[45%] ${isLeft ? 'pr-12 text-right' : ''}`}>
                {isLeft && (
                  <div 
                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                    className={`cursor-pointer glass-panel rounded-xl p-6 transition-all duration-300 relative overflow-hidden ${
                      isExpanded ? 'ring-2 ring-primary scale-105 shadow-xl' : 'group-hover:-translate-y-1'
                    } ${step.status === 'active' ? 'border-primary shadow-[0_0_20px_rgba(43,84,204,0.15)] ring-2 ring-primary/30' : step.status === 'upcoming' ? 'opacity-70 hover:opacity-100' : ''}`}
                  >
                    {step.status === 'completed' && <div className="absolute top-0 right-0 w-2 h-full bg-secondary"></div>}
                    <h3 className={`text-2xl font-semibold mb-2 ${step.status === 'completed' ? 'text-secondary' : 'text-primary'}`}>{step.title}</h3>
                    <p className="text-on-surface-variant font-medium">{step.desc}</p>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="text-sm text-on-surface pt-4 border-t border-outline-variant text-left bg-primary/5 p-4 rounded-lg"
                        >
                          {step.longDesc}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="mt-4 flex justify-end">
                      <span className="text-xs uppercase tracking-wider font-bold text-primary/60 border border-primary/20 rounded-full px-3 py-1">
                        {isExpanded ? 'Show Less' : 'Learn More'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Node */}
              <div 
                 onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                 className={`cursor-pointer cursor-pulse absolute left-[14px] md:left-1/2 transform md:-translate-x-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-20 shadow-lg transition-transform hover:scale-110 ${
                step.status === 'completed' ? 'bg-secondary border-2 border-white' :
                step.status === 'active' ? 'bg-primary border-4 border-white shadow-[0_0_20px_rgba(43,84,204,0.4)]' :
                'bg-surface border-4 border-surface-variant'
              }`}>
                {step.status === 'completed' && <Check className="w-5 h-5 md:w-6 md:h-6 text-white font-black" />}
                {step.status === 'active' && <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white animate-pulse"></div>}
                {step.status === 'upcoming' && step.icon && <step.icon className="w-4 h-4 md:w-5 md:h-5 text-on-surface-variant" />}
              </div>

              {/* Right Side Box (Desktop & Mobile) */}
              <div className={`w-full pl-[60px] md:pl-0 md:w-[45%] ${!isLeft ? 'md:pl-12 text-left' : 'md:hidden block'}`}>
                <div 
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  className={`cursor-pointer glass-panel rounded-xl p-6 transition-all duration-300 relative overflow-hidden ${
                      isExpanded ? 'ring-2 ring-primary scale-102 md:scale-105 shadow-xl' : 'group-hover:-translate-y-1'
                    } ${step.status === 'active' ? 'border-primary shadow-[0_0_20px_rgba(43,84,204,0.15)] ring-2 ring-primary/30' : step.status === 'upcoming' ? 'opacity-70 hover:opacity-100' : ''}`}
                >
                  {step.status === 'completed' && <div className="absolute top-0 left-0 w-2 h-full bg-secondary"></div>}
                  <h3 className={`text-2xl font-semibold mb-2 ${step.status === 'completed' ? 'text-secondary' : 'text-primary'}`}>{step.title}</h3>
                  <p className="text-on-surface-variant font-medium">{step.desc}</p>
                  
                  <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="text-sm text-on-surface pt-4 border-t border-outline-variant bg-primary/5 p-4 rounded-lg"
                        >
                          {step.longDesc}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="mt-4 flex justify-between md:justify-start items-center">
                      <span className="text-xs uppercase tracking-wider font-bold text-primary/60 border border-primary/20 rounded-full px-3 py-1">
                        {isExpanded ? 'Show Less' : 'Learn More'}
                      </span>
                    </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto"
      >
        <div className="bg-gradient-to-br from-surface-container-high to-surface-container border border-white/40 shadow-lg rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between backdrop-blur-md relative overflow-hidden">
          <div className="mb-6 md:mb-0 md:mr-8 z-10 relative text-center md:text-left">
            <h2 className="text-3xl font-bold text-primary mb-2">Ready to take the next step?</h2>
            <p className="text-on-surface-variant">Generate a personalized action plan based on your current journey progress.</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadChecklist}
            className="z-10 bg-primary text-white font-bold px-8 py-4 rounded-full shadow-md hover:bg-primary-container transition-colors flex items-center whitespace-nowrap"
          >
            <Download className="w-5 h-5 mr-2" />
            Download My Checklist
          </motion.button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto mt-12"
      >
        <div className="glass-panel rounded-2xl p-8 border border-outline-variant shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
              <BellRing className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-extrabold text-on-surface flex items-center gap-2">
                Election Reminders
                {permission === 'granted' && <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] uppercase font-bold tracking-wider">Active</span>}
              </h2>
              <p className="text-on-surface-variant text-sm mt-1">Never miss an important polling date with proactive notifications.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
               {permission !== 'granted' && (
                 <button 
                   onClick={requestNotificationPermission} 
                   className="flex-1 md:flex-none text-xs font-bold px-4 py-2 border border-outline-variant rounded-full text-on-surface-variant hover:bg-surface-variant transition-colors"
                 >
                   Enable Push
                 </button>
               )}
              <button 
                onClick={() => setShowReminderForm(!showReminderForm)}
                className="flex-1 md:flex-none bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-primary/90 hover:shadow-lg transition-all"
              >
                {showReminderForm ? 'Cancel' : '+ Add Reminder'}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showReminderForm && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddReminder}
                className="overflow-hidden mb-6"
              >
                <div className="bg-surface-container rounded-xl p-5 border border-outline-variant grid md:grid-cols-3 gap-4">
                  <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-semibold text-on-surface-variant">Election Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. General Assembly"
                      value={newReminder.electionName}
                      onChange={(e) => setNewReminder({ ...newReminder, electionName: e.target.value })}
                      className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface-variant">Date</label>
                    <input 
                      type="date" 
                      required
                      value={newReminder.date}
                      onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                      className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface-variant">Notify Me</label>
                    <select 
                      value={newReminder.notifyBefore}
                      onChange={(e) => setNewReminder({ ...newReminder, notifyBefore: e.target.value })}
                      className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                    >
                      <option value="1 day">1 day before</option>
                      <option value="3 days">3 days before</option>
                      <option value="1 week">1 week before</option>
                    </select>
                  </div>
                  <div className="md:col-span-3 flex justify-end mt-2">
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
                      Save Reminder
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {reminders.length > 0 ? (
            <div className="space-y-3">
              {reminders.map(reminder => (
                <div key={reminder.id} className="flex items-center justify-between p-4 rounded-xl bg-surface border border-outline-variant hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">{reminder.electionName}</h4>
                      <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-1 font-medium">
                        <span>{new Date(reminder.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        <span className="flex items-center gap-1"><Bell className="w-3 h-3" /> {reminder.notifyBefore} before</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                    title="Delete Reminder"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
              <Bell className="w-8 h-8 text-on-surface-variant mx-auto mb-2 opacity-50" />
              <p className="text-on-surface-variant">No reminders set yet. Get started by adding one!</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
