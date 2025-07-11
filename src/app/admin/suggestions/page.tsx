'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Suggestion {
  id: string;
  name: string;
  createdAt: string;
}

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('/api/admin/suggestions');
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToDraft = async (suggestion: Suggestion) => {
    // Navigate to new company form with pre-filled name
    const url = `/admin/new?name=${encodeURIComponent(suggestion.name)}`;
    
    // Delete suggestion after copying to draft
    try {
      await fetch(`/api/admin/suggestions/${suggestion.id}`, {
        method: 'DELETE',
      });
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    } catch (error) {
      console.error('Failed to delete suggestion:', error);
    }
    
    window.open(url, '_blank');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this suggestion?')) return;
    
    try {
      await fetch(`/api/admin/suggestions/${id}`, {
        method: 'DELETE',
      });
      setSuggestions(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete suggestion:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Startup Suggestions</h1>
          <p className="text-gray-600 mt-2">
            Review and manage community-submitted startup suggestions.
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline">← Back to Admin</Button>
        </Link>
      </div>

      {suggestions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <PlusCircle className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions yet</h3>
            <p className="text-gray-600">
              When users suggest startups, they'll appear here for review.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''} pending
            </p>
          </div>

          <div className="grid gap-4">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {suggestion.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        Suggested {new Date(suggestion.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddToDraft(suggestion)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <PlusCircle className="w-4 h-4 mr-1" />
                        Add to Draft
                      </Button>
                      <Button
                        onClick={() => handleDelete(suggestion.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}