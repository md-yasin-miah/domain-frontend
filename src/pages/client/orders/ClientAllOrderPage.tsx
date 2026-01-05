import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Search, Package, Loader2, Eye, FileText } from "lucide-react";
import { useGetOrdersQuery } from '@/store/api/ordersApi';
import { useAuth } from '@/store/hooks/useAuth';
import { formatCurrency, timeFormat, getStatusColor, getStatusBadgeVariant } from '@/lib/helperFun';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constant';

type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';

const ClientAllOrderPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Build query params
  const queryParams = useMemo(() => {
    const params: OrderFilters = {
      page,
      size: pageSize,
    };

    // Filter by current user (as buyer or seller)
    if (user?.id) {
      // You might want to filter by buyer_id or seller_id based on your needs
      // For now, let's show all orders where user is buyer or seller
      // params.buyer_id = user.id; // Uncomment if you want only buyer orders
      // params.seller_id = user.id; // Uncomment if you want only seller orders
    }

    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }

    if (searchTerm) {
      params.search = searchTerm;
    }

    return params;
  }, [page, pageSize, statusFilter, searchTerm, user?.id]);

  const { data: ordersData, isLoading, error } = useGetOrdersQuery(queryParams);
  // Define table columns
  const columns: ColumnDef<Order>[] = useMemo(() => {
    // Get status label helper
    const getStatusLabel = (status: string) => {
      return t(`orders.status.${status}`) || status;
    };

    return [
      {
        id: 'order_number',
        accessorKey: 'order_number',
        header: t('orders.table.order_number'),
        cell: ({ row }) => (
          <div className="font-medium">
            <Link
              to={`${ROUTES.CLIENT.ORDERS.INDEX}/${row.id}`}
              className="text-primary hover:underline"
            >
              {row.order_number}
            </Link>
          </div>
        ),
      },
      {
        id: 'listing',
        accessorKey: (row) => row.listing?.title || '',
        header: t('orders.table.listing'),
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.listing?.title || 'N/A'}</div>
            <div className="text-sm text-muted-foreground">
              {t('orders.table.listing_id')}: {row.listing_id}
            </div>
          </div>
        ),
      },
      {
        id: 'buyer',
        accessorKey: (row) => row.buyer?.username || row.buyer?.email || '',
        header: t('orders.table.buyer'),
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.buyer?.username || row.buyer?.email || 'N/A'}</div>
          </div>
        ),
      },
      {
        id: 'seller',
        accessorKey: (row) => row.seller?.username || row.seller?.email || '',
        header: t('orders.table.seller'),
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.seller?.username || row.seller?.email || 'N/A'}</div>
          </div>
        ),
      },
      {
        id: 'final_price',
        accessorKey: 'final_price',
        header: t('orders.table.price'),
        cell: ({ row }) => (
          <div className="font-medium">
            {formatCurrency(row.final_price)} {row.currency}
          </div>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: t('orders.table.status'),
        cell: ({ row }) => (
          <Badge
            variant={getStatusBadgeVariant(row.status)}
            className={cn('capitalize', getStatusColor(row.status))}
          >
            {getStatusLabel(row.status)}
          </Badge>
        ),
      },
      {
        id: 'created_at',
        accessorKey: 'created_at',
        header: t('orders.table.created_at'),
        cell: ({ row }) => (
          <div className="text-sm">
            {timeFormat(row.created_at, 'MM/DD/YYYY')}
          </div>
        ),
      },
    ];
  }, [t]);

  // Render actions for each row
  const renderActions = (order: Order) => (
    <Button
      variant="ghost"
      size="sm"
      asChild
    >
      <Link to={ROUTES.CLIENT.ORDERS.ORDER_DETAILS(order.id)}>
        <Eye className="w-4 h-4" />
      </Link>
    </Button>
  );

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = ordersData?.pagination?.total_pages || 1;
  const currentPage = ordersData?.pagination?.page || page;

  return (
    <div className="space-y-6 container mx-auto">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
        <div className="col-span-12 md:col-span-5">
          <h1 className="text-3xl font-bold">{t('orders.all_orders')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('orders.description')}
          </p>
        </div>
        {/* Filters and Search */}
        <div className="col-span-12 md:col-span-7">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('orders.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1); // Reset to first page on search
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as OrderStatus | 'all');
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('orders.filter_by_status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('orders.status.all')}</SelectItem>
                  <SelectItem value="pending">{t('orders.status.pending')}</SelectItem>
                  <SelectItem value="processing">{t('orders.status.processing')}</SelectItem>
                  <SelectItem value="completed">{t('orders.status.completed')}</SelectItem>
                  <SelectItem value="cancelled">{t('orders.status.cancelled')}</SelectItem>
                  <SelectItem value="refunded">{t('orders.status.refunded')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('orders.table.title')}</CardTitle>
              <CardDescription>
                {ordersData?.pagination?.total || 0} {t('orders.table.total_orders')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4 text-center">
                <Package className="w-16 h-16 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">{t('orders.error.title')}</h3>
                  <p className="text-muted-foreground">{t('orders.error.description')}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <DataTable
                data={ordersData?.items || []}
                columns={columns}
                isLoading={false}
                emptyMessage={t('orders.empty.no_orders')}
                emptyIcon={<Package className="w-16 h-16 text-muted-foreground" />}
                getRowId={(row) => String(row.id)}
                renderActions={renderActions}
                actionsColumnHeader={t('orders.table.actions')}
                enableSorting={true}
              />

              {/* Pagination */}
              {ordersData && ordersData.pagination && ordersData.pagination.total_pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    {t('orders.pagination.showing')} {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, ordersData.pagination.total)} {t('orders.pagination.of')} {ordersData.pagination.total}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!ordersData.pagination.has_previous || isLoading}
                    >
                      {t('orders.pagination.previous')}
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            disabled={isLoading}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!ordersData.pagination.has_next || isLoading}
                    >
                      {t('orders.pagination.next')}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientAllOrderPage;
