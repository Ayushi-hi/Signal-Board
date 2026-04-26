
export interface Signals {
  safetyRisk: number;      // 0-100
  noveltyScore: number;    // 0-100
  impactPotential: number; // 0-100
  confidenceScore: number; // 0-100
}

export interface UserNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface Metadata {
  itemCount?: number;
  modelVersion?: string;
  region?: string;
}

export interface ReviewItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'reviewed' | 'escalated';
  createdAt: string;
  updatedAt: string;
  signals: Signals;
  tags: string[];
  source: 'manual' | 'api' | 'feedback';
  metadata: Metadata;
  userNotes: UserNote[];
  snoozedUntil?: string;
}

export type SortOption = 'signal-score' | 'recency';
export type StatusFilter = 'all' | 'pending' | 'reviewed' | 'escalated';
export type RiskFilter = 'all' | 'high' | 'medium' | 'low';

export interface FilterState {
  status: StatusFilter;
  riskLevel: RiskFilter;
  searchQuery: string;
  sortBy: SortOption;
}

export interface UserPreferences {
  filterState: FilterState;
  viewMode: 'grid' | 'list';
  sidebarOpen: boolean;
}

export interface CommandAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: () => void;
}