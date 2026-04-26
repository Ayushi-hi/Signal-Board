
import { useMemo } from 'react';
import type { ReviewItem, FilterState } from '../types';

export const useReviewItems = (items: ReviewItem[], filters: FilterState) => {
  return useMemo(() => {
    let filtered = [...items];

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((item) => item.status === filters.status);
    }

    // Apply risk level filter
    if (filters.riskLevel !== 'all') {
      const riskThresholds = {
        high: 75,
        medium: 50,
      };
      const threshold = riskThresholds[filters.riskLevel as 'high' | 'medium'] || 0;

      filtered = filtered.filter((item) => {
        const safetyRisk = item.signals.safetyRisk;
        return filters.riskLevel === 'high'
          ? safetyRisk >= threshold
          : filters.riskLevel === 'medium'
            ? safetyRisk >= threshold && safetyRisk < 75
            : safetyRisk < 50;
      });
    }

    // Apply search query - FIX: Check if searchQuery exists and is a string
    const query = filters.searchQuery ? String(filters.searchQuery).toLowerCase().trim() : '';
    if (query) {
      filtered = filtered.filter((item) => {
        return (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      });
    }

    // Apply sort
    if (filters.sortBy === 'signal-score') {
      filtered.sort((a, b) => {
        const scoreA = (a.signals.safetyRisk + a.signals.noveltyScore + a.signals.impactPotential + a.signals.confidenceScore) / 4;
        const scoreB = (b.signals.safetyRisk + b.signals.noveltyScore + b.signals.impactPotential + b.signals.confidenceScore) / 4;
        return scoreB - scoreA;
      });
    } else if (filters.sortBy === 'recency') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [items, filters]);
};