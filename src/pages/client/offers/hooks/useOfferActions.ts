import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import {
  useAcceptOfferMutation,
  useRejectOfferMutation,
  useCounterOfferMutation,
  useWithdrawOfferMutation,
} from "@/store/api/offersApi";
import { extractErrorMessage, setFormErrors } from "@/lib/errorHandler";
import type { OfferCounterFormData } from "@/schemas/marketplace/offer.schema";

interface UseOfferActionsOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useOfferActions = (options: UseOfferActionsOptions = {}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { onSuccess, onError } = options;

  const [acceptOfferMutation, { isLoading: isAccepting }] = useAcceptOfferMutation();
  const [rejectOfferMutation, { isLoading: isRejecting }] = useRejectOfferMutation();
  const [counterOfferMutation, { isLoading: isCountering }] = useCounterOfferMutation();
  const [withdrawOfferMutation, { isLoading: isWithdrawing }] = useWithdrawOfferMutation();

  const handleAccept = async (offerId: number, refetch?: () => void) => {
    try {
      await acceptOfferMutation(offerId).unwrap();
      toast({
        title: t("offers.actions.accept_success"),
        description: t("offers.actions.accept_success_desc"),
      });
      refetch?.();
      onSuccess?.();
    } catch (error: unknown) {
      console.error({ error });
      const errorMessage = extractErrorMessage(error);
      toast({
        title: t("offers.actions.accept_error"),
        description: errorMessage || t("offers.actions.accept_error_desc"),
        variant: "destructive",
      });
      onError?.(error);
    }
  };

  const handleReject = async (offerId: number, refetch?: () => void) => {
    try {
      await rejectOfferMutation(offerId).unwrap();
      toast({
        title: t("offers.actions.reject_success"),
        description: t("offers.actions.reject_success_desc"),
      });
      refetch?.();
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error);
      toast({
        title: t("offers.actions.reject_error"),
        description: errorMessage || t("offers.actions.reject_error_desc"),
        variant: "destructive",
      });
      onError?.(error);
    }
  };

  const handleCounter = async (
    offerId: number,
    data: OfferCounterFormData,
    options?: {
      refetch?: () => void;
      form?: {
        setError: (name: keyof OfferCounterFormData, error: { type?: string; message: string }) => void;
        reset: () => void;
      };
      onSuccess?: () => void;
    }
  ) => {
    try {
      await counterOfferMutation({
        id: offerId,
        data: {
          amount: data.amount,
          message: data.message || undefined,
        },
      }).unwrap();
      toast({
        title: t("offers.actions.counter_success"),
        description: t("offers.actions.counter_success_desc"),
      });
      options?.form?.reset();
      options?.refetch?.();
      options?.onSuccess?.();
      onSuccess?.();
    } catch (error: unknown) {
      // Set form field errors if form is provided
      if (options?.form) {
        const hasFieldErrors = setFormErrors<OfferCounterFormData>(
          options.form,
          error,
          undefined,
          ["amount", "message"]
        );

        // Show general error toast if no field-specific errors were set
        if (!hasFieldErrors) {
          const errorMessage = extractErrorMessage(error);
          toast({
            title: errorMessage || t("offers.actions.counter_error"),
            variant: "destructive",
          });
        }
      } else {
        // No form, just show error toast
        const errorMessage = extractErrorMessage(error);
        toast({
          title: errorMessage || t("offers.actions.counter_error"),
          description: t("offers.actions.counter_error_desc"),
          variant: "destructive",
        });
      }
      onError?.(error);
    }
  };

  const handleWithdraw = async (offerId: number, refetch?: () => void) => {
    try {
      await withdrawOfferMutation(offerId).unwrap();
      toast({
        title: t("offers.actions.withdraw_success"),
        description: t("offers.actions.withdraw_success_desc"),
      });
      refetch?.();
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error);
      toast({
        title: t("offers.actions.withdraw_error"),
        description: errorMessage || t("offers.actions.withdraw_error_desc"),
        variant: "destructive",
      });
      onError?.(error);
    }
  };

  return {
    handleAccept,
    handleReject,
    handleCounter,
    handleWithdraw,
    isAccepting,
    isRejecting,
    isCountering,
    isWithdrawing,
  };
};

