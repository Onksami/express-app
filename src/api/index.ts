import { Router } from "express";

import usersRouter from "./users";
import productsRouter from "./products";
import companiesRouter from "./companies";

const router = Router();

router.get("/", async (req, res) => {
  res.json({
    message: `${req.originalUrl} api is up and running`,
  });
});

router.use("/users", usersRouter);
router.use("/products", productsRouter);
router.use("/companies", companiesRouter);

export default router;
