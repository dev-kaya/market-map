/**
 * @jest-environment node
 */

import { GET } from './route';

// Mock the dependencies
jest.mock('@/lib/db', () => ({
  prisma: {
    company: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
}));

jest.mock('@/lib/config', () => ({
  config: {
    publicCompanyLimit: 4,
  },
}));

describe('/api/companies', () => {
  let mockPrisma: any;
  let mockGetSession: jest.Mock;

  beforeEach(() => {
    const { prisma } = require('@/lib/db');
    const { getSession } = require('@/lib/auth');
    
    mockPrisma = prisma;
    mockGetSession = getSession;
    
    // Reset mocks
    jest.clearAllMocks();
  });

  it('should return limited companies for unauthenticated users', async () => {
    // Mock unauthenticated user
    mockGetSession.mockReturnValue(null);
    
    const mockCompanies = [
      { id: '1', name: 'Company 1' },
      { id: '2', name: 'Company 2' },
      { id: '3', name: 'Company 3' },
      { id: '4', name: 'Company 4' },
    ];
    
    mockPrisma.company.findMany.mockResolvedValue(mockCompanies);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockCompanies);
    expect(response.headers.get('X-Data-Truncated')).toBe('true');
    
    // Should be called with take limit
    expect(mockPrisma.company.findMany).toHaveBeenCalledWith({
      include: { category: true },
      orderBy: { name: 'asc' },
      take: 4,
    });
    
    // Should not count for unauthenticated users
    expect(mockPrisma.company.count).not.toHaveBeenCalled();
  });

  it('should return all companies for authenticated users', async () => {
    // Mock authenticated user
    mockGetSession.mockReturnValue({
      user: { id: '1', email: 'user@example.com' },
      expires: '2024-12-31',
    });
    
    const mockCompanies = Array.from({ length: 20 }, (_, i) => ({
      id: String(i + 1),
      name: `Company ${i + 1}`,
    }));
    
    mockPrisma.company.count.mockResolvedValue(20);
    mockPrisma.company.findMany.mockResolvedValue(mockCompanies);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockCompanies);
    expect(response.headers.get('X-Data-Truncated')).toBe('false');
    expect(response.headers.get('X-Total-Count')).toBe('20');
    
    // Should be called without take limit
    expect(mockPrisma.company.findMany).toHaveBeenCalledWith({
      include: { category: true },
      orderBy: { name: 'asc' },
    });
    
    // Should count for authenticated users
    expect(mockPrisma.company.count).toHaveBeenCalled();
  });

  it('should handle database errors', async () => {
    mockGetSession.mockReturnValue(null);
    mockPrisma.company.findMany.mockRejectedValue(new Error('Database error'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch companies');
  });
});