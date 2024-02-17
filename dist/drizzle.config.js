"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    strict: true,
    schema: "./src/db/schema.ts",
    driver: "pg",
    out: "./src/db/migrations",
    dbCredentials: {
        connectionString: process.env.DATABASE_URL,
    },
};
//# sourceMappingURL=drizzle.config.js.map