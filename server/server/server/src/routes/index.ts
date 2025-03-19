// server/src/routes/index.ts
import { Express } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import * as searchController from '../controllers/searchController';
import { authenticate, optionalAuth } from '../middlewares/authMiddleware';

// Configure all API routes
export const configureRoutes = (app: Express): void => {
  // Auth routes
  app.post(
    '/api/auth/register',
    [
      body('username').isLength({ min: 3, max: 50 }).trim().escape(),
      body('email').isEmail().normalizeEmail(),
      body('password').isLength({ min: 6 }),
      body('firstName').optional().trim().escape(),
      body('lastName').optional().trim().escape(),
    ],
    authController.register
  );

  app.post(
    '/api/auth/login',
    [
      body('email').isEmail().normalizeEmail(),
      body('password').notEmpty(),
    ],
    authController.login
  );

  app.get('/api/auth/user', authenticate, authController.getCurrentUser);
  app.post('/api/auth/logout', authenticate, authController.logout);
  
  app.post(
    '/api/auth/password',
    authenticate,
    [
      body('currentPassword').notEmpty(),
      body('newPassword').isLength({ min: 6 }),
    ],
    authController.changePassword
  );
  
  app.post('/api/auth/refresh', authenticate, authController.refreshToken);

  // Search routes
  app.get('/api/search', optionalAuth, searchController.searchMedia);
  app.get('/api/media/:type/:id', optionalAuth, searchController.getMediaDetails);
  app.get('/api/media/:type/:id/related', optionalAuth, searchController.getRelatedMedia);
  
  // Search history routes (authenticated)
  app.get('/api/history', authenticate, searchController.getSearchHistory);
  app.delete('/api/history/:id', authenticate, searchController.deleteSearchHistoryItem);
  app.delete('/api/history', authenticate, searchController.clearSearchHistory);

  // Stats route
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await require('../services/openverseService').openverseAPI.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get stats', error: (error as Error).message });
    }
  });

  // Health check route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Catch-all route for API 404s
  app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
  });
};