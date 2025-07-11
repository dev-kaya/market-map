'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth';
import SearchBar from './SearchBar';
import CompanyCard from './CompanyCard';
import SuggestButton from './SuggestButton';
import GatedGrid from './GatedGrid';
import { useCompanies } from '@/hooks/useCompanies';
import { Company, Category, ViewMode, CountryInfo } from '@/types';

interface MarketMapProps {
  className?: string;
}

// Removed fetchCompanies - now using useCompanies hook

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

const COUNTRIES: CountryInfo[] = [
  { code: 'czechia', name: 'Czechia', flag: '🇨🇿', color: '#D2001C' },
  { code: 'slovakia', name: 'Slovakia', flag: '🇸🇰', color: '#0B4EA2' },
  { code: 'poland', name: 'Poland', flag: '🇵🇱', color: '#DC143C' },
];

const VIEW_OPTIONS = [
  { key: 'top-early-stage' as ViewMode, label: 'Top Early Stage', desc: 'Best emerging CEE companies' },
  { key: 'czechia' as ViewMode, label: 'Czechia 🇨🇿', desc: 'Top Czech companies' },
  { key: 'slovakia' as ViewMode, label: 'Slovakia 🇸🇰', desc: 'Top Slovak companies' },
  { key: 'poland' as ViewMode, label: 'Poland 🇵🇱', desc: 'Top Polish companies' },
  { key: 'sectors' as ViewMode, label: 'By Sectors', desc: 'Companies by industry' },
];

export default function MarketMap({ className }: MarketMapProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<ViewMode>('top-early-stage');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: companiesResponse, isLoading: companiesLoading } = useCompanies();
  const companies = companiesResponse?.data || [];
  const truncated = companiesResponse?.truncated || false;
  const totalCount = companiesResponse?.totalCount;

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const filteredCompanies = useMemo(() => {
    let filtered = companies.filter((company) => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Apply view-specific filtering
    switch (currentView) {
      case 'top-early-stage':
        filtered = filtered
          .filter(c => ['SEED', 'SERIES_A', 'SERIES_B'].includes(c.stage))
          .sort((a, b) => b.fundingToDate - a.fundingToDate)
          .slice(0, 20);
        break;
      case 'czechia':
        filtered = filtered
          .filter(c => c.country === 'czechia')
          .sort((a, b) => b.fundingToDate - a.fundingToDate)
          .slice(0, 10);
        break;
      case 'slovakia':
        filtered = filtered
          .filter(c => c.country === 'slovakia')
          .sort((a, b) => b.fundingToDate - a.fundingToDate)
          .slice(0, 10);
        break;
      case 'poland':
        filtered = filtered
          .filter(c => c.country === 'poland')
          .sort((a, b) => b.fundingToDate - a.fundingToDate)
          .slice(0, 10);
        break;
      case 'sectors':
        // Show all for sectors view
        break;
    }

    return filtered;
  }, [companies, searchTerm, currentView]);

  const companiesByCategory = useMemo(() => {
    const grouped = filteredCompanies.reduce((acc, company) => {
      const categoryId = company.categoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(company);
      return acc;
    }, {} as Record<string, Company[]>);

    // Sort companies within each category by funding
    Object.keys(grouped).forEach(categoryId => {
      grouped[categoryId].sort((a, b) => b.fundingToDate - a.fundingToDate);
    });

    return grouped;
  }, [filteredCompanies]);


  if (companiesLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentViewOption = VIEW_OPTIONS.find(v => v.key === currentView);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Sophisticated Header */}
      <div className="py-12 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
            {/* Title Section with Visual Hierarchy */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                  {currentViewOption?.label}
                </h1>
              </div>
              <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-2xl">
                {currentViewOption?.desc}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live data • Updated daily</span>
              </div>
            </div>
            
            {/* View Selector & Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              {/* Simple Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between min-w-[180px] px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span>{currentViewOption?.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {VIEW_OPTIONS.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => {
                          setCurrentView(option.key);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          currentView === option.key ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Search */}
              <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search companies..."
                className="min-w-[280px]"
              />
              
              {/* Suggest Button */}
              <SuggestButton />
            </div>
          </div>
        </div>
      </div>

      {/* Results Overview */}
      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredCompanies.length} Companies
              </h2>
              <div className="h-5 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-500 font-medium">
                {currentView === 'sectors' ? 'Grouped by industry' : 'Sorted by funding'}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              <span className="font-medium">Central & Eastern Europe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {currentView === 'sectors' ? (
            <div className="relative">
              <div className="space-y-12">
                {categories.map((category) => {
                  const categoryCompanies = companiesByCategory[category.id] || [];
                  if (categoryCompanies.length === 0) return null;

                  return (
                    <div key={category.id} className="space-y-8">
                      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full shadow-sm"
                            style={{ backgroundColor: category.color }}
                          />
                          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {category.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-5 w-px bg-gray-300"></div>
                          <span className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1.5 rounded-full">
                            {categoryCompanies.length} companies
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryCompanies.map((company) => (
                          <CompanyCard key={company.id} company={company} variant="grid" />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Gating Overlay for Sectors View */}
              {truncated && (
                <div className="absolute inset-0 flex flex-col items-center justify-end">
                  {/* Gradient overlay - starts after first category section */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white backdrop-blur-sm motion-reduce:backdrop-blur-none"
                    style={{
                      // Start gradient after first category (~500px to show first complete section)
                      background: `linear-gradient(to bottom, 
                        transparent 0%, 
                        transparent 450px, 
                        rgba(255,255,255,0.3) 500px, 
                        rgba(255,255,255,0.8) 600px, 
                        rgba(255,255,255,0.95) 700px, 
                        white 100%)`
                    }}
                  />
                  
                  {/* CTA Content */}
                  <div className="relative z-10 text-center mb-8 max-w-md mx-auto px-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Unlock the complete CEE startup map
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Discover {totalCount ? `all ${totalCount}` : 'hundreds of'} tech companies across Central & Eastern Europe.
                    </p>
                    <div className="space-y-2">
                      <Button onClick={() => signIn('google')} className="w-full" size="lg">
                        Continue with Google
                      </Button>
                      <Button 
                        onClick={() => signIn('magic-link')} 
                        variant="outline" 
                        className="w-full"
                        size="lg"
                      >
                        Send me a magic link
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {filteredCompanies.length === 0 ? (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="text-gray-400 mb-4">
                      <Search className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No companies found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Can't find what you're looking for? Suggest a startup to add to our map.
                    </p>
                    <SuggestButton variant="default" />
                  </div>
                </div>
              ) : (
                <GatedGrid 
                  companies={filteredCompanies}
                  truncated={truncated}
                  totalCount={totalCount}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}