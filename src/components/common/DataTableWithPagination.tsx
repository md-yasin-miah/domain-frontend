import React from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { TablePagination } from "@/components/ui/table-pagination";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DataTableWithPaginationProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pagination?: {
    total: number;
    page: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onRowClick?: (row: TData) => void;
  getRowId?: (row: TData) => string;
  renderActions?: (row: TData) => React.ReactNode;
  actionsColumnHeader?: string;
  enableSorting?: boolean;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  error?: unknown;
  errorTitle?: string;
  errorDescription?: string;
  errorIcon?: React.ReactNode;
  className?: string;
}

export function DataTableWithPagination<TData = unknown>({
  data,
  columns,
  pagination,
  isLoading = false,
  emptyMessage = "No data available",
  emptyIcon,
  onRowClick,
  getRowId,
  renderActions,
  actionsColumnHeader,
  enableSorting = true,
  pageSize,
  onPageChange,
  onPageSizeChange,
  error,
  errorTitle,
  errorDescription,
  errorIcon,
  className,
}: DataTableWithPaginationProps<TData>) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t("common.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          {errorIcon}
          <div>
            <h3 className="text-lg font-semibold">{errorTitle || t("common.error.title")}</h3>
            <p className="text-muted-foreground">
              {errorDescription || t("common.error.description")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
        emptyIcon={emptyIcon}
        getRowId={getRowId}
        renderActions={renderActions}
        actionsColumnHeader={actionsColumnHeader}
        enableSorting={enableSorting}
        onRowClick={onRowClick}
      />

      {/* Pagination */}
      {pagination && (
        <TablePagination
          pagination={pagination}
          pageSize={pageSize}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}

