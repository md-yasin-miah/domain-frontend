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
  CheckCircle,
} from "lucide-react";
import {
  useGetProductVerificationsQuery,
  useCreateProductVerificationMutation,
  useVerifyProductVerificationMutation,
} from "@/store/api/productVerification";
import {
  useGetMarketplaceListingTypesQuery,
  type ListingType,
} from "@/store/api/marketplaceApi";
import { Label } from "@/components/ui/label";
import {
  getStatusColor,
  getStatusBadgeVariant,
  timeFormat,
  getStatusLabel,
} from "@/lib/helperFun";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import StatusIcon from "@/components/common/StatusIcon";
import { ROUTES } from "@/lib/routes";

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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<VerificationStatus>("all");
  const [productTypeFilter, setProductTypeFilter] =
    useState<ProductType>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ProductVerificationCreateRequest>({
    product_type: "",
    domain_name: "",
    domain_extension: "",
    website_url: "",
  });

  const {
    data: verifications,
    isLoading,
    error,
    refetch,
  } = useGetProductVerificationsQuery({});
  const { data: listingTypes, isLoading: listingTypesLoading } =
    useGetMarketplaceListingTypesQuery();
  const [createVerification, { isLoading: isCreating }] =
    useCreateProductVerificationMutation();

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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t("common.copied") || "Copied",
      description: `${label} ${t("common.copied_to_clipboard") || "copied to clipboard"
        }`,
    });
  };

  const handleViewDetails = (verification: ProductVerification) => {
    navigate(ROUTES.CLIENT.MARKETPLACE.LISTING_DETAILS(verification.id));
  };

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
    setFormData({
      product_type: "",
      domain_name: "",
      domain_extension: "",
      website_url: "",
    });
  };

  const handleFormChange = (
    field: keyof ProductVerificationCreateRequest,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.product_type) {
        toast({
          title: t("my_listings.create.error.title") || "Validation Error",
          description:
            t("my_listings.create.error.product_type_required") ||
            "Product type is required",
          variant: "destructive",
        });
        return;
      }

      // Validate domain fields if product type is domain
      const selectedType = listingTypes?.find(
        (type) => type.slug === formData.product_type
      );
      const isDomainType =
        selectedType?.slug === "domain" || formData.product_type === "domain";

      if (isDomainType) {
        if (!formData.domain_name) {
          toast({
            title: t("my_listings.create.error.title") || "Validation Error",
            description:
              t("my_listings.create.error.domain_name_required") ||
              "Domain name is required",
            variant: "destructive",
          });
          return;
        }
      } else {
        // For website type
        if (!formData.website_url) {
          toast({
            title: t("my_listings.create.error.title") || "Validation Error",
            description:
              t("my_listings.create.error.website_url_required") ||
              "Website URL is required",
            variant: "destructive",
          });
          return;
        }
      }

      const response = await createVerification(formData).unwrap();
      toast({
        title: t("my_listings.create.success.title") || "Success",
        description:
          t("my_listings.create.success.description") ||
          "Product verification created successfully",
      });
      setCreateDialogOpen(false);
      refetch();
      // Navigate to details page
      if (response?.id) {
        navigate(ROUTES.CLIENT.MARKETPLACE.LISTING_DETAILS(response.id));
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast({
        title: t("my_listings.create.error.title") || "Error",
        description:
          errorMessage ||
          t("my_listings.create.error.description") ||
          "Failed to create product verification",
        variant: "destructive",
      });
    }
  };

  const selectedListingType = listingTypes?.find(
    (type) => type.slug === formData.product_type
  );
  const isDomainType =
    selectedListingType?.slug === "domain" ||
    formData.product_type === "domain";
  const isWebsiteType =
    selectedListingType?.slug === "website" ||
    formData.product_type === "website";

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
        <Button onClick={handleCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
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
                  {t("common.status.all") || "All Status"} (
                  {verifications?.length || 0})
                </SelectItem>
                <SelectItem value="pending">
                  {t("common.status.pending") || "Pending"} (
                  {statusCounts.pending})
                </SelectItem>
                <SelectItem value="verified">
                  {t("common.status.verified") || "Verified"} (
                  {statusCounts.verified})
                </SelectItem>
                <SelectItem value="rejected">
                  {t("common.status.rejected") || "Rejected"} (
                  {statusCounts.rejected})
                </SelectItem>
                <SelectItem value="expired">
                  {t("common.status.expired") || "Expired"} (
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
                            ? `${verification.domain_name}${verification.domain_extension || ""
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
                          <StatusIcon status={verification.status} />
                          {getStatusLabel(verification.status, t)}
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


      {/* Create Verification Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {t("my_listings.create.title") || "Create Product Verification"}
            </DialogTitle>
            <DialogDescription>
              {t("my_listings.create.description") ||
                "Create a new product verification to list your domain or website"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Product Type */}
            <div className="space-y-2">
              <Label htmlFor="product_type">
                {t("my_listings.create.product_type") || "Product Type"} *
              </Label>
              <Select
                value={formData.product_type}
                onValueChange={(value) =>
                  handleFormChange("product_type", value)
                }
                disabled={listingTypesLoading}
              >
                <SelectTrigger id="product_type">
                  <SelectValue
                    placeholder={
                      listingTypesLoading
                        ? t("common.loading") || "Loading..."
                        : t("my_listings.create.select_product_type") ||
                        "Select product type"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {listingTypes
                    ?.filter((type) => type.is_active)
                    .map((type) => (
                      <SelectItem key={type.id} value={type.slug}>
                        {type.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {selectedListingType && (
                <p className="text-sm text-muted-foreground">
                  {selectedListingType.description}
                </p>
              )}
            </div>

            {/* Domain Fields */}
            {isDomainType && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="domain_name">
                    {t("my_listings.create.domain_name") || "Domain Name"} *
                  </Label>
                  <Input
                    id="domain_name"
                    placeholder="example"
                    value={formData.domain_name || ""}
                    onChange={(e) =>
                      handleFormChange("domain_name", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain_extension">
                    {t("my_listings.create.domain_extension") ||
                      "Domain Extension"}
                  </Label>
                  <Input
                    id="domain_extension"
                    placeholder=".com"
                    value={formData.domain_extension || ""}
                    onChange={(e) =>
                      handleFormChange("domain_extension", e.target.value)
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    {t("my_listings.create.domain_extension_hint") ||
                      "Include the dot (e.g., .com, .io, .net)"}
                  </p>
                </div>
              </>
            )}

            {/* Website Field */}
            {isWebsiteType && (
              <div className="space-y-2">
                <Label htmlFor="website_url">
                  {t("my_listings.create.website_url") || "Website URL"} *
                </Label>
                <Input
                  id="website_url"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.website_url || ""}
                  onChange={(e) =>
                    handleFormChange("website_url", e.target.value)
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {t("my_listings.create.website_url_hint") ||
                    "Enter the full URL including https://"}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              disabled={isCreating}
            >
              {t("common.cancel") || "Cancel"}
            </Button>
            <Button onClick={handleCreateSubmit} disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("my_listings.create.creating") || "Creating..."}
                </>
              ) : (
                t("my_listings.create.submit") || "Create Verification"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientMyListingsPage;
