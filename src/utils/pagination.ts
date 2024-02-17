interface PaginationMetadata {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  currentLimit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
export const calculatePaginationMetadata = (
  totalCount: number,
  page: number,
  limit: number
): PaginationMetadata => {
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
