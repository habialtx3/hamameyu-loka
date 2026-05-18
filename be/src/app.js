const express = require('express');
const cors = require('cors');
const path = require('path');
const reportRoutes = require('./routes/report.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Standard middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files (uploads/ folder)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger UI configuration
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Sajikan Swagger UI di endpoint /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, status: 'healthy', timestamp: new Date() });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, status: 'healthy', timestamp: new Date() });
});

// Register Routes (Mount at /api)
app.use('/api', reportRoutes);

// 404 Route handler
app.use((req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
