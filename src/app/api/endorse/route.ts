import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const endorseSchema = z.object({
  companyId: z.string(),
  tag: z.enum(['GREAT_TEAM', 'STRONG_TECH', 'FAST_GROWTH', 'MARKET_LEADER', 'OTHER']),
});

// Mock auth for now - in production, this would verify JWT
function getUserIdFromAuth(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  // Mock user ID - in production, decode JWT and extract user ID
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { companyId, tag } = endorseSchema.parse(body);

    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Create or update endorsement (upsert for idempotency)
    const endorsement = await prisma.endorsement.upsert({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
      update: {
        tag,
      },
      create: {
        userId,
        companyId,
        tag,
      },
    });

    return NextResponse.json({ 
      success: true, 
      endorsement: {
        id: endorsement.id,
        tag: endorsement.tag,
        createdAt: endorsement.createdAt,
      }
    });

  } catch (error) {
    console.error('Endorsement error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}