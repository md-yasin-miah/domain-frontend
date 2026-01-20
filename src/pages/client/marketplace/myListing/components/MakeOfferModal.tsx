import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useCreateOfferMutation } from '@/store/api/offersApi';
import { useToast } from '@/hooks/use-toast';
import { offerCreateSchema, type OfferCreateFormData } from '@/schemas/marketplace/offer.schema';
import { extractErrorMessage, setFormErrors } from '@/lib/errorHandler';

interface MakeOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: {
    id: number;
    title: string;
    currency: string;
  };
  onSuccess?: () => void;
}

const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  open,
  onOpenChange,
  listing,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [createOffer, { isLoading }] = useCreateOfferMutation();

  const form = useForm<OfferCreateFormData>({
    resolver: zodResolver(offerCreateSchema),
    defaultValues: {
      listing_id: listing.id,
      amount: undefined,
      currency: listing.currency || 'USD',
      message: '',
      expires_at: undefined,
    },
  });

  // Get minimum date for expires_at (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const onSubmit = async (data: OfferCreateFormData) => {
    try {
      const payload = {
        listing_id: data.listing_id,
        amount: data.amount,
        currency: data.currency as 'USD',
        message: data.message,
        ...(data.expires_at && { expires_at: new Date(data.expires_at).toISOString() }),
      };

      await createOffer(payload).unwrap();

      toast({
        title: t('offers.create.success.title') || 'Offer Created',
        description: t('offers.create.success.description') || 'Your offer has been submitted successfully.',
      });

      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      // Set form field errors dynamically
      const hasFieldErrors = setFormErrors<OfferCreateFormData>(
        form,
        error,
        undefined,
        ['amount', 'currency', 'message', 'expires_at']
      );

      // Show general error toast if no field-specific errors were set
      if (!hasFieldErrors) {
        const errorMessage = extractErrorMessage(error);
        toast({
          title: t('offers.create.error.title') || 'Error',
          description: errorMessage || t('offers.create.error.description') || 'Failed to create offer. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t('offers.create.title') || 'Make an Offer'}
          </DialogTitle>
          <DialogDescription>
            {t('offers.create.description') || `Make an offer for "${listing.title}"`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('offers.create.amount') || 'Offer Amount'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder={t('offers.create.amount_placeholder') || 'Enter your offer amount'}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : Number(value));
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('offers.create.currency') || 'Currency'}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('offers.create.currency_placeholder') || 'Select currency'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('offers.create.message') || 'Message'}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('offers.create.message_placeholder') || 'Add a message to your offer (optional)'}
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expires_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('offers.create.expires_at') || 'Expiration Date (Optional)'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      min={getMinDate()}
                      placeholder={t('offers.create.expires_at_placeholder') || 'Select expiration date'}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                {t('common.cancel') || 'Cancel'}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('offers.create.submitting') || 'Submitting...'}
                  </>
                ) : (
                  t('offers.create.submit') || 'Submit Offer'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MakeOfferModal;
