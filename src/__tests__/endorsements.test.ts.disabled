import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Endorsement API', () => {
  let testCompanyId: string;
  const testUserId = 'test_user_123';

  beforeEach(async () => {
    // Create a test category
    const category = await prisma.category.create({
      data: {
        name: 'Test Category',
        color: '#000000',
        positionX: 0,
        positionY: 0,
      },
    });

    // Create a test company
    const company = await prisma.company.create({
      data: {
        name: 'Test Company',
        stage: 'SEED',
        fundingToDate: 1000000,
        positionX: 0,
        positionY: 0,
        categoryId: category.id,
      },
    });

    testCompanyId = company.id;
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.endorsement.deleteMany({
      where: { companyId: testCompanyId },
    });
    await prisma.company.deleteMany({
      where: { id: testCompanyId },
    });
    await prisma.category.deleteMany({
      where: { name: 'Test Category' },
    });
  });

  it('should create a new endorsement', async () => {
    const endorsement = await prisma.endorsement.create({
      data: {
        userId: testUserId,
        companyId: testCompanyId,
        tag: 'GREAT_TEAM',
      },
    });

    expect(endorsement).toBeDefined();
    expect(endorsement.userId).toBe(testUserId);
    expect(endorsement.companyId).toBe(testCompanyId);
    expect(endorsement.tag).toBe('GREAT_TEAM');
  });

  it('should enforce unique constraint (one endorsement per user per company)', async () => {
    // Create first endorsement
    await prisma.endorsement.create({
      data: {
        userId: testUserId,
        companyId: testCompanyId,
        tag: 'GREAT_TEAM',
      },
    });

    // Try to create duplicate - should fail
    await expect(
      prisma.endorsement.create({
        data: {
          userId: testUserId,
          companyId: testCompanyId,
          tag: 'STRONG_TECH',
        },
      })
    ).rejects.toThrow();
  });

  it('should allow updating endorsement tag via upsert', async () => {
    // Create initial endorsement
    const initial = await prisma.endorsement.create({
      data: {
        userId: testUserId,
        companyId: testCompanyId,
        tag: 'GREAT_TEAM',
      },
    });

    // Update via upsert
    const updated = await prisma.endorsement.upsert({
      where: {
        userId_companyId: {
          userId: testUserId,
          companyId: testCompanyId,
        },
      },
      update: {
        tag: 'STRONG_TECH',
      },
      create: {
        userId: testUserId,
        companyId: testCompanyId,
        tag: 'STRONG_TECH',
      },
    });

    expect(updated.id).toBe(initial.id);
    expect(updated.tag).toBe('STRONG_TECH');

    // Verify only one endorsement exists
    const count = await prisma.endorsement.count({
      where: {
        userId: testUserId,
        companyId: testCompanyId,
      },
    });
    expect(count).toBe(1);
  });

  it('should count endorsements by tag correctly', async () => {
    // Create multiple endorsements
    await prisma.endorsement.createMany({
      data: [
        { userId: 'user1', companyId: testCompanyId, tag: 'GREAT_TEAM' },
        { userId: 'user2', companyId: testCompanyId, tag: 'GREAT_TEAM' },
        { userId: 'user3', companyId: testCompanyId, tag: 'STRONG_TECH' },
        { userId: 'user4', companyId: testCompanyId, tag: 'FAST_GROWTH' },
      ],
    });

    const endorsements = await prisma.endorsement.findMany({
      where: { companyId: testCompanyId },
      select: { tag: true },
    });

    const counts = endorsements.reduce((acc, endorsement) => {
      acc[endorsement.tag] = (acc[endorsement.tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    expect(counts['GREAT_TEAM']).toBe(2);
    expect(counts['STRONG_TECH']).toBe(1);
    expect(counts['FAST_GROWTH']).toBe(1);
    expect(counts['MARKET_LEADER'] || 0).toBe(0);
    expect(counts['OTHER'] || 0).toBe(0);
  });
});