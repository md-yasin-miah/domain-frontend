import { useGetMyMarketListingQuery } from '@/store/api/marketplaceApi';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Eye,
  Heart,
  MoreVertical,
  Edit,
  Trash2,
  Search,
  Package,
  ExternalLink
} from 'lucide-react';
import { formatCurrency, formatNumber, getStatusColor, getStatusLabel, timeFormat, getStatusBadgeVariant } from '@/lib/helperFun';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MyListing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading } = useGetMyMarketListingQuery({
    skip: 0,
    limit: 50,
  });

  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!data?.items) return [];
    if (!searchTerm) return data.items;

    return data.items.filter((listing) =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.listing_type.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.items, searchTerm]);

  // Define table columns
  const columns: ColumnDef<MarketplaceListing>[] = [
    {
      id: 'title',
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{row.title}</span>
          {row.short_description && (
            <span className="text-xs text-muted-foreground line-clamp-1">
              {row.short_description}
            </span>
          )}
        </div>
      ),
      minWidth: 250,
      enableSorting: true,
    },
    {
      id: 'listing_type',
      accessorKey: (row) => row.listing_type.name,
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal">
          {row.listing_type.name}
        </Badge>
      ),
      enableSorting: true,
    },
    {
      id: 'price',
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold">{formatCurrency(row.price)}</span>
          {row.is_price_negotiable && (
            <Badge variant="secondary" className="text-xs w-fit">
              Negotiable
            </Badge>
          )}
        </div>
      ),
      enableSorting: true,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', getStatusColor(row.status))} />
          <Badge variant={getStatusBadgeVariant(row.status)}>
            {getStatusLabel(row.status, t)}
          </Badge>
          {row.is_featured && (
            <Badge variant="default" className="text-xs">
              Featured
            </Badge>
          )}
        </div>
      ),
      enableSorting: true,
    },
    {
      id: 'views',
      accessorKey: 'view_count',
      header: 'Views',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Eye className="w-4 h-4" />
          <span>{formatNumber(row.view_count)}</span>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: 'favorites',
      accessorKey: 'favorite_count',
      header: 'Favorites',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Heart className="w-4 h-4" />
          <span>{formatNumber(row.favorite_count)}</span>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: 'created_at',
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-sm">{timeFormat(row.created_at, 'MMM DD, YYYY')}</span>
      ),
      enableSorting: true,
    },
    {
      id: 'expires_at',
      accessorKey: 'expires_at',
      header: 'Expires',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.expires_at ? timeFormat(row.expires_at, 'MMM DD, YYYY') : '---'}
        </span>
      ),
      enableSorting: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            My Listings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your marketplace listings
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Package className="w-4 h-4 mr-2" />
          Create New Listing
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Listings</div>
          <div className="text-2xl font-bold mt-1">
            {data?.pagination.total || 0}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Active</div>
          <div className="text-2xl font-bold mt-1 text-green-600">
            {data?.items?.filter(item => item.status === 'active').length || 0}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Views</div>
          <div className="text-2xl font-bold mt-1">
            {formatNumber(data?.items?.reduce((acc, item) => acc + item.view_count, 0) || 0)}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Favorites</div>
          <div className="text-2xl font-bold mt-1 text-red-600">
            {formatNumber(data?.items?.reduce((acc, item) => acc + item.favorite_count, 0) || 0)}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search listings by title or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No listings found. Create your first listing to get started!"
        emptyIcon={<Package className="w-16 h-16" />}
        enableSorting={true}
        renderActions={(row) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(ROUTES.CLIENT.MARKETPLACE.MY_LISTINGS_DETAILS(row.id))}>
                <ExternalLink className="w-4 h-4 mr-2" />
                View Listing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        actionsColumnHeader="Actions"
      />
    </div>
  );
};

export default MyListing;