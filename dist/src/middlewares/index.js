"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.errorHandlerMiddleware = exports.notFoundMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Missing token" });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        // req.user = decoded;
        next();
    });
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=index.js.map