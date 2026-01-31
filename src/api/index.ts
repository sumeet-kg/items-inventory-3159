import { Hono } from 'hono';
import { cors } from "hono/cors";
import { authRoutes } from './routes/auth';
import { itemsRoutes } from './routes/items';
import { authMiddleware } from './middleware/authentication';

const app = new Hono()
  .basePath('api');

app.use(cors({
  origin: "*",
  credentials: true
}));

// Apply auth middleware before routes
app.use(authMiddleware);

// Auth routes
app.route('/', authRoutes);

// Items routes
app.route('/', itemsRoutes);

app.get('/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }));

export default app;
