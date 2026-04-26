import React from 'react';
import type { FilterState, StatusFilter, RiskFilter, SortOption } from '../types';

interface SidebarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  itemCount: number;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ filters, onFilterChange, itemCount, isOpen = true, onClose }) => {
  const statusOptions: { value: StatusFilter; label: string; icon: React.ReactNode }[] = [
    { 
      value: 'all', 
      label: 'All Signals',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
    },
    { 
      value: 'pending', 
      label: 'Pending',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    { 
      value: 'reviewed', 
      label: 'Reviewed',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
    },
    { 
      value: 'escalated', 
      label: 'Escalated',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
    }
  ];

  const riskOptions: { value: RiskFilter; label: string; colorClass: string }[] = [
    { value: 'all', label: 'All Risks', colorClass: 'text-slate-400' },
    { value: 'high', label: 'High Risk', colorClass: 'text-rose-500' },
    { value: 'medium', label: 'Medium Risk', colorClass: 'text-amber-500' },
    { value: 'low', label: 'Low Risk', colorClass: 'text-emerald-500' },
  ];

  const hasActiveFilters = filters.status !== 'all' || filters.riskLevel !== 'all';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-white border-r border-slate-200/60 z-40 transform transition-transform lg:transform-none overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } custom-scrollbar`}
      >
        <div className="p-6 space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Signal Board</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Active Filters Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Filters</h3>
            {hasActiveFilters && (
              <button 
                onClick={() => onFilterChange({ status: 'all', riskLevel: 'all' })}
                className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors bg-indigo-50 px-2 py-1 rounded-md"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Filter Groups */}
          <div className="space-y-8">
            {/* Status Section */}
            <section>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                Review Status
              </h4>
              <div className="space-y-1">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onFilterChange({ status: opt.value })}
                    className={`sidebar-item w-full capitalize group flex items-center justify-between ${
                      filters.status === opt.value ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${filters.status === opt.value ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                        {opt.icon}
                      </span>
                      <span className="font-semibold text-sm">{opt.label}</span>
                    </div>
                    {filters.status === opt.value && (
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Risk Section */}
            <section>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Safety Priority
              </h4>
              <div className="space-y-1">
                {riskOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onFilterChange({ riskLevel: opt.value })}
                    className={`sidebar-item w-full capitalize group flex items-center justify-between ${
                      filters.riskLevel === opt.value ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className={`w-4 h-4 ${opt.value === 'all' && filters.riskLevel !== 'all' ? 'text-slate-400' : opt.colorClass}`} fill="currentColor" viewBox="0 0 20 20">
                        {opt.value === 'all' ? (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        )}
                      </svg>
                      <span className="font-semibold text-sm">{opt.label}</span>
                    </div>
                    {filters.riskLevel === opt.value && (
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Display Order Section */}
            <section>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Display Order
              </h4>
              <div className="bg-slate-100/50 p-1 rounded-xl flex items-center border border-slate-200/50">
                <button
                  onClick={() => onFilterChange({ sortBy: 'signal-score' })}
                  className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${
                    filters.sortBy === 'signal-score' 
                      ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Intensity
                </button>
                <button
                  onClick={() => onFilterChange({ sortBy: 'recency' })}
                  className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${
                    filters.sortBy === 'recency' 
                      ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Recency
                </button>
              </div>
            </section>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100/50 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Queue Status</span>
                <span className="text-xs font-black text-white bg-indigo-500 px-2 py-0.5 rounded-md shadow-sm">
                  {itemCount}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                Showing {filters.status === 'all' ? 'all' : filters.status} items with {filters.riskLevel === 'all' ? 'any' : filters.riskLevel} risk level.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quick Tips</h3>
            <div className="space-y-2">
              {[
                { key: '/', label: 'Search' },
                { key: '⌘ K', label: 'Commands' },
                { key: 'J / K', label: 'Navigate' }
              ].map(tip => (
                <div key={tip.key} className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{tip.label}</span>
                  <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-400 font-mono">
                    {tip.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
