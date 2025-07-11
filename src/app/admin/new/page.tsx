'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminNewCompanyPage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    stage: 'SEED',
    country: '',
    city: '',
    employeeCount: '',
    fundingToDate: '',
  });

  useEffect(() => {
    // Pre-fill name from suggestion if provided
    const suggestedName = searchParams.get('name');
    if (suggestedName) {
      setFormData(prev => ({ ...prev, name: suggestedName }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement company creation
    console.log('Creating company:', formData);
    alert('Company creation not implemented yet - this is just the draft form.');
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/suggestions">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Suggestions
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Company</h1>
          <p className="text-gray-600 mt-1">
            Create a new company entry for the market map.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. JetBrains"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <Input
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://jetbrains.com"
                  type="url"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Brief description of what the company does..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => handleChange('stage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="SEED">Seed</option>
                  <option value="SERIES_A">Series A</option>
                  <option value="SERIES_B">Series B</option>
                  <option value="SERIES_C">Series C</option>
                  <option value="GROWTH">Growth</option>
                  <option value="PUBLIC">Public</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select country</option>
                  <option value="czechia">Czechia</option>
                  <option value="slovakia">Slovakia</option>
                  <option value="poland">Poland</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Input
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="e.g. Prague"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Count
                </label>
                <Input
                  value={formData.employeeCount}
                  onChange={(e) => handleChange('employeeCount', e.target.value)}
                  placeholder="e.g. 1800"
                  type="number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Funding (USD)
                </label>
                <Input
                  value={formData.fundingToDate}
                  onChange={(e) => handleChange('fundingToDate', e.target.value)}
                  placeholder="e.g. 50000000"
                  type="number"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Link href="/admin/suggestions">
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="flex-1">
                Create Company
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}