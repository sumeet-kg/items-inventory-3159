import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Re-export auth schema tables
export * from "./auth-schema";

/**
 * Items table - stores inventory items per user
 */
export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  description: text("description").default(""),
  price: real("price").notNull().default(0),
  quantity: integer("quantity").notNull().default(0),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});
