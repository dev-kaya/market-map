'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
}

export default function AdminCompaniesPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      website: formData.get('website'),
      logoUrl: formData.get('logoUrl'),
      stage: formData.get('stage'),
      country: formData.get('country'),
      city: formData.get('city'),
      fundingToDate: parseFloat(formData.get('fundingToDate') as string) || 0,
      employeeCount: parseInt(formData.get('employeeCount') as string) || null,
      foundedYear: parseInt(formData.get('foundedYear') as string) || null,
      linkedinUrl: formData.get('linkedinUrl'),
      categoryId: formData.get('categoryId'),
    };
    
    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        alert('Company added successfully!');
        e.currentTarget.reset();
      } else {
        alert('Failed to add company');
      }
    } catch (error) {
      alert('Error adding company');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Add New Company</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name *</label>
            <input
              type="text"
              name="name"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input
              type="url"
              name="website"
              placeholder="https://example.com"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Logo URL</label>
            <input
              type="url"
              name="logoUrl"
              placeholder="https://example.com/logo.png"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Stage *</label>
            <select name="stage" required className="w-full border rounded px-3 py-2">
              <option value="SEED">Seed</option>
              <option value="SERIES_A">Series A</option>
              <option value="SERIES_B">Series B</option>
              <option value="SERIES_C">Series C</option>
              <option value="GROWTH">Growth</option>
              <option value="PUBLIC">Public</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <select name="country" className="w-full border rounded px-3 py-2">
                <option value="">Select Country</option>
                <option value="Czechia">Czechia</option>
                <option value="Slovakia">Slovakia</option>
                <option value="Poland">Poland</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                name="city"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Total Funding (USD)</label>
            <input
              type="number"
              name="fundingToDate"
              step="1000"
              placeholder="10000000"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Employee Count</label>
              <input
                type="number"
                name="employeeCount"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Founded Year</label>
              <input
                type="number"
                name="foundedYear"
                min="1900"
                max="2024"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
            <input
              type="url"
              name="linkedinUrl"
              placeholder="https://linkedin.com/company/..."
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select name="categoryId" required className="w-full border rounded px-3 py-2">
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add Company'}
          </button>
        </form>
      </div>
    </div>
  );
}