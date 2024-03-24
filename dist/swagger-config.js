"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const config = {
    outputFile: "./swagger-output.json",
    endpointFile: path_1.default.resolve(__dirname, "src/app.ts"), // Adjust this to your main Express app file
};
exports.default = config;
//# sourceMappingURL=swagger-config.js.map