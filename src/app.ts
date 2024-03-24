import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import api from "./api";

import * as customMiddleware from "./middlewares";

import { loadEnvIntoProcess } from "./environment";

import swaggerUi from "swagger-ui-express";

const swaggerOutput = require("./swagger/swagger-output.json");

loadEnvIntoProcess();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerOutput, { explorer: true })
);

app.get<{}, {}, { message: string }>("/", async (_req, res) => {
  res.json({
    message: "Hello from app!",
  });
});

app.use("/api/v1", api);

app.use(customMiddleware.notFoundMiddleware);
app.use(customMiddleware.errorHandlerMiddleware);

export default app;
