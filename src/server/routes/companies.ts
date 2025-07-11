import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db';

const CompanySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  website: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  stage: z.enum(['SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C', 'SERIES_D', 'GROWTH', 'PUBLIC']),
  geography: z.string().optional(),
  fundingToDate: z.number().min(0).default(0),
  lastRoundDate: z.string().datetime().optional(),
  lastRoundSize: z.number().min(0).optional(),
  employeeCount: z.number().min(0).optional(),
  positionX: z.number().default(0),
  positionY: z.number().default(0),
  categoryId: z.string(),
});

const UpdateCompanySchema = CompanySchema.partial();

export async function companyRoutes(fastify: FastifyInstance) {
  // Get all companies
  fastify.get('/companies', {
    schema: {
      description: 'Get all companies',
      tags: ['companies'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string', nullable: true },
              website: { type: 'string', nullable: true },
              logoUrl: { type: 'string', nullable: true },
              stage: { type: 'string' },
              geography: { type: 'string', nullable: true },
              fundingToDate: { type: 'number' },
              lastRoundDate: { type: 'string', nullable: true },
              lastRoundSize: { type: 'number', nullable: true },
              employeeCount: { type: 'number', nullable: true },
              positionX: { type: 'number' },
              positionY: { type: 'number' },
              categoryId: { type: 'string' },
              category: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  color: { type: 'string' },
                },
              },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const companies = await prisma.company.findMany({
        include: {
          category: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
      return companies;
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to fetch companies' });
    }
  });

  // Get company by ID
  fastify.get('/companies/:id', {
    schema: {
      description: 'Get company by ID',
      tags: ['companies'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      
      const company = await prisma.company.findUnique({
        where: { id },
        include: {
          category: true,
        },
      });

      if (!company) {
        reply.code(404).send({ error: 'Company not found' });
        return;
      }

      return company;
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to fetch company' });
    }
  });

  // Create company
  fastify.post('/companies', {
    schema: {
      description: 'Create a new company',
      tags: ['companies'],
      body: CompanySchema,
    },
  }, async (request, reply) => {
    try {
      const data = CompanySchema.parse(request.body);
      
      const company = await prisma.company.create({
        data: {
          ...data,
          lastRoundDate: data.lastRoundDate ? new Date(data.lastRoundDate) : null,
        },
        include: {
          category: true,
        },
      });

      reply.code(201).send(company);
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(400).send({ error: error.errors });
        return;
      }
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to create company' });
    }
  });

  // Update company
  fastify.put('/companies/:id', {
    schema: {
      description: 'Update company by ID',
      tags: ['companies'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      body: UpdateCompanySchema,
    },
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const data = UpdateCompanySchema.parse(request.body);

      const company = await prisma.company.update({
        where: { id },
        data: {
          ...data,
          lastRoundDate: data.lastRoundDate ? new Date(data.lastRoundDate) : undefined,
        },
        include: {
          category: true,
        },
      });

      return company;
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(400).send({ error: error.errors });
        return;
      }
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to update company' });
    }
  });

  // Delete company
  fastify.delete('/companies/:id', {
    schema: {
      description: 'Delete company by ID',
      tags: ['companies'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      await prisma.company.delete({
        where: { id },
      });

      reply.code(204).send();
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to delete company' });
    }
  });
}