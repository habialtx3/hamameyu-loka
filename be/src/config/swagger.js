const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Envireport API Documentation',
      version: '1.0.0',
      description: 'Dokumentasi API untuk sistem pelaporan masalah lingkungan Envireport (Express + Raw Query)',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
    ],
    components: {
      schemas: {
        // Standard Response Format
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' }
          }
        },
        // Location Schema
        Location: {
          type: 'object',
          required: ['province', 'city', 'district', 'rt', 'rw', 'latitude', 'longitude'],
          properties: {
            id: { type: 'integer', example: 1 },
            province: { type: 'string', example: 'Jawa Barat' },
            city: { type: 'string', example: 'Bandung' },
            district: { type: 'string', example: 'Coblong' },
            village: { type: 'string', example: 'Dago' },
            rt: { type: 'string', example: '03' },
            rw: { type: 'string', example: '05' },
            latitude: { type: 'number', format: 'float', example: -6.89148 },
            longitude: { type: 'number', format: 'float', example: 107.61633 }
          }
        },
        // Report Schema
        Report: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Jalan Lubang di Dago' },
            description: { type: 'string', example: 'Ada lubang besar membahayakan pengendara motor.' },
            category: { type: 'string', enum: ['sampah', 'lampu jalan', 'jalan rusak', 'drainase'], example: 'jalan rusak' },
            status: { type: 'string', enum: ['pending', 'processing', 'done'], example: 'pending' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' },
            location_id: { type: 'integer', example: 1 },
            created_at: { type: 'string', format: 'date-time', example: '2026-05-18T07:11:32Z' },
            location: { $ref: '#/components/schemas/Location' },
            images: {
              type: 'array',
              items: {
                type: 'string',
                example: '/uploads/reports/file-1715978123.jpg'
              }
            }
          }
        }
      }
    }
  },
  // Lokasi file yang berisi annotation JSDoc
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
