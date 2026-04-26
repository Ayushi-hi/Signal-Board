import React from 'react';
import type { ReviewItem } from '../types';
import ItemCard from './ItemCard';

interface BoardViewProps {
  items: ReviewItem[];
  selectedItemId: string | null;
  onSelectItem: (item: ReviewItem) => void;
  onApproveItem?: (id: string) => void;
  onEscalateItem?: (id: string) => void;
  isLoading: boolean;
}

const BoardView: React.FC<BoardViewProps> = ({ items, selectedItemId, onSelectItem, onApproveItem, onEscalateItem, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-[240px] rounded-2xl bg-white border border-slate-100 p-5 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="h-3 w-16 rounded-md animate-shimmer" />
              <div className="h-3 w-12 rounded-md animate-shimmer" />
            </div>
            <div className="mb-4">
              <div className="h-5 rounded-md w-3/4 mb-2 animate-shimmer" />
              <div className="h-4 rounded-md w-full mb-1.5 animate-shimmer" />
              <div className="h-4 rounded-md w-5/6 animate-shimmer" />
            </div>
            <div className="flex gap-2 mb-5">
              <div className="h-5 w-12 rounded-md animate-shimmer" />
              <div className="h-5 w-16 rounded-md animate-shimmer" />
            </div>
            <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
              <div className="flex gap-2">
                <div className="h-9 w-9 rounded-xl animate-shimmer" />
                <div className="space-y-1 py-1">
                  <div className="h-2.5 w-12 rounded animate-shimmer" />
                  <div className="h-2.5 w-16 rounded animate-shimmer" />
                </div>
              </div>
              <div className="h-5 w-16 rounded-md animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center animate-slide-up">
        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Queue clear</h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto">
          No signals match your current filters. Try broadening your search or resetting status filters.
        </p>
      </div>
    );
  }

  const highRiskCount = items.filter(i => i.signals.safetyRisk >= 75).length;
  const escalatedCount = items.filter(i => i.status === 'escalated').length;
  const pendingCount = items.filter(i => i.status === 'pending').length;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 flex flex-col">
      {/* Summary Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0ms' }}>
        <div className="glass-card bg-white p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800 leading-none mb-1">{items.length}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Items</p>
          </div>
        </div>

        <div className="glass-card bg-white p-4 rounded-2xl flex items-center gap-4 border-l-4 border-l-rose-500">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800 leading-none mb-1">{highRiskCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">High Risk</p>
          </div>
        </div>

        <div className="glass-card bg-white p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800 leading-none mb-1">{pendingCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</p>
          </div>
        </div>

        <div className="glass-card bg-white p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800 leading-none mb-1">{escalatedCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Escalated</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max pb-12 flex-1">
        {items.map((item, index) => (
          <div key={item.id} className="animate-slide-up" style={{ animationDelay: `${(index * 50) + 100}ms` }}>
            <ItemCard
              item={item}
              onClick={onSelectItem}
              isSelected={selectedItemId === item.id}
              onApprove={() => onApproveItem?.(item.id)}
              onEscalate={() => onEscalateItem?.(item.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardView;
