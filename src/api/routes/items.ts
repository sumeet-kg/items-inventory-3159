import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { env } from 'cloudflare:workers';
import { eq, desc } from 'drizzle-orm';
import * as schema from '../database/schema';
import { authenticatedOnly } from '../middleware/authentication';

export const itemsRoutes = new Hono();

// Apply authenticated middleware to all item routes
itemsRoutes.use('*', authenticatedOnly);

// Get all items for the current user
itemsRoutes.get('/items', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
  }

  const db = drizzle(env.DB, { schema });
  const items = await db
    .select()
    .from(schema.items)
    .where(eq(schema.items.userId, user.id))
    .orderBy(desc(schema.items.createdAt));

  return c.json(items);
});

// Create a new item
itemsRoutes.post('/items', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
  }

  const body = await c.req.json();
  const { name, description, price, quantity } = body;

  if (!name) {
    return c.json({ error: 'Name is required' }, 400);
  }

  const db = drizzle(env.DB, { schema });
  const id = crypto.randomUUID();
  const now = new Date();

  await db.insert(schema.items).values({
    id,
    userId: user.id,
    name,
    description: description || '',
    price: parseFloat(price) || 0,
    quantity: parseInt(quantity) || 0,
    createdAt: now,
    updatedAt: now,
  });

  const [newItem] = await db
    .select()
    .from(schema.items)
    .where(eq(schema.items.id, id));

  return c.json(newItem, 201);
});

// Update an item
itemsRoutes.put('/items/:id', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
  }

  const itemId = c.req.param('id');
  const body = await c.req.json();
  const { name, description, price, quantity } = body;

  const db = drizzle(env.DB, { schema });

  // Check if item exists and belongs to user
  const [existingItem] = await db
    .select()
    .from(schema.items)
    .where(eq(schema.items.id, itemId));

  if (!existingItem) {
    return c.json({ error: 'Item not found' }, 404);
  }

  if (existingItem.userId !== user.id) {
    return c.json({ error: 'Not authorized' }, 403);
  }

  await db
    .update(schema.items)
    .set({
      name: name ?? existingItem.name,
      description: description ?? existingItem.description,
      price: price !== undefined ? parseFloat(price) : existingItem.price,
      quantity: quantity !== undefined ? parseInt(quantity) : existingItem.quantity,
      updatedAt: new Date(),
    })
    .where(eq(schema.items.id, itemId));

  const [updatedItem] = await db
    .select()
    .from(schema.items)
    .where(eq(schema.items.id, itemId));

  return c.json(updatedItem);
});

// Delete an item
itemsRoutes.delete('/items/:id', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
  }

  const itemId = c.req.param('id');
  const db = drizzle(env.DB, { schema });

  // Check if item exists and belongs to user
  const [existingItem] = await db
    .select()
    .from(schema.items)
    .where(eq(schema.items.id, itemId));

  if (!existingItem) {
    return c.json({ error: 'Item not found' }, 404);
  }

  if (existingItem.userId !== user.id) {
    return c.json({ error: 'Not authorized' }, 403);
  }

  await db
    .delete(schema.items)
    .where(eq(schema.items.id, itemId));

  return c.json({ success: true });
});
