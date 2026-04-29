import { useState, useRef, useEffect } from 'react';
import { Bot, Paperclip, Send, User, ThumbsUp, ThumbsDown, Trash2, Languages, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import DOMPurify from 'dompurify';

type Message = {
  id: string;
  type: 'ai' | 'user';
  text: string;
  isTyping?: boolean;
  feedback?: 'up' | 'down' | null;
  isError?: boolean;
  sentiment?: 'positive' | 'neutral' | 'negative' | null;
};

const INITIAL_MESSAGE: Message = {
  id: '1',
  type: 'ai',
  text: "Hello! I'm VoteGuide AI, your personal civic assistant. I'm here to help you navigate the democratic process with clear, non-partisan information.\n\nHow can I assist you with your voting journey today?"
};

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
];

export default function AIAssistant() {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation from local storage
  useEffect(() => {
    const savedMessages = localStorage.getItem('voteGuide_ai_chat');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }
    const savedLang = localStorage.getItem('voteGuide_ai_lang');
    if (savedLang) {
      setTargetLanguage(savedLang);
    }
    setIsLoaded(true);
  }, []);

  // Save conversation to local storage
  useEffect(() => {
    if (isLoaded) {
      // Don't save typing indicators
      const messagesToSave = messages.filter(m => !m.isTyping);
      localStorage.setItem('voteGuide_ai_chat', JSON.stringify(messagesToSave));
      localStorage.setItem('voteGuide_ai_lang', targetLanguage);
    }
  }, [messages, targetLanguage, isLoaded]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your conversation history?')) {
      setMessages([INITIAL_MESSAGE]);
      localStorage.removeItem('voteGuide_ai_chat');
    }
  };

  const handleLanguageChange = (code: string) => {
    setTargetLanguage(code);
    setShowLanguageMenu(false);
    
    // Add system message acknowledging the change
    const langName = LANGUAGES.find(l => l.code === code)?.name || 'English';
    const msgId = Date.now().toString();
    setMessages(prev => [...prev, { 
      id: msgId, 
      type: 'ai', 
      text: `Language preference updated to ${langName}. How can I assist you now?` 
    }]);
  };

  const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    // Basic heuristic simulation for frontend (In a full backend, we'd use Google Cloud NLP)
    const lower = text.toLowerCase();
    if (lower.match(/(thanks|thank you|great|good|awesome|helpful|love|excellent)/)) return 'positive';
    if (lower.match(/(bad|terrible|frustrated|hate|awful|stupid|wrong|confusing)/)) return 'negative';
    return 'neutral';
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userSentiment = analyzeSentiment(text);

    // Add user message
    const msgId = Date.now().toString();
    setMessages(prev => [...prev, { id: msgId, type: 'user', text, sentiment: userSentiment }]);
    setInputMessage('');

    // Call Gemini API
    const typingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: typingId, type: 'ai', text: '', isTyping: true, feedback: null }]);

    const callAI = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        // Build conversation history
        const chatHistory = messages
          .filter(m => !m.isTyping && !m.isError)
          .map(m => ({
            role: m.type === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }));
          
        chatHistory.push({
          role: 'user',
          parts: [{ text }]
        });
        
        const langName = LANGUAGES.find(l => l.code === targetLanguage)?.name || 'English';

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: chatHistory,
          config: {
            systemInstruction: `You are VoteGuide AI, a non-partisan civic assistant guiding voters in India. Keep answers objective, clear, and concise. Educate on topics like VVPAT, registration, elections, and democratic processes. CRITICAL INSTRUCTION: You MUST reply in the following language: ${langName}. Even if the user types in English, translate your response to ${langName}. If the user is expressing frustration, be especially empathetic.`,
          }
        });

        const responseText = response.text || "I apologize, but I couldn't generate a response. Please try again.";

        setMessages(prev => prev.map(m => m.id === typingId ? { id: typingId, type: 'ai', text: responseText, feedback: null } : m));
      } catch (error) {
        setMessages(prev => prev.map(m => m.id === typingId ? { id: typingId, type: 'ai', text: "I'm experiencing technical difficulties connecting to my knowledge base right now. Please try asking your question again in a moment.", feedback: null, isError: true } : m));
      }
    };
    
    callAI();
  };

  const handleFeedback = (id: string, feedback: 'up' | 'down') => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, feedback: m.feedback === feedback ? null : feedback } : m));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center w-full max-w-[800px] mx-auto h-full relative pb-24 md:pb-6"
    >
      <div className="w-full flex items-center justify-between px-4 py-3 border-b border-outline-variant/30 flex-shrink-0">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <Bot className="w-6 h-6" />
          VoteGuide AI
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowLanguageMenu(!showLanguageMenu)} 
              className="flex items-center gap-2 text-sm font-medium text-secondary hover:bg-secondary/10 px-3 py-1.5 rounded-full transition-colors"
              title="Change Language"
            >
              <Languages className="w-4 h-4" />
              {LANGUAGES.find(l => l.code === targetLanguage)?.name || 'English'}
            </button>
            {showLanguageMenu && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 w-48 overflow-hidden pointer-events-auto">
                <div className="py-1">
                  {LANGUAGES.map(lang => (
                     <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-primary/5 ${targetLanguage === lang.code ? 'text-primary font-bold bg-primary/5' : 'text-gray-700'}`}
                      >
                        {lang.name}
                     </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {messages.length > 1 && (
            <button 
              onClick={handleClearHistory} 
              className="flex items-center gap-2 text-sm font-medium text-error hover:bg-error/10 px-3 py-1.5 rounded-full transition-colors"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div 
        className="w-full flex-grow flex flex-col gap-6 overflow-y-auto px-4 py-4 scroll-smooth"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 items-start ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.type === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
                {msg.type === 'user' ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
              </div>
              
              {msg.isTyping ? (
                <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-4 rounded-xl rounded-tl-none shadow-[0_4px_30px_rgba(0,0,0,0.05)] flex items-center gap-2 h-12">
                  <div className="w-2 h-2 rounded-full bg-secondary opacity-60 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-secondary opacity-40 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-secondary opacity-20 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-w-[85%]">
                  <div className={`p-6 rounded-xl font-serif text-lg leading-relaxed whitespace-pre-wrap ${
                    msg.type === 'user' 
                      ? 'bg-primary text-white rounded-tr-none shadow-lg' 
                      : msg.isError
                        ? 'bg-error/10 text-error border border-error/20 rounded-tl-none shadow-[0_4px_30px_rgba(0,0,0,0.05)]'
                        : 'bg-white/80 backdrop-blur-xl border border-white/60 rounded-tl-none shadow-[0_4px_30px_rgba(0,0,0,0.05)] text-on-surface'
                  }`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.text).replace(/\n/g, '<br/>') }}>
                  </div>
                  {msg.type === 'user' && msg.sentiment && (
                    <div className="flex items-center gap-1.5 px-2 mt-0.5 justify-end" title={`Detected Sentiment: ${msg.sentiment}`}>
                       <Activity className={`w-3.5 h-3.5 ${msg.sentiment === 'positive' ? 'text-green-500' : msg.sentiment === 'negative' ? 'text-red-500' : 'text-gray-400'}`} />
                       <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                         {msg.sentiment}
                       </span>
                    </div>
                  )}
                  {msg.type === 'ai' && !msg.isError && (
                    <div className="flex items-center gap-2 px-2 mt-1 opacity-60 hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleFeedback(msg.id, 'up')}
                        className={`p-1.5 rounded-lg hover:bg-surface-variant transition-colors flex items-center gap-1.5 text-xs font-semibold ${msg.feedback === 'up' ? 'text-primary bg-primary/10' : 'text-on-surface-variant'}`}
                        title="Helpful"
                        aria-label="Rate response as helpful"
                      >
                        <ThumbsUp className="w-4 h-4" fill={msg.feedback === 'up' ? 'currentColor' : 'none'} />
                        {msg.feedback === 'up' && "Helpful"}
                      </button>
                      <button 
                        onClick={() => handleFeedback(msg.id, 'down')}
                        className={`p-1.5 rounded-lg hover:bg-surface-variant transition-colors flex items-center gap-1.5 text-xs font-semibold ${msg.feedback === 'down' ? 'text-error bg-error/10' : 'text-on-surface-variant'}`}
                        title="Not helpful"
                        aria-label="Rate response as not helpful"
                      >
                        <ThumbsDown className="w-4 h-4" fill={msg.feedback === 'down' ? 'currentColor' : 'none'} />
                        {msg.feedback === 'down' && "Not Helpful"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area Container */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full mt-auto"
      >
        {/* Suggested Questions */}
        <div className="flex flex-wrap gap-2 mb-4 px-4 justify-center">
          <button onClick={() => handleSendMessage("How do I register?")} className="bg-white/50 hover:bg-white/80 backdrop-blur-md text-on-surface text-sm px-4 py-2 rounded-full border border-outline-variant/50 transition-colors shadow-sm active:scale-95">
            How do I register?
          </button>
          <button onClick={() => handleSendMessage("What is VVPAT?")} className="bg-white/50 hover:bg-white/80 backdrop-blur-md text-on-surface text-sm px-4 py-2 rounded-full border border-outline-variant/50 transition-colors shadow-sm active:scale-95">
            What is VVPAT?
          </button>
          <button onClick={() => handleSendMessage("Find my polling booth")} className="bg-white/50 hover:bg-white/80 backdrop-blur-md text-on-surface text-sm px-4 py-2 rounded-full border border-outline-variant/50 transition-colors shadow-sm active:scale-95">
            Find my polling booth
          </button>
        </div>
        
        {/* Input Box */}
        <div className={`bg-white/90 backdrop-blur-xl rounded-full p-2 mx-4 flex items-center shadow-[0_8px_30px_rgba(0,0,0,0.08)] border transition-colors ${messages.some(m => m.isTyping) ? 'border-primary/40 bg-primary/5' : 'border-white/40'}`}>
          <button className="p-2 text-outline hover:text-primary transition-colors disabled:opacity-50" disabled={messages.some(m => m.isTyping)} aria-label="Attach file">
            <Paperclip className="w-6 h-6" />
          </button>
          <input 
            className="flex-grow bg-transparent border-none outline-none focus:ring-0 font-serif text-lg text-on-surface placeholder:text-on-surface-variant/50 px-4 h-12 disabled:cursor-not-allowed disabled:opacity-70" 
            placeholder={messages.some(m => m.isTyping) ? "VoteGuide is processing..." : "Ask VoteGuide AI anything about voting..."} 
            type="text" 
            aria-label="Message to VoteGuide AI"
            value={inputMessage}
            disabled={messages.some(m => m.isTyping)}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
          />
          {messages.some(m => m.isTyping) ? (
            <div className="flex items-center justify-center w-12 h-12 bg-transparent">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => handleSendMessage(inputMessage)}
              disabled={!inputMessage.trim()}
              className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md flex-shrink-0 disabled:opacity-50 disabled:hover:scale-100"
              aria-label="Send message"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          )}
        </div>
        <div className="text-center mt-4 pb-4">
          <span className="font-bold text-outline text-[10px] uppercase tracking-wider">VoteGuide AI provides objective information based on official election data.</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
