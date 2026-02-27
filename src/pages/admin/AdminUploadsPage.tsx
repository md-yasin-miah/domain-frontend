import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  CloudUpload,
  FileText,
  Image,
  Film,
  File,
  Loader2,
  MoreVertical,
  Download,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import {
  useGetUploadsQuery,
  useDeleteUploadMutation,
  type Upload,
} from "@/store/api/uploadApi";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 24;
const SCROLL_THRESHOLD = 300;
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getFileIcon(upload: Upload) {
  const mime = (upload.mime_type || "").toLowerCase();
  const type = (upload.file_type || upload.upload_type || "").toLowerCase();
  if (mime.startsWith("image/") || type === "image") return Image;
  if (mime.startsWith("video/") || type === "video") return Film;
  if (
    mime.includes("pdf") ||
    mime.includes("document") ||
    type === "document"
  )
    return FileText;
  return File;
}

export default function AdminUploadsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const token = useAppSelector((state) => state.auth.token);

  const [items, setItems] = useState<Upload[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreTriggered = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploadToDelete, setUploadToDelete] = useState<Upload | null>(null);

  const { data, isLoading, isFetching } = useGetUploadsQuery(
    { skip, limit: PAGE_SIZE },
    { skip: false }
  );

  const [deleteUpload, { isLoading: isDeleting }] = useDeleteUploadMutation();

  useEffect(() => {
    if (!data) return;
    const list = Array.isArray(data)
      ? data
      : "items" in data
        ? (data as { items: Upload[] }).items
        : [];
    if (skip === 0) {
      setItems(list);
    } else {
      setItems((prev) => [...prev, ...list]);
    }
    setHasMore(list.length >= PAGE_SIZE);
    loadMoreTriggered.current = false;
  }, [data, skip]);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el || !hasMore || isFetching || loadMoreTriggered.current) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD) {
      loadMoreTriggered.current = true;
      setSkip((s) => items.length);
    }
  }, [hasMore, isFetching, items.length]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleDownload = useCallback(
    async (upload: Upload) => {
      if (!token || !API_BASE) {
        toast({
          title: t("admin.uploads.download_error", "Download failed"),
          variant: "destructive",
        });
        return;
      }
      try {
        const res = await fetch(
          `${API_BASE.replace(/\/$/, "")}/uploads/${upload.id}/download`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Download failed");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = upload.original_filename || upload.filename || "file";
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: t("admin.uploads.downloaded", "Download started") });
      } catch {
        toast({
          title: t("admin.uploads.download_error", "Download failed"),
          variant: "destructive",
        });
      }
    },
    [token, toast, t]
  );

  const handleOpenInNewTab = useCallback(
    (upload: Upload) => {
      if (upload.file_url) {
        window.open(upload.file_url, "_blank");
        return;
      }
      if (!token || !API_BASE) return;
      const url = `${API_BASE.replace(/\/$/, "")}/uploads/${upload.id}/download`;
      window.open(url + "?token=" + encodeURIComponent(token), "_blank");
    },
    [token]
  );

  const confirmDelete = (upload: Upload) => {
    setUploadToDelete(upload);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!uploadToDelete) return;
    try {
      await deleteUpload(uploadToDelete.id).unwrap();
      setItems((prev) => prev.filter((u) => u.id !== uploadToDelete.id));
      setDeleteDialogOpen(false);
      setUploadToDelete(null);
      toast({ title: t("admin.uploads.deleted", "File deleted") });
    } catch {
      toast({
        title: t("common.error", "Error"),
        variant: "destructive",
      });
    }
  };

  const isImage = (u: Upload) => {
    const m = (u.mime_type || "").toLowerCase();
    const t = (u.file_type || u.upload_type || "").toLowerCase();
    return m.startsWith("image/") || t === "image";
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-none mb-4">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <CloudUpload className="h-7 w-7" />
          {t("admin.uploads.title", "Uploads")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("admin.uploads.description", "All uploaded files. Scroll down to load more.")}
        </p>
      </div>

      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="flex-none">
          <CardTitle>{t("admin.uploads.drive_title", "Files")}</CardTitle>
          <CardDescription>
            {items.length} {t("admin.uploads.files_shown", "files")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 flex flex-col p-0 px-6 pb-6">
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-auto rounded-lg border bg-muted/20 p-4"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <CloudUpload className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground font-medium">
                  {t("admin.uploads.empty", "No files yet")}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("admin.uploads.empty_hint", "Uploaded files will appear here.")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {items.map((upload) => {
                  const Icon = getFileIcon(upload);
                  const showThumb =
                    isImage(upload) && upload.file_url;
                  return (
                    <div
                      key={upload.id}
                      className={cn(
                        "group relative rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40",
                        "flex flex-col items-center text-center min-w-0"
                      )}
                    >
                      <div className="w-full aspect-square rounded-lg bg-muted/50 overflow-hidden flex items-center justify-center mb-3">
                        {showThumb ? (
                          <img
                            src={upload.file_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icon className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                      <p
                        className="text-sm font-medium truncate w-full px-1"
                        title={upload.original_filename || upload.filename}
                      >
                        {upload.original_filename || upload.filename}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatFileSize(upload.file_size)} ·{" "}
                        {formatDate(upload.created_at)}
                      </p>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleDownload(upload)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              {t("admin.uploads.download", "Download")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenInNewTab(upload)}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              {t("admin.uploads.open", "Open")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => confirmDelete(upload)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t("admin.uploads.delete", "Delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {isFetching && items.length > 0 && (
              <div className="flex justify-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            {!hasMore && items.length > 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">
                {t("admin.uploads.end_of_list", "You've reached the end.")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.uploads.delete_confirm_title", "Delete file?")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.uploads.delete_confirm_description", "This will permanently delete this file. This action cannot be undone.")}
              {uploadToDelete && (
                <span className="block mt-2 font-medium text-foreground">
                  {uploadToDelete.original_filename || uploadToDelete.filename}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}{" "}
              {t("admin.uploads.delete", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
