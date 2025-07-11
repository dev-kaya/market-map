export interface Investor {
  id: string;
  name: string;
  logoUrl: string;
  type: 'VC' | 'PE' | 'ACCELERATOR' | 'CORPORATE' | 'ANGEL';
  tier: 'TOP_TIER' | 'MID_TIER' | 'EMERGING';
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  stage: 'SEED' | 'SERIES_A' | 'SERIES_B' | 'SERIES_C' | 'SERIES_D' | 'GROWTH' | 'PUBLIC';
  country?: string;
  city?: string;
  geography?: string;
  fundingToDate: number;
  lastRoundDate?: string;
  lastRoundSize?: number;
  employeeCount?: number;
  foundedYear?: number;
  linkedinUrl?: string;
  twitterUrl?: string;
  isTopCompany: boolean;
  positionX: number;
  positionY: number;
  categoryId: string;
  category?: Category;
  investors?: Investor[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  positionX: number;
  positionY: number;
  companies?: Company[];
  createdAt: string;
  updatedAt: string;
}

export interface FilterState {
  search: string;
  stages: string[];
  geographies: string[];
  categories: string[];
}

export interface Position {
  x: number;
  y: number;
}

export type ViewMode = 'top-early-stage' | 'czechia' | 'slovakia' | 'poland' | 'sectors';

export type CountryCode = 'czechia' | 'slovakia' | 'poland';

export interface CountryInfo {
  code: CountryCode;
  name: string;
  flag: string;
  color: string;
}


