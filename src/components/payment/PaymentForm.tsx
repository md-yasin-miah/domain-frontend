import { useAuth } from '@/store/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/helperFun';
import { extractErrorMessage } from '@/lib/errorHandler';
import { useState, useEffect, startTransition } from 'react';
import { useCreatePaymentIntentMutation, useGetPaymentIntentStatusQuery } from '@/store/api/ordersApi';

const PaymentForm = ({
  orderId,
  amount,
  currency,
  orderNumber,
  onSuccess,
  onClose,
}: {
  orderId: number;
  amount: number;
  currency: string;
  orderNumber: string;
  onSuccess?: () => void;
  onClose: () => void;
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const [createPaymentIntent, { isLoading: isCreatingIntent }] = useCreatePaymentIntentMutation();
  const { data: paymentStatus, refetch: refetchStatus } = useGetPaymentIntentStatusQuery(orderId, {
    skip: !orderId || !clientSecret,
  });

  // Create payment intent when component mounts
  useEffect(() => {
    const createIntent = async () => {
      try {
        const result = await createPaymentIntent(orderId).unwrap();
        startTransition(() => {
          setClientSecret(result.client_secret);
        });
      } catch (error) {
        startTransition(() => {
          toast({
            title: t('orders.payment.error_creating_intent') || 'Error',
            description: extractErrorMessage(error),
            variant: 'destructive',
          });
        });
      }
    };

    createIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check payment status periodically
  useEffect(() => {
    if (!clientSecret) return;

    const interval = setInterval(() => {
      refetchStatus();
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSecret]);

  // Handle payment success
  useEffect(() => {
    if (paymentStatus?.status === 'succeeded') {
      startTransition(() => {
        toast({
          title: t('orders.payment.success') || 'Payment Successful',
          description: t('orders.payment.success_desc') || 'Your payment has been processed successfully.',
        });
        onSuccess?.();
        setClientSecret(null);
        setIsProcessing(false);
        onClose();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      startTransition(() => {
        toast({
          title: t('orders.payment.error') || 'Payment Failed',
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
            title: t('orders.payment.error') || 'Payment Failed',
            description: error.message || extractErrorMessage(error),
            variant: 'destructive',
          });
          setIsProcessing(false);
        });
      } else if (paymentIntent.status === 'succeeded') {
        // Payment succeeded - webhook will handle the rest
        startTransition(() => {
          toast({
            title: t('orders.payment.processing') || 'Processing Payment',
            description: t('orders.payment.processing_desc') || 'Your payment is being processed. Please wait...',
          });
        });
        // Poll for status update
        setTimeout(() => {
          refetchStatus();
        }, 2000);
      } else {
        startTransition(() => {
          setIsProcessing(false);
        });
      }
    } catch (error) {
      startTransition(() => {
        toast({
          title: t('orders.payment.error') || 'Payment Failed',
          description: extractErrorMessage(error),
          variant: 'destructive',
        });
        setIsProcessing(false);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Order Summary */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('orders.payment.order_number') || 'Order Number'}:</span>
          <span className="font-medium">{orderNumber}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold">
          <span>{t('orders.payment.total') || 'Total Amount'}:</span>
          <span>{formatCurrency(amount)} {currency}</span>
        </div>
      </div>

      {/* Card Element */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {t('orders.payment.card_details') || 'Card Details'}
        </label>
        <div className="p-3 border rounded-md bg-background">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {t('orders.payment.card_info') || 'Your card information is secure and encrypted'}
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isProcessing || isCreatingIntent}
          className="flex-1"
        >
          {t('common.cancel') || 'Cancel'}
        </Button>
        <Button
          type="submit"
          disabled={!stripe || !elements || !clientSecret || isProcessing || isCreatingIntent}
          className="flex-1"
        >
          {isProcessing || isCreatingIntent ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isCreatingIntent
                ? t('orders.payment.creating') || 'Creating...'
                : t('orders.payment.processing') || 'Processing...'}
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              {t('orders.payment.pay_now', { amount: formatCurrency(amount) }) || `Pay ${formatCurrency(amount)} ${currency}`}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm