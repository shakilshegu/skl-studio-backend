import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';
import cors from 'cors';

const app = express(); // Define the express app
const ip = process.env.IP
const port = process.env.PORT

// Enable CORS
// app.use(cors());

app.use(cors({
  origin: 'https://web-front-skl-studio.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Swagger definition with bearerAuth security scheme
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API',
      version: '1.0.0',
      description: 'API for authenticating via JWT',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    // Apply security globally
    security: [
      {
        bearerAuth: [], 
      },
    ],
    servers: [
      {
        url:process.env.LOCAL_URL,
        description: "Development server",
      },
    ],
  },
  apis: ['./routes/**/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

export {
  swaggerUi,
  swaggerSpec,
};
