import type { DriveStep } from "driver.js";

/**
 * Structured offer tutorial aligned with backend flow:
 * POST /offers → pending; seller/buyer accept rules; POST /offers/{id}/accept creates order;
 * reject / counter / withdraw; creating an offer also ensures a chat conversation.
 */
export function getClientOffersListTutorialSteps(): DriveStep[] {
  return [
    {
      popover: {
        title: "How offers work",
        description:
          "Buyers submit an offer on an active listing. The seller can accept, reject, or counter. Accepting a pending offer creates an order, rejects other pending offers on that listing, and marks the listing sold. A conversation thread is created when an offer is submitted so you can message the other party.",
        side: "over",
        align: "center",
      },
    },
    {
      element: "[data-tour='offers-page-header']",
      popover: {
        title: "Your offers hub",
        description:
          "All offers where you are the buyer or the seller appear here. Use this page to track status and open an offer for full details.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "[data-tour='offers-search']",
      popover: {
        title: "Search",
        description: "Filter the current page of offers by listing title or related text.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "[data-tour='offers-status-filter']",
      popover: {
        title: "Status filter",
        description:
          "Match API statuses: pending, accepted, rejected, countered, withdrawn. Pending offers are the ones you can still act on.",
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "[data-tour='offers-table']",
      popover: {
        title: "Table & quick actions",
        description:
          "Accept, reject, counter, or withdraw from the row when your role allows. Open the eye icon for the full offer page and larger action buttons.",
        side: "top",
        align: "start",
      },
    },
    {
      popover: {
        title: "Submitting an offer (buyers)",
        description:
          "From the public marketplace or a listing page, use “Make offer”. You can only have one pending offer per listing. The app calls POST /offers with amount, currency, and optional message.",
        side: "over",
        align: "center",
      },
    },
  ];
}

export function getOfferDetailsTutorialSteps(): DriveStep[] {
  return [
    {
      popover: {
        title: "Offer detail",
        description:
          "Here you see one offer with listing context, buyer info, and timeline. Actions depend on your user id vs buyer/seller and on offer status (permissions match the backend accept/counter rules).",
        side: "over",
        align: "center",
      },
    },
    {
      element: "[data-tour='offer-detail-actions']",
      popover: {
        title: "Primary actions",
        description:
          "Accept: confirms the deal and starts the order flow (seller accepts buyer’s offer, or the eligible party accepts a counter). Reject, counter, or withdraw when shown.",
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "[data-tour='offer-detail-stats']",
      popover: {
        title: "Amount vs listing",
        description:
          "Compare offered amount to listing price and status at a glance before you decide.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "[data-tour='offer-detail-info']",
      popover: {
        title: "Full context",
        description:
          "Listing, buyer, expiry, timestamps, and optional message from the buyer.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "[data-tour='offer-detail-quick-actions']",
      popover: {
        title: "Next steps",
        description:
          "Jump to related areas: your listings or chat to continue the conversation alongside the offer.",
        side: "left",
        align: "start",
      },
    },
  ];
}
