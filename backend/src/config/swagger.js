const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Chess Game API',
        version: '1.0.0',
        description: 'API for online chess game',
      },
    },
  
    apis: ['./src/routes/*.js'],
  };
  
  const swaggerDocs = swaggerJsdoc(swaggerOptions);

  module.exports = swaggerDocs;