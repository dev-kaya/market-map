import { useQuery } from '@tanstack/react-query';
import { Company } from '@/types';

interface CompaniesResponse {
  data: Company[];
  truncated: boolean;
  totalCount?: number;
}

const fetchCompanies = async (): Promise<CompaniesResponse> => {
  const response = await fetch('/api/companies');
  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }
  
  const data = await response.json();
  const truncated = response.headers.get('X-Data-Truncated') === 'true';
  const totalCount = response.headers.get('X-Total-Count');
  
  return {
    data,
    truncated,
    totalCount: totalCount ? parseInt(totalCount, 10) : undefined,
  };
};

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });
}