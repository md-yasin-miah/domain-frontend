import { useState, useEffect, startTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreatePaymentIntentMutation, useGetPaymentIntentStatusQuery } from '@/store/api/ordersApi';
import { useGetPaymentMethodsQuery } from '@/store/api/paymentsApi';
import { extractErrorMessage } from '@/lib/errorHandler';
import { formatCurrency } from '@/lib/helperFun';
import { useAuth } from '@/store/hooks/useAuth';
import PaymentForm from './PaymentForm';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number;
  amount: number;
  currency: string;
  orderNumber: string;
  onSuccess?: () => void;
}

// Main PaymentDialog component
const PaymentDialog = ({
  open,
  onOpenChange,
  orderId,
  amount,
  currency,
  orderNumber,
  onSuccess,
}: PaymentDialogProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  const { data: paymentMethods } = useGetPaymentMethodsQuery(undefined, { skip: !open });

  // Initialize Stripe promise
  useEffect(() => {
    if (!open) return;

    const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!stripePublishableKey) {
      startTransition(() => {
        toast({
          title: t('orders.payment.config_error') || 'Configuration Error',
          description: t('orders.payment.config_error_desc') || 'Stripe publishable key is not configured.',
          variant: 'destructive',
        });
      });
      return;
    }

    const promise = loadStripe(stripePublishableKey);
    setStripePromise(promise);
  }, [open, toast, t]);

  const handleClose = () => {
    startTransition(() => {
      onOpenChange(false);
    });
  };

  const stripeMethod = paymentMethods?.payment_methods?.find((m) => m.id === 'stripe' && m.enabled);

  if (!stripeMethod) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('orders.payment.title') || 'Make Payment'}</DialogTitle>
            <DialogDescription>
              {t('orders.payment.no_methods') || 'No payment methods available at this time.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{t('orders.payment.no_methods_desc') || 'Please contact support.'}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!stripePromise) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('orders.payment.title') || 'Make Payment'}</DialogTitle>
          <DialogDescription>
            {t('orders.payment.description', { orderNumber: orderNumber })}
          </DialogDescription>
        </DialogHeader>

        {/* Payment Method Info */}
        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20 mb-4">
          <CreditCard className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium">{stripeMethod.display_name}</p>
            <p className="text-xs text-muted-foreground">{stripeMethod.description}</p>
          </div>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm
            orderId={orderId}
            amount={amount}
            currency={currency}
            orderNumber={orderNumber}
            onSuccess={onSuccess}
            onClose={handleClose}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
