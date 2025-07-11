import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Company, Investor } from '@/types';
import { ExternalLink, MapPin, Users, DollarSign, Calendar, Linkedin, Twitter } from 'lucide-react';
import { useState } from 'react';

interface CompanyCardProps {
  company: Company;
  variant?: 'grid' | 'list';
  className?: string;
  style?: React.CSSProperties;
}

const formatCurrency = (amount: number): string => {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)}B`;
  }
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount}`;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
};

const getStageColor = (stage: string): string => {
  const colors = {
    SEED: 'stage-badge seed',
    SERIES_A: 'stage-badge series',
    SERIES_B: 'stage-badge series',
    SERIES_C: 'stage-badge series',
    SERIES_D: 'stage-badge series',
    GROWTH: 'stage-badge growth',
    PUBLIC: 'stage-badge public',
  };
  return colors[stage as keyof typeof colors] || 'stage-badge';
};

export default function CompanyCard({ company, variant = 'grid', className, style }: CompanyCardProps) {
  // Use actual investor data from the database if available
  const investors = company.investments?.map(inv => ({
    id: inv.investor.id,
    name: inv.investor.name,
    logoUrl: inv.investor.logoUrl,
    website: inv.investor.website,
  })) || [];
  
  // Show investors if we have any
  const topTierInvestors = investors.slice(0, 3); // Show up to 3 investors
  
  return (
    <Card data-testid="company-card" className={`bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 h-full relative overflow-hidden ${className}`} style={style}>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          {company.logoUrl && (
            <div className="w-12 h-12 rounded-lg bg-gray-50 p-2 flex-shrink-0">
              <img
                src={company.logoUrl}
                alt={`${company.name} logo`}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {company.name}
              </h3>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label={`Visit ${company.name} website`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                company.stage === 'SEED' ? 'bg-green-100 text-green-800' :
                ['SERIES_A', 'SERIES_B', 'SERIES_C'].includes(company.stage) ? 'bg-blue-100 text-blue-800' :
                company.stage === 'GROWTH' ? 'bg-purple-100 text-purple-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {company.stage.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {company.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {company.description}
          </p>
        )}
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Total Funding</span>
            <span className="font-semibold text-gray-900">{formatCurrency(company.fundingToDate)}</span>
          </div>
          
          {company.lastRoundDate && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Last Round</span>
              <span className="text-gray-700">{formatDate(company.lastRoundDate)}</span>
            </div>
          )}
          
          {company.lastRoundSize && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Round Size</span>
              <span className="text-gray-700">{formatCurrency(company.lastRoundSize)}</span>
            </div>
          )}
          
          {company.employeeCount && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Employees</span>
              <span className="text-gray-700">{company.employeeCount}</span>
            </div>
          )}
          
          {company.geography && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Location</span>
              <span className="text-gray-700">{company.geography}</span>
            </div>
          )}
        </div>
        
        {/* Investors section at the bottom */}
        {topTierInvestors.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Backed by</p>
            <div className="flex flex-wrap gap-2">
              {topTierInvestors.map((investor) => (
                <a
                  key={investor.id}
                  href={investor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-gray-50 rounded-full px-2 py-1 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-white overflow-hidden flex items-center justify-center">
                    <img
                      src={investor.logoUrl}
                      alt={investor.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{investor.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}