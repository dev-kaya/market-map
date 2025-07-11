import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

describe('utils', () => {
  describe('formatCurrency', () => {
    it('formats billions correctly', () => {
      expect(formatCurrency(1000000000)).toBe('$1.0B');
      expect(formatCurrency(2500000000)).toBe('$2.5B');
    });

    it('formats millions correctly', () => {
      expect(formatCurrency(1000000)).toBe('$1.0M');
      expect(formatCurrency(250000000)).toBe('$250.0M');
    });

    it('formats thousands correctly', () => {
      expect(formatCurrency(1000)).toBe('$1.0K');
      expect(formatCurrency(250000)).toBe('$250.0K');
    });

    it('formats small amounts correctly', () => {
      expect(formatCurrency(100)).toBe('$100');
      expect(formatCurrency(999)).toBe('$999');
    });
  });

  describe('formatDate', () => {
    it('formats date strings correctly', () => {
      const date = '2023-04-15T10:30:00Z';
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Apr 15, 2023/);
    });
  });

  describe('cn', () => {
    it('combines class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2');
      expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3');
    });

    it('handles Tailwind conflicts', () => {
      expect(cn('p-2', 'p-4')).toBe('p-4');
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });
  });
});