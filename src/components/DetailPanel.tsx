import React, { useState } from 'react';
import type { ReviewItem, UserNote } from '../types';
import { calculateCompositeScore, formatDate } from '../utils/helpers';
import SignalChart from './SignalChart';

interface DetailPanelProps {
  item: ReviewItem | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkReviewed?: () => void;
  onMarkEscalated?: () => void;
  onAddNote?: (note: string) => void;
  onSnooze?: (days: number) => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({
  item,
  onClose,
  onMarkReviewed,
  onMarkEscalated,
  onAddNote,
  onSnooze,
}) => {
  const [noteText, setNoteText] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);

  if (!item) return null;

  const compositeScore = calculateCompositeScore(item.signals);

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddNote?.(noteText);
      setNoteText('');
      setShowNoteForm(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
            {compositeScore}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-none">Signal Analysis</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Intensity Report</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        {/* Main Title & Description */}
        <section className="animate-slide-up opacity-0" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`badge-status badge-${item.status}`}>{item.status}</span>
            <span className="text-[10px] text-slate-400 font-medium">• {formatDate(item.createdAt)}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">{item.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {item.description}
          </p>
        </section>

        {/* Signals Visualization */}
        <section className="space-y-4 animate-slide-up opacity-0" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signal Metrics</h4>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-4">
            <SignalChart signals={item.signals} />
          </div>
        </section>

        {/* Metadata Grid */}
        <section className="grid grid-cols-2 gap-4 animate-slide-up opacity-0" style={{ animationDelay: '150ms' }}>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Source</p>
            <p className="text-xs font-bold text-slate-700 capitalize">{item.source}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Risk Tier</p>
            <p className={`text-xs font-bold ${
              item.signals.safetyRisk >= 75 ? 'text-rose-600' : 
              item.signals.safetyRisk >= 50 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {item.signals.safetyRisk >= 75 ? 'High Criticality' : 
               item.signals.safetyRisk >= 50 ? 'Medium Advisory' : 'Low Priority'}
            </p>
          </div>
        </section>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <section className="animate-slide-up opacity-0" style={{ animationDelay: '200ms' }}>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Classifications</h4>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-[11px] font-medium hover:border-indigo-200 hover:text-indigo-600 transition-colors cursor-default">
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Notes System */}
        <section className="space-y-4 animate-slide-up opacity-0" style={{ animationDelay: '250ms' }}>
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auditor Notes</h4>
          
          <div className="space-y-3">
            {item.userNotes?.map((note: UserNote) => (
              <div key={note.id} className="p-4 bg-slate-50 rounded-2xl border-l-4 border-indigo-500 relative">
                <p className="text-xs text-slate-700 leading-relaxed">{note.text}</p>
                <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-tight">
                  {formatDate(note.createdAt)}
                </p>
              </div>
            ))}
          </div>

          {!showNoteForm ? (
            <button
              onClick={() => setShowNoteForm(true)}
              className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-xs font-bold hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Annotation
            </button>
          ) : (
            <div className="space-y-3 p-4 bg-indigo-50/30 border border-indigo-100 rounded-2xl animate-slide-up">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Type your findings here..."
                className="w-full p-4 bg-white border border-indigo-100 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddNote}
                  className="btn-premium btn-premium-primary flex-1 text-xs py-2"
                >
                  Save Findings
                </button>
                <button
                  onClick={() => { setShowNoteForm(false); setNoteText(''); }}
                  className="btn-premium btn-premium-secondary flex-1 text-xs py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Primary Actions */}
      <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-3">
        <div className="flex gap-3">
          <button
            onClick={onMarkReviewed}
            className="btn-premium btn-premium-primary flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Approve
          </button>
          <button
            onClick={onMarkEscalated}
            className="btn-premium btn-premium-primary flex-1 py-3 bg-rose-600 hover:bg-rose-700 shadow-rose-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Escalate
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onSnooze?.(1)}
            className="btn-premium btn-premium-secondary py-2.5 text-[11px]"
          >
            Snooze 24h
          </button>
          <button
            onClick={() => onSnooze?.(7)}
            className="btn-premium btn-premium-secondary py-2.5 text-[11px]"
          >
            Snooze 7d
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
