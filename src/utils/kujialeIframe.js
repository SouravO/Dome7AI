/**
 * Sandbox + permissions for embedded Kujiale (trusted origin).
 * Downloads often use popups or programmatic save — default sandbox blocks these.
 */
export const KUJIALE_IFRAME_SANDBOX = [
  "allow-scripts",
  "allow-forms",
  "allow-same-origin",
  "allow-popups",
  "allow-popups-to-escape-sandbox",
  "allow-downloads",
  "allow-modals",
  "allow-top-navigation-by-user-activation",
].join(" ");

/** no-referrer can break signed download URLs from Kujiale CDNs */
export const KUJIALE_IFRAME_REFERRER_POLICY = "strict-origin-when-cross-origin";

export const KUJIALE_IFRAME_ALLOW =
  "fullscreen; clipboard-read; clipboard-write; downloads";
