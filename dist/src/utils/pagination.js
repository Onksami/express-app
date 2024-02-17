"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePaginationMetadata = void 0;
const calculatePaginationMetadata = (totalCount, page, limit) => {
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    return {
        totalCount,
        totalPages,
        currentPage: page,
        currentLimit: limit,
        hasNextPage,
        hasPreviousPage,
    };
};
exports.calculatePaginationMetadata = calculatePaginationMetadata;
//# sourceMappingURL=pagination.js.map