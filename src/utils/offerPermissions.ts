// Offer type is defined in types/api/offers.d.ts
interface Offer {
  id: number;
  buyer_id: number;
  status: "pending" | "accepted" | "rejected" | "countered" | "withdrawn";
}

interface OfferPermissions {
  canAccept: boolean;
  canReject: boolean;
  canCounter: boolean;
  canWithdraw: boolean;
}

export const getOfferPermissions = (
  offerStatus: "pending" | "accepted" | "rejected" | "countered" | "withdrawn",
  userId: number,
  buyerId: number
): OfferPermissions => {
  if (!offerStatus) {
    return {
      canAccept: false,
      canReject: false,
      canCounter: false,
      canWithdraw: false,
    };
  }

  const isAccepted = offerStatus === "accepted";
  const isBuyer = userId === buyerId;

  return {
    canAccept: !isAccepted && !isBuyer,
    canReject: !isAccepted,
    canCounter: !isAccepted,
    canWithdraw: !isAccepted && isBuyer,
  };
};

