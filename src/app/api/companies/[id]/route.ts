import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: params.id },
      include: {
        category: true,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Failed to fetch company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    
    const company = await prisma.company.update({
      where: { id: params.id },
      data: {
        ...body,
        lastRoundDate: body.lastRoundDate ? new Date(body.lastRoundDate) : undefined,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error('Failed to update company:', error);
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.company.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete company:', error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 },
    );
  }
}