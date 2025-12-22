import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

// ============ Types ============

export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnDef<TData, TValue = unknown> {
  id?: string;
  accessorKey?: keyof TData | ((row: TData) => TValue);
  header: string | ((props: { column: Column<TData> }) => React.ReactNode);
  cell?: (props: { row: TData; getValue: () => TValue }) => React.ReactNode;
  enableSorting?: boolean;
  enableHiding?: boolean;
  className?: string;
  headerClassName?: string;
  cellClassName?: string | ((row: TData) => string);
  minWidth?: number;
  maxWidth?: number;
}

export interface Column<TData> {
  id: string;
  toggleSorting: (desc?: boolean) => void;
  getIsSorted: () => SortDirection;
}

export interface DataTableProps<TData = any> {
  data: TData[];
  columns: ColumnDef<TData>[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onRowClick?: (row: TData) => void;
  getRowId?: (row: TData) => string;
  className?: string;
  tableClassName?: string;
  enableSorting?: boolean;
  enableRowSelection?: boolean;
  selectedRows?: TData[];
  onRowSelectionChange?: (rows: TData[]) => void;
  renderActions?: (row: TData) => React.ReactNode;
  actionsColumnHeader?: string;
  actionsColumnClassName?: string;
}

// ============ Internal State ============

interface SortingState {
  columnId: string | null;
  direction: SortDirection;
}

// ============ DataTable Component ============

export function DataTable<TData = any>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No data available',
  emptyIcon,
  onRowClick,
  getRowId = (row: TData) => String((row as any).id || Math.random()),
  className,
  tableClassName,
  enableSorting = true,
  enableRowSelection = false,
  selectedRows = [],
  onRowSelectionChange,
  renderActions,
  actionsColumnHeader = 'Actions',
  actionsColumnClassName,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>({
    columnId: null,
    direction: null,
  });

  const [selectedRowIds, setSelectedRowIds] = React.useState<Set<string>>(
    new Set(selectedRows.map(getRowId))
  );

  // Sync selected rows with external state
  React.useEffect(() => {
    if (onRowSelectionChange) {
      const selected = data.filter((row) => selectedRowIds.has(getRowId(row)));
      onRowSelectionChange(selected);
    }
  }, [selectedRowIds, data, getRowId, onRowSelectionChange]);

  // Handle sorting
  const handleSort = (columnId: string) => {
    if (!enableSorting) return;

    setSorting((prev) => {
      if (prev.columnId === columnId) {
        // Cycle: asc -> desc -> null
        if (prev.direction === 'asc') {
          return { columnId, direction: 'desc' };
        } else if (prev.direction === 'desc') {
          return { columnId: null, direction: null };
        }
      }
      return { columnId, direction: 'asc' };
    });
  };

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sorting.columnId || !sorting.direction) return data;

    const column = columns.find((col) => col.id === sorting.columnId);
    if (!column || !column.accessorKey) return data;

    return [...data].sort((a, b) => {
      const getValue = (row: TData) => {
        if (typeof column.accessorKey === 'function') {
          return column.accessorKey(row);
        }
        return row[column.accessorKey as keyof TData] as unknown;
      };

      const aValue = getValue(a);
      const bValue = getValue(b);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sorting.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sorting.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [data, sorting, columns]);

  // Get cell value
  const getCellValue = (row: TData, column: ColumnDef<TData>): unknown => {
    if (typeof column.accessorKey === 'function') {
      return column.accessorKey(row);
    }
    if (column.accessorKey) {
      return row[column.accessorKey];
    }
    return null;
  };

  // Handle row selection
  const handleRowSelect = (rowId: string, checked: boolean) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(rowId);
      } else {
        next.delete(rowId);
      }
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds(new Set(data.map(getRowId)));
    } else {
      setSelectedRowIds(new Set());
    }
  };

  const allSelected = data.length > 0 && selectedRowIds.size === data.length;
  const someSelected = selectedRowIds.size > 0 && selectedRowIds.size < data.length;

  // Render header
  const renderHeader = (column: ColumnDef<TData>, index: number) => {
    const columnId = column.id || String(index);
    const isSorted = sorting.columnId === columnId;
    const sortDirection = isSorted ? sorting.direction : null;

    const columnObj: Column<TData> = {
      id: columnId,
      toggleSorting: (desc?: boolean) => handleSort(columnId),
      getIsSorted: () => sortDirection,
    };

    const headerContent =
      typeof column.header === 'function'
        ? column.header({ column: columnObj })
        : column.header;

    const canSort = enableSorting && column.enableSorting !== false;

    return (
      <TableHead
        key={columnId}
        className={cn(column.headerClassName, {
          'cursor-pointer select-none hover:bg-muted/50': canSort,
        })}
        style={{
          minWidth: column.minWidth,
          maxWidth: column.maxWidth,
        }}
        onClick={() => canSort && handleSort(columnId)}
      >
        <div className="flex items-center gap-2">
          {enableRowSelection && index === 0 && (
            <input
              type="checkbox"
              checked={allSelected}
              ref={(el) => {
                if (el) {
                  (el as HTMLInputElement).indeterminate = someSelected;
                }
              }}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <span className="flex-1">{headerContent}</span>
          {canSort && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleSort(columnId);
              }}
            >
              {sortDirection === 'asc' ? (
                <ArrowUp className="h-3 w-3" />
              ) : sortDirection === 'desc' ? (
                <ArrowDown className="h-3 w-3" />
              ) : (
                <ArrowUpDown className="h-3 w-3 opacity-50" />
              )}
            </Button>
          )}
        </div>
      </TableHead>
    );
  };

  // Render cell
  const renderCell = (row: TData, column: ColumnDef<TData>, index: number) => {
    const columnId = column.id || String(index);
    const value = getCellValue(row, column);

    const cellContent = column.cell
      ? column.cell({ row, getValue: () => value })
      : String(value ?? '');

    const cellClassName =
      typeof column.cellClassName === 'function'
        ? column.cellClassName(row)
        : column.cellClassName;

    return (
      <TableCell
        key={columnId}
        className={cn(column.className, cellClassName)}
        style={{
          minWidth: column.minWidth,
          maxWidth: column.maxWidth,
        }}
      >
        {cellContent}
      </TableCell>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (sortedData.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="flex flex-col items-center gap-4 text-center">
          {emptyIcon && <div className="text-muted-foreground">{emptyIcon}</div>}
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-md border', className)}>
      <Table className={tableClassName}>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => renderHeader(column, index))}
            {renderActions && (
              <TableHead
                className={cn('text-right', actionsColumnClassName)}
              >
                {actionsColumnHeader}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row) => {
            const rowId = getRowId(row);
            const isSelected = selectedRowIds.has(rowId);

            return (
              <TableRow
                key={rowId}
                data-state={isSelected ? 'selected' : undefined}
                className={cn({
                  'bg-muted/50': isSelected,
                  'cursor-pointer': onRowClick,
                })}
                onClick={() => onRowClick?.(row)}
              >
                {enableRowSelection && (
                  <TableCell
                    className="w-12"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleRowSelect(rowId, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </TableCell>
                )}
                {columns.map((column, index) => renderCell(row, column, index))}
                {renderActions && (
                  <TableCell
                    className={cn('text-right', actionsColumnClassName)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {renderActions(row)}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// ============ Export ============

export default DataTable;

