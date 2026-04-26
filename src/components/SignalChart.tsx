import React from 'react';
import type { Signals } from '../types';

interface SignalChartProps {
  signals: Signals;
}

const SignalChart: React.FC<SignalChartProps> = ({ signals }) => {
  const signals_array = [
    { label: 'Safety Risk', value: signals.safetyRisk, color: 'from-rose-500 to-rose-400', textColor: 'text-rose-600' },
    { label: 'Novelty Score', value: signals.noveltyScore, color: 'from-indigo-500 to-indigo-400', textColor: 'text-indigo-600' },
    { label: 'Impact Potential', value: signals.impactPotential, color: 'from-purple-500 to-purple-400', textColor: 'text-purple-600' },
    { label: 'Confidence Level', value: signals.confidenceScore, color: 'from-emerald-500 to-emerald-400', textColor: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-4">
      {signals_array.map((signal, idx) => (
        <div key={idx} className="group">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight group-hover:text-slate-700 transition-colors">
              {signal.label}
            </label>
            <span className={`text-xs font-black ${signal.textColor}`}>{signal.value}%</span>
          </div>
          <div
            className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50"
            role="progressbar"
            aria-valuenow={signal.value}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div 
              className={`h-full bg-gradient-to-r ${signal.color} rounded-full transition-all duration-1000 ease-out shadow-sm`} 
              style={{ width: `${signal.value}%` }} 
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SignalChart;
