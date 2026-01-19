import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Package,
  User,
  Calendar,
  DollarSign,
  FileText,
  Loader2,
  Check,
  X,
  RotateCcw,
  Trash2,
  AlertCircle,
  Clock,
  Handshake,
  TrendingUp,
  Sparkles,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import {
  useGetOfferQuery,
  useAcceptOfferMutation,
  useRejectOfferMutation,
  useCounterOfferMutation,
  useWithdrawOfferMutation,
} from "@/store/api/offersApi";
import { useAuth } from "@/store/hooks/useAuth";
import {
  formatCurrency,
  timeFormat,
  getStatusColor,
  getStatusBadgeVariant,
} from "@/lib/helperFun";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

const OfferDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const offerId = id ? parseInt(id, 10) : 0;
  const {
    data: offer,
    isLoading,
    error,
    refetch,
  } = useGetOfferQuery(offerId, {
    skip: !offerId || isNaN(offerId),
  });

  const [acceptOffer, { isLoading: isAccepting }] = useAcceptOfferMutation();
  const [rejectOffer, { isLoading: isRejecting }] = useRejectOfferMutation();
  const [counterOffer, { isLoading: isCountering }] = useCounterOfferMutation();
  const [withdrawOffer, { isLoading: isWithdrawing }] =
    useWithdrawOfferMutation();

  const [counterDialogOpen, setCounterDialogOpen] = useState(false);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterMessage, setCounterMessage] = useState("");

  // Get status label
  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status;
  };

  // Handle accept offer
  const handleAccept = async () => {
    if (!offer) return;

    try {
      await acceptOffer(offer.id).unwrap();
      toast({
        title: t("offers.actions.accept_success"),
        description: t("offers.actions.accept_success_desc"),
      });
      refetch();
    } catch (error) {
      toast({
        title: t("offers.actions.accept_error"),
        description: t("offers.actions.accept_error_desc"),
        variant: "destructive",
      });
    }
  };

  // Handle reject offer
  const handleReject = async () => {
    if (!offer) return;

    try {
      await rejectOffer(offer.id).unwrap();
      toast({
        title: t("offers.actions.reject_success"),
        description: t("offers.actions.reject_success_desc"),
      });
      refetch();
    } catch (error) {
      toast({
        title: error?.data?.detail || t("offers.actions.reject_error"),
        description: t("offers.actions.reject_error_desc"),
        variant: "destructive",
      });
    }
  };

  // Handle counter offer
  const handleCounter = async () => {
    if (!offer || !counterAmount) {
      toast({
        title: t("offers.actions.counter_error"),
        description: t("offers.actions.counter_error_desc"),
        variant: "destructive",
      });
      return;
    }

    try {
      await counterOffer({
        id: offer.id,
        data: {
          amount: parseFloat(counterAmount),
          message: counterMessage || undefined,
        },
      }).unwrap();
      toast({
        title: t("offers.actions.counter_success"),
        description: t("offers.actions.counter_success_desc"),
      });
      setCounterDialogOpen(false);
      setCounterAmount("");
      setCounterMessage("");
      refetch();
    } catch (error) {
      toast({
        title: error?.data?.detail || t("offers.actions.counter_error"),
        description: t("offers.actions.counter_error_desc"),
        variant: "destructive",
      });
    }
  };

  // Handle withdraw offer
  const handleWithdraw = async () => {
    if (!offer) return;

    try {
      await withdrawOffer(offer.id).unwrap();
      toast({
        title: t("offers.actions.withdraw_success"),
        description: t("offers.actions.withdraw_success_desc"),
      });
      refetch();
    } catch (error) {
      toast({
        title: error?.data?.detail || t("offers.actions.withdraw_error"),
        description: t("offers.actions.withdraw_error_desc"),
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !offer) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Offer Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The offer you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate(ROUTES.CLIENT.OFFERS.INDEX)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Offers
        </Button>
      </div>
    );
  }

  const canAccept = offer.status === "pending";
  const canReject = offer.status === "pending";
  const canCounter = offer.status === "pending";
  const canWithdraw = offer.status === "pending";

  // Calculate difference percentage
  const priceDifference = offer.listing?.price
    ? ((offer.amount - offer.listing.price) / offer.listing.price) * 100
    : 0;

  return (
    <div className="min-h-screen">
      <div className="space-y-6 p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.CLIENT.OFFERS.INDEX}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Offers
          </Link>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            Offer #{offer.id}
          </span>
        </div>

        {/* Premium Header with Transparent Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/30 via-primary/20 to-secondary/30 backdrop-blur-md p-8 text-foreground shadow-xl border border-primary/20">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
              }}
            />
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 backdrop-blur-sm shadow-lg border border-primary/30">
                <Handshake className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight mb-2 text-foreground">
                  Offer #{offer.id}
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage and review offer details
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {canAccept && (
                <Button
                  onClick={handleAccept}
                  disabled={isAccepting}
                  className="bg-primary/90 text-primary-foreground hover:bg-primary shadow-lg hover:shadow-xl transition-all backdrop-blur-sm"
                >
                  {isAccepting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {t("offers.actions.accept")}
                </Button>
              )}
              {canReject && (
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isRejecting}
                  className="bg-destructive/80 text-destructive-foreground border-destructive/30 hover:bg-destructive/90 backdrop-blur-sm"
                >
                  {isRejecting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <X className="w-4 h-4 mr-2" />
                  )}
                  {t("offers.actions.reject")}
                </Button>
              )}
              {canCounter && (
                <Button
                  variant="outline"
                  onClick={() => setCounterDialogOpen(true)}
                  className="bg-background/60 text-foreground border-primary/30 hover:bg-background/80 backdrop-blur-sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t("offers.actions.counter")}
                </Button>
              )}
              {canWithdraw && (
                <Button
                  variant="outline"
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                  className="bg-background/60 text-foreground border-primary/30 hover:bg-background/80 backdrop-blur-sm"
                >
                  {isWithdrawing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  {t("offers.actions.withdraw")}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards - Colorful Dashboard Style with Transparency */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-500/20 via-blue-600/15 to-blue-700/10 backdrop-blur-md text-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">Offer Amount</p>
                  <p className="text-3xl font-black text-blue-900 dark:text-blue-100">
                    {formatCurrency(offer.amount)}
                  </p>
                  <p className="text-blue-600/80 dark:text-blue-400/80 text-xs mt-1">{offer.currency}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/20 backdrop-blur-sm flex items-center justify-center border border-blue-300/30 dark:border-blue-700/30">
                  <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-500/20 via-purple-600/15 to-purple-700/10 backdrop-blur-md text-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-1">Listing Price</p>
                  <p className="text-3xl font-black text-purple-900 dark:text-purple-100">
                    {formatCurrency(offer.listing?.price || 0)}
                  </p>
                  <p className="text-purple-600/80 dark:text-purple-400/80 text-xs mt-1">{offer.listing?.currency || "USD"}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-purple-500/20 backdrop-blur-sm flex items-center justify-center border border-purple-300/30 dark:border-purple-700/30">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-emerald-200/50 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-500/20 via-emerald-600/15 to-emerald-700/10 backdrop-blur-md text-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-1">Difference</p>
                  <p className={cn(
                    "text-3xl font-black",
                    priceDifference >= 0
                      ? "text-emerald-900 dark:text-emerald-100"
                      : "text-amber-900 dark:text-amber-100"
                  )}>
                    {priceDifference >= 0 ? "+" : ""}{priceDifference.toFixed(1)}%
                  </p>
                  <p className="text-emerald-600/80 dark:text-emerald-400/80 text-xs mt-1">
                    {priceDifference >= 0 ? "Above" : "Below"} listing price
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center border border-emerald-300/30 dark:border-emerald-700/30">
                  <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-amber-200/50 dark:border-amber-800/50 bg-gradient-to-br from-amber-500/20 via-amber-600/15 to-amber-700/10 backdrop-blur-md text-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 dark:text-amber-400 text-sm font-medium mb-1">Status</p>
                  <Badge
                    variant={getStatusBadgeVariant(offer.status)}
                    className={cn(
                      "capitalize text-sm font-bold px-3 py-1 mt-2",
                      getStatusColor(offer.status),
                      "text-white border-0"
                    )}
                  >
                    {getStatusLabel(offer.status)}
                  </Badge>
                </div>
                <div className="h-12 w-12 rounded-xl bg-amber-500/20 backdrop-blur-sm flex items-center justify-center border border-amber-300/30 dark:border-amber-700/30">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Offer Information - Premium Card */}
            <Card className="border border-primary/10 shadow-xl bg-gradient-to-br from-card/80 via-card/60 to-muted/20 backdrop-blur-md">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-primary/20 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 backdrop-blur-sm flex items-center justify-center border border-primary/20">
                    <Handshake className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Offer Information</CardTitle>
                    <CardDescription className="text-base">Complete details about this offer</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Listing Info Card */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/20 backdrop-blur-sm flex items-center justify-center border border-blue-300/30 dark:border-blue-700/30">
                        <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                          Listing
                        </label>
                        <p className="font-bold text-lg text-blue-900 dark:text-blue-100">
                          {offer.listing?.title || "N/A"}
                        </p>
                      </div>
                    </div>
                    {offer.listing_id && (
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        ID: #{offer.listing_id}
                      </p>
                    )}
                  </div>

                  {/* Buyer Info Card */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200/50 dark:border-purple-800/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-500/20 backdrop-blur-sm flex items-center justify-center border border-purple-300/30 dark:border-purple-700/30">
                        <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                          Buyer
                        </label>
                        <p className="font-bold text-lg text-purple-900 dark:text-purple-100">
                          {offer.buyer?.username || offer.buyer?.email || "N/A"}
                        </p>
                      </div>
                    </div>
                    {offer.buyer?.email && (
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                        {offer.buyer.email}
                      </p>
                    )}
                  </div>

                  {/* Expires At Card */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200/50 dark:border-amber-800/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-amber-500/20 backdrop-blur-sm flex items-center justify-center border border-amber-300/30 dark:border-amber-700/30">
                        <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                          Expires At
                        </label>
                        <p className="font-bold text-lg text-amber-900 dark:text-amber-100">
                          {offer.expires_at
                            ? timeFormat(offer.expires_at, "MMM DD, YYYY")
                            : t("offers.table.no_expiry")}
                        </p>
                      </div>
                    </div>
                    {offer.expires_at && (
                      <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                        {timeFormat(offer.expires_at, "HH:mm")}
                      </p>
                    )}
                  </div>

                  {/* Status Card */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center border border-emerald-300/30 dark:border-emerald-700/30">
                        <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                          Status
                        </label>
                        <div className="mt-1">
                          <Badge
                            variant={getStatusBadgeVariant(offer.status)}
                            className={cn(
                              "capitalize text-sm font-bold px-3 py-1",
                              getStatusColor(offer.status),
                              "text-white border-0"
                            )}
                          >
                            {getStatusLabel(offer.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 dark:from-indigo-950/30 dark:to-indigo-900/20 border border-indigo-200/50 dark:border-indigo-800/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      <label className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                        Created At
                      </label>
                    </div>
                    <p className="font-bold text-lg text-indigo-900 dark:text-indigo-100">
                      {timeFormat(offer.created_at, "MMM DD, YYYY")}
                    </p>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                      {timeFormat(offer.created_at, "HH:mm")}
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-600/5 dark:from-rose-950/30 dark:to-rose-900/20 border border-rose-200/50 dark:border-rose-800/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                      <label className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                        Updated At
                      </label>
                    </div>
                    <p className="font-bold text-lg text-rose-900 dark:text-rose-100">
                      {timeFormat(offer.updated_at, "MMM DD, YYYY")}
                    </p>
                    <p className="text-sm text-rose-600 dark:text-rose-400 font-medium mt-1">
                      {timeFormat(offer.updated_at, "HH:mm")}
                    </p>
                  </div>
                </div>

                {/* Message Card */}
                {offer.message && (
                  <>
                    <Separator className="my-6" />
                    <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 dark:from-cyan-950/30 dark:to-cyan-900/20 border border-cyan-200/50 dark:border-cyan-800/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-cyan-500/20 backdrop-blur-sm flex items-center justify-center border border-cyan-300/30 dark:border-cyan-700/30">
                          <MessageSquare className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <label className="text-sm font-semibold text-cyan-700 dark:text-cyan-300 uppercase tracking-wide">
                          Message
                        </label>
                      </div>
                      <div className="p-4 bg-cyan-500/5 dark:bg-cyan-950/20 rounded-lg backdrop-blur-sm border border-cyan-200/50 dark:border-cyan-800/50">
                        <p className="whitespace-pre-wrap text-cyan-900 dark:text-cyan-100 leading-relaxed">
                          {offer.message}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions - Premium Card with Transparency */}
            <Card className="border border-violet-200/50 dark:border-violet-800/50 shadow-xl bg-gradient-to-br from-violet-500/20 via-violet-600/15 to-purple-700/10 backdrop-blur-md">
              <CardHeader className="border-b border-violet-200/30 dark:border-violet-800/30">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-violet-500/20 backdrop-blur-sm flex items-center justify-center border border-violet-300/30 dark:border-violet-700/30">
                    <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <CardTitle className="text-foreground">Quick Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {offer.listing && (
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-violet-500/10 hover:bg-violet-500/20 text-foreground border-violet-200/50 dark:border-violet-800/50 backdrop-blur-sm transition-all"
                    onClick={() =>
                      navigate(`/marketplace/${offer.listing?.slug}`)
                    }
                  >
                    <Package className="w-4 h-4 mr-2" />
                    View Listing
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start bg-violet-500/10 hover:bg-violet-500/20 text-foreground border-violet-200/50 dark:border-violet-800/50 backdrop-blur-sm transition-all"
                  onClick={() => navigate(ROUTES.CLIENT.CHAT.ROOT)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Open Chat
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </Button>
              </CardContent>
            </Card>

            {/* Offer Summary - Premium Card */}
            <Card className="border border-primary/10 shadow-xl bg-gradient-to-br from-card/80 via-card/60 to-muted/20 backdrop-blur-md">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-primary/20 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 backdrop-blur-sm flex items-center justify-center border border-primary/20">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/5 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Offer ID:</span>
                  <span className="font-black text-lg text-blue-900 dark:text-blue-100">#{offer.id}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-600/5 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200/50 dark:border-purple-800/50 backdrop-blur-sm">
                  <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Status:</span>
                  <Badge
                    variant={getStatusBadgeVariant(offer.status)}
                    className={cn(
                      "capitalize font-bold",
                      getStatusColor(offer.status),
                      "text-white border-0"
                    )}
                  >
                    {getStatusLabel(offer.status)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-sm">
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Amount:</span>
                  <span className="font-black text-lg text-emerald-900 dark:text-emerald-100">
                    {formatCurrency(offer.amount)}
                  </span>
                </div>
                {offer.expires_at && (
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-amber-600/5 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200/50 dark:border-amber-800/50 backdrop-blur-sm">
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">Expires:</span>
                    <span className="font-bold text-amber-900 dark:text-amber-100">
                      {timeFormat(offer.expires_at, "MMM DD, YYYY")}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Counter Offer Dialog */}
        <Dialog
          open={counterDialogOpen}
          onOpenChange={(open) => {
            setCounterDialogOpen(open);
            if (!open) {
              setCounterAmount("");
              setCounterMessage("");
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t("offers.actions.counter_dialog.title")}
              </DialogTitle>
              <DialogDescription>
                {t("offers.actions.counter_dialog.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("offers.actions.counter_dialog.amount")}
                </label>
                <Input
                  type="number"
                  placeholder={t(
                    "offers.actions.counter_dialog.amount_placeholder"
                  )}
                  value={counterAmount}
                  onChange={(e) => setCounterAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("offers.actions.counter_dialog.message")}
                </label>
                <Textarea
                  placeholder={t(
                    "offers.actions.counter_dialog.message_placeholder"
                  )}
                  value={counterMessage}
                  onChange={(e) => setCounterMessage(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCounterDialogOpen(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={handleCounter}
                disabled={isCountering || !counterAmount}
              >
                {isCountering ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t("offers.actions.countering")}
                  </>
                ) : (
                  t("offers.actions.counter_submit")
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OfferDetails;

