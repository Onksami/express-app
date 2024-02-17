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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnvIntoProcess = void 0;
const dotenv = __importStar(require("dotenv"));
const zod_1 = require("zod");
const environmentSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production"], {
        required_error: "NODE_ENV is required",
        invalid_type_error: "NODE_ENV must be either 'development' or 'production'",
    }),
    PORT: zod_1.z.string({
        required_error: "PORT is required",
        invalid_type_error: "PORT must be a string",
    }),
    DATABASE_URL: zod_1.z.string({
        required_error: "DATABASE_URL is required",
        invalid_type_error: "DATABASE_URL must be a string",
    }),
    JWT_SECRET: zod_1.z.string({
        required_error: "DATABASE_URL is required",
        invalid_type_error: "DATABASE_URL must be a string",
    }),
}, {
    required_error: "Environment was not found",
});
const loadEnvIntoProcess = () => {
    try {
        // if available, load .env file into process.env
        dotenv.config();
        // make sure process.env contains all required variables
        environmentSchema.parse(process.env);
    }
    catch (error) {
        console.error("Something went wrong while parsing environment");
        if (error instanceof zod_1.ZodError) {
            console.error(error.format());
            // format zod error to show which env variables are missing then print it to console (including name of the missing env variable)
            process.exit(1);
        }
        throw error;
    }
};
exports.loadEnvIntoProcess = loadEnvIntoProcess;
//# sourceMappingURL=index.js.map