import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateListingFromVerificationMutation } from "@/store/api/productVerification";
import { useGetMarketplaceListingTypesQuery } from "@/store/api/marketplaceApi";
import { useGetProductVerificationsQuery } from "@/store/api/productVerification";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Package,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLazyGetAutoValuationQuery } from "@/store/api/valuationsApi";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import {
  SELLER_LISTING_TUTORIAL_COMPLETED_KEY,
  SELLER_LISTING_TUTORIAL_PENDING_KEY,
} from "@/lib/tutorialStorage";

export default function CreateListingPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [verificationId, setVerificationId] = useState<number | null>(null);
  const [runTutorial, setRunTutorial] = useState(false);
  const [formData, setFormData] =
    useState<CreateListingFromVerificationRequest>({
      title: "",
      description: "",
      short_description: "",
      price: "",
      currency: "USD",
      is_price_negotiable: false,
      listing_type_id: 0,
      status: "draft",
    });

  const { data: verifications, isLoading: loadingVerifications } =
    useGetProductVerificationsQuery({ status: "verified" });
  const { data: listingTypes, isLoading: loadingTypes } =
    useGetMarketplaceListingTypesQuery();
  const [createListing, { isLoading: creating }] =
    useCreateListingFromVerificationMutation();
  const [fetchValuation, { data: valuationData }] =
    useLazyGetAutoValuationQuery();

  useEffect(() => {
    if (!valuationData) return;
    setFormData((prev) => ({
      ...prev,
      domain_age_years:
        valuationData.domain_age_years ?? prev.domain_age_years ?? undefined,
      domain_authority:
        valuationData.domain_authority_score ??
        prev.domain_authority ??
        undefined,
      website_traffic_monthly:
        valuationData.monthly_traffic ??
        prev.website_traffic_monthly ??
        undefined,
      website_revenue_monthly:
        valuationData.monthly_revenue != null
          ? Number(valuationData.monthly_revenue)
          : prev.website_revenue_monthly,
      domain_backlinks:
        valuationData.backlinks_count ?? prev.domain_backlinks ?? undefined,
    }));
  }, [valuationData]);

  useEffect(() => {
    const tutorialPending =
      localStorage.getItem(SELLER_LISTING_TUTORIAL_PENDING_KEY) === "1";
    const tutorialCompleted =
      localStorage.getItem(SELLER_LISTING_TUTORIAL_COMPLETED_KEY) === "1";
    const tutorialFromQuery = searchParams.get("tutorial") === "1";
    if ((tutorialPending || tutorialFromQuery) && !tutorialCompleted) {
      setRunTutorial(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!runTutorial) return;

    const timer = window.setTimeout(() => {
      const hasNoVerifiedProducts =
        !loadingVerifications &&
        (verifications?.filter((v) => v.status === "verified" && !v.listing_id)
          .length ?? 0) === 0;
      const tourSteps = hasNoVerifiedProducts
        ? [
            {
              element: "[data-tour='listing-stepper']",
              popover: {
                title: "Listing creation requires verification",
                description:
                  "First verify your domain or website, then return here to create your listing.",
                side: "bottom" as const,
                align: "center" as const,
              },
            },
            {
              element: "[data-tour='go-verify-product']",
              popover: {
                title: "Go to product verification",
                description:
                  "Use this button to add and verify a product before creating a listing.",
                side: "top" as const,
                align: "start" as const,
              },
            },
          ]
        : [
            {
              element: "[data-tour='listing-stepper']",
              popover: {
                title: "Step-by-step listing form",
                description:
                  "Create listing is split into two steps: select a verified product, then complete listing details.",
                side: "bottom" as const,
                align: "center" as const,
              },
            },
            {
              element: "[data-tour='verification-select']",
              popover: {
                title: "Select verified product",
                description:
                  "Pick a verified domain/website first. This links ownership and pre-fills listing details.",
                side: "bottom" as const,
                align: "start" as const,
              },
            },
            {
              element: "[data-tour='listing-title-input']",
              popover: {
                title: "Add core listing details",
                description:
                  "Set title, description, and pricing. Required fields must be filled before submission.",
                side: "bottom" as const,
                align: "start" as const,
              },
            },
            {
              element: "[data-tour='create-listing-submit']",
              popover: {
                title: "Create and publish later",
                description:
                  "Click Create Listing to save. You can keep it draft or set status to active before submit.",
                side: "top" as const,
                align: "end" as const,
              },
            },
          ];

      const guide = driver({
        showProgress: true,
        allowClose: true,
        nextBtnText: "Next",
        prevBtnText: "Back",
        doneBtnText: "Done",
        onNextClick: (_element, _step, context) => {
          const currentIndex = context.state.activeIndex ?? 0;
          if (!hasNoVerifiedProducts && currentIndex === 1 && step === 1) {
            setStep(2);
            window.setTimeout(() => {
              context.driver.moveNext();
            }, 350);
            return;
          }
          context.driver.moveNext();
        },
        onDestroyed: () => {
          localStorage.setItem(SELLER_LISTING_TUTORIAL_COMPLETED_KEY, "1");
          localStorage.removeItem(SELLER_LISTING_TUTORIAL_PENDING_KEY);
          setRunTutorial(false);
        },
        steps: tourSteps,
      });
      guide.drive();
    }, 500);

    return () => window.clearTimeout(timer);
  }, [runTutorial, step, loadingVerifications, verifications]);

  const availableVerifications =
    verifications?.filter((v) => v.status === "verified" && !v.listing_id) ??
    [];

  const handleInputChange = (
    field: keyof CreateListingFromVerificationRequest,
    value: unknown,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!verificationId) {
      toast({
        title: "Error",
        description: "Please select a verified product",
        variant: "destructive",
      });
      return;
    }
    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.listing_type_id
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const listing = await createListing({
        verificationId,
        data: formData,
      }).unwrap();

      toast({
        title: "Success",
        description: "Listing created successfully!",
      });

      navigate(ROUTES.CLIENT.MARKETPLACE.MY_LISTINGS_DETAILS(listing.id));
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast({
        title: "Error",
        description: err?.data?.message ?? "Failed to create listing",
        variant: "destructive",
      });
    }
  };

  const selectedVerification = availableVerifications.find(
    (v) => v.id === verificationId,
  );

  const steps = [
    { number: 1, label: "Select product" },
    { number: 2, label: "Listing details" },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Header with back */}
      <div className="w-full">
        <div className="flex items-center justify-between gap-4">
          <div className=" flex items-center gap-4">
            <div>
              <h1 className="md:text-2xl text-lg font-bold flex items-center gap-2">
                <Package className="md:h-8 md:w-8 h-6 w-6 text-primary" />
                Create New Listing
              </h1>
            </div>
          </div>
          <Link to={ROUTES.CLIENT.MARKETPLACE.MY_LISTINGS}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
        <p className="text-muted-foreground text-sm md:mt-6 mt-4">
          Create a marketplace listing from your verified product
        </p>
      </div>

      {/* Stepper */}
      <div className="w-full max-w-2xl md:my-8 my-6" data-tour="listing-stepper">
        <div className="flex items-center justify-center gap-0">
          {steps.map((s, index) => (
            <React.Fragment key={s.number}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex md:h-10 md:w-10 h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    step === s.number
                      ? "border-primary bg-primary text-primary-foreground"
                      : step > s.number
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30 bg-muted/50 text-muted-foreground",
                  )}
                >
                  {step > s.number ? <Check className="h-5 w-5" /> : s.number}
                </div>
                <span
                  className={cn(
                    "md:mt-2 mt-1 text-xs font-medium",
                    step === s.number
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {s.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 w-12 min-[400px]:w-20 sm:w-24 transition-colors",
                    step > s.number ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Centered form card */}
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg">
            {step === 1 ? "Select a verified product" : "Listing details"}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? "Choose a verified product to create a listing from"
              : "Fill in the details for your listing"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification">Select Verified Product *</Label>
                {loadingVerifications ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading verified products...
                  </div>
                ) : availableVerifications.length === 0 ? (
                  <div className="flex items-start gap-2 p-4 border rounded-lg bg-muted/50">
                    <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div className="space-y-3">
                      <p className="font-medium">
                        No verified products available
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Please verify a product first before creating a listing
                      </p>
                      <Button
                        asChild
                        size="sm"
                        className="h-8"
                        data-tour="go-verify-product"
                      >
                        <Link
                          to={ROUTES.CLIENT.MARKETPLACE.PRODUCTS_VERIFICATION}
                        >
                          Add Verified Product
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Select
                    value={verificationId?.toString() ?? ""}
                    onValueChange={(value) => {
                      const id = parseInt(value, 10);
                      setVerificationId(id);
                      const verification = availableVerifications.find(
                        (v) => v.id === id,
                      );
                      if (verification) {
                        const title = verification.domain_name
                          ? verification.domain_name
                          : (verification.website_url ?? "");
                        const listing_type_id =
                          listingTypes?.find(
                            (type) => type.slug === verification.product_type,
                          )?.id ?? 0;
                        setFormData((prev) => ({
                          ...prev,
                          title,
                          listing_type_id,
                        }));
                        if (
                          verification.product_type === "domain" &&
                          verification.domain_name
                        ) {
                          fetchValuation({ domain: verification.domain_name });
                        }
                      }
                    }}
                  >
                    <SelectTrigger
                      id="verification"
                      data-tour="verification-select"
                    >
                      <SelectValue placeholder="Select a verified product" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVerifications.map((v) => (
                        <SelectItem key={v.id} value={v.id.toString()}>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            <span>{v.domain_name ?? v.website_url}</span>
                            <span className="text-xs text-muted-foreground">
                              ({v.product_type})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {selectedVerification && (
                <div className="p-4 border rounded-lg bg-muted/30 space-y-2">
                  <h4 className="font-semibold text-sm">
                    Selected Product Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <span className="ml-2 font-medium capitalize">
                        {selectedVerification.product_type}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Verified:</span>
                      <span className="ml-2 font-medium">
                        {selectedVerification.verified_at
                          ? new Date(
                              selectedVerification.verified_at,
                            ).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Basic Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    data-tour="listing-title-input"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter listing title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="listing_type">Listing Type *</Label>
                  {loadingTypes ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading types...
                    </div>
                  ) : (
                    <Select
                      value={formData.listing_type_id?.toString() ?? ""}
                      onValueChange={(value) =>
                        handleInputChange(
                          "listing_type_id",
                          parseInt(value, 10),
                        )
                      }
                      disabled
                    >
                      <SelectTrigger id="listing_type">
                        <SelectValue placeholder="Select listing type" />
                      </SelectTrigger>
                      <SelectContent>
                        {listingTypes?.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description</Label>
                  <Input
                    id="short_description"
                    value={formData.short_description ?? ""}
                    onChange={(e) =>
                      handleInputChange("short_description", e.target.value)
                    }
                    placeholder="Brief description (optional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Detailed description of your listing"
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) =>
                        handleInputChange("currency", value)
                      }
                    >
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="negotiable"
                    checked={formData.is_price_negotiable}
                    onCheckedChange={(checked) =>
                      handleInputChange("is_price_negotiable", checked)
                    }
                  />
                  <Label htmlFor="negotiable" className="cursor-pointer">
                    Price is negotiable
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">
                  Additional Information (Optional)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain_age">Domain Age (years)</Label>
                    <Input
                      id="domain_age"
                      type="number"
                      value={formData.domain_age_years ?? ""}
                      disabled={!formData.domain_age_years}
                      onChange={(e) =>
                        handleInputChange(
                          "domain_age_years",
                          e.target.value ? parseInt(e.target.value, 10) : null,
                        )
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain_authority">Domain Authority</Label>
                    <Input
                      id="domain_authority"
                      type="text"
                      value={formData.domain_authority ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "domain_authority",
                          e.target.value ? parseInt(e.target.value, 10) : null,
                        )
                      }
                      disabled={!!formData.domain_authority}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="traffic">Monthly Traffic</Label>
                    <Input
                      id="traffic"
                      type="number"
                      value={formData.website_traffic_monthly ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "website_traffic_monthly",
                          e.target.value ? parseInt(e.target.value, 10) : null,
                        )
                      }
                      placeholder="0"
                      disabled={!!Number(formData.website_traffic_monthly)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Monthly Revenue</Label>
                    <Input
                      id="revenue"
                      type="number"
                      value={formData.website_revenue_monthly ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "website_revenue_monthly",
                          e.target.value,
                        )
                      }
                      placeholder="0.00"
                      disabled={!!Number(formData.website_revenue_monthly)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profit">Monthly Profit</Label>
                    <Input
                      id="profit"
                      type="number"
                      value={formData.website_profit_monthly ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "website_profit_monthly",
                          e.target.value,
                        )
                      }
                      placeholder="0.00"
                      disabled={!!Number(formData.website_profit_monthly)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backlinks">Domain Backlinks</Label>
                    <Input
                      id="backlinks"
                      type="number"
                      value={formData.domain_backlinks ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "domain_backlinks",
                          e.target.value ? parseInt(e.target.value, 10) : null,
                        )
                      }
                      placeholder="0"
                      disabled={!formData.domain_backlinks}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="technology">Website Technology</Label>
                    <Input
                      id="technology"
                      value={formData.website_technology ?? ""}
                      onChange={(e) =>
                        handleInputChange("website_technology", e.target.value)
                      }
                      placeholder="e.g., WordPress, React, etc."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Images & SEO (Optional)</h3>
                <div className="space-y-2">
                  <Label htmlFor="primary_image">Primary Image URL</Label>
                  <Input
                    id="primary_image"
                    value={formData.primary_image_url ?? ""}
                    onChange={(e) =>
                      handleInputChange("primary_image_url", e.target.value)
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_urls">Additional Image URLs</Label>
                  <Input
                    id="image_urls"
                    value={formData.image_urls?.join(", ") ?? ""}
                    onChange={(e) => {
                      const urls = e.target.value
                        .split(",")
                        .map((url) => url.trim())
                        .filter(Boolean);
                      handleInputChange(
                        "image_urls",
                        urls.length > 0 ? urls : null,
                      );
                    }}
                    placeholder="Comma-separated URLs"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple URLs with commas
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title ?? ""}
                    onChange={(e) =>
                      handleInputChange("meta_title", e.target.value)
                    }
                    placeholder="SEO title for search engines"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description ?? ""}
                    onChange={(e) =>
                      handleInputChange("meta_description", e.target.value)
                    }
                    placeholder="SEO description for search engines"
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            {step === 1 ? (
              <>
                <Button variant="outline" asChild>
                  <Link to={ROUTES.CLIENT.MARKETPLACE.MY_LISTINGS}>Cancel</Link>
                </Button>
                <Button onClick={() => setStep(2)} disabled={!verificationId}>
                  Next
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={creating}
                  data-tour="create-listing-submit"
                >
                  {creating && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Create Listing
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
