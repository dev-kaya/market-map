import { Company, Category, ViewMode } from '@/types';
import { Badge } from './ui/badge';

interface LogoGridProps {
  companies: Company[];
  categories: Category[];
  view: ViewMode;
}

const getViewTitle = (view: ViewMode): string => {
  switch (view) {
    case 'top-early-stage':
      return 'Top 20 Early Stage CEE Companies';
    case 'czechia':
      return 'Top Czech Tech Companies 🇨🇿';
    case 'slovakia':
      return 'Top Slovak Tech Companies 🇸🇰';
    case 'poland':
      return 'Top Polish Tech Companies 🇵🇱';
    case 'sectors':
      return 'CEE Tech Companies by Sector';
    default:
      return 'CEE Tech Companies';
  }
};

const getViewSubtitle = (view: ViewMode, companiesCount: number): string => {
  switch (view) {
    case 'top-early-stage':
      return `${companiesCount} promising early-stage startups across Central & Eastern Europe`;
    case 'czechia':
      return `${companiesCount} leading technology companies from the Czech Republic`;
    case 'slovakia':
      return `${companiesCount} innovative companies from Slovakia`;
    case 'poland':
      return `${companiesCount} top tech companies from Poland`;
    case 'sectors':
      return `${companiesCount} companies organized by industry sector`;
    default:
      return `${companiesCount} companies`;
  }
};

export default function LogoGrid({ companies, categories, view }: LogoGridProps) {
  const title = getViewTitle(view);
  const subtitle = getViewSubtitle(view, companies.length);

  // Group companies by category for sectors view
  const companiesByCategory = companies.reduce((acc, company) => {
    const categoryId = company.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(company);
    return acc;
  }, {} as Record<string, Company[]>);

  const renderCompanyLogo = (company: Company, index?: number) => (
    <div 
      key={company.id}
      className="logo-grid-item group relative animate-fade-in"
      style={{ 
        animationDelay: `${(index || 0) * 50}ms`,
        animationFillMode: 'both'
      }}
    >
      {/* Logo container */}
      <div className="aspect-square flex items-center justify-center mb-3 p-3">
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt={`${company.name} logo`}
            className="max-w-full max-h-full object-contain"
            style={{ maxHeight: '60px', maxWidth: '120px' }}
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-surface rounded-xl flex items-center justify-center shadow-soft">
            <span className="text-muted-foreground text-sm font-display font-bold">
              {company.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Company name */}
      <div className="text-center px-2">
        <h4 className="font-display text-sm font-semibold text-foreground line-clamp-2 leading-tight mb-2">
          {company.name}
        </h4>
        
        {/* Metadata - always visible, no hover effects */}
        <div className="text-xs space-y-1 mt-1">
          {company.stage && (
            <div className={`stage-badge inline-block ${
              company.stage === 'SEED' ? 'seed' :
              ['SERIES_A', 'SERIES_B', 'SERIES_C'].includes(company.stage) ? 'series' :
              company.stage === 'GROWTH' ? 'growth' : 'public'
            }`}>
              {company.stage.replace('_', ' ')}
            </div>
          )}
          {company.fundingToDate > 0 && (
            <div className="text-xs font-semibold text-gray-600">
              ${Math.round(company.fundingToDate / 1000000)}M
            </div>
          )}
        </div>
      </div>

      {/* Enhanced ranking badge for top companies */}
      {typeof index === 'number' && index < 3 && (
        <div className="absolute -top-2 -right-2 animate-float">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-elevated ${
            index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
            index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' : 
            'bg-gradient-to-r from-amber-500 to-amber-600'
          }`}>
            {index + 1}
          </div>
        </div>
      )}

    </div>
  );

  return (
    <div id="logo-grid-export" className="logo-grid-container animate-fade-in">
      {/* Enhanced Header */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-gradient-primary opacity-50" />
          <span className="text-sm font-medium text-muted-foreground">
            CEE Market Map • {new Date().getFullYear()}
          </span>
          <div className="h-px w-12 bg-gradient-primary opacity-50" />
        </div>
      </div>

      {/* Enhanced Content */}
      {view === 'sectors' ? (
        /* Grouped by categories with staggered animations */
        <div className="space-y-16">
          {categories.map((category, categoryIndex) => {
            const categoryCompanies = companiesByCategory[category.id] || [];
            if (categoryCompanies.length === 0) return null;

            return (
              <div 
                key={category.id} 
                className="space-y-6 animate-fade-in"
                style={{ animationDelay: `${categoryIndex * 200}ms` }}
              >
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm animate-float"
                    style={{ 
                      backgroundColor: category.color,
                      animationDelay: `${categoryIndex * 300}ms`
                    }}
                  />
                  <h2 className="font-display text-2xl font-bold text-foreground tracking-tight">
                    {category.name}
                  </h2>
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm animate-float"
                    style={{ 
                      backgroundColor: category.color,
                      animationDelay: `${categoryIndex * 300 + 150}ms`
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {categoryCompanies.map((company, companyIndex) => 
                    renderCompanyLogo(company, categoryIndex * 20 + companyIndex)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Enhanced simple grid layout */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {companies.map((company, index) => renderCompanyLogo(company, index))}
        </div>
      )}

      {/* Enhanced Footer */}
      <div className="mt-16 pt-8 border-t border-border/30 text-center animate-fade-in" style={{ animationDelay: '800ms' }}>
        <div className="text-sm text-muted-foreground">
          Interactive version available at: 
          <span className="ml-1 font-mono text-primary font-medium">cee-market-map.com</span>
        </div>
        <div className="mt-3 text-xs text-muted-foreground/70">
          Share this market map to showcase the growing CEE tech ecosystem 🚀
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 opacity-60">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-muted-foreground">Live Data</span>
        </div>
      </div>
    </div>
  );
}