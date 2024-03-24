"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = __importDefault(require("./users"));
const products_1 = __importDefault(require("./products"));
const companies_1 = __importDefault(require("./companies"));
const test_1 = __importDefault(require("./test"));
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    // #swagger.tags = ['General']
    res.json({
        message: `${req.originalUrl} api is up and running`,
    });
});
router.use("/users", users_1.default);
router.use("/products", products_1.default);
router.use("/companies", companies_1.default);
router.use("/test", test_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map