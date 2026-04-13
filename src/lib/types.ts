export type PlayerStatus = 'target' | 'visiting' | 'committed' | 'signed' | 'gone';
export type PlayerDirection = 'incoming' | 'outgoing' | 'returning' | 'freshman';

export interface PlayerStats {
  ppg?: number;
  rpg?: number;
  apg?: number;
  bpg?: number;
  fgPct?: number;
  threePct?: number;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  height?: string;
  weight?: string;
  previousSchool: string;
  direction: PlayerDirection;
  status: PlayerStatus;
  stats?: PlayerStats;
  eligibilityYears?: number;
  highlightUrl?: string;
  destinationSchool?: string;
  note?: string;
  sources: string[];
  firstTracked: string;
  lastUpdated: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  publishedAt: string;
  relatedPlayerNames: string[];
  category: 'commitment' | 'visit' | 'rumor' | 'departure' | 'general';
}

export interface DashboardData {
  players: Player[];
  news: NewsItem[];
  lastPipelineRun: string;
  pipelineStatus: 'healthy' | 'degraded' | 'down';
  seenUrls: string[];
}
