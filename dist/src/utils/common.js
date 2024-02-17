"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genUniqId = void 0;
function genUniqId() {
    return Date.now() + "-" + Math.floor(Math.random() * 1000000000);
}
exports.genUniqId = genUniqId;
//# sourceMappingURL=common.js.map