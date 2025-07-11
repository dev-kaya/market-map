import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.company.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'AI/ML',
        description: 'Artificial Intelligence and Machine Learning companies',
        color: '#3B82F6',
        positionX: 0,
        positionY: 0,
      },
    }),
    prisma.category.create({
      data: {
        name: 'FinTech',
        description: 'Financial Technology companies',
        color: '#10B981',
        positionX: 1,
        positionY: 0,
      },
    }),
    prisma.category.create({
      data: {
        name: 'E-commerce',
        description: 'E-commerce and marketplace platforms',
        color: '#F59E0B',
        positionX: 0,
        positionY: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Enterprise Software',
        description: 'B2B Software and SaaS companies',
        color: '#8B5CF6',
        positionX: 1,
        positionY: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Gaming',
        description: 'Game development and gaming platforms',
        color: '#EF4444',
        positionX: 2,
        positionY: 0,
      },
    }),
    prisma.category.create({
      data: {
        name: 'HealthTech',
        description: 'Healthcare Technology and Digital Health',
        color: '#06B6D4',
        positionX: 2,
        positionY: 1,
      },
    }),
  ]);

  // Czech companies
  const czechCompanies = [
    {
      name: 'Bohemia Interactive',
      description: 'Leading game development studio behind ArmA and DayZ',
      website: 'https://bohemia.net',
      logoUrl: 'https://logo.clearbit.com/bohemia.net',
      stage: 'GROWTH',
      country: 'czechia',
      city: 'Prague',
      geography: 'Prague, Czech Republic',
      fundingToDate: 100000000,
      lastRoundDate: new Date('2022-06-01'),
      lastRoundSize: 50000000,
      employeeCount: 400,
      foundedYear: 1999,
      linkedinUrl: 'https://linkedin.com/company/bohemia-interactive',
      isTopCompany: true,
      categoryId: categories[4].id, // Gaming
    },
    {
      name: 'JetBrains',
      description: 'Professional software development tools and IDEs',
      website: 'https://jetbrains.com',
      logoUrl: 'https://logo.clearbit.com/jetbrains.com',
      stage: 'GROWTH',
      country: 'czechia',
      city: 'Prague',
      geography: 'Prague, Czech Republic',
      fundingToDate: 0, // Bootstrapped
      employeeCount: 1800,
      foundedYear: 2000,
      linkedinUrl: 'https://linkedin.com/company/jetbrains',
      isTopCompany: true,
      categoryId: categories[3].id, // Enterprise Software
    },
    {
      name: 'Socialbakers',
      description: 'AI-powered social media marketing platform (acquired by Emplifi)',
      website: 'https://emplifi.io',
      logoUrl: 'https://logo.clearbit.com/emplifi.io',
      stage: 'GROWTH',
      country: 'czechia',
      city: 'Prague',
      geography: 'Prague, Czech Republic',
      fundingToDate: 26000000,
      lastRoundDate: new Date('2019-11-01'),
      lastRoundSize: 26000000,
      employeeCount: 300,
      foundedYear: 2008,
      linkedinUrl: 'https://linkedin.com/company/emplifi',
      isTopCompany: true,
      categoryId: categories[0].id, // AI/ML
    },
    {
      name: 'Slevomat',
      description: 'Leading Czech e-commerce platform for deals and discounts',
      website: 'https://slevomat.cz',
      logoUrl: 'https://logo.clearbit.com/slevomat.cz',
      stage: 'GROWTH',
      country: 'czechia',
      city: 'Prague',
      geography: 'Prague, Czech Republic',
      fundingToDate: 15000000,
      lastRoundDate: new Date('2021-03-01'),
      lastRoundSize: 8000000,
      employeeCount: 200,
      foundedYear: 2012,
      linkedinUrl: 'https://linkedin.com/company/slevomat',
      isTopCompany: true,
      categoryId: categories[2].id, // E-commerce
    },
    {
      name: 'Bohemia Energy',
      description: 'Energy trading and supply company',
      website: 'https://bohemiaenergy.cz',
      stage: 'GROWTH',
      country: 'czechia',
      city: 'Prague',
      geography: 'Prague, Czech Republic',
      fundingToDate: 50000000,
      employeeCount: 150,
      foundedYear: 2005,
      categoryId: categories[3].id, // Enterprise Software
    },
    {
      name: 'Foot Traffic',
      description: 'Location analytics and foot traffic measurement platform',
      website: 'https://foottraffik.co',
      stage: 'SERIES_A',
      country: 'czechia',
      city: 'Prague',
      geography: 'Prague, Czech Republic',
      fundingToDate: 3000000,
      lastRoundDate: new Date('2023-08-01'),
      lastRoundSize: 3000000,
      employeeCount: 25,
      foundedYear: 2018,
      categoryId: categories[0].id, // AI/ML
    },
    {
      name: 'Rossum',
      description: 'AI-powered document processing and data extraction',
      website: 'https://rossum.ai',
      logoUrl: 'https://logo.clearbit.com/rossum.ai',
      stage: 'SERIES_A',
      country: 'czechia',
      city: 'Prague',
      geography: 'Prague, Czech Republic',
      fundingToDate: 15000000,
      lastRoundDate: new Date('2022-11-01'),
      lastRoundSize: 15000000,
      employeeCount: 80,
      foundedYear: 2017,
      linkedinUrl: 'https://linkedin.com/company/rossum',
      categoryId: categories[0].id, // AI/ML
    },
    {
      name: 'Gamee',
      description: 'Mobile gaming platform with instant games',
      website: 'https://gamee.com',
      logoUrl: 'https://logo.clearbit.com/gamee.com',
      stage: 'SERIES_B',
      country: 'czechia',
      city: 'Prague',
      geography: 'Prague, Czech Republic',
      fundingToDate: 8000000,
      lastRoundDate: new Date('2021-07-01'),
      lastRoundSize: 5000000,
      employeeCount: 45,
      foundedYear: 2015,
      linkedinUrl: 'https://linkedin.com/company/gamee',
      categoryId: categories[4].id, // Gaming
    },
  ];

  // Slovak companies
  const slovakCompanies = [
    {
      name: 'ESET',
      description: 'Global cybersecurity company providing antivirus and internet security',
      website: 'https://eset.com',
      logoUrl: 'https://logo.clearbit.com/eset.com',
      stage: 'GROWTH',
      country: 'slovakia',
      city: 'Bratislava',
      geography: 'Bratislava, Slovakia',
      fundingToDate: 0, // Bootstrapped
      employeeCount: 1800,
      foundedYear: 1992,
      linkedinUrl: 'https://linkedin.com/company/eset',
      isTopCompany: true,
      categoryId: categories[3].id, // Enterprise Software
    },
    {
      name: 'Nice Actimize',
      description: 'Financial crime, risk and compliance solutions (Nice Systems)',
      website: 'https://niceactimize.com',
      logoUrl: 'https://logo.clearbit.com/niceactimize.com',
      stage: 'PUBLIC',
      country: 'slovakia',
      city: 'Bratislava',
      geography: 'Bratislava, Slovakia',
      fundingToDate: 200000000,
      employeeCount: 500,
      foundedYear: 1999,
      linkedinUrl: 'https://linkedin.com/company/nice-actimize',
      isTopCompany: true,
      categoryId: categories[1].id, // FinTech
    },
    {
      name: 'Sygic',
      description: 'GPS navigation app and automotive solutions',
      website: 'https://sygic.com',
      logoUrl: 'https://logo.clearbit.com/sygic.com',
      stage: 'GROWTH',
      country: 'slovakia',
      city: 'Bratislava',
      geography: 'Bratislava, Slovakia',
      fundingToDate: 15000000,
      lastRoundDate: new Date('2020-09-01'),
      lastRoundSize: 10000000,
      employeeCount: 200,
      foundedYear: 2004,
      linkedinUrl: 'https://linkedin.com/company/sygic',
      isTopCompany: true,
      categoryId: categories[0].id, // AI/ML
    },
    {
      name: 'Pixel Federation',
      description: 'Mobile game development studio',
      website: 'https://pixelfederation.com',
      logoUrl: 'https://logo.clearbit.com/pixelfederation.com',
      stage: 'GROWTH',
      country: 'slovakia',
      city: 'Bratislava',
      geography: 'Bratislava, Slovakia',
      fundingToDate: 5000000,
      lastRoundDate: new Date('2021-05-01'),
      lastRoundSize: 5000000,
      employeeCount: 120,
      foundedYear: 2007,
      linkedinUrl: 'https://linkedin.com/company/pixel-federation',
      isTopCompany: true,
      categoryId: categories[4].id, // Gaming
    },
    {
      name: 'Monogram Ventures',
      description: 'Venture capital and startup accelerator',
      website: 'https://monogramventures.com',
      stage: 'GROWTH',
      country: 'slovakia',
      city: 'Bratislava',
      geography: 'Bratislava, Slovakia',
      fundingToDate: 2000000,
      employeeCount: 15,
      foundedYear: 2015,
      categoryId: categories[1].id, // FinTech
    },
    {
      name: 'Cleancloud',
      description: 'Digital platform for laundry and dry cleaning services',
      website: 'https://cleancloud.com',
      logoUrl: 'https://logo.clearbit.com/cleancloud.com',
      stage: 'SERIES_A',
      country: 'slovakia',
      city: 'Bratislava',
      geography: 'Bratislava, Slovakia',
      fundingToDate: 4000000,
      lastRoundDate: new Date('2023-03-01'),
      lastRoundSize: 4000000,
      employeeCount: 35,
      foundedYear: 2019,
      linkedinUrl: 'https://linkedin.com/company/cleancloud',
      categoryId: categories[3].id, // Enterprise Software
    },
    {
      name: 'Photoneo',
      description: '3D machine vision and robotic intelligence solutions',
      website: 'https://photoneo.com',
      logoUrl: 'https://logo.clearbit.com/photoneo.com',
      stage: 'SERIES_A',
      country: 'slovakia',
      city: 'Bratislava',
      geography: 'Bratislava, Slovakia',
      fundingToDate: 2500000,
      lastRoundDate: new Date('2022-05-01'),
      lastRoundSize: 2500000,
      employeeCount: 40,
      foundedYear: 2013,
      linkedinUrl: 'https://linkedin.com/company/photoneo',
      categoryId: categories[0].id, // AI/ML
    },
  ];

  // Polish companies
  const polishCompanies = [
    {
      name: 'CD Projekt',
      description: 'Game development studio behind The Witcher and Cyberpunk 2077',
      website: 'https://cdprojekt.com',
      logoUrl: 'https://logo.clearbit.com/cdprojekt.com',
      stage: 'PUBLIC',
      country: 'poland',
      city: 'Warsaw',
      geography: 'Warsaw, Poland',
      fundingToDate: 300000000,
      employeeCount: 1200,
      foundedYear: 1994,
      linkedinUrl: 'https://linkedin.com/company/cd-projekt-red',
      isTopCompany: true,
      categoryId: categories[4].id, // Gaming
    },
    {
      name: 'Allegro',
      description: 'Leading Polish e-commerce marketplace platform',
      website: 'https://allegro.pl',
      logoUrl: 'https://logo.clearbit.com/allegro.pl',
      stage: 'PUBLIC',
      country: 'poland',
      city: 'Warsaw',
      geography: 'Warsaw, Poland',
      fundingToDate: 2500000000,
      employeeCount: 2800,
      foundedYear: 1999,
      linkedinUrl: 'https://linkedin.com/company/allegro',
      isTopCompany: true,
      categoryId: categories[2].id, // E-commerce
    },
    {
      name: 'Asseco',
      description: 'Software house providing IT solutions',
      website: 'https://asseco.com',
      logoUrl: 'https://logo.clearbit.com/asseco.com',
      stage: 'PUBLIC',
      country: 'poland',
      city: 'Rzeszów',
      geography: 'Rzeszów, Poland',
      fundingToDate: 1000000000,
      employeeCount: 28000,
      foundedYear: 1991,
      linkedinUrl: 'https://linkedin.com/company/asseco',
      isTopCompany: true,
      categoryId: categories[3].id, // Enterprise Software
    },
    {
      name: 'PayU',
      description: 'Leading fintech company providing payment solutions',
      website: 'https://payu.com',
      logoUrl: 'https://logo.clearbit.com/payu.com',
      stage: 'GROWTH',
      country: 'poland',
      city: 'Warsaw',
      geography: 'Warsaw, Poland',
      fundingToDate: 400000000,
      employeeCount: 900,
      foundedYear: 2002,
      linkedinUrl: 'https://linkedin.com/company/payu',
      isTopCompany: true,
      categoryId: categories[1].id, // FinTech
    },
    {
      name: 'Livechat',
      description: 'Customer service software for online sales and support',
      website: 'https://livechat.com',
      logoUrl: 'https://logo.clearbit.com/livechat.com',
      stage: 'PUBLIC',
      country: 'poland',
      city: 'Wrocław',
      geography: 'Wrocław, Poland',
      fundingToDate: 100000000,
      employeeCount: 400,
      foundedYear: 2002,
      linkedinUrl: 'https://linkedin.com/company/livechat',
      isTopCompany: true,
      categoryId: categories[3].id, // Enterprise Software
    },
    {
      name: 'Techland',
      description: 'Game development studio behind Dying Light series',
      website: 'https://techland.pl',
      logoUrl: 'https://logo.clearbit.com/techland.pl',
      stage: 'GROWTH',
      country: 'poland',
      city: 'Wrocław',
      geography: 'Wrocław, Poland',
      fundingToDate: 50000000,
      employeeCount: 300,
      foundedYear: 1991,
      linkedinUrl: 'https://linkedin.com/company/techland',
      isTopCompany: true,
      categoryId: categories[4].id, // Gaming
    },
    {
      name: 'Infermedica',
      description: 'AI-powered medical diagnosis and triage solutions',
      website: 'https://infermedica.com',
      logoUrl: 'https://logo.clearbit.com/infermedica.com',
      stage: 'SERIES_A',
      country: 'poland',
      city: 'Wrocław',
      geography: 'Wrocław, Poland',
      fundingToDate: 8000000,
      lastRoundDate: new Date('2022-09-01'),
      lastRoundSize: 8000000,
      employeeCount: 60,
      foundedYear: 2012,
      linkedinUrl: 'https://linkedin.com/company/infermedica',
      categoryId: categories[5].id, // HealthTech
    },
    {
      name: 'Brand24',
      description: 'Social media monitoring and analytics platform',
      website: 'https://brand24.com',
      logoUrl: 'https://logo.clearbit.com/brand24.com',
      stage: 'SERIES_A',
      country: 'poland',
      city: 'Wrocław',
      geography: 'Wrocław, Poland',
      fundingToDate: 5000000,
      lastRoundDate: new Date('2021-12-01'),
      lastRoundSize: 5000000,
      employeeCount: 80,
      foundedYear: 2011,
      linkedinUrl: 'https://linkedin.com/company/brand24',
      categoryId: categories[0].id, // AI/ML
    },
    {
      name: 'Booksy',
      description: 'Appointment booking platform for beauty and wellness',
      website: 'https://booksy.com',
      logoUrl: 'https://logo.clearbit.com/booksy.com',
      stage: 'SERIES_B',
      country: 'poland',
      city: 'Kraków',
      geography: 'Kraków, Poland',
      fundingToDate: 70000000,
      lastRoundDate: new Date('2022-04-01'),
      lastRoundSize: 35000000,
      employeeCount: 200,
      foundedYear: 2014,
      linkedinUrl: 'https://linkedin.com/company/booksy',
      categoryId: categories[3].id, // Enterprise Software
    },
    {
      name: 'Brainly',
      description: 'AI-powered homework help and learning platform',
      website: 'https://brainly.com',
      logoUrl: 'https://logo.clearbit.com/brainly.com',
      stage: 'SERIES_B',
      country: 'poland',
      city: 'Kraków',
      geography: 'Kraków, Poland',
      fundingToDate: 68000000,
      lastRoundDate: new Date('2020-01-01'),
      lastRoundSize: 30000000,
      employeeCount: 180,
      foundedYear: 2009,
      linkedinUrl: 'https://linkedin.com/company/brainly',
      categoryId: categories[0].id, // AI/ML
    },
  ];

  // Create all companies
  const allCompanies = [...czechCompanies, ...slovakCompanies, ...polishCompanies];

  const createdCompanies = [];
  for (const company of allCompanies) {
    const created = await prisma.company.create({
      data: {
        ...company,
        positionX: Math.random() * 4,
        positionY: Math.random() * 4,
      },
    });
    createdCompanies.push(created);
  }


  console.log('Database seeded with CEE companies successfully!');
  console.log(`Created ${categories.length} categories`);
  console.log(`Created ${allCompanies.length} companies`);
  console.log(`- Czech: ${czechCompanies.length} companies`);
  console.log(`- Slovak: ${slovakCompanies.length} companies`);
  console.log(`- Polish: ${polishCompanies.length} companies`);
  console.log(`- Early stage (Seed/Series A/B): ${allCompanies.filter(c => ['SEED', 'SERIES_A', 'SERIES_B'].includes(c.stage)).length} companies`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });