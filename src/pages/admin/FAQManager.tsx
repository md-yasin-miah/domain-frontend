import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { mockData, mockAuth } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  HelpCircle,
  Search,
  Loader2,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface FAQFormData {
  question: string;
  answer: string;
  category: string;
  order_index: number;
  is_published: boolean;
}

export default function FAQManager() {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<FAQFormData>({
    question: "",
    answer: "",
    category: "",
    order_index: 0,
    is_published: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Admins can view all FAQs (including unpublished)
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error: any) {
      console.error("Error fetching FAQs:", error);
      toast({
        title: t("admin.faq.errors.fetch_error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      question: "",
      answer: "",
      category: "",
      order_index: 0,
      is_published: true,
    });
    setEditingFAQ(null);
  };

  const handleCreate = async () => {
    if (!formData.question || !formData.answer) {
      toast({
        title: t("admin.faq.errors.required_fields"),
        variant: "destructive",
      });
      return;
    }

    try {
      setFormLoading(true);

      const { data, error } = await supabase.functions.invoke("create-faq", {
        body: {
          question: formData.question,
          answer: formData.answer,
          category: formData.category || null,
          order_index: formData.order_index || 0,
          is_published: formData.is_published,
        },
      });

      if (error) throw error;

      if (!data || !data.success) {
        throw new Error(data?.error || t("admin.faq.errors.create_error"));
      }

      toast({
        title: t("admin.faq.messages.create_success"),
        description: t("admin.faq.messages.create_success_desc"),
      });

      setShowCreateDialog(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error("Error creating FAQ:", error);
      toast({
        title: t("admin.faq.errors.create_error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "",
      order_index: faq.order_index,
      is_published: faq.is_published,
    });
    setShowEditDialog(true);
  };

  const handleUpdate = async () => {
    if (!editingFAQ || !formData.question || !formData.answer) {
      toast({
        title: t("admin.faq.errors.required_fields"),
        variant: "destructive",
      });
      return;
    }

    try {
      setFormLoading(true);

      const { data, error } = await supabase.functions.invoke("update-faq", {
        body: {
          id: editingFAQ.id,
          question: formData.question,
          answer: formData.answer,
          category: formData.category || null,
          order_index: formData.order_index || 0,
          is_published: formData.is_published,
        },
      });

      if (error) throw error;

      if (!data || !data.success) {
        throw new Error(data?.error || t("admin.faq.errors.update_error"));
      }

      toast({
        title: t("admin.faq.messages.update_success"),
        description: t("admin.faq.messages.update_success_desc"),
      });

      setShowEditDialog(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error("Error updating FAQ:", error);
      toast({
        title: t("admin.faq.errors.update_error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!faqToDelete) return;

    try {
      setFormLoading(true);

      const { data, error } = await supabase.functions.invoke("delete-faq", {
        body: {
          id: faqToDelete.id,
        },
      });

      if (error) throw error;

      if (!data || !data.success) {
        throw new Error(data?.error || t("admin.faq.errors.delete_error"));
      }

      toast({
        title: t("admin.faq.messages.delete_success"),
        description: t("admin.faq.messages.delete_success_desc"),
      });

      setShowDeleteDialog(false);
      setFaqToDelete(null);
      fetchData();
    } catch (error: any) {
      console.error("Error deleting FAQ:", error);
      toast({
        title: t("admin.faq.errors.delete_error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (faq.category &&
        faq.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = Array.from(
    new Set(faqs.map((faq) => faq.category).filter(Boolean))
  ) as string[];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                {t("admin.faq.title")}
              </CardTitle>
              <CardDescription>{t("admin.faq.description")}</CardDescription>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("admin.faq.create_faq")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {t("admin.faq.create_dialog.title")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("admin.faq.create_dialog.description")}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="question">
                      {t("admin.faq.form.question")} *
                    </Label>
                    <Input
                      id="question"
                      value={formData.question}
                      onChange={(e) =>
                        setFormData({ ...formData, question: e.target.value })
                      }
                      placeholder={t("admin.faq.form.question_placeholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="answer">
                      {t("admin.faq.form.answer")} *
                    </Label>
                    <Textarea
                      id="answer"
                      value={formData.answer}
                      onChange={(e) =>
                        setFormData({ ...formData, answer: e.target.value })
                      }
                      placeholder={t("admin.faq.form.answer_placeholder")}
                      rows={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      {t("admin.faq.form.category")}
                    </Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      placeholder={t("admin.faq.form.category_placeholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order_index">
                      {t("admin.faq.form.order_index")}
                    </Label>
                    <Input
                      id="order_index"
                      type="number"
                      value={formData.order_index}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          order_index: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_published: checked })
                      }
                    />
                    <Label htmlFor="is_published">
                      {t("admin.faq.form.is_published")}
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button onClick={handleCreate} disabled={formLoading}>
                    {formLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("common.loading")}
                      </>
                    ) : (
                      t("admin.faq.create_dialog.create")
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t("admin.faq.search_placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredFAQs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? t("admin.faq.no_results")
                  : t("admin.faq.no_faqs")}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("admin.faq.table.question")}</TableHead>
                    <TableHead>{t("admin.faq.table.category")}</TableHead>
                    <TableHead>{t("admin.faq.table.order")}</TableHead>
                    <TableHead>{t("common.status.status")}</TableHead>
                    <TableHead>{t("admin.faq.table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFAQs.map((faq) => (
                    <TableRow key={faq.id}>
                      <TableCell className="max-w-md">
                        <div className="font-medium">{faq.question}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {faq.answer}
                        </div>
                      </TableCell>
                      <TableCell>
                        {faq.category ? (
                          <Badge variant="outline">{faq.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{faq.order_index}</TableCell>
                      <TableCell>
                        {faq.is_published ? (
                          <Badge className="bg-green-500">
                            <Check className="h-3 w-3 mr-1" />
                            {t("admin.faq.published")}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 mr-1" />
                            {t("admin.faq.unpublished")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(faq)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFaqToDelete(faq);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("admin.faq.edit_dialog.title")}</DialogTitle>
            <DialogDescription>
              {t("admin.faq.edit_dialog.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-question">
                {t("admin.faq.form.question")} *
              </Label>
              <Input
                id="edit-question"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                placeholder={t("admin.faq.form.question_placeholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-answer">
                {t("admin.faq.form.answer")} *
              </Label>
              <Textarea
                id="edit-answer"
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                placeholder={t("admin.faq.form.answer_placeholder")}
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">
                {t("admin.faq.form.category")}
              </Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder={t("admin.faq.form.category_placeholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-order_index">
                {t("admin.faq.form.order_index")}
              </Label>
              <Input
                id="edit-order_index"
                type="number"
                value={formData.order_index}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order_index: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_published: checked })
                }
              />
              <Label htmlFor="edit-is_published">
                {t("admin.faq.form.is_published")}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleUpdate} disabled={formLoading}>
              {formLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                t("admin.faq.edit_dialog.update")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.faq.delete_dialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.faq.delete_dialog.description")}
              {faqToDelete && (
                <div className="mt-2 p-2 bg-muted rounded">
                  <strong>{faqToDelete.question}</strong>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={formLoading}
            >
              {formLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                t("common.delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
