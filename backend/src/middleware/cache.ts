import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';
import logger from '../utils/logger';

interface CachedResponse extends Response {
  sendResponse?: any;
}

export const cacheMiddleware = (ttl: number = 300) => {
  return async (req: Request, res: CachedResponse, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `cache:${req.originalUrl}`;
    
    try {
      // Try to get from cache
      const cachedData = await redisClient.get(cacheKey);
      
      if (cachedData) {
        logger.debug(`Cache hit for ${cacheKey}`);
        return res.json({
          ...cachedData,
          _cached: true,
          _cacheTime: new Date().toISOString()
        });
      }

      // Store original json function
      const originalJson = res.json;
      
      // Override json function to cache the response
      res.json = function(data: any) {
        res.json = originalJson;
        
        // Cache the response
        redisClient.set(cacheKey, data, ttl).catch(err => {
          logger.error('Failed to cache response:', err);
        });
        
        logger.debug(`Cache miss for ${cacheKey} - cached for ${ttl}s`);
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

export const invalidateCache = (pattern: string = '*') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Store original functions
    const originalJson = res.json;
    const originalSend = res.send;
    
    const clearCache = async () => {
      try {
        // Simple cache invalidation - in production, use more sophisticated patterns
        if (pattern === '*') {
          await redisClient.flush();
        } else {
          await redisClient.del(`cache:${pattern}`);
        }
        logger.debug(`Cache invalidated for pattern: ${pattern}`);
      } catch (error) {
        logger.error('Cache invalidation error:', error);
      }
    };

    // Override response functions to clear cache after successful mutations
    res.json = function(data: any) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        clearCache();
      }
      return originalJson.call(this, data);
    };

    res.send = function(data: any) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        clearCache();
      }
      return originalSend.call(this, data);
    };
    
    next();
  };
};