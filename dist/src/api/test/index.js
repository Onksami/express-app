"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const worker_threads_1 = require("worker_threads");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    try {
        const worker = new worker_threads_1.Worker("./src/api/test/test-worker.ts");
        worker.on("message", (counter) => {
            res.json({
                counter,
            });
        });
        worker.on("error", (error) => {
            console.error("Worker error:", error);
            res.json({
                error,
            });
        });
        worker.on("exit", (code) => {
            console.log("Worker exited with code", code);
        });
    }
    catch (error) {
        console.error("Error creating worker:", error);
        res.status(500).json({
            error: "Internal server error",
        });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map