import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Create geography string
    const geography = [data.city, data.country].filter(Boolean).join(', ');
    
    const company = await prisma.company.create({
      data: {
        name: data.name,
        description: data.description,
        website: data.website,
        logoUrl: data.logoUrl,
        stage: data.stage,
        country: data.country,
        city: data.city,
        geography,
        fundingToDate: data.fundingToDate || 0,
        employeeCount: data.employeeCount,
        foundedYear: data.foundedYear,
        linkedinUrl: data.linkedinUrl,
        categoryId: data.categoryId,
      },
    });
    
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const companies = await prisma.company.findMany({
      include: {
        category: true,
        investments: {
          include: {
            investor: true,
          },
        },
      },
      orderBy: {
        fundingToDate: 'desc',
      },
    });
    
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}