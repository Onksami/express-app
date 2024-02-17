"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_js_1 = require("drizzle-orm/postgres-js");
const migrator_1 = require("drizzle-orm/postgres-js/migrator");
const postgres_1 = __importDefault(require("postgres"));
const sql = (0, postgres_1.default)(process.env.DATABASE_URL, { max: 1 });
const db = (0, postgres_js_1.drizzle)(sql);
(0, migrator_1.migrate)(db, { migrationsFolder: "src/db/migrations" }).then(() => {
    console.log("Migration complete");
    process.exit(0);
});
//# sourceMappingURL=migrate.js.map