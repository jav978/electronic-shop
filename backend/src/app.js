import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import cors from 'cors';
import { authenticateMiddleware } from './auth.js';
import { registerUsersService } from './services/users.js';
import { registerCategoriesService } from './services/categories.js';
import { registerProductsService } from './services/products.js';
import { registerOrdersService } from './services/orders.js';
import { registerReportsService } from './services/reports.js';

const app = express(feathers());

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure REST transport
app.configure(express.rest());

// Custom auth middleware
app.use(authenticateMiddleware);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Register services
registerUsersService(app);
registerCategoriesService(app);
registerProductsService(app);
registerOrdersService(app);
registerReportsService(app);

// Express error handler
app.use(express.errorHandler());

export default app;
