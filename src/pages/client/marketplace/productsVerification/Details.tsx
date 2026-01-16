import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Download,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  useGetProductVerificationsQuery,
  useVerifyProductVerificationMutation,
} from "@/store/api/productVerification";
import {
  getStatusColor,
  getStatusBadgeVariant,
  timeFormat,
  getStatusLabel,
} from "@/lib/helperFun";
import { useToast } from "@/hooks/use-toast";
import StatusIcon from "@/components/common/StatusIcon";
import { ROUTES } from "@/lib/routes";

const DetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();

  const verificationId = id ? parseInt(id, 10) : 0;

  const {
    data: verifications,
    isLoading,
    error,
    refetch,
  } = useGetProductVerificationsQuery({});

  const [verifyVerification, { isLoading: isVerifying }] =
    useVerifyProductVerificationMutation();

  const verification = verifications?.find((v) => v.id === verificationId);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t("common.copied") || "Copied",
      description: `${label} ${t("common.copied_to_clipboard") || "copied to clipboard"
        }`,
    });
  };

  const handleVerifyProduct = async () => {
    if (!verification) return;

    try {
      const response = await verifyVerification(verification.id).unwrap();

      if (response.is_verified) {
        toast({
          title:
            t("productsVerification.verify.success.title") || "Verification Successful",
          description:
            t("productsVerification.verify.success.description") ||
            "Your product has been successfully verified!",
        });
      } else {
        toast({
          title: t("productsVerification.verify.failed.title") || "Verification Failed",
          description:
            response.message ||
            t("productsVerification.verify.failed.description") ||
            "Verification failed. Please check your DNS record or file upload.",
          variant: "destructive",
        });
      }

      // Refetch the list to update all verifications
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;

      toast({
        title: t("productsVerification.verify.error.title") || "Error",
        description:
          errorMessage ||
          t("productsVerification.verify.error.description") ||
          "Failed to verify product. Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">
              {t("productsVerification.loading") || "Loading..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !verification) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                {t("productsVerification.details.not_found") || "Verification Not Found"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("productsVerification.details.not_found_desc") ||
                  "The verification you're looking for doesn't exist or has been removed."}
              </p>
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.CLIENT.MARKETPLACE.PRODUCTS_VERIFICATION)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("common.back_to_listings") || "Back to Listings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(ROUTES.CLIENT.MARKETPLACE.PRODUCTS_VERIFICATION)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("common.back") || "Back"}
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {t("productsVerification.details.title") || "Verification Details"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("productsVerification.details.description") ||
                "View detailed information about your verification"}
            </p>
          </div>
          <Badge
            variant={getStatusBadgeVariant(verification.status)}
            className={`flex items-center gap-1 w-fit ${getStatusColor(
              verification.status
            )}`}
          >
            <StatusIcon status={verification.status} />
            {getStatusLabel(verification.status, t)}
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("productsVerification.details.basic_info") || "Basic Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-muted-foreground">
                  {t("productsVerification.details.product_type") || "Product Type"}
                </label>
                <p className="font-medium capitalize mt-1">
                  {verification.product_type}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  {t("common.status.status") || "Status"}
                </label>
                <div className="mt-1">
                  <Badge
                    variant={getStatusBadgeVariant(verification.status)}
                    className={`flex items-center gap-1 w-fit ${getStatusColor(
                      verification.status
                    )}`}
                  >
                    <StatusIcon status={verification.status} />
                    {getStatusLabel(verification.status, t)}
                  </Badge>
                </div>
              </div>
              {verification.domain_name && (
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("productsVerification.details.domain") || "Domain"}
                  </label>
                  <p className="font-medium mt-1">
                    {verification.domain_name}
                    {verification.domain_extension}
                  </p>
                </div>
              )}
              {verification.website_url && (
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("productsVerification.details.website_url") || "Website URL"}
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-medium truncate">
                      {verification.website_url}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        window.open(verification.website_url!, "_blank")
                      }
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm text-muted-foreground">
                  {t("productsVerification.details.verification_method") ||
                    "Verification Method"}
                </label>
                <p className="font-medium capitalize mt-1">
                  {verification.verification_method.replace("_", " ")}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  {t("productsVerification.details.verification_code") ||
                    "Verification Code"}
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-medium font-mono text-sm truncate">
                    {verification.verification_code}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        verification.verification_code,
                        t("productsVerification.details.verification_code") ||
                        "Verification code"
                      )
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DNS Record Data */}
        {verification.dns_record_data && (
          <Card>
            <CardHeader>
              <CardTitle>
                {t("productsVerification.details.dns_record") || "DNS Record"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("productsVerification.details.dns_type") || "Type"}
                  </label>
                  <p className="font-medium mt-1">
                    {verification.dns_record_data.type}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("productsVerification.details.dns_name") || "Name/Host"}
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-medium font-mono text-sm">
                      {verification.dns_record_data.name}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          verification.dns_record_data!.name,
                          t("productsVerification.details.dns_name") || "DNS Name"
                        )
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("productsVerification.details.dns_value") || "Value"}
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-medium font-mono text-sm break-all">
                      {verification.dns_record_data.value}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          verification.dns_record_data!.value,
                          t("productsVerification.details.dns_value") || "DNS Value"
                        )
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("productsVerification.details.full_record") || "Full Record"}
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-medium font-mono text-xs break-all bg-muted p-2 rounded">
                      {verification.dns_record_data.full_record}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          verification.dns_record_data!.full_record,
                          t("productsVerification.details.full_record") || "Full Record"
                        )
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {verification.dns_record_data.instructions && (
                  <div>
                    <label className="text-sm text-muted-foreground">
                      {t("productsVerification.details.instructions") || "Instructions"}
                    </label>
                    <p className="text-sm whitespace-pre-wrap mt-1">
                      {verification.dns_record_data.instructions}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* File Upload Data */}
        {verification.verification_file_data && (
          <Card>
            <CardHeader>
              <CardTitle>
                {t("productsVerification.details.verification_file") ||
                  "Verification File"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("productsVerification.details.filename") || "Filename"}
                  </label>
                  <p className="font-medium mt-1">
                    {verification.verification_file_data.filename}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("productsVerification.details.file_url") || "File URL"}
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-medium text-sm truncate">
                      {verification.verification_file_data.file_url}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        window.open(
                          verification.verification_file_data!.file_url,
                          "_blank"
                        )
                      }
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {verification.verification_file_data.instructions && (
                  <div>
                    <label className="text-sm text-muted-foreground">
                      {t("productsVerification.details.instructions") || "Instructions"}
                    </label>
                    <p className="text-sm whitespace-pre-wrap mt-1">
                      {verification.verification_file_data.instructions}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("productsVerification.details.additional_info") || "Additional Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-muted-foreground">
                  {t("productsVerification.details.created_at") || "Created At"}
                </label>
                <p className="font-medium mt-1">
                  {timeFormat(verification.created_at, "lll")}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  {t("productsVerification.details.updated_at") || "Updated At"}
                </label>
                <p className="font-medium mt-1">
                  {timeFormat(verification.updated_at, "lll")}
                </p>
              </div>
              {verification.expires_at && (
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("productsVerification.details.expires_at") || "Expires At"}
                  </label>
                  <p className="font-medium mt-1">
                    {timeFormat(verification.expires_at, "lll")}
                  </p>
                </div>
              )}
              {verification.verified_at && (
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("productsVerification.details.verified_at") || "Verified At"}
                  </label>
                  <p className="font-medium mt-1">
                    {timeFormat(verification.verified_at, "lll")}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm text-muted-foreground">
                  {t("productsVerification.details.attempts") ||
                    "Verification Attempts"}
                </label>
                <p className="font-medium mt-1">
                  {verification.verification_attempts}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.CLIENT.MARKETPLACE.PRODUCTS_VERIFICATION)}
              >
                {t("common.close") || "Close"}
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={handleVerifyProduct}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("productsVerification.verify.verifying") || "Verifying..."}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t("productsVerification.details.verify_product") ||
                      "Verify Product"}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetailsPage;

