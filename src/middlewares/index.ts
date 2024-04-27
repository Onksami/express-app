import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import jwt from "jsonwebtoken";
import { DecodedToken } from "types";
import * as schema from "../db/schema";
import dbClient from "../db/db-client";
import { eq } from "drizzle-orm";

declare global {
  namespace Express {
    interface Request {
      decoded?: DecodedToken; // Declare the user property in the Request interface
    }
  }
}

export const notFoundMiddleware: RequestHandler = (req, res, next) => {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
};

export const errorHandlerMiddleware: ErrorRequestHandler = (
  err: Error,
  _req,
  res,
  _next
) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};
// Middleware to verify JWT token
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    req.decoded = decoded;
    next();
  });
};
// Middleware to check if user is admin
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get user email from decoded token
    const email = req.decoded?.email!;

    // Fetch user from database based on email
    const user = await dbClient()
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    const currentUser = user[0];
    // Check if user exists and has admin role
    if (currentUser && currentUser.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden: Not an admin" });
    }
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
