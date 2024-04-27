import { integer, pgTable, real, text, uuid } from "drizzle-orm/pg-core";

export const product = pgTable("product", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  price: real("price").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  added: text("added").notNull(),
  manufacturer: text("manufacturer").notNull(),
  itemType: text("itemType").notNull(),
  tags: text("tags").notNull(),
});
export const company = pgTable("company", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  address: text("address").notNull(),
  account: integer("account").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  contact: text("contact").notNull(),
});

export const itemType = pgTable("item_type", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  type: text("type").notNull(),
});
export const tag = pgTable("tag", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  tag: text("tag").notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  firstName: text("firstName"),
  lastName: text("lastName"),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").default("user"),
});
