'use client';

import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth';
import { Company } from '@/types';
import CompanyCard from './CompanyCard';

interface GatedGridProps {
  companies: Company[];
  truncated: boolean;
  totalCount?: number;
  className?: string;
}

export default function GatedGrid({ companies, truncated, totalCount, className }: GatedGridProps) {
  const handleSignIn = () => {
    signIn('google');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} variant="grid" />
        ))}
      </div>

      {/* Gating Overlay */}
      {truncated && (
        <div className="absolute inset-0 flex flex-col items-center justify-end">
          {/* Gradient overlay - starts after first row */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white backdrop-blur-sm motion-reduce:backdrop-blur-none"
            style={{
              // Start gradient after first row (~400px on desktop)
              background: `linear-gradient(to bottom, 
                transparent 0%, 
                transparent 300px, 
                rgba(255,255,255,0.7) 400px, 
                rgba(255,255,255,0.95) 500px, 
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
              <Button onClick={handleSignIn} className="w-full" size="lg">
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
  );
}