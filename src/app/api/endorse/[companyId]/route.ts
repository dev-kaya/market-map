import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mock auth for now - in production, this would verify JWT
function getUserIdFromAuth(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  // Mock user ID - in production, decode JWT and extract user ID
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { companyId: string } }
) {
  try {
    const userId = getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = params;

    // Get all endorsements for this company
    const endorsements = await prisma.endorsement.findMany({
      where: { companyId },
      select: {
        tag: true,
        userId: true,
        createdAt: true,
      },
    });

    // Count endorsements by tag
    const counts = endorsements.reduce((acc, endorsement) => {
      acc[endorsement.tag] = (acc[endorsement.tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Ensure all tags have a count (even if 0)
    const allCounts = {
      GREAT_TEAM: counts.GREAT_TEAM || 0,
      STRONG_TECH: counts.STRONG_TECH || 0,
      FAST_GROWTH: counts.FAST_GROWTH || 0,
      MARKET_LEADER: counts.MARKET_LEADER || 0,
      OTHER: counts.OTHER || 0,
    };

    // Find user's endorsement
    const userEndorsement = endorsements.find(e => e.userId === userId);

    return NextResponse.json({
      counts: allCounts,
      userTag: userEndorsement?.tag || null,
      totalEndorsements: endorsements.length,
    });

  } catch (error) {
    console.error('Get endorsements error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}