import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { rateLimit } from '@/lib/rate-limit';
import { notifyCurator } from '@/lib/notify';

const prisma = new PrismaClient();

const suggestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name must be no more than 60 characters'),
  honeypot: z.string().optional().refine(val => !val, 'Bot detected'),
});

const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 5,
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const { allowed } = rateLimiter(req);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    
    // Validate input
    const validation = suggestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name } = validation.data;

    try {
      // Insert suggestion
      const suggestion = await prisma.suggestion.create({
        data: { name: name.trim() },
      });

      // Notify curator
      await notifyCurator(name);

      return NextResponse.json({ 
        success: true, 
        id: suggestion.id 
      });

    } catch (error: any) {
      // Handle duplicate name
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'This startup has already been suggested.' },
          { status: 409 }
        );
      }
      throw error;
    }

  } catch (error) {
    console.error('Error creating suggestion:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}