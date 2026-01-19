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
import EmptyState from "@/components/common/EmptyState";
import OfferDetailsSkeleton from "@/components/skeletons/OfferDetailsSkeleton";

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
    return <OfferDetailsSkeleton />;
  }

  // Error state
  if (error || !offer) {
    return (
      <EmptyState
        variant="error"
        title="Offer Not Found"
        description="The offer you're looking for doesn't exist or has been removed."
        actionLabel="Back to Offers"
        onAction={() => navigate(ROUTES.CLIENT.OFFERS.INDEX)}
      />
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

        {/* Premium Header - Subtle Design */}
        <div className="relative overflow-hidden rounded-xl bg-primary/10 border border-border/50 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50 border border-border">
                <Handshake className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight mb-1 text-foreground">
                  Offer #{offer.id}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage and review offer details
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {canAccept && (
                <Button
                  onClick={handleAccept}
                  disabled={isAccepting}
                  size="sm"
                >
                  {isAccepting ? (
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5 mr-2" />
                  )}
                  {t("offers.actions.accept")}
                </Button>
              )}
              {canReject && (
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isRejecting}
                  size="sm"
                >
                  {isRejecting ? (
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  ) : (
                    <X className="w-3.5 h-3.5 mr-2" />
                  )}
                  {t("offers.actions.reject")}
                </Button>
              )}
              {canCounter && (
                <Button
                  variant="outline"
                  onClick={() => setCounterDialogOpen(true)}
                  size="sm"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-2" />
                  {t("offers.actions.counter")}
                </Button>
              )}
              {canWithdraw && (
                <Button
                  variant="outline"
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                  size="sm"
                >
                  {isWithdrawing ? (
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                  )}
                  {t("offers.actions.withdraw")}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards - Subtle Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Offer Amount</p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatCurrency(offer.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{offer.currency}</p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Listing Price</p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatCurrency(offer.listing?.price || 0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{offer.listing?.currency || "USD"}</p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Difference</p>
                  <p className={cn(
                    "text-xl font-semibold",
                    priceDifference >= 0 ? "text-foreground" : "text-foreground"
                  )}>
                    {priceDifference >= 0 ? "+" : ""}{priceDifference.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {priceDifference >= 0 ? "Above" : "Below"} listing price
                  </p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge
                    variant={getStatusBadgeVariant(offer.status)}
                    className={cn(
                      "capitalize text-xs font-medium px-2 py-0.5 mt-1",
                      getStatusColor(offer.status),
                      "text-white border-0"
                    )}
                  >
                    {getStatusLabel(offer.status)}
                  </Badge>
                </div>
                <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Offer Information - Clean Design */}
            <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border bg-secondary/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                    <Handshake className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Offer Information</CardTitle>
                    <CardDescription className="text-xs">Complete details about this offer</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Listing Info */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        Listing
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {offer.listing?.title || "N/A"}
                    </p>
                    {offer.listing_id && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ID: #{offer.listing_id}
                      </p>
                    )}
                  </div>

                  {/* Buyer Info */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        Buyer
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {offer.buyer?.username || offer.buyer?.email || "N/A"}
                    </p>
                    {offer.buyer?.email && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {offer.buyer.email}
                      </p>
                    )}
                  </div>

                  {/* Expires At */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        Expires At
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {offer.expires_at
                        ? timeFormat(offer.expires_at, "MMM DD, YYYY")
                        : t("offers.table.no_expiry")}
                    </p>
                    {offer.expires_at && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {timeFormat(offer.expires_at, "HH:mm")}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        Status
                      </label>
                    </div>
                    <Badge
                      variant={getStatusBadgeVariant(offer.status)}
                      className={cn(
                        "capitalize text-xs font-medium px-2 py-0.5",
                        getStatusColor(offer.status),
                        "text-white border-0"
                      )}
                    >
                      {getStatusLabel(offer.status)}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-3" />

                {/* Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        Created At
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {timeFormat(offer.created_at, "MMM DD, YYYY")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {timeFormat(offer.created_at, "HH:mm")}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        Updated At
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {timeFormat(offer.updated_at, "MMM DD, YYYY")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {timeFormat(offer.updated_at, "HH:mm")}
                    </p>
                  </div>
                </div>

                {/* Message Card */}
                {offer.message && (
                  <>
                    <Separator className="my-3" />
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                        <label className="text-xs font-medium text-muted-foreground">
                          Message
                        </label>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg border border-border">
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
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
            {/* Quick Actions - Clean Design */}
            <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border bg-secondary/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {offer.listing && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() =>
                      navigate(`/marketplace/${offer.listing?.slug}`)
                    }
                    size="sm"
                  >
                    <Package className="w-3.5 h-3.5 mr-2" />
                    View Listing
                    <ExternalLink className="w-3.5 h-3.5 ml-auto" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(ROUTES.CLIENT.CHAT.ROOT)}
                  size="sm"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-2" />
                  Open Chat
                  <ExternalLink className="w-3.5 h-3.5 ml-auto" />
                </Button>
              </CardContent>
            </Card>

            {/* Offer Summary - Clean Design */}
            <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border bg-secondary/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg font-semibold">Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/30 border border-border">
                  <span className="text-xs font-medium text-muted-foreground">Offer ID:</span>
                  <span className="text-sm font-semibold text-foreground">#{offer.id}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/30 border border-border">
                  <span className="text-xs font-medium text-muted-foreground">Status:</span>
                  <Badge
                    variant={getStatusBadgeVariant(offer.status)}
                    className={cn(
                      "capitalize text-xs font-medium px-2 py-0.5",
                      getStatusColor(offer.status),
                      "text-white border-0"
                    )}
                  >
                    {getStatusLabel(offer.status)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/30 border border-border">
                  <span className="text-xs font-medium text-muted-foreground">Amount:</span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrency(offer.amount)}
                  </span>
                </div>
                {offer.expires_at && (
                  <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/30 border border-border">
                    <span className="text-xs font-medium text-muted-foreground">Expires:</span>
                    <span className="text-sm font-semibold text-foreground">
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

