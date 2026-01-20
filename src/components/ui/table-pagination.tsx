import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface PaginationInfo {
  total: number;
  page: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

interface TablePaginationProps {
  pagination: PaginationInfo;
  pageSize: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
  showInfo?: boolean;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
  translationKey?: string; // e.g., 'orders.pagination' for custom translations
}

export function TablePagination({
  pagination,
  pageSize,
  isLoading = false,
  onPageChange,
  onPageSizeChange,
  className,
  showInfo = true,
  showPageSizeSelector = true,
  pageSizeOptions = [10, 20, 30, 50, 100],
  translationKey = 'common.pagination',
}: TablePaginationProps) {
  const { t } = useTranslation();
console.log({pagination})
  const { total, page, total_pages, has_next, has_previous } = pagination;
  const currentPage = page + 1;
  // Don't render if pagination data is invalid
  if (!pagination || total_pages <= 1) {
    return null;
  }

  const handlePageSizeChange = (newPageSize: string) => {
    const size = parseInt(newPageSize, 10);
    if (onPageSizeChange && !isNaN(size)) {
      onPageSizeChange(size);
      // Reset to first page when page size changes
      onPageChange(1);
    }
  };
  // Calculate page numbers to display (max 5 pages)
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (total_pages <= maxPagesToShow) {
      // Show all pages if total pages is 5 or less
      for (let i = 1; i <= total_pages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      if (currentPage <= 3) {
        // Show first 5 pages
        for (let i = 1; i <= maxPagesToShow; i++) {
          pages.push(i);
        }
      } else if (currentPage >= total_pages - 2) {
        // Show last 5 pages
        for (let i = total_pages - 4; i <= total_pages; i++) {
          pages.push(i);
        }
      } else {
        // Show current page with 2 pages before and after
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = currentPage * pageSize;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= total_pages && newPage !== currentPage) {
      onPageChange(newPage);
      // Scroll to top on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={cn('flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6', className)}>
      <div className="flex items-center gap-4">
        {showInfo && (
          <div className="text-sm text-muted-foreground">
            {t(`${translationKey}.showing`, { defaultValue: 'Showing' })} {startItem} to {endItem}{' '}
            {t(`${translationKey}.of`, { defaultValue: 'of' })} {total}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {t(`${translationKey}.per_page`, { defaultValue: 'Per page' })}:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[80px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!has_previous || isLoading}
          >
            {t(`${translationKey}.previous`, { defaultValue: 'Previous' })}
          </Button>
          <div className="flex items-center gap-1">
            {pageNumbers.map((pageNum) => (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                disabled={isLoading}
              >
                {pageNum}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!has_next || isLoading}
          >
            {t(`${translationKey}.next`, { defaultValue: 'Next' })}
          </Button>
        </div>
      </div>
    </div>
  );
}

