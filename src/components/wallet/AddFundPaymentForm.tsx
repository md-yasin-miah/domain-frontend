import { useAuth } from '@/store/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { extractErrorMessage } from '@/lib/errorHandler';
import { useState, startTransition } from 'react';

interface AddFundPaymentFormProps {
  clientSecret: string;
  amount: number;
  currency: string;
  onSuccess?: () => void;
  onClose: () => void;
}

const AddFundPaymentForm = ({
  clientSecret,
  amount,
  currency,
  onSuccess,
  onClose,
}: AddFundPaymentFormProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      startTransition(() => {
        toast({
          title: t('wallet.add_fund.error') || 'Payment Failed',
          description: 'Card element not found',
          variant: 'destructive',
        });
        setIsProcessing(false);
      });
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user.username,
            email: user.email,
          },
        },
      });

      if (error) {
        startTransition(() => {
          toast({
            title: t('wallet.add_fund.error') || 'Payment Failed',
            description: error.message || extractErrorMessage(error),
            variant: 'destructive',
          });
          setIsProcessing(false);
        });
      } else if (paymentIntent?.status === 'succeeded') {
        startTransition(() => {
          toast({
            title: t('wallet.add_fund.success') || 'Funds Added',
            description:
              t('wallet.add_fund.success_desc') ||
              'Your wallet has been credited. Balance will update shortly.',
          });
          onSuccess?.();
          setIsProcessing(false);
          onClose();
        });
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      startTransition(() => {
        toast({
          title: t('wallet.add_fund.error') || 'Payment Failed',
          description: extractErrorMessage(error),
          variant: 'destructive',
        });
        setIsProcessing(false);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-lg font-semibold">
          <span>{t('wallet.add_fund.amount') || 'Amount'}:</span>
          <span>
            {new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)}{' '}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {t('wallet.add_fund.card_details') || 'Card Details'}
        </label>
        <div className="p-3 border rounded-md bg-background">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' },
                },
                invalid: { color: '#9e2146' },
              },
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {t('wallet.add_fund.card_info') || 'Your card information is secure and encrypted'}
        </p>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isProcessing}
          className="flex-1"
        >
          {t('common.cancel') || 'Cancel'}
        </Button>
        <Button type="submit" disabled={!stripe || !elements || isProcessing} className="flex-1">
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('wallet.add_fund.processing') || 'Processing...'}
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              {t('wallet.add_fund.pay_now') || 'Pay Now'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddFundPaymentForm;
