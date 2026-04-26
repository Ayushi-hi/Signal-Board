import React from 'react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenCommandPalette?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenCommandPalette }) => {
  return (
    <header className="header-blur px-6 py-4">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
              Signal Board
            </h1>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                AI Safety Review
              </p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-xl mx-12">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center gap-3 px-4 py-2.5 bg-slate-100/50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-slate-500 text-sm transition-all group"
          >
            <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="flex-1 text-left">Search items or commands...</span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-400">
              <span className="text-[12px]">⌘</span>K
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 border-2 border-white rounded-full"></span>
          </button>
          
          <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>
          
          <button className="flex items-center gap-2 p-1 pl-1 pr-3 hover:bg-slate-100 rounded-xl transition-all group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-indigo-100">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-700 leading-none">Admin</p>
              <p className="text-[10px] text-slate-400">Moderator</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
