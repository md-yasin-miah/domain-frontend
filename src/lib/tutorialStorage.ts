const TUTORIAL_KEY_TOKEN = "tutorial";

export const SELLER_LISTING_TUTORIAL_PENDING_KEY =
  "seller_listing_tutorial_pending";
export const SELLER_LISTING_TUTORIAL_COMPLETED_KEY =
  "seller_listing_tutorial_completed";

/** Full offers tutorial (list + detail) completed */
export const CLIENT_OFFERS_TUTORIAL_COMPLETED_KEY =
  "client_offers_tutorial_completed";
/** User requested replay from FAB; cleared when list tour starts or finishes */
export const CLIENT_OFFERS_TUTORIAL_PENDING_KEY =
  "client_offers_tutorial_pending";

export function markClientOffersTutorialPending() {
  localStorage.setItem(CLIENT_OFFERS_TUTORIAL_PENDING_KEY, "1");
  localStorage.removeItem(CLIENT_OFFERS_TUTORIAL_COMPLETED_KEY);
}


export function completeClientOffersTutorial() {
  localStorage.removeItem(CLIENT_OFFERS_TUTORIAL_PENDING_KEY);
  localStorage.setItem(CLIENT_OFFERS_TUTORIAL_COMPLETED_KEY, "1");
}

export function clearClientOffersTutorialPendingOnly() {
  localStorage.removeItem(CLIENT_OFFERS_TUTORIAL_PENDING_KEY);
}

export function markSellerListingTutorialPending() {
  localStorage.setItem(SELLER_LISTING_TUTORIAL_PENDING_KEY, "1");
  localStorage.removeItem(SELLER_LISTING_TUTORIAL_COMPLETED_KEY);
}

export function resetSellerListingTutorialProgress() {
  localStorage.removeItem(SELLER_LISTING_TUTORIAL_COMPLETED_KEY);
  localStorage.setItem(SELLER_LISTING_TUTORIAL_PENDING_KEY, "1");
}

export function clearAllTutorialStorageKeys(): string[] {
  const removedKeys: string[] = [];

  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    if (!key) continue;
    if (!key.toLowerCase().includes(TUTORIAL_KEY_TOKEN)) continue;
    localStorage.removeItem(key);
    removedKeys.push(key);
  }

  return removedKeys;
}
