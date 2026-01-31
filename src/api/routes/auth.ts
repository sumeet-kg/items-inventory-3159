import { Hono } from 'hono';
import { createAuth } from '../auth';

const getBaseURL = (request: Request) => {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
};

export const authRoutes = new Hono();

authRoutes.all('/auth/*', async (c) => {
  const auth = createAuth(getBaseURL(c.req.raw));
  return auth.handler(c.req.raw);
});
