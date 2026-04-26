// src/App.tsx

import React, { useState, useEffect } from 'react';
import type { ReviewItem } from './types';
import { loadReviewItems } from './data/mockData';
import SignalBoard from './components/SignalBoard';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await loadReviewItems(1200);
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load review items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <ErrorBoundary>
      <SignalBoard items={items} isLoading={isLoading} error={error} />
    </ErrorBoundary>
  );
};

export default App;