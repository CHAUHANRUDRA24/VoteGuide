import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart2, GripVertical, Lightbulb, Sparkles, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { analytics } from '../lib/firebase';
import { logEvent } from 'firebase/analytics';
import { GEMINI_API_KEY, GEMINI_MODEL } from '../config/ai';
import { GoogleGenAI } from '@google/genai';
import DOMPurify from 'dompurify';

interface Priority {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const INITIAL_PRIORITIES: Priority[] = [
  { id: '1', name: 'Education', icon: '🎓', description: 'Public schooling, universities, and vocational training.' },
  { id: '2', name: 'Healthcare', icon: '🏥', description: 'Public health, hospitals, and affordable medicine.' },
  { id: '3', name: 'Environment', icon: '🌱', description: 'Climate action, clean air, and water preservation.' },
  { id: '4', name: 'Economy', icon: '📈', description: 'Job creation, inflation control, and infrastructure.' },
  { id: '5', name: 'Social Justice', icon: '⚖️', description: 'Equality, minority rights, and inclusive growth.' },
];

export default function Ranking() {
  const [priorities, setPriorities] = useState<Priority[]>(INITIAL_PRIORITIES);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const movePriority = (index: number, direction: 'up' | 'down') => {
    const newPriorities = [...priorities];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= priorities.length) return;
    
    [newPriorities[index], newPriorities[targetIndex]] = [newPriorities[targetIndex], newPriorities[index]];
    setPriorities(newPriorities);
    
    if (analytics) {
      logEvent(analytics, 'priority_reordered', { item: priorities[index].name, direction });
    }
  };

  const handleGenerateAnalysis = async () => {
    if (!GEMINI_API_KEY) {
      setError("AI is not configured. Missing API key.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAiAnalysis(null);

    try {
      if (analytics) {
        logEvent(analytics, 'generate_ranking_analysis');
      }

      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const priorityList = priorities.map((p, i) => `${i + 1}. ${p.name} - ${p.description}`).join('\n');
      
      const prompt = `
        The user has ranked their top civic priorities for an upcoming election as follows:
        ${priorityList}
        
        As a non-partisan civic assistant, provide a brief, insightful 2-paragraph analysis. 
        Focus on how these top priorities intersect in modern democratic governance.
        Use HTML formatting (like <strong>, <ul>, <li>) to make it readable.
        Do not use markdown. Do not mention specific political parties.
      `;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      if (response.text) {
        setAiAnalysis(DOMPurify.sanitize(response.text));
      } else {
        throw new Error("No response generated.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate analysis. Please try again later. Verify your GEMINI_API_KEY.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow pt-16 pb-24 px-6 max-w-[1000px] mx-auto w-full"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-primary mb-4">Rank Your Priorities</h1>
        <p className="text-on-surface-variant max-w-2xl mx-auto">
          What matters most to you? Use the arrows to rank these issues. We'll help you understand how they align with the upcoming election.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Sorting List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {priorities.map((priority, index) => (
              <motion.div
                key={priority.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-4 rounded-2xl flex items-center gap-4 border border-white/40 shadow-sm hover:shadow-md transition-shadow group bg-surface"
              >
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => movePriority(index, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:text-primary disabled:opacity-20 transition-colors bg-surface-variant rounded-md disabled:bg-transparent"
                    aria-label="Move Up"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => movePriority(index, 'down')}
                    disabled={index === priorities.length - 1}
                    className="p-1 hover:text-primary disabled:opacity-20 transition-colors bg-surface-variant rounded-md disabled:bg-transparent"
                    aria-label="Move Down"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">{priority.icon}</span>
                    <h3 className="font-bold text-lg text-primary">{priority.name}</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant">{priority.description}</p>
                </div>
                <div className="text-4xl font-black text-surface-variant/40 select-none px-2">
                  #{index + 1}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* AI Analysis Section */}
        <div className="glass-panel p-6 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-surface to-surface-container shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <BarChart2 className="w-48 h-48" />
           </div>

           <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
             <Sparkles className="w-6 h-6 text-secondary" /> AI Insights
           </h2>

           <p className="text-on-surface-variant mb-6 text-sm relative z-10">
             Rearrange your priorities on the left, then let VoteGuide AI analyze your alignment and suggest which election issues to watch closely based on your top choices.
           </p>

           <button 
             onClick={handleGenerateAnalysis}
             disabled={isAnalyzing}
             className="w-full bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-wait flex justify-center items-center gap-2 relative z-10 active:scale-[0.98]"
           >
             {isAnalyzing ? (
               <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
             ) : (
               <Sparkles className="w-5 h-5" />
             )}
             {isAnalyzing ? 'Analyzing...' : 'Generate Analysis'}
           </button>

           {error && (
             <div className="mt-4 p-3 bg-error/10 text-error rounded-lg flex items-start gap-2 text-sm border border-error/20 relative z-10">
               <AlertCircle className="w-5 h-5 flex-shrink-0" />
               <p>{error}</p>
             </div>
           )}

           {aiAnalysis && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="mt-6 pt-6 border-t border-outline-variant/30 relative z-10"
             >
               <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                 <Lightbulb className="w-5 h-5 text-secondary" /> Analysis Result
               </h3>
               <div className="text-sm text-on-surface-variant leading-relaxed [&>p]:mb-3 [&>ul]:list-disc [&>ul]:ml-4 [&>strong]:text-primary" dangerouslySetInnerHTML={{ __html: aiAnalysis }} />
             </motion.div>
           )}
        </div>
      </div>
    </motion.div>
  );
}
