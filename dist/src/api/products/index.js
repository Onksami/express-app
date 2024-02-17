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
const db_client_1 = __importDefault(require("../../db/db-client"));
const express_1 = require("express");
const schema = __importStar(require("../../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const pagination_1 = require("../../utils/pagination");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    let page = 1;
    let limit = 20;
    if (req.query.page) {
        page = parseInt(req.query.page);
    }
    if (req.query.limit) {
        limit = parseInt(req.query.limit);
        if (limit < 20) {
            limit = 20;
        }
    }
    const total = await (0, db_client_1.default)()
        .select({
        count: (0, drizzle_orm_1.sql) `count(*)`.mapWith(Number),
    })
        .from(schema.product);
    const metadata = (0, pagination_1.calculatePaginationMetadata)(total[0].count, page, limit);
    if (page > metadata.totalPages) {
        res.json({
            data: [],
            metadata,
        });
        return;
    }
    const products = await (0, db_client_1.default)()
        .select()
        .from(schema.product)
        .limit(limit)
        .offset((page - 1) * limit);
    res.json({
        data: products,
        metadata,
    });
});
router.get("/:id", async (req, res) => {
    const product = await (0, db_client_1.default)()
        .select()
        .from(schema.product)
        .where((0, drizzle_orm_1.eq)(schema.product.id, req.params.id));
    res.json({
        data: product,
    });
});
function readData() {
    try {
        const filePath = path_1.default.join(__dirname, "db.json");
        const data = fs_1.default.readFileSync(filePath, "utf-8");
        return JSON.parse(data);
    }
    catch (error) {
        console.error("Error reading data from db.json:", error);
        return { users: [] }; // Return empty data or handle error as needed
    }
}
router.post("/import-data", async (req, res) => {
    const data = readData();
    const products = data.products;
    const seenSlugsP = {};
    const uniqueItemsP = [];
    for (const item of products) {
        if (!seenSlugsP[item.slug]) {
            seenSlugsP[item.slug] = true;
            item.added = new Date(item.added).toISOString();
            uniqueItemsP.push(item);
        }
    }
    const companies = data.companies;
    const seenSlugsC = {};
    const uniqueItemsC = [];
    for (const item of companies) {
        if (!seenSlugsC[item.slug]) {
            seenSlugsC[item.slug] = true;
            uniqueItemsC.push(item);
        }
    }
    const itemType = data.itemType.map((type) => {
        return { type };
    });
    const tags = data.tags.map((tag) => {
        return { tag };
    });
    await (0, db_client_1.default)().insert(schema.product).values(uniqueItemsP);
    await (0, db_client_1.default)().insert(schema.company).values(uniqueItemsC);
    await (0, db_client_1.default)().insert(schema.itemType).values(itemType);
    await (0, db_client_1.default)().insert(schema.tag).values(tags);
    res.json({
        message: "data imported",
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map