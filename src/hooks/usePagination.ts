import { useState } from 'react';

export const usePagination = ({
  initialPage = 1,
  initialPageSize = 10,
}: {
  initialPage?: number;
  initialPageSize?: number;
}) => {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialPageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setSize(newPageSize);
  };

  return { page, size, handlePageChange, handlePageSizeChange };
};