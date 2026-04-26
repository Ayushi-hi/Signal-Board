import React, { useState, useCallback } from 'react';
import type { ReviewItem, FilterState, UserPreferences } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useReviewItems } from '../hooks/useReviewItems';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import Header from './Header';
import Sidebar from './Sidebar';
import BoardView from './BoardView';
import DetailPanel from './DetailPanel';
import CommandPalette from './CommandPalette';
import HelpModal from './HelpModal';

interface SignalBoardProps {
  items: ReviewItem[];
  isLoading?: boolean;
  error?: string | null;
}

const defaultPreferences: UserPreferences = {
  filterState: {
    status: 'all',
    riskLevel: 'all',
    searchQuery: '',
    sortBy: 'signal-score',
  },
  viewMode: 'grid',
  sidebarOpen: true,
};

const SignalBoard: React.FC<SignalBoardProps> = ({ items, isLoading = false, error = null }) => {
  const [prefs, setPrefs] = useLocalStorage<UserPreferences>('signal-board-prefs', defaultPreferences);
  const [displayItems, setDisplayItems] = useState<ReviewItem[]>(items);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(prefs?.sidebarOpen ?? true);

  // Update display items when items change
  React.useEffect(() => {
    setDisplayItems(items);
  }, [items]);

  const filters: FilterState = prefs?.filterState || defaultPreferences.filterState;
  const filteredItems = useReviewItems(displayItems, filters);
  const selectedItem = displayItems.find((item) => item.id === selectedItemId) || null;

  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setPrefs({
      ...prefs,
      filterState: {
        ...filters,
        ...newFilters,
      },
    });
  }, [filters, prefs, setPrefs]);

  const handleSelectItem = useCallback((item: ReviewItem) => {
    setSelectedItemId(item.id);
  }, []);

  const handleMarkReviewed = useCallback(() => {
    if (!selectedItem) return;
    setDisplayItems((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id ? { ...item, status: 'reviewed' as const } : item
      )
    );
  }, [selectedItem]);

  const handleMarkEscalated = useCallback(() => {
    if (!selectedItem) return;
    setDisplayItems((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id ? { ...item, status: 'escalated' as const } : item
      )
    );
  }, [selectedItem]);

  const handleApproveItem = useCallback((id: string) => {
    setDisplayItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'reviewed' as const } : item
      )
    );
  }, []);

  const handleEscalateItem = useCallback((id: string) => {
    setDisplayItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'escalated' as const } : item
      )
    );
  }, []);

  const handleAddNote = useCallback((noteText: string) => {
    if (!selectedItem) return;
    const newNote = {
      id: Math.random().toString(36).substr(2, 9),
      text: noteText,
      createdAt: new Date().toISOString(),
    };
    setDisplayItems((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? { ...item, userNotes: [...(item.userNotes || []), newNote] }
          : item
      )
    );
  }, [selectedItem]);

  const handleSnooze = useCallback((days: number) => {
    if (!selectedItem) return;
    const snoozedUntil = new Date();
    snoozedUntil.setDate(snoozedUntil.getDate() + days);
    setDisplayItems((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? { ...item, snoozedUntil: snoozedUntil.toISOString() }
          : item
      )
    );
  }, [selectedItem]);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
    setPrefs({
      ...prefs,
      sidebarOpen: !sidebarOpen,
    });
  }, [sidebarOpen, prefs, setPrefs]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onCommandPalette: () => setShowCommandPalette(true),
    onFocusSearch: () => {
      const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
      searchInput?.focus();
    },
    onShowHelp: () => setShowHelp(true),
    onEscapePressed: () => {
      setShowCommandPalette(false);
      setShowHelp(false);
      setSelectedItemId(null);
    },
  });

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-md p-8 glass-panel rounded-3xl">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">System Interrupted</h2>
          <p className="text-slate-500 mb-8">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-premium btn-premium-primary w-full py-3">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        itemCount={filteredItems.length}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header
          onToggleSidebar={handleToggleSidebar}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
        />

        <main className="flex-1 overflow-hidden relative">
          <div className="h-full flex">
            {/* Board View */}
            <div className={`flex-1 transition-all duration-500 ${selectedItem ? 'mr-0 lg:mr-4' : ''}`}>
              <BoardView
                items={filteredItems}
                selectedItemId={selectedItemId}
                onSelectItem={handleSelectItem}
                onApproveItem={handleApproveItem}
                onEscalateItem={handleEscalateItem}
                isLoading={isLoading}
              />
            </div>

            {/* Detail Panel Overlay/Sidecar */}
            {selectedItem && (
              <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] lg:relative lg:w-[450px] z-50 lg:z-10 shadow-2xl lg:shadow-none animate-slide-in-right">
                <div className="h-full lg:h-[calc(100%-2rem)] lg:my-4 lg:mr-4 bg-white lg:rounded-3xl lg:border lg:border-slate-100 shadow-xl overflow-hidden">
                  <DetailPanel
                    item={selectedItem}
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItemId(null)}
                    onMarkReviewed={handleMarkReviewed}
                    onMarkEscalated={handleMarkEscalated}
                    onAddNote={handleAddNote}
                    onSnooze={handleSnooze}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {showCommandPalette && (
        <CommandPalette
          isOpen={showCommandPalette}
          allItems={displayItems}
          onClose={() => setShowCommandPalette(false)}
          onSelectItem={(item) => {
            handleSelectItem(item);
            setShowCommandPalette(false);
          }}
        />
      )}

      {showHelp && <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />}
    </div>
  );
};

export default SignalBoard;
