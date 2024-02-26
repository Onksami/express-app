"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const schema = __importStar(require("./schema"));
async function clearDBTables() {
    const connectionString = process.env.DATABASE_URL;
    const client = (0, postgres_1.default)(connectionString);
    const db = (0, postgres_js_1.drizzle)(client, { schema });
    console.log("🗑️ Emptying the entire database");
    const tablesSchema = db._.schema;
    if (!tablesSchema)
        throw new Error("Schema not loaded");
    const queries = Object.values(tablesSchema).map((table) => {
        console.log(`🧨 Preparing delete query for table: ${table.dbName}`);
        return db.delete(table.dbName);
    });
    console.log("🛜 Sending delete queries");
    await db.transaction(async (trx) => {
        await Promise.all(queries.map(async (query) => {
            if (query)
                await trx.execute(query);
        }));
    });
    console.log("✅ Database emptied");
}
clearDBTables();
//# sourceMappingURL=clear.js.map