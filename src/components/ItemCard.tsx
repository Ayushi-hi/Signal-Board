import React from 'react';
import type { ReviewItem } from '../types';
import { calculateCompositeScore, formatRelativeTime } from '../utils/helpers';

interface ItemCardProps {
  item: ReviewItem;
  isSelected?: boolean;
  onClick?: (item: ReviewItem) => void;
  onApprove?: (id: string) => void;
  onEscalate?: (id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, isSelected = false, onClick, onApprove, onEscalate }) => {
  const compositeScore = calculateCompositeScore(item.signals);
  const relativeTime = formatRelativeTime(item.createdAt);

  const riskColor = 
    compositeScore >= 90 ? 'bg-rose-500' : 
    compositeScore >= 70 ? 'bg-amber-500' : 'bg-emerald-500';

  const riskTextColor = 
    compositeScore >= 90 ? 'text-rose-600' : 
    compositeScore >= 70 ? 'text-amber-600' : 'text-emerald-600';

  const leftBorderColor = 
    item.signals.safetyRisk >= 75 ? 'border-l-rose-500' : 
    item.signals.safetyRisk >= 50 ? 'border-l-amber-500' : 'border-l-emerald-500';

  return (
    <div
      onClick={() => onClick?.(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(item);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${item.title}`}
      className={`glass-card p-5 rounded-2xl cursor-pointer group relative overflow-hidden flex flex-col h-full bg-white transition-all duration-300 border-l-[6px] border-y border-r ${leftBorderColor} ${
        isSelected ? 'ring-2 ring-indigo-500 shadow-lg' : 'border-slate-200/60 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:-translate-y-1'
      }`}
    >
      {/* Top Header: Source & Time */}
      <div className="flex items-center justify-between mb-4 text-xs font-medium text-slate-400">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L18.5 7H20" />
          </svg>
          <span className="uppercase tracking-wider font-bold text-slate-500">{item.source}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{relativeTime}</span>
        </div>
      </div>

      {/* Main Content: Title & Description */}
      <div className="mb-4 flex-1">
        <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
          {item.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {item.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="px-2.5 py-1 text-[11px] font-semibold bg-slate-50 border border-slate-100 text-slate-600 rounded-md">
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="px-2.5 py-1 text-[11px] font-medium text-slate-400">
              +{item.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer: Progress Bar Score & Status */}
      <div className="pt-4 border-t border-slate-100 mt-auto flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Intensity Score</span>
          <span className={`text-sm font-black ${riskTextColor}`}>{compositeScore}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
           <div className={`h-full ${riskColor} rounded-full transition-all duration-1000`} style={{ width: `${compositeScore}%` }}></div>
        </div>

        <div className="flex items-center justify-between mt-3 min-h-[28px]">
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 absolute">
            <button 
              onClick={(e) => { e.stopPropagation(); onApprove?.(item.id); }}
              className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white hover:shadow-md rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1 border border-emerald-200 hover:border-emerald-500 z-10"
              title="Quick Resolve"
            >
              Resolve
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onEscalate?.(item.id); }}
              className="px-2.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-500 hover:text-white hover:shadow-md rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1 border border-rose-200 hover:border-rose-500 z-10"
              title="Quick Escalate"
            >
              Escalate
            </button>
          </div>
          
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 group-hover:opacity-0 transition-opacity duration-300">
            Click to view details
          </div>

          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm transition-all z-0 ${
              item.status === 'escalated' ? 'bg-rose-100 text-rose-700 border-rose-200' :
              item.status === 'reviewed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
              'bg-amber-100 text-amber-700 border-amber-200'
          }`}>
            {item.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
