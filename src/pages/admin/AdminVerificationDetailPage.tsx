import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Verified,
  Loader2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  User,
  Mail,
  FileText,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/lib/routes";
import {
  useGetVerificationUserDetailQuery,
  useApproveUserVerificationMutation,
  useRejectUserVerificationMutation,
  type UserVerificationRequest,
  type VerificationDocumentSummary,
} from "@/store/api/verificationApi";
import { getStatusColor } from "@/lib/helperFun";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function DocumentLink({ doc }: { doc: VerificationDocumentSummary }) {
  const href = doc.file_url.startsWith("http") ? doc.file_url : `${API_BASE}${doc.file_url}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
    >
      <FileText className="h-4 w-4 shrink-0" />
      <span className="truncate max-w-[200px]">{doc.original_filename}</span>
      <ExternalLink className="h-3 w-3 shrink-0" />
    </a>
  );
}

export default function AdminVerificationDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const userId = id ? parseInt(id, 10) : NaN;
  const isValidId = !isNaN(userId) && userId > 0;

  const { data, isLoading, error, refetch } = useGetVerificationUserDetailQuery(userId, {
    skip: !isValidId,
  });
  const [approveUser, { isLoading: isApproving }] = useApproveUserVerificationMutation();
  const [rejectUser, { isLoading: isRejecting }] = useRejectUserVerificationMutation();

  const handleApprove = async (request: UserVerificationRequest, adminNotes: string) => {
    try {
      await approveUser({
        user_id: request.user_id,
        body: adminNotes.trim() ? { admin_notes: adminNotes.trim() } : undefined,
      }).unwrap();
      toast({ title: t("admin.verifications.verified", "User verified") });
      refetch();
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "data" in e
          ? String((e as { data?: { detail?: string } }).data?.detail)
          : t("common.error", "Error");
      toast({ title: msg, variant: "destructive" });
    }
  };

  const handleReject = async (request: UserVerificationRequest, adminNotes: string) => {
    try {
      await rejectUser({
        user_id: request.user_id,
        body: adminNotes.trim() ? { admin_notes: adminNotes.trim() } : undefined,
      }).unwrap();
      toast({ title: t("admin.verifications.rejected", "Request rejected") });
      refetch();
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "data" in e
          ? String((e as { data?: { detail?: string } }).data?.detail)
          : t("common.error", "Error");
      toast({ title: msg, variant: "destructive" });
    }
  };

  if (!isValidId) {
    return (
      <div className="space-y-6 p-6">
        <p className="text-muted-foreground">{t("common.invalid_id", "Invalid ID")}</p>
        <Button variant="outline" onClick={() => navigate(ROUTES.ADMIN.USERS.VERIFICATIONS.LIST)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("admin.verifications.back_to_list", "Back to list")}
        </Button>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <p className="text-destructive">
          {t("common.error.description", "Something went wrong.")}
        </p>
        <Button variant="outline" onClick={() => navigate(ROUTES.ADMIN.USERS.VERIFICATIONS.LIST)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("admin.verifications.back_to_list", "Back to list")}
        </Button>
      </div>
    );
  }

  const { user, verification_requests } = data;
  const displayName =
    user.profile?.first_name || user.profile?.last_name
      ? [user.profile.first_name, user.profile.last_name].filter(Boolean).join(" ")
      : user.name || user.username || user.email || `User #${user.id}`;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2"
            onClick={() => navigate(ROUTES.ADMIN.USERS.VERIFICATIONS.LIST)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("admin.verifications.back_to_list", "Back to list")}
          </Button>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Verified className="h-7 w-7" />
            {t("admin.verifications.detail_title", "Verification detail")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("admin.verifications.detail_desc", "Review user and documents, then approve or reject.")}
          </p>
        </div>
      </div>

      {/* User info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("admin.verifications.user_info", "User information")}
          </CardTitle>
          <CardDescription>
            {t("admin.verifications.user_info_desc", "Profile and contact for this verification request.")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">{displayName}</span>
              {user.profile?.is_verified && (
                <Badge variant="default" className="bg-green-600">
                  {t("profile.client.verified", "Verified")}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {user.email}
            </div>
          </div>
          <div className="grid gap-2 text-sm md:grid-cols-2">
            {user.profile?.company_name && (
              <div>
                <Label className="text-muted-foreground">{t("profile.client.company_name")}</Label>
                <p>{user.profile.company_name}</p>
              </div>
            )}
            {user.profile?.phone && (
              <div>
                <Label className="text-muted-foreground">{t("profile.client.phone")}</Label>
                <p>{user.profile.phone}</p>
              </div>
            )}
            {user.profile?.address_line1 && (
              <div className="md:col-span-2">
                <Label className="text-muted-foreground">{t("profile.client.address")}</Label>
                <p>{user.profile.address_line1}</p>
              </div>
            )}
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.ADMIN.USERS.DETAILS(user.id))}
            >
              {t("admin.verifications.view_full_profile", "View full profile")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Verification requests */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.verifications.requests_for_user", "Verification requests")}</CardTitle>
          <CardDescription>
            {t("admin.verifications.requests_for_user_desc", "Documents and status for each request.")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {verification_requests.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              {t("admin.verifications.no_requests", "No verification requests for this user.")}
            </p>
          ) : (
            verification_requests.map((req) => (
              <RequestBlock
                key={req.id}
                request={req}
                formatDate={formatDate}
                t={(key, fallback) => t(key, { defaultValue: fallback })}
                onApprove={handleApprove}
                onReject={handleReject}
                isApproving={isApproving}
                isRejecting={isRejecting}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RequestBlock({
  request,
  formatDate,
  t,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: {
  request: UserVerificationRequest;
  formatDate: (s: string | null) => string;
  t: (key: string, fallback?: string) => string;
  onApprove: (req: UserVerificationRequest, notes: string) => void;
  onReject: (req: UserVerificationRequest, notes: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}) {
  const [adminNotes, setAdminNotes] = useState("");
  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-muted-foreground text-sm">#{request.id}</span>
          <Badge className={getStatusColor(request.status)}>
            {t(`admin.verifications.status.${request.status}`) || request.status}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {t("admin.verifications.requested_at", "Requested")}: {formatDate(request.requested_at)}
          {request.reviewed_at && (
            <> · {t("admin.verifications.reviewed_at", "Reviewed")}: {formatDate(request.reviewed_at)}</>
          )}
        </div>
      </div>
      {request.admin_notes && (
        <div>
          <Label className="text-muted-foreground text-xs">
            {t("admin.verifications.admin_notes", "Notes")}
          </Label>
          <p className="text-sm mt-0.5">{request.admin_notes}</p>
        </div>
      )}
      {request.document_files && request.document_files.length > 0 && (
        <div>
          <Label className="text-muted-foreground text-xs">
            {t("admin.verifications.documents", "Documents")}
          </Label>
          <ul className="mt-1.5 flex flex-wrap gap-3 list-none">
            {request.document_files.map((doc) => (
              <li key={doc.file_upload_id}>
                <DocumentLink doc={doc} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {request.status === "pending" && (
        <div className="pt-2 border-t space-y-3">
          <div>
            <Label htmlFor={`notes-${request.id}`}>
              {t("admin.verifications.admin_notes_optional", "Admin notes (optional)")}
            </Label>
            <Textarea
              id={`notes-${request.id}`}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={t("admin.verifications.admin_notes_placeholder", "Notes for the user...")}
              rows={2}
              className="mt-1"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950 bg-green-500/10"
              onClick={() => onApprove(request, adminNotes)}
              disabled={isApproving || isRejecting}
            >
              {isApproving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <CheckCircle className="h-4 w-4 mr-2" />
              {t("admin.verifications.approve", "Approve")}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onReject(request, adminNotes)}
              disabled={isApproving || isRejecting}
            >
              {isRejecting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <XCircle className="h-4 w-4 mr-2" />
              {t("admin.verifications.reject", "Reject")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
