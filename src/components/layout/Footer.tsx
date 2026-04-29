import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50/50 backdrop-blur-lg mt-auto py-12">
      <div className="max-w-[1280px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-light tracking-wide text-slate-900">
        <div className="text-lg font-bold text-blue-950 uppercase">
          VoteGuide AI
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="#" className="text-slate-500 hover:text-secondary underline decoration-secondary/50 underline-offset-4 transition-all">Privacy Policy</Link>
          <Link to="#" className="text-slate-500 hover:text-secondary underline decoration-secondary/50 underline-offset-4 transition-all">Terms of Service</Link>
          <Link to="#" className="text-slate-500 hover:text-secondary underline decoration-secondary/50 underline-offset-4 transition-all">Election Resources</Link>
          <Link to="#" className="text-slate-500 hover:text-secondary underline decoration-secondary/50 underline-offset-4 transition-all">Contact</Link>
        </div>
        
        <div className="text-slate-500 text-xs">
          © 2024 VoteGuide AI. Democratic Tech Initiative.
        </div>
      </div>
    </footer>
  );
}
