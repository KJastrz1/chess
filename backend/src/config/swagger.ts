import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chess Game API',
      version: '1.0.0', 
      description: 'API for online chess game',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Base path for all endpoints'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\""
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export default swaggerDocs;
