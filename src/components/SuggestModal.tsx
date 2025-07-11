'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Check, Loader2 } from 'lucide-react';

interface SuggestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuggestModal({ isOpen, onClose }: SuggestModalProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.trim(),
          honeypot: '' // Anti-bot field
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit suggestion');
      }

      setIsSuccess(true);
      setName('');
      
      // Auto-close after success
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setError('');
    setIsSuccess(false);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-gray-600 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Suggest a Startup
          </CardTitle>
          <p className="text-sm text-gray-600">
            Know a great CEE startup we're missing? Let us know!
          </p>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-green-800 font-medium">Thanks for your suggestion!</p>
                <p className="text-green-700 text-sm">We'll review it and add it to our map.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="startup-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Startup Name
                </label>
                <Input
                  id="startup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. JetBrains, Bohemia Interactive..."
                  maxLength={60}
                  disabled={isSubmitting}
                  autoFocus
                />
                {name.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {name.length}/60 characters
                  </p>
                )}
              </div>

              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                name="honeypot"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}