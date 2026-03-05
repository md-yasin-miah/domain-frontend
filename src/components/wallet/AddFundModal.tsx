import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet } from 'lucide-react';
import { useAddFundMutation } from '@/store/api/walletApi';
import { useToast } from '@/hooks/use-toast';
import { addFundSchema, type AddFundFormData } from '@/schemas/wallet/addFund.schema';
import { extractErrorMessage, setFormErrors } from '@/lib/errorHandler';
import AddFundPaymentForm from './AddFundPaymentForm';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD'] as const;

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

interface AddFundModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AddFundModal = ({ open, onOpenChange, onSuccess }: AddFundModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [addFund, { isLoading: isAdding }] = useAddFundMutation();
  const [paymentIntent, setPaymentIntent] = useState<{
    client_secret: string;
    amount: number;
    currency: string;
  } | null>(null);

  const form = useForm<AddFundFormData>({
    resolver: zodResolver(addFundSchema),
    defaultValues: {
      amount: undefined as unknown as number,
      currency: 'USD',
    },
  });

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setPaymentIntent(null);
      form.reset({ amount: undefined as unknown as number, currency: 'USD' });
    }
  }, [open, form]);

  const handleAmountSubmit = async (data: AddFundFormData) => {
    if (!stripePromise) {
      toast({
        title: t('wallet.add_fund.error') || 'Error',
        description: t('wallet.add_fund.stripe_not_configured') || 'Payment is not configured. Please contact support.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const result = await addFund({
        amount: data.amount,
        currency: data.currency,
      }).unwrap();

      setPaymentIntent({
        client_secret: result.client_secret,
        amount: result.amount,
        currency: result.currency,
      });
    } catch (error: unknown) {
      const hasFieldErrors = setFormErrors<AddFundFormData>(
        form,
        error,
        undefined,
        ['amount', 'currency']
      );
      if (!hasFieldErrors) {
        toast({
          title: t('wallet.add_fund.error') || 'Error',
          description: extractErrorMessage(error) || t('wallet.add_fund.error_desc'),
          variant: 'destructive',
        });
      }
    }
  };

  const handlePaymentSuccess = () => {
    onSuccess?.();
    setPaymentIntent(null);
    onOpenChange(false);
  };

  const handleClose = () => {
    if (!isAdding) {
      setPaymentIntent(null);
      form.reset();
      onOpenChange(false);
    }
  };

  const showPaymentStep = paymentIntent && stripePromise;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            {showPaymentStep
              ? t('wallet.add_fund.complete_payment') || 'Complete Payment'
              : t('wallet.add_fund.title') || 'Add Funds'}
          </DialogTitle>
          <DialogDescription>
            {showPaymentStep
              ? t('wallet.add_fund.complete_payment_desc') ||
                'Enter your card details to complete the top-up'
              : t('wallet.add_fund.description') ||
                'Add funds to your wallet. Minimum 1, maximum 50,000.'}
          </DialogDescription>
        </DialogHeader>

        {showPaymentStep ? (
          <Elements stripe={stripePromise}>
            <AddFundPaymentForm
              clientSecret={paymentIntent.client_secret}
              amount={paymentIntent.amount}
              currency={paymentIntent.currency}
              onSuccess={handlePaymentSuccess}
              onClose={handleClose}
            />
          </Elements>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAmountSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('wallet.add_fund.amount_label') || 'Amount'}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={1}
                        max={50000}
                        placeholder={t('wallet.add_fund.amount_placeholder') || 'Enter amount (1 - 50,000)'}
                        {...field}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? undefined : Number(val));
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
                    <FormLabel>{t('wallet.add_fund.currency_label') || 'Currency'}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('wallet.add_fund.currency_placeholder') || 'Select currency'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose} disabled={isAdding}>
                  {t('common.cancel') || 'Cancel'}
                </Button>
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('wallet.add_fund.proceeding') || 'Proceeding...'}
                    </>
                  ) : (
                    t('wallet.add_fund.continue') || 'Continue to Payment'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddFundModal;
