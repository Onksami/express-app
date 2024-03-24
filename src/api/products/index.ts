import dbClient from "../../db/db-client";
import { Router } from "express";

import * as schema from "../../db/schema";
import { eq, sql } from "drizzle-orm";
import path from "path";
import fs from "fs";
import { calculatePaginationMetadata } from "../../utils/pagination";

const router = Router();

router.get("/", async (req, res) => {
  let page = 1;
  let limit = 20;
  if (req.query.page) {
    page = parseInt(req.query.page as string);
  }

  if (req.query.limit) {
    limit = parseInt(req.query.limit as string);
    if (limit < 20) {
      limit = 20;
    }
  }

  const total = await dbClient()
    .select({
      count: sql`count(*)`.mapWith(Number),
    })
    .from(schema.product);

  const metadata = calculatePaginationMetadata(total[0].count, page, limit);

  if (page > metadata.totalPages) {
    res.json({
      data: [],
      metadata,
    });
    return;
  }

  const products = await dbClient()
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
  const product = await dbClient()
    .select()
    .from(schema.product)
    .where(eq(schema.product.id, req.params.id));

  res.json({
    data: product,
  });
});

function readData() {
  try {
    const filePath = path.join(__dirname, "db.json");
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data from db.json:", error);
    return null;
  }
}

// router.post("/import-data", async (req, res) => {
//   const data = readData();

//   const products = data.items;
//   const seenSlugsP = {} as any;
//   const uniqueItemsP = [];
//   for (const item of products) {
//     if (!seenSlugsP[item.slug]) {
//       seenSlugsP[item.slug] = true;
//       item.added = new Date(item.added).toISOString();
//       uniqueItemsP.push(item);
//     }
//   }

//   const companies = data.companies;
//   const seenSlugsC = {} as any;
//   const uniqueItemsC = [];
//   for (const item of companies) {
//     if (!seenSlugsC[item.slug]) {
//       seenSlugsC[item.slug] = true;
//       uniqueItemsC.push(item);
//     }
//   }

//   const itemType = data.itemType.map((type: any) => {
//     return { type };
//   });
//   const tags = data.tags.map((tag: any) => {
//     return { tag };
//   });
//   await dbClient().insert(schema.product).values(uniqueItemsP);

//   await dbClient().insert(schema.company).values(uniqueItemsC);

//   await dbClient().insert(schema.itemType).values(itemType);

//   await dbClient().insert(schema.tag).values(tags);

//   res.json({
//     message: "data imported",
//   });
// });

export default router;
