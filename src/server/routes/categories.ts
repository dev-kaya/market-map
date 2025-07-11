import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db';

const CategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).default('#3B82F6'),
  positionX: z.number().default(0),
  positionY: z.number().default(0),
});

const UpdateCategorySchema = CategorySchema.partial();

export async function categoryRoutes(fastify: FastifyInstance) {
  // Get all categories
  fastify.get('/categories', {
    schema: {
      description: 'Get all categories',
      tags: ['categories'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string', nullable: true },
              color: { type: 'string' },
              positionX: { type: 'number' },
              positionY: { type: 'number' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: {
          name: 'asc',
        },
      });
      return categories;
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to fetch categories' });
    }
  });

  // Get category by ID
  fastify.get('/categories/:id', {
    schema: {
      description: 'Get category by ID',
      tags: ['categories'],
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
      
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          companies: true,
        },
      });

      if (!category) {
        reply.code(404).send({ error: 'Category not found' });
        return;
      }

      return category;
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to fetch category' });
    }
  });

  // Create category
  fastify.post('/categories', {
    schema: {
      description: 'Create a new category',
      tags: ['categories'],
      body: CategorySchema,
    },
  }, async (request, reply) => {
    try {
      const data = CategorySchema.parse(request.body);
      
      const category = await prisma.category.create({
        data,
      });

      reply.code(201).send(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(400).send({ error: error.errors });
        return;
      }
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to create category' });
    }
  });

  // Update category
  fastify.put('/categories/:id', {
    schema: {
      description: 'Update category by ID',
      tags: ['categories'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      body: UpdateCategorySchema,
    },
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const data = UpdateCategorySchema.parse(request.body);

      const category = await prisma.category.update({
        where: { id },
        data,
      });

      return category;
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(400).send({ error: error.errors });
        return;
      }
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to update category' });
    }
  });

  // Delete category
  fastify.delete('/categories/:id', {
    schema: {
      description: 'Delete category by ID',
      tags: ['categories'],
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

      await prisma.category.delete({
        where: { id },
      });

      reply.code(204).send();
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to delete category' });
    }
  });
}