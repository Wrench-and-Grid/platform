export type ReturnAnchor = `#${string}`;

type ReturnAnchorState = {
  returnTo?: ReturnAnchor;
};

export function getReturnToHash(locationState: unknown, fallback: ReturnAnchor): ReturnAnchor {
  const returnTo =
    typeof locationState === "object" &&
    locationState !== null &&
    "returnTo" in locationState &&
    typeof (locationState as ReturnAnchorState).returnTo === "string"
      ? (locationState as ReturnAnchorState).returnTo
      : null;

  if (returnTo?.startsWith("#")) {
    return returnTo;
  }

  return fallback;
}
