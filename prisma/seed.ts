import { PrismaClient, InvestorType, InvestorTier } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Fintech' },
      update: {},
      create: {
        name: 'Fintech',
        description: 'Financial technology companies',
        color: '#10B981',
        positionX: 100,
        positionY: 100,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Enterprise Software' },
      update: {},
      create: {
        name: 'Enterprise Software',
        description: 'B2B software solutions',
        color: '#3B82F6',
        positionX: 300,
        positionY: 150,
      },
    }),
    prisma.category.upsert({
      where: { name: 'E-commerce' },
      update: {},
      create: {
        name: 'E-commerce',
        description: 'Online retail and marketplace companies',
        color: '#F59E0B',
        positionX: 200,
        positionY: 300,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Health Tech' },
      update: {},
      create: {
        name: 'Health Tech',
        description: 'Healthcare technology companies',
        color: '#EF4444',
        positionX: 400,
        positionY: 200,
      },
    }),
  ]);

  // Create investors
  const investors = await Promise.all([
    prisma.investor.upsert({
      where: { name: 'Kaya VC' },
      update: {},
      create: {
        name: 'Kaya VC',
        logoUrl: 'https://media.licdn.com/dms/image/v2/C4D0BAQFf9R3vY0o6KQ/company-logo_200_200/company-logo_200_200/0/1630517672097/kayavc_logo?e=2147483647&v=beta&t=WlLBec6KzrhnB9XwHjUDs2_ydtDfkg9r2Fji4vND8aM',
        website: 'https://www.kaya.vc',
        type: InvestorType.VC,
        tier: InvestorTier.MID_TIER,
        focus: ['Fintech', 'Enterprise Software'],
      },
    }),
    prisma.investor.upsert({
      where: { name: 'Andreessen Horowitz' },
      update: {},
      create: {
        name: 'Andreessen Horowitz',
        logoUrl: 'https://i.nextmedia.com.au/News/a16z.png',
        website: 'https://a16z.com',
        type: InvestorType.VC,
        tier: InvestorTier.TOP_TIER,
        focus: ['Enterprise Software', 'Fintech', 'Health Tech'],
      },
    }),
    prisma.investor.upsert({
      where: { name: 'Credo Ventures' },
      update: {},
      create: {
        name: 'Credo Ventures',
        website: 'https://www.credoventures.com',
        type: InvestorType.VC,
        tier: InvestorTier.MID_TIER,
        focus: ['Enterprise Software', 'Fintech'],
      },
    }),
  ]);

  // Create some sample companies
  const companies = await Promise.all([
    prisma.company.upsert({
      where: { name: 'JetBrains' },
      update: {},
      create: {
        name: 'JetBrains',
        description: 'Professional software development tools',
        website: 'https://www.jetbrains.com',
        stage: 'GROWTH',
        country: 'Czechia',
        city: 'Prague',
        geography: 'Prague, Czechia',
        fundingToDate: 0, // Bootstrapped
        employeeCount: 1600,
        foundedYear: 2000,
        linkedinUrl: 'https://www.linkedin.com/company/jetbrains',
        categoryId: categories[1].id, // Enterprise Software
        positionX: 320,
        positionY: 180,
        isTopCompany: true,
      },
    }),
    prisma.company.upsert({
      where: { name: 'Socialbakers' },
      update: {},
      create: {
        name: 'Socialbakers',
        description: 'Social media marketing platform',
        website: 'https://www.socialbakers.com',
        stage: 'GROWTH',
        country: 'Czechia',
        city: 'Prague',
        geography: 'Prague, Czechia',
        fundingToDate: 26000000,
        employeeCount: 400,
        foundedYear: 2008,
        linkedinUrl: 'https://www.linkedin.com/company/socialbakers',
        categoryId: categories[1].id, // Enterprise Software
        positionX: 280,
        positionY: 220,
        isTopCompany: true,
      },
    }),
    prisma.company.upsert({
      where: { name: 'Bohemia Interactive' },
      update: {},
      create: {
        name: 'Bohemia Interactive',
        description: 'Game development studio',
        website: 'https://www.bohemia.net',
        stage: 'GROWTH',
        country: 'Czechia',
        city: 'Prague',
        geography: 'Prague, Czechia',
        fundingToDate: 0, // Bootstrapped
        employeeCount: 400,
        foundedYear: 1999,
        linkedinUrl: 'https://www.linkedin.com/company/bohemia-interactive',
        categoryId: categories[1].id, // Enterprise Software
        positionX: 360,
        positionY: 160,
      },
    }),
  ]);

  // Create some company-investor relationships
  await Promise.all([
    prisma.companyInvestor.upsert({
      where: {
        companyId_investorId_roundDate: {
          companyId: companies[1].id, // Socialbakers
          investorId: investors[0].id, // Kaya VC
          roundDate: new Date('2015-01-01'),
        },
      },
      update: {},
      create: {
        companyId: companies[1].id,
        investorId: investors[0].id,
        roundDate: new Date('2015-01-01'),
        roundSize: 10000000,
        roundType: 'Series A',
        leadInvestor: true,
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created ${categories.length} categories`);
  console.log(`💰 Created ${investors.length} investors`);
  console.log(`🏢 Created ${companies.length} companies`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });