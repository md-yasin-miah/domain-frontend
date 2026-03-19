const TUTORIAL_KEY_TOKEN = "tutorial";

export const SELLER_LISTING_TUTORIAL_PENDING_KEY =
  "seller_listing_tutorial_pending";
export const SELLER_LISTING_TUTORIAL_COMPLETED_KEY =
  "seller_listing_tutorial_completed";

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
