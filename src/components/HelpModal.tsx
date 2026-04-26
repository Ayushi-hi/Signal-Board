import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <button
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close help modal"
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-auto px-4 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border border-slate-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Signal Board Help</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Navigation */}
            <section>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Navigation</h3>
              <div className="space-y-2">
                <div className="flex gap-4">
                  <kbd className="px-3 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-sm whitespace-nowrap">
                    Cmd+K / Ctrl+K
                  </kbd>
                  <span className="text-sm text-slate-700">Open command palette</span>
                </div>
                <div className="flex gap-4">
                  <kbd className="px-3 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-sm whitespace-nowrap">
                    /
                  </kbd>
                  <span className="text-sm text-slate-700">Focus search box</span>
                </div>
                <div className="flex gap-4">
                  <kbd className="px-3 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-sm whitespace-nowrap">
                    j / k
                  </kbd>
                  <span className="text-sm text-slate-700">Navigate items (next/prev)</span>
                </div>
                <div className="flex gap-4">
                  <kbd className="px-3 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-sm whitespace-nowrap">
                    Enter
                  </kbd>
                  <span className="text-sm text-slate-700">Open selected item</span>
                </div>
                <div className="flex gap-4">
                  <kbd className="px-3 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-sm whitespace-nowrap">
                    Esc
                  </kbd>
                  <span className="text-sm text-slate-700">Close detail view</span>
                </div>
              </div>
            </section>

            {/* Actions */}
            <section>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Item Actions</h3>
              <div className="space-y-2">
                <div className="flex gap-4">
                  <kbd className="px-3 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-sm whitespace-nowrap">
                    r
                  </kbd>
                  <span className="text-sm text-slate-700">Mark item as reviewed</span>
                </div>
                <div className="flex gap-4">
                  <kbd className="px-3 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-sm whitespace-nowrap">
                    e
                  </kbd>
                  <span className="text-sm text-slate-700">Escalate item</span>
                </div>
              </div>
            </section>

            {/* Tips */}
            <section>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Tips & Tricks</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>
                  • Use <span className="font-semibold">filters</span> to narrow down items by status or safety risk level
                </li>
                <li>
                  • <span className="font-semibold">Search</span> by title, description, or tags to find specific items
                </li>
                <li>
                  • View <span className="font-semibold">signal profiles</span> in the detail panel to understand item priority
                </li>
                <li>
                  • <span className="font-semibold">Add notes</span> to items to document your review decisions
                </li>
                <li>
                  • Use <span className="font-semibold">snooze</span> to defer items to later
                </li>
                <li>
                  • Your filter preferences are saved automatically
                </li>
              </ul>
            </section>

            {/* About Signals */}
            <section>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Signal Types</h3>
              <div className="space-y-2 text-sm text-slate-700">
                <div>
                  <span className="font-semibold text-red-600">Safety Risk:</span> Potential for harmful output or misuse
                </div>
                <div>
                  <span className="font-semibold text-blue-600">Novelty Score:</span> How unusual or unexpected the finding is
                </div>
                <div>
                  <span className="font-semibold text-purple-600">Impact Potential:</span> Significance if the issue is real
                </div>
                <div>
                  <span className="font-semibold text-emerald-600">Confidence:</span> How confident we are in this assessment
                </div>
              </div>
            </section>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;