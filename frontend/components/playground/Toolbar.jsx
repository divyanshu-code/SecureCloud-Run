import { Play, Settings, RefreshCw, Clock } from 'lucide-react';

export default function Toolbar({
  language, setLanguage,
  theme, setTheme,
  fontSize, setFontSize,
  isExecuting, onRun,
  onOpenHistory
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/10 z-10">

      {/* Left side: Branding / Title */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded bg-primary/20 border border-primary/50 flex items-center justify-center">
          <span className="text-primary font-bold">{'</>'}</span>
        </div>
        <span className="text-white font-semibold tracking-wide">Playground</span>
      </div>

      {/* Middle: Editor Controls */}
      <div className="flex items-center space-x-4 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-transparent text-sm text-gray-300 outline-none cursor-pointer hover:text-white transition-colors"
        >
          <option value="javascript" className="bg-[#1e1e1e]">JavaScript</option>
          <option value="python" className="bg-[#1e1e1e]">Python</option>
          <option value="java" className="bg-[#1e1e1e]">Java</option>
          <option value="cpp" className="bg-[#1e1e1e]">C++</option>
          <option value="go" className="bg-[#1e1e1e]">Go</option>
          <option value="rust" className="bg-[#1e1e1e]">Rust</option>
        </select>

        <div className="w-px h-4 bg-white/10" />

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-transparent text-sm text-gray-300 outline-none cursor-pointer hover:text-white transition-colors"
        >
          <option value="vs-dark" className="bg-[#1e1e1e]">Dark</option>
          <option value="light" className="bg-[#1e1e1e]">Light</option>
          <option value="hc-black" className="bg-[#1e1e1e]">High Contrast</option>
        </select>

        <div className="w-px h-4 bg-white/10" />

        <select
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="bg-transparent text-sm text-gray-300 outline-none cursor-pointer hover:text-white transition-colors"
        >
          <option value="12" className="bg-[#1e1e1e]">12px</option>
          <option value="14" className="bg-[#1e1e1e]">14px</option>
          <option value="16" className="bg-[#1e1e1e]">16px</option>
          <option value="18" className="bg-[#1e1e1e]">18px</option>
        </select>
      </div>

      {/* Right side: Action */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenHistory}
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/5"
        >
          <Clock size={16} />
          <span className="text-sm font-medium">History</span>
        </button>

        <button
          onClick={onRun}
          disabled={isExecuting}
          className={`flex items-center space-x-2 px-5 py-2 rounded-md font-semibold transition-all duration-300 ${isExecuting
              ? 'bg-primary/50 text-white/50 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]'
            }`}
        >
          {isExecuting ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <Play size={18} fill="currentColor" />
          )}
          <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
        </button>
      </div>
    </div>
  );
}
