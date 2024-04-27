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
exports.isAdmin = exports.verifyToken = exports.errorHandlerMiddleware = exports.notFoundMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema = __importStar(require("../db/schema"));
const db_client_1 = __importDefault(require("../db/db-client"));
const drizzle_orm_1 = require("drizzle-orm");
const notFoundMiddleware = (req, res, next) => {
    res.status(404);
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    next(error);
};
exports.notFoundMiddleware = notFoundMiddleware;
const errorHandlerMiddleware = (err, _req, res, _next) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    });
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Missing token" });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        req.decoded = decoded;
        next();
    });
};
exports.verifyToken = verifyToken;
// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        // Get user email from decoded token
        const email = req.decoded?.email;
        // Fetch user from database based on email
        const user = await (0, db_client_1.default)()
            .select()
            .from(schema.users)
            .where((0, drizzle_orm_1.eq)(schema.users.email, email));
        const currentUser = user[0];
        // Check if user exists and has admin role
        if (currentUser && currentUser.role === "admin") {
            next();
        }
        else {
            return res.status(403).json({ message: "Forbidden: Not an admin" });
        }
    }
    catch (error) {
        console.error("Error in isAdmin middleware:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=index.js.map