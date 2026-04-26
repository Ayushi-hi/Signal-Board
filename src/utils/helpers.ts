
import type { ReviewItem, Signals } from '../types';

/**
 * Calculate composite signal score (average of all 4 signals)
 */
export const calculateCompositeScore = (signals: Signals): number => {
  const sum = signals.safetyRisk + signals.noveltyScore + signals.impactPotential + signals.confidenceScore;
  return Math.round(sum / 4);
};

/**
 * Format date as relative time (e.g., "2d ago", "just now")
 */
export const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

/**
 * Format date as ISO string (e.g., "Jan 15, 2024")
 */
export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get risk level from safety risk score
 */
export const getRiskLevel = (safetyRisk: number): 'high' | 'medium' | 'low' => {
  if (safetyRisk >= 75) return 'high';
  if (safetyRisk >= 50) return 'medium';
  return 'low';
};

/**
 * Get risk color for CSS/styling
 */
export const getRiskColor = (safetyRisk: number): string => {
  const level = getRiskLevel(safetyRisk);
  switch (level) {
    case 'high':
      return 'text-red-600';
    case 'medium':
      return 'text-amber-600';
    default:
      return 'text-emerald-600';
  }
};

/**
 * Get risk badge color
 */
export const getRiskBadgeColor = (safetyRisk: number): string => {
  const level = getRiskLevel(safetyRisk);
  switch (level) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'medium':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    default:
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  }
};

/**
 * Get status badge color
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'escalated':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'reviewed':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    default:
      return 'bg-amber-100 text-amber-800 border-amber-300';
  }
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Debounce function for search input
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

/**
 * Check if item matches search query
 */
export const matchesQuery = (item: ReviewItem, query: string): boolean => {
  if (!query.trim()) return true;

  const q = query.toLowerCase();
  return (
    item.title.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q) ||
    item.tags.some((tag) => tag.toLowerCase().includes(q))
  );
};

/**
 * Sort items by signal score (descending)
 */
export const sortBySignalScore = (items: ReviewItem[]): ReviewItem[] => {
  return [...items].sort((a, b) => {
    const scoreA = calculateCompositeScore(a.signals);
    const scoreB = calculateCompositeScore(b.signals);
    return scoreB - scoreA;
  });
};

/**
 * Sort items by date (newest first)
 */
export const sortByRecency = (items: ReviewItem[]): ReviewItem[] => {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

/**
 * Get count of items by status
 */
export const getStatusCounts = (items: ReviewItem[]): Record<string, number> => {
  return {
    pending: items.filter((i) => i.status === 'pending').length,
    reviewed: items.filter((i) => i.status === 'reviewed').length,
    escalated: items.filter((i) => i.status === 'escalated').length,
  };
};

/**
 * Get count of items by risk level
 */
export const getRiskCounts = (items: ReviewItem[]): Record<string, number> => {
  return {
    high: items.filter((i) => getRiskLevel(i.signals.safetyRisk) === 'high').length,
    medium: items.filter((i) => getRiskLevel(i.signals.safetyRisk) === 'medium').length,
    low: items.filter((i) => getRiskLevel(i.signals.safetyRisk) === 'low').length,
  };
};

/**
 * Export items as JSON
 */
export const exportItemsAsJSON = (items: ReviewItem[], filename: string = 'signal-board-export.json'): void => {
  const dataStr = JSON.stringify(items, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Get unique tags from items
 */
export const getUniqueTags = (items: ReviewItem[]): string[] => {
  const tags = new Set<string>();
  items.forEach((item) => {
    item.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
};