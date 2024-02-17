import dbClient from "../../db/db-client";
import { Router } from "express";

import * as schema from "../../db/schema";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs";
const router = Router();

router.get("/", async (req, res) => {
  const company = await dbClient().select().from(schema.company);

  if (!company) {
    res.status(404);
    throw new Error("company not found");
  }

  res.json({
    data: company,
  });
});
router.get("/:id", async (req, res) => {
  const company = await dbClient()
    .select()
    .from(schema.company)
    .where(eq(schema.company.id, req.params.id));

  res.json({
    data: company,
  });
});

export default router;
