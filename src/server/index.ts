import Fastify from 'fastify';
import { companyRoutes } from './routes/companies';
import { categoryRoutes } from './routes/categories';

const fastify = Fastify({
  logger: true,
});

// Register CORS
fastify.register(import('@fastify/cors'), {
  origin: true,
});

// Register Swagger
fastify.register(import('@fastify/swagger'), {
  swagger: {
    info: {
      title: 'Market Map API',
      description: 'API for Market Map application',
      version: '1.0.0',
    },
    host: 'localhost:3001',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'companies', description: 'Company related end-points' },
      { name: 'categories', description: 'Category related end-points' },
    ],
  },
});

fastify.register(import('@fastify/swagger-ui'), {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});

// Register routes
fastify.register(companyRoutes, { prefix: '/api' });
fastify.register(categoryRoutes, { prefix: '/api' });

// Health check
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    fastify.log.info('Server listening on http://localhost:3001');
    fastify.log.info('Swagger UI available at http://localhost:3001/docs');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();