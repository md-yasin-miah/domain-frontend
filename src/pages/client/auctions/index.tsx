import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ColumnDef } from "@/components/ui/data-table";
import { DataTableWithPagination } from "@/components/common/DataTableWithPagination";
import {
  Gavel,
  Loader2,
  Eye,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  useGetAuctionsQuery,
  useWithdrawBidMutation,
} from "@/store/api/auctionsApi";
import { useAuth } from "@/store/hooks/useAuth";
import {
  formatCurrency,
  timeFormat,
  getStatusBadgeVariant,
} from "@/lib/helperFun";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/usePagination";
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/lib/routes";
import CustomTooltip from "@/components/common/CustomTooltip";
import EmptyState from "@/components/common/EmptyState";

const ClientAuctionsPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | boolean>("all");
  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  // Build query params
  const queryParams = useMemo(() => {
    const params: AuctionFilters = {
      skip: (page - 1) * size,
      limit: size,
    };

    if (statusFilter !== "all") {
      params.is_active = statusFilter === true;
    }

    if (searchTerm) {
      // Search by listing title if listing info is available
      // Note: Backend doesn't support search, but we can filter client-side if needed
    }

    return params;
  }, [page, size, statusFilter, searchTerm]);

  const {
    data: auctionsData,
    isLoading,
    error,
    refetch,
  } = useGetAuctionsQuery(queryParams);

  const [withdrawBid, { isLoading: isWithdrawing }] = useWithdrawBidMutation();

  // Normalize data - handle both paginated and array responses
  const auctions = useMemo(() => {
    if (!auctionsData) return [];
    if (Array.isArray(auctionsData)) return auctionsData;
    return auctionsData.items || [];
  }, [auctionsData]);

  const pagination = useMemo(() => {
    if (!auctionsData || Array.isArray(auctionsData)) return undefined;
    return auctionsData.pagination;
  }, [auctionsData]);

  // Define table columns
  const columns: ColumnDef<Auction>[] = useMemo(() => {
    // Get auction status helper
    const getAuctionStatus = (auction: Auction) => {
      const now = new Date();
      const startsAt = new Date(auction.starts_at);
      const endsAt = new Date(auction.ends_at);

      if (!auction.is_active) {
        return { status: "ended", label: t("auctions.status.ended") };
      }
      if (now < startsAt) {
        return { status: "upcoming", label: t("auctions.status.upcoming") };
      }
      if (now >= startsAt && now <= endsAt) {
        return { status: "active", label: t("auctions.status.active") };
      }
      return { status: "ended", label: t("auctions.status.ended") };
    };

    return [
      {
        id: "listing",
        accessorKey: "listing",
        header: t("auctions.table.listing"),
        cell: ({ row }) => {
          const listing = row.listing;
          if (!listing) {
            return (
              <span className="text-muted-foreground">
                {t("auctions.table.listing_deleted")}
              </span>
            );
          }
          return (
            <div className="flex flex-col">
              <span className="font-medium">{listing.title}</span>
              <span className="text-xs text-muted-foreground">
                {t("auctions.table.listing_id")}: #{listing.id}
              </span>
            </div>
          );
        },
      },
      {
        id: "starting_price",
        accessorKey: "starting_price",
        header: t("auctions.table.starting_price"),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {formatCurrency(row.starting_price)} USD
            </span>
          </div>
        ),
      },
      {
        id: "current_bid",
        accessorKey: "current_bid",
        header: t("auctions.table.current_bid"),
        cell: ({ row }) => {
          const currentBid = row.current_bid;
          return (
            <div className="flex items-center gap-2">
              {currentBid ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-600">
                    {formatCurrency(currentBid)} USD
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">
                  {t("auctions.table.no_bids")}
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: "bid_count",
        accessorKey: "bid_count",
        header: t("auctions.table.bid_count"),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{row.bid_count}</span>
          </div>
        ),
      },
      {
        id: "current_bidder",
        accessorKey: "current_bidder",
        header: t("auctions.table.current_bidder"),
        cell: ({ row }) => {
          const bidder = row.current_bidder;
          if (!bidder) {
            return (
              <span className="text-muted-foreground">
                {t("auctions.table.no_bidder")}
              </span>
            );
          }
          return (
            <div className="flex flex-col">
              <span className="font-medium">{bidder.username}</span>
              <span className="text-xs text-muted-foreground">
                {bidder.email}
              </span>
            </div>
          );
        },
      },
      {
        id: "ends_at",
        accessorKey: "ends_at",
        header: t("auctions.table.ends_at"),
        cell: ({ row }) => {
          const status = getAuctionStatus(row);
          const endsAt = new Date(row.ends_at);
          const now = new Date();
          const timeLeft = endsAt.getTime() - now.getTime();

          return (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {timeFormat(row.ends_at, "MM/DD/YYYY HH:mm")}
                </span>
              </div>
              {status.status === "active" && timeLeft > 0 && (
                <span className="text-xs text-muted-foreground">
                  {Math.ceil(timeLeft / (1000 * 60 * 60))}{" "}
                  {t("auctions.table.hours_left")}
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: t("auctions.table.status"),
        cell: ({ row }) => {
          const status = getAuctionStatus(row);
          return (
            <Badge
              variant={
                status.status === "active"
                  ? "default"
                  : status.status === "upcoming"
                  ? "secondary"
                  : "outline"
              }
              className={cn(
                status.status === "active" && "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
                status.status === "upcoming" && "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30"
              )}
            >
              {status.label}
            </Badge>
          );
        },
      },
    ];
  }, [t]);

  // Handle view details
  const handleViewDetails = (auctionId: number) => {
    navigate(`/client/auctions/${auctionId}`);
  };

  return (
    <div className="space-y-6">
      {/* Auctions Table */}
      <Card>
        <CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
              <CardTitle>{t("auctions.all_auctions")}</CardTitle>
              <CardDescription>
                {t("auctions.description")}{" "}
                <span className="text-xs bg-primary/10 px-2 py-1 rounded-md">
                  {pagination?.total || auctions.length}{" "}
                  {t("auctions.table.total_auctions")}
                </span>
              </CardDescription>
            </div>
            {/* Filters */}
            <div className="col-span-12 md:col-span-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex-1 w-full md:w-auto">
                  <div className="relative">
                    <Input
                      placeholder={t("auctions.search_placeholder")}
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handlePageChange(1);
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={
                      statusFilter === "all"
                        ? "all"
                        : statusFilter === true
                        ? "active"
                        : "inactive"
                    }
                    onValueChange={(value) => {
                      if (value === "all") {
                        setStatusFilter("all");
                      } else {
                        setStatusFilter(value === "active");
                      }
                      handlePageChange(1);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue
                        placeholder={t("auctions.filter_by_status")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("common.status.all")}
                      </SelectItem>
                      <SelectItem value="active">
                        {t("auctions.status.active")}
                      </SelectItem>
                      <SelectItem value="inactive">
                        {t("auctions.status.ended")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <EmptyState
              icon={<Gavel className="w-16 h-16 text-muted-foreground" />}
              title={t("auctions.error.title")}
              description={t("auctions.error.description")}
            />
          ) : (
            <DataTableWithPagination
              data={auctions}
              columns={columns}
              pagination={pagination}
              isLoading={isLoading}
              emptyMessage={t("auctions.empty.no_auctions")}
              emptyIcon={<Gavel className="w-16 h-16 text-muted-foreground" />}
              getRowId={(row) => String(row.id)}
              renderActions={(row) => (
                <div className="flex items-center gap-1 justify-center">
                  <CustomTooltip
                    content={t("auctions.actions.view")}
                    side="top"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(row.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </CustomTooltip>
                </div>
              )}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSize={size}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientAuctionsPage;
