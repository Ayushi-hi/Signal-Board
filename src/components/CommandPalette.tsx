import React, { useState, useEffect, useRef } from 'react';
import type { ReviewItem } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  allItems: ReviewItem[];
  onSelectItem: (item: ReviewItem) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, allItems, onSelectItem }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? allItems.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      })
    : allItems.slice(0, 10); // Show recent items

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 0, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        onSelectItem(results[selectedIndex]);
        onClose();
        setQuery('');
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      setQuery('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 sm:pt-32">
      {/* Backdrop */}
      <button
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        aria-label="Close command palette"
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 animate-slide-up origin-top shadow-2xl">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white shadow-2xl ring-1 ring-slate-900/5">
          {/* Search Input */}
          <div className="p-4 flex items-center gap-3 border-b border-slate-100 bg-white">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search by title, description, or #tag..."
              className="w-full bg-transparent focus:outline-none text-lg text-slate-800 placeholder:text-slate-400 font-medium"
              aria-label="Search command palette"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar bg-slate-50/50">
            {results.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-900">No results found</p>
                <p className="text-xs text-slate-500 mt-1">Try tweaking your search query</p>
              </div>
            ) : (
              <div className="p-2">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {query ? 'Search Results' : 'Recent Signals'}
                </div>
                <ul role="listbox" className="space-y-1">
                  {results.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <li key={item.id} role="option" aria-selected={isSelected}>
                        <button
                          onClick={() => {
                            onSelectItem(item);
                            onClose();
                            setQuery('');
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-150 flex items-center gap-4 ${
                            isSelected ? 'bg-indigo-600 shadow-md shadow-indigo-200 translate-x-1' : 'hover:bg-white hover:shadow-sm'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-white/20' : 'bg-slate-100'
                          }`}>
                            <svg className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold text-sm truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                              {item.title}
                            </p>
                            <p className={`text-xs truncate ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                              {item.description}
                            </p>
                          </div>

                          <div className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border shrink-0 ${
                            isSelected 
                              ? 'bg-white/20 border-white/20 text-white'
                              : item.status === 'escalated'
                                ? 'bg-rose-50 border-rose-100 text-rose-600'
                                : item.status === 'reviewed'
                                  ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                  : 'bg-amber-50 border-amber-100 text-amber-600'
                          }`}>
                            {item.status}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-between items-center">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md shadow-sm font-sans">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md shadow-sm font-sans">↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md shadow-sm font-sans">↵</kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md shadow-sm font-sans">esc</kbd>
                <span>Dismiss</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
              {results.length} Matches
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;