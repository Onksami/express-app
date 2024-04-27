"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.tag = exports.itemType = exports.company = exports.product = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.product = (0, pg_core_1.pgTable)("product", {
    id: (0, pg_core_1.uuid)("id").notNull().primaryKey().defaultRandom(),
    price: (0, pg_core_1.real)("price").notNull(),
    name: (0, pg_core_1.text)("name").notNull(),
    slug: (0, pg_core_1.text)("slug").notNull().unique(),
    description: (0, pg_core_1.text)("description").notNull(),
    added: (0, pg_core_1.text)("added").notNull(),
    manufacturer: (0, pg_core_1.text)("manufacturer").notNull(),
    itemType: (0, pg_core_1.text)("itemType").notNull(),
    tags: (0, pg_core_1.text)("tags").notNull(),
});
exports.company = (0, pg_core_1.pgTable)("company", {
    id: (0, pg_core_1.uuid)("id").notNull().primaryKey().defaultRandom(),
    name: (0, pg_core_1.text)("name").notNull(),
    slug: (0, pg_core_1.text)("slug").notNull().unique(),
    address: (0, pg_core_1.text)("address").notNull(),
    account: (0, pg_core_1.integer)("account").notNull(),
    city: (0, pg_core_1.text)("city").notNull(),
    state: (0, pg_core_1.text)("state").notNull(),
    contact: (0, pg_core_1.text)("contact").notNull(),
});
exports.itemType = (0, pg_core_1.pgTable)("item_type", {
    id: (0, pg_core_1.uuid)("id").notNull().primaryKey().defaultRandom(),
    type: (0, pg_core_1.text)("type").notNull(),
});
exports.tag = (0, pg_core_1.pgTable)("tag", {
    id: (0, pg_core_1.uuid)("id").notNull().primaryKey().defaultRandom(),
    tag: (0, pg_core_1.text)("tag").notNull(),
});
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").notNull().primaryKey().defaultRandom(),
    firstName: (0, pg_core_1.text)("firstName"),
    lastName: (0, pg_core_1.text)("lastName"),
    age: (0, pg_core_1.text)("age"),
    password: (0, pg_core_1.text)("password").notNull(),
    email: (0, pg_core_1.text)("email").notNull(),
    role: (0, pg_core_1.text)("role").default("user"),
    country: (0, pg_core_1.text)("country"),
    city: (0, pg_core_1.text)("city"),
    phone: (0, pg_core_1.text)("phone"),
    status: (0, pg_core_1.text)("status").default("active"),
    company: (0, pg_core_1.text)("company"),
    profession: (0, pg_core_1.text)("profession"),
    createdAt: (0, pg_core_1.timestamp)("createdAt").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt").defaultNow(),
});
//# sourceMappingURL=schema.js.map