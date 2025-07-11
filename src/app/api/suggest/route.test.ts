/**
 * @jest-environment node
 */

import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    suggestion: {
      create: jest.fn(),
    },
    $disconnect: jest.fn(),
  })),
}));

// Mock notify function
jest.mock('@/lib/notify', () => ({
  notifyCurator: jest.fn(),
}));

describe('/api/suggest', () => {
  let mockCreate: jest.Mock;
  let mockDisconnect: jest.Mock;

  beforeEach(() => {
    const { PrismaClient } = require('@prisma/client');
    const mockPrisma = new PrismaClient();
    mockCreate = mockPrisma.suggestion.create;
    mockDisconnect = mockPrisma.$disconnect;
    
    // Reset mocks
    jest.clearAllMocks();
  });

  it('should create a new suggestion successfully', async () => {
    mockCreate.mockResolvedValue({ id: 'test-id', name: 'Test Company' });

    const request = new NextRequest('http://localhost:3000/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Company' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true, id: 'test-id' });
    expect(mockCreate).toHaveBeenCalledWith({
      data: { name: 'Test Company' },
    });
  });

  it('should return 409 for duplicate names', async () => {
    const duplicateError = new Error('Duplicate');
    (duplicateError as any).code = 'P2002';
    mockCreate.mockRejectedValue(duplicateError);

    const request = new NextRequest('http://localhost:3000/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Existing Company' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe('This startup has already been suggested.');
  });

  it('should validate name length', async () => {
    const request = new NextRequest('http://localhost:3000/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'A' }), // Too short
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('at least 2 characters');
  });

  it('should reject bot submissions via honeypot', async () => {
    const request = new NextRequest('http://localhost:3000/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: 'Bot Company',
        honeypot: 'bot-filled-this' 
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Bot detected');
  });
});