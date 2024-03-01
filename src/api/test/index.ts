import dbClient from "../../db/db-client";
import { Router } from "express";

import * as schema from "../../db/schema";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs";
import { Worker } from "worker_threads";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const worker = new Worker("./src/api/test/test-worker.ts");

    worker.on("message", (counter: number) => {
      res.json({
        counter,
      });
    });

    worker.on("error", (error: any) => {
      console.error("Worker error:", error);
      res.json({
        error,
      });
    });

    worker.on("exit", (code: number) => {
      console.log("Worker exited with code", code);
    });
  } catch (error) {
    console.error("Error creating worker:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default router;
