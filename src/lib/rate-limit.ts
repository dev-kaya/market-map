import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(options: {
  windowMs: number;
  maxRequests: number;
}) {
  return (req: NextRequest) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowStart = now - options.windowMs;

    // Clean old entries
    for (const key in store) {
      if (store[key].resetTime < windowStart) {
        delete store[key];
      }
    }

    if (!store[ip]) {
      store[ip] = { count: 1, resetTime: now + options.windowMs };
      return { allowed: true, remaining: options.maxRequests - 1 };
    }

    if (store[ip].resetTime < now) {
      store[ip] = { count: 1, resetTime: now + options.windowMs };
      return { allowed: true, remaining: options.maxRequests - 1 };
    }

    if (store[ip].count >= options.maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    store[ip].count++;
    return { allowed: true, remaining: options.maxRequests - store[ip].count };
  };
}