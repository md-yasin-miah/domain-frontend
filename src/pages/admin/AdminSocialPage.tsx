import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  Share2,
  Loader2,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetSellerStatsQuery,
  useGetFollowersQuery,
  useGetSharesQuery,
  useDeleteShareMutation,
  type Share,
  type Follow,
} from "@/store/api/socialApi";
import { useLazyGetUsersQuery } from "@/store/api/userApi";
import { AsyncSearchSelect } from "@/components/common/AsyncSearchSelect";
import { ROUTES } from "@/lib/routes";
import { Link } from "react-router-dom";

const PAGE_SIZE = 15;
const SHARE_PLATFORMS = [
  "all",
  "facebook",
  "twitter",
  "linkedin",
  "email",
  "copy_link",
  "embed",
  "other",
] as const;

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function AdminSocialPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [sellerId, setSellerId] = useState<number | null>(null);
  const [sharePlatformFilter, setSharePlatformFilter] = useState<string>("all");
  const [sharePage, setSharePage] = useState(1);
  const [shareToDelete, setShareToDelete] = useState<Share | null>(null);

  const [fetchUsers] = useLazyGetUsersQuery();
  const fetchSellerOptions = useCallback(
    async (params: { search: string; skip: number; limit: number }) => {
      const res = await fetchUsers({
        search: params.search || undefined,
        skip: params.skip,
        limit: params.limit,
      }).unwrap();
      const pagination = (res as { pagination?: { total?: number; has_next?: boolean } }).pagination;
      return {
        items: res.items,
        total: pagination?.total,
        hasMore: pagination?.has_next ?? (res.items.length === params.limit),
      };
    },
    [fetchUsers]
  );

  const { data: sellerStats, isLoading: loadingStats } = useGetSellerStatsQuery(
    sellerId!,
    { skip: !sellerId || sellerId <= 0 }
  );
  const { data: followers = [], isLoading: loadingFollowers } =
    useGetFollowersQuery(
      {
        sellerId: sellerId!,
        params: { skip: 0, limit: 50 },
      },
      { skip: !sellerId || sellerId <= 0 }
    );
  const { data: shares = [], isLoading: loadingShares } = useGetSharesQuery({
    skip: (sharePage - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
    ...(sharePlatformFilter !== "all" && { share_platform: sharePlatformFilter }),
  });

  const [deleteShare] = useDeleteShareMutation();

  const handleDeleteShare = async () => {
    if (!shareToDelete) return;
    try {
      await deleteShare(shareToDelete.id).unwrap();
      toast({ title: t("admin.social.share_deleted") });
      setShareToDelete(null);
    } catch {
      toast({ title: t("common.error"), variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-7 w-7" />
          {t("admin.social.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("admin.social.description")}
        </p>
      </div>

      <Card>
        <Tabs defaultValue="stats">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stats">
                <Users className="h-4 w-4 mr-2" />
                {t("admin.social.tab_stats")}
              </TabsTrigger>
              <TabsTrigger value="shares">
                <Share2 className="h-4 w-4 mr-2" />
                {t("admin.social.tab_shares")}
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="stats">
              <div className="space-y-4">
                <div className="flex gap-2 items-end">
                  <div>
                    <Label>{t("admin.social.seller_id")}</Label>
                    <div className="mt-1">
                      <AsyncSearchSelect
                        value={sellerId ?? ""}
                        onChange={(val, _item) =>
                          setSellerId(val != null && val !== "" ? Number(val) : null)
                        }
                        fetchOptions={fetchSellerOptions}
                        getOptionLabel={(u) => u.username ?? u.email ?? String(u.id)}
                        getOptionValue={(u) => u.id}
                        placeholder={t("admin.social.select_seller")}
                        searchPlaceholder={t("admin.social.search_seller")}
                        emptyMessage={t("admin.social.no_sellers")}
                        pageSize={25}
                        triggerClassName="w-[280px]"
                      />
                    </div>
                  </div>
                </div>
                {sellerId && (
                  <>
                    {loadingStats ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : sellerStats ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              {t("admin.social.followers_count")}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {sellerStats.followers_count}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              {t("admin.social.active_listings")}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {sellerStats.active_listings_count}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              {t("admin.social.total_shares")}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {sellerStats.total_shares}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              {t("admin.social.is_following")}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {sellerStats.is_following
                                ? t("common.yes")
                                : t("common.no")}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : null}
                    <div>
                      <h4 className="font-medium mb-2">
                        {t("admin.social.followers_list", { count: (followers as Follow[]).length })}
                      </h4>
                      {loadingFollowers ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (followers as Follow[]).length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          {t("admin.social.no_followers")}
                        </p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>{t("admin.social.follower_id")}</TableHead>
                              <TableHead>{t("admin.social.seller_id")}</TableHead>
                              <TableHead>{t("admin.social.followed_at")}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(followers as Follow[]).map((f) => (
                              <TableRow key={f.id}>
                                <TableCell className="font-mono">#{f.id}</TableCell>
                                <TableCell>{f.follower_id}</TableCell>
                                <TableCell>{f.seller_id}</TableCell>
                                <TableCell>{formatDate(f.created_at)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="shares">
              <div className="flex justify-between items-center mb-4">
                <Select
                  value={sharePlatformFilter}
                  onValueChange={(v) => {
                    setSharePlatformFilter(v);
                    setSharePage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SHARE_PLATFORMS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p === "all" ? t("common.all") : p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {loadingShares ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (shares as Share[]).length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  {t("admin.social.shares_empty")}
                </p>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>{t("admin.social.listing_id")}</TableHead>
                        <TableHead>{t("admin.social.platform")}</TableHead>
                        <TableHead>{t("admin.social.method")}</TableHead>
                        <TableHead>{t("admin.social.shared_by")}</TableHead>
                        <TableHead>{t("admin.social.created_at")}</TableHead>
                        <TableHead className="w-[80px]">{t("common.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(shares as Share[]).map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-mono">#{s.id}</TableCell>
                          <TableCell>
                            <Link
                              to={ROUTES.ADMIN.LISTINGS_MANAGEMENT + "/view/" + s.listing_id}
                              className="text-primary hover:underline"
                            >
                              #{s.listing_id}
                            </Link>
                          </TableCell>
                          <TableCell>{s.share_platform}</TableCell>
                          <TableCell>{s.share_method}</TableCell>
                          <TableCell>{s.shared_by_id ?? "—"}</TableCell>
                          <TableCell>{formatDate(s.created_at)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => setShareToDelete(s)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {(shares as Share[]).length >= PAGE_SIZE && (
                    <div className="flex justify-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={sharePage <= 1}
                        onClick={() => setSharePage((p) => p - 1)}
                      >
                        {t("common.previous")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSharePage((p) => p + 1)}
                      >
                        {t("common.next")}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <AlertDialog
        open={!!shareToDelete}
        onOpenChange={(open) => !open && setShareToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.social.delete_share_confirm_title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.social.delete_share_confirm_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteShare}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("admin.social.delete_share")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
