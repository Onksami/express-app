import { Router } from "express";

import usersRouter from "./users";
import productsRouter from "./products";
import companiesRouter from "./companies";
import testRouter from "./test";

const router = Router();

router.get("/", async (req, res) => {
  // #swagger.tags = ['General']
  res.json({
    message: `${req.originalUrl} api is up and running`,
  });
});

router.use("/users", usersRouter);
router.use("/products", productsRouter);
router.use("/companies", companiesRouter);
router.use("/test", testRouter);

export default router;
