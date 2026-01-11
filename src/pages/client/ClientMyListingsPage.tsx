import { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  ExternalLink,
  Copy,
  Download,
  Plus,
} from "lucide-react";
import {
  useGetProductVerificationsQuery,
  type ProductVerification,
} from "@/store/api/verificationApi";
import {
  getStatusColor,
  getStatusBadgeVariant,
  timeFormat,
} from "@/lib/helperFun";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type VerificationStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "expired"
  | "all";
type ProductType = "domain" | "website" | "all";

const ClientMyListingsPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<VerificationStatus>("all");
  const [productTypeFilter, setProductTypeFilter] =
    useState<ProductType>("all");
  const [selectedVerification, setSelectedVerification] =
    useState<ProductVerification | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const {
    data: verifications,
    isLoading,
    error,
  } = useGetProductVerificationsQuery({});

  // Filter verifications
  const filteredVerifications = useMemo(() => {
    if (!verifications) return [];

    return verifications.filter((verification) => {
      // Status filter
      if (statusFilter !== "all" && verification.status !== statusFilter) {
        return false;
      }

      // Product type filter
      if (
        productTypeFilter !== "all" &&
        verification.product_type !== productTypeFilter
      ) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const domainName = verification.domain_name?.toLowerCase() || "";
        const websiteUrl = verification.website_url?.toLowerCase() || "";
        const verificationCode =
          verification.verification_code?.toLowerCase() || "";

        if (
          !domainName.includes(searchLower) &&
          !websiteUrl.includes(searchLower) &&
          !verificationCode.includes(searchLower)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [verifications, statusFilter, productTypeFilter, searchTerm]);

  // Get status counts
  const statusCounts = useMemo(() => {
    if (!verifications)
      return { pending: 0, verified: 0, rejected: 0, expired: 0 };

    return {
      pending: verifications.filter((v) => v.status === "pending").length,
      verified: verifications.filter((v) => v.status === "verified").length,
      rejected: verifications.filter((v) => v.status === "rejected").length,
      expired: verifications.filter((v) => v.status === "expired").length,
    };
  }, [verifications]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "expired":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    return t(`my_listings.status.${status}`) || status;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t("common.copied") || "Copied",
      description: `${label} ${
        t("common.copied_to_clipboard") || "copied to clipboard"
      }`,
    });
  };

  const handleViewDetails = (verification: ProductVerification) => {
    setSelectedVerification(verification);
    setDetailDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertTriangle className="w-16 h-16 text-destructive" />
          <div>
            <h3 className="text-lg font-semibold">
              {t("my_listings.error.title") || "Error loading listings"}
            </h3>
            <p className="text-muted-foreground">
              {t("my_listings.error.description") ||
                "Failed to load your listings. Please try again later."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            {t("nav.myListings") || "My Listings"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("my_listings.subtitle") ||
              "Manage and track your product verifications"}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          {t("my_listings.create_verification")}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={
                  t("my_listings.search_placeholder") ||
                  "Search by domain, URL, or verification code..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as VerificationStatus)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={
                    t("my_listings.filter_by_status") || "Filter by status"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("my_listings.status.all") || "All Status"} (
                  {verifications?.length || 0})
                </SelectItem>
                <SelectItem value="pending">
                  {t("my_listings.status.pending") || "Pending"} (
                  {statusCounts.pending})
                </SelectItem>
                <SelectItem value="verified">
                  {t("my_listings.status.verified") || "Verified"} (
                  {statusCounts.verified})
                </SelectItem>
                <SelectItem value="rejected">
                  {t("my_listings.status.rejected") || "Rejected"} (
                  {statusCounts.rejected})
                </SelectItem>
                <SelectItem value="expired">
                  {t("my_listings.status.expired") || "Expired"} (
                  {statusCounts.expired})
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={productTypeFilter}
              onValueChange={(value) =>
                setProductTypeFilter(value as ProductType)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={
                    t("my_listings.filter_by_type") || "Filter by type"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("my_listings.type.all") || "All Types"}
                </SelectItem>
                <SelectItem value="domain">
                  {t("nav.domains") || "Domains"}
                </SelectItem>
                <SelectItem value="website">
                  {t("nav.websites") || "Websites"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      {filteredVerifications.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t("my_listings.empty.title") || "No listings found"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm ||
                statusFilter !== "all" ||
                productTypeFilter !== "all"
                  ? t("my_listings.empty.filtered") ||
                    "No listings match your filters"
                  : t("my_listings.empty.description") ||
                    "You haven't created any listings yet."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVerifications.map((verification) => (
            <Card
              key={verification.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleViewDetails(verification)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full",
                        getStatusColor(verification.status)
                      )}
                    />
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {verification.product_type === "domain"
                          ? verification.domain_name
                            ? `${verification.domain_name}${
                                verification.domain_extension || ""
                              }`
                            : t("my_listings.unknown_domain") ||
                              "Unknown Domain"
                          : verification.website_url ||
                            t("my_listings.unknown_website") ||
                            "Unknown Website"}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {verification.product_type === "domain"
                            ? t("nav.domains") || "Domain"
                            : t("nav.websites") || "Website"}
                        </Badge>
                        <Badge
                          variant={getStatusBadgeVariant(verification.status)}
                          className={cn(
                            "text-xs flex items-center gap-1",
                            getStatusColor(verification.status)
                          )}
                        >
                          {getStatusIcon(verification.status)}
                          {getStatusLabel(verification.status)}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      {t("my_listings.verification_method") || "Method"}:
                    </span>
                    <span className="ml-2 font-medium">
                      {verification.verification_method === "dns"
                        ? "DNS"
                        : t("my_listings.file_upload") || "File Upload"}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      {t("my_listings.created_at") || "Created"}:
                    </span>
                    <span className="ml-2 font-medium">
                      {timeFormat(verification.created_at, "MM/DD/YYYY")}
                    </span>
                  </div>
                  {verification.expires_at && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        {t("my_listings.expires_at") || "Expires"}:
                      </span>
                      <span className="ml-2 font-medium">
                        {timeFormat(verification.expires_at, "MM/DD/YYYY")}
                      </span>
                    </div>
                  )}
                  {verification.verification_attempts > 0 && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        {t("my_listings.attempts") || "Attempts"}:
                      </span>
                      <span className="ml-2 font-medium">
                        {verification.verification_attempts}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedVerification && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {t("my_listings.details.title") || "Verification Details"}
                </DialogTitle>
                <DialogDescription>
                  {t("my_listings.details.description") ||
                    "View detailed information about your verification"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      {t("my_listings.details.product_type") || "Product Type"}
                    </label>
                    <p className="font-medium capitalize">
                      {selectedVerification.product_type}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      {t("my_listings.details.status") || "Status"}
                    </label>
                    <div className="mt-1">
                      <Badge
                        variant={getStatusBadgeVariant(
                          selectedVerification.status
                        )}
                        className="flex items-center gap-1 w-fit"
                      >
                        {getStatusIcon(selectedVerification.status)}
                        {getStatusLabel(selectedVerification.status)}
                      </Badge>
                    </div>
                  </div>
                  {selectedVerification.domain_name && (
                    <div>
                      <label className="text-sm text-muted-foreground">
                        {t("my_listings.details.domain") || "Domain"}
                      </label>
                      <p className="font-medium">
                        {selectedVerification.domain_name}
                        {selectedVerification.domain_extension}
                      </p>
                    </div>
                  )}
                  {selectedVerification.website_url && (
                    <div>
                      <label className="text-sm text-muted-foreground">
                        {t("my_listings.details.website_url") || "Website URL"}
                      </label>
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">
                          {selectedVerification.website_url}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(
                              selectedVerification.website_url!,
                              "_blank"
                            )
                          }
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-muted-foreground">
                      {t("my_listings.details.verification_method") ||
                        "Verification Method"}
                    </label>
                    <p className="font-medium capitalize">
                      {selectedVerification.verification_method.replace(
                        "_",
                        " "
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      {t("my_listings.details.verification_code") ||
                        "Verification Code"}
                    </label>
                    <div className="flex items-center gap-2">
                      <p className="font-medium font-mono text-sm truncate">
                        {selectedVerification.verification_code}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            selectedVerification.verification_code,
                            t("my_listings.details.verification_code") ||
                              "Verification code"
                          )
                        }
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* DNS Record Data */}
                {selectedVerification.dns_record_data && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">
                      {t("my_listings.details.dns_record") || "DNS Record"}
                    </h4>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-muted-foreground">
                              {t("my_listings.details.dns_type") || "Type"}
                            </label>
                            <p className="font-medium">
                              {selectedVerification.dns_record_data.type}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">
                              {t("my_listings.details.dns_name") || "Name/Host"}
                            </label>
                            <div className="flex items-center gap-2">
                              <p className="font-medium font-mono text-sm">
                                {selectedVerification.dns_record_data.name}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  copyToClipboard(
                                    selectedVerification.dns_record_data!.name,
                                    t("my_listings.details.dns_name") ||
                                      "DNS Name"
                                  )
                                }
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">
                              {t("my_listings.details.dns_value") || "Value"}
                            </label>
                            <div className="flex items-center gap-2">
                              <p className="font-medium font-mono text-sm break-all">
                                {selectedVerification.dns_record_data.value}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  copyToClipboard(
                                    selectedVerification.dns_record_data!.value,
                                    t("my_listings.details.dns_value") ||
                                      "DNS Value"
                                  )
                                }
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">
                              {t("my_listings.details.full_record") ||
                                "Full Record"}
                            </label>
                            <div className="flex items-center gap-2">
                              <p className="font-medium font-mono text-xs break-all bg-muted p-2 rounded">
                                {
                                  selectedVerification.dns_record_data
                                    .full_record
                                }
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  copyToClipboard(
                                    selectedVerification.dns_record_data!
                                      .full_record,
                                    t("my_listings.details.full_record") ||
                                      "Full Record"
                                  )
                                }
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          {selectedVerification.dns_record_data
                            .instructions && (
                            <div>
                              <label className="text-sm text-muted-foreground">
                                {t("my_listings.details.instructions") ||
                                  "Instructions"}
                              </label>
                              <p className="text-sm whitespace-pre-wrap mt-1">
                                {
                                  selectedVerification.dns_record_data
                                    .instructions
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* File Upload Data */}
                {selectedVerification.verification_file_data && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">
                      {t("my_listings.details.verification_file") ||
                        "Verification File"}
                    </h4>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-muted-foreground">
                              {t("my_listings.details.filename") || "Filename"}
                            </label>
                            <p className="font-medium">
                              {
                                selectedVerification.verification_file_data
                                  .filename
                              }
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">
                              {t("my_listings.details.file_url") || "File URL"}
                            </label>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">
                                {
                                  selectedVerification.verification_file_data
                                    .file_url
                                }
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  window.open(
                                    selectedVerification.verification_file_data!
                                      .file_url,
                                    "_blank"
                                  )
                                }
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          {selectedVerification.verification_file_data
                            .instructions && (
                            <div>
                              <label className="text-sm text-muted-foreground">
                                {t("my_listings.details.instructions") ||
                                  "Instructions"}
                              </label>
                              <p className="text-sm whitespace-pre-wrap mt-1">
                                {
                                  selectedVerification.verification_file_data
                                    .instructions
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      {t("my_listings.details.created_at") || "Created At"}
                    </label>
                    <p className="font-medium">
                      {timeFormat(
                        selectedVerification.created_at,
                        "MM/DD/YYYY HH:mm"
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      {t("my_listings.details.updated_at") || "Updated At"}
                    </label>
                    <p className="font-medium">
                      {timeFormat(
                        selectedVerification.updated_at,
                        "MM/DD/YYYY HH:mm"
                      )}
                    </p>
                  </div>
                  {selectedVerification.expires_at && (
                    <div>
                      <label className="text-sm text-muted-foreground">
                        {t("my_listings.details.expires_at") || "Expires At"}
                      </label>
                      <p className="font-medium">
                        {timeFormat(
                          selectedVerification.expires_at,
                          "MM/DD/YYYY HH:mm"
                        )}
                      </p>
                    </div>
                  )}
                  {selectedVerification.verified_at && (
                    <div>
                      <label className="text-sm text-muted-foreground">
                        {t("my_listings.details.verified_at") || "Verified At"}
                      </label>
                      <p className="font-medium">
                        {timeFormat(
                          selectedVerification.verified_at,
                          "MM/DD/YYYY HH:mm"
                        )}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-muted-foreground">
                      {t("my_listings.details.attempts") ||
                        "Verification Attempts"}
                    </label>
                    <p className="font-medium">
                      {selectedVerification.verification_attempts}
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDetailDialogOpen(false)}
                >
                  {t("common.close") || "Close"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientMyListingsPage;
