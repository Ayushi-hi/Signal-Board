import React, { useState } from 'react';
import type { ReviewItem } from '../types';
import { exportItemsAsJSON, getStatusCounts, getRiskCounts } from '../utils/helpers';

interface AdvancedFeaturesProps {
  filteredItems: ReviewItem[];
}

const AdvancedFeatures: React.FC<AdvancedFeaturesProps> = ({ filteredItems }) => {
  const [showAnalytics, setShowAnalytics] = useState(false);

  const statusCounts = getStatusCounts(filteredItems);
  const riskCounts = getRiskCounts(filteredItems);

  const pendingPercent = filteredItems.length > 0 ? Math.round((statusCounts.pending / filteredItems.length) * 100) : 0;
  const reviewedPercent = filteredItems.length > 0 ? Math.round((statusCounts.reviewed / filteredItems.length) * 100) : 0;
  const escalatedPercent = filteredItems.length > 0 ? Math.round((statusCounts.escalated / filteredItems.length) * 100) : 0;

  const highPercent = filteredItems.length > 0 ? Math.round((riskCounts.high / filteredItems.length) * 100) : 0;
  const mediumPercent = filteredItems.length > 0 ? Math.round((riskCounts.medium / filteredItems.length) * 100) : 0;
  const lowPercent = filteredItems.length > 0 ? Math.round((riskCounts.low / filteredItems.length) * 100) : 0;

  const handleExport = () => {
    exportItemsAsJSON(filteredItems, `signal-board-${new Date().toISOString().split('T')[0]}.json`);
  };

  return (
    <div className="space-y-4">
      {/* Analytics Toggle */}
      <button
        onClick={() => setShowAnalytics(!showAnalytics)}
        className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
      >
        <span>📊 Analytics</span>
        <svg
          className={`w-4 h-4 transition-transform ${showAnalytics ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* Analytics Panel */}
      {showAnalytics && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
          {/* Status Distribution */}
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-3">Status Distribution</h4>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-700">Pending</span>
                  <span className="text-xs font-bold text-slate-900">{statusCounts.pending} ({pendingPercent}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pendingPercent}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-700">Reviewed</span>
                  <span className="text-xs font-bold text-slate-900">{statusCounts.reviewed} ({reviewedPercent}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${reviewedPercent}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-700">Escalated</span>
                  <span className="text-xs font-bold text-slate-900">{statusCounts.escalated} ({escalatedPercent}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${escalatedPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="border-t border-slate-300 pt-4">
            <h4 className="font-semibold text-slate-900 text-sm mb-3">Risk Level Distribution</h4>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-700">High Risk</span>
                  <span className="text-xs font-bold text-red-600">{riskCounts.high} ({highPercent}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${highPercent}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-700">Medium Risk</span>
                  <span className="text-xs font-bold text-amber-600">{riskCounts.medium} ({mediumPercent}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${mediumPercent}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-700">Low Risk</span>
                  <span className="text-xs font-bold text-emerald-600">{riskCounts.low} ({lowPercent}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${lowPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-slate-300 pt-4 grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-slate-500 font-medium">Total Items</p>
              <p className="text-lg font-bold text-slate-900">{filteredItems.length}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Completion Rate</p>
              <p className="text-lg font-bold text-emerald-600">
                {filteredItems.length > 0 ? Math.round(((statusCounts.reviewed + statusCounts.escalated) / filteredItems.length) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-4-2m4 2l4-2" />
            </svg>
            Export as JSON
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvancedFeatures;