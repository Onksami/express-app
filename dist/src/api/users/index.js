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
const db_client_1 = __importDefault(require("../../db/db-client"));
const express_1 = require("express");
const schema = __importStar(require("../../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const common_1 = require("../../utils/common");
const middlewares_1 = require("../../middlewares");
const pagination_1 = require("../../utils/pagination");
let clients = [];
let newUser = [];
const router = (0, express_1.Router)();
// router.get("/:id", async (req, res, next) => {
//   // #swagger.tags = ['Users']
//   const { id } = req.params;
//   try {
//     const user = await dbClient()
//       .select()
//       .from(schema.users)
//       .where(eq(schema.users.id, id));
//     const { password, ...userData } = user[0];
//     res.json({
//       data: userData,
//     });
//   } catch (err) {
//     res.status(500);
//     return next(err);
//   }
// });
router.post("/sign-up", async (req, res, next) => {
    // #swagger.tags = ['Auth']
    const { email, password, name, surName } = req.body;
    if (!email || !password) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const user = await (0, db_client_1.default)()
        .select()
        .from(schema.users)
        .where((0, drizzle_orm_1.eq)(schema.users.email, email));
    // If the user already exists, return a conflict error
    if (user.length > 0) {
        res.status(409).json("User already exists");
        return;
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    try {
        await (0, db_client_1.default)().insert(schema.users).values({
            email,
            password: hashedPassword,
            firstName: name,
            lastName: surName,
        });
        // newUser = [{ id: user[0].id, text: email, checked: false }, ...newUser];
        // sendToAllUsers();
        const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET);
        res.json({
            token,
        });
    }
    catch (err) {
        res.status(500);
        return next(err);
    }
});
router.post("/sign-in", async (req, res, next) => {
    // #swagger.tags = ['Auth']
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const user = await (0, db_client_1.default)()
        .select()
        .from(schema.users)
        .where((0, drizzle_orm_1.eq)(schema.users.email, email));
    // If the user already exists, return a conflict error
    if (user.length === 0) {
        res.status(401).json("Email or password is incorrect");
    }
    // Verify password
    if (!(await bcryptjs_1.default.compare(password, user[0].password))) {
        return res.status(401).json({ message: "Invalid username or password" });
    }
    try {
        const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET);
        const { password, ...userData } = user[0];
        res.json({
            token,
        });
    }
    catch (err) {
        res.status(500);
        return next(err);
    }
});
router.get("/", middlewares_1.verifyToken, middlewares_1.isAdmin, async (req, res) => {
    // #swagger.tags = ['Users']
    let page = 1;
    let limit = 20;
    if (req.query.page) {
        page = parseInt(req.query.page);
    }
    if (req.query.limit) {
        limit = parseInt(req.query.limit);
        if (limit < 20) {
            limit = 20;
        }
    }
    const total = await (0, db_client_1.default)()
        .select({
        count: (0, drizzle_orm_1.sql) `count(*)`.mapWith(Number),
    })
        .from(schema.users);
    const metadata = (0, pagination_1.calculatePaginationMetadata)(total[0].count, page, limit);
    const users = await (0, db_client_1.default)()
        .select()
        .from(schema.users)
        .limit(limit)
        .offset((page - 1) * limit);
    res.json({
        data: users,
        metadata,
    });
});
router.get("/account", middlewares_1.verifyToken, async (req, res, next) => {
    // #swagger.tags = ['Users']
    const decoded = req.decoded;
    const email = decoded?.email;
    // return res.json({ data: "ok" });
    try {
        const user = await (0, db_client_1.default)()
            .select()
            .from(schema.users)
            .where((0, drizzle_orm_1.eq)(schema.users.email, email));
        const { password, ...userData } = user[0];
        res.json({
            data: userData,
        });
    }
    catch (err) {
        res.status(500);
        return next(err);
    }
});
router.put("/", middlewares_1.verifyToken, async (req, res, next) => {
    // #swagger.tags = ['Users']
    const decoded = req.decoded;
    const email = decoded?.email;
    const { firstName, lastName } = req.body;
    try {
        const user = await (0, db_client_1.default)()
            .update(schema.users)
            .set({
            firstName,
            lastName,
        })
            .where((0, drizzle_orm_1.eq)(schema.users.email, email))
            .returning({
            id: schema.users.id,
        });
        res.json({
            message: "user updated",
        });
    }
    catch (err) {
        res.status(500);
        return next(err);
    }
});
router.delete("/:id", middlewares_1.verifyToken, middlewares_1.isAdmin, async (req, res, next) => {
    // #swagger.tags = ['Users']
    const { id } = req.params;
    try {
        const user = await (0, db_client_1.default)()
            .delete(schema.users)
            .where((0, drizzle_orm_1.eq)(schema.users.id, id))
            .returning({
            id: schema.users.id,
        });
        res.json({
            data: user,
        });
    }
    catch (err) {
        res.status(500);
        return next(err);
    }
});
router.get("/event", function (req, res) {
    // #swagger.ignore = true
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    });
    const sendData = `data: ${JSON.stringify(newUser)}\n\n`;
    res.write(sendData);
    const clientId = (0, common_1.genUniqId)();
    const newClient = {
        id: clientId,
        res,
    };
    clients.push(newClient);
    req.on("close", () => {
        console.log(`${clientId} - Connection closed`);
        clients = clients.filter((client) => client.id !== clientId);
    });
});
function sendToAllUsers() {
    for (let i = 0; i < clients.length; i++) {
        clients[i].res.write(`data: ${JSON.stringify(newUser)}\n\n`);
    }
}
exports.default = router;
//# sourceMappingURL=index.js.map