import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Retífica Figueirêdo API',
      version: '1.0.0',
      description: 'API documentation for the Retífica Figueirêdo management system',
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    }
  },
  apis: [
    './app/api/customers/route.ts',
    './app/api/vehicles/route.ts', 
    './app/api/inventory/route.ts',
    './app/api/budgets/route.ts',
    './app/api/orders/route.ts',
    './app/api/services/route.ts'
  ], // files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);
export default specs;