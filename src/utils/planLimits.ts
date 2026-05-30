import { Tier } from "../types/userTypes";

export const PLAN_LIMITS = {
  FREE: {
    maxWorkspaces: 1,
    maxSurveys: 8,
  },
  PROFESSIONAL: {
    maxWorkspaces: Infinity,
    maxSurveys: Infinity,
  },
  ENTERPRISE: {
    maxWorkspaces: Infinity,
    maxSurveys: Infinity,
  },
};

export const getTierLevel = (tier: Tier) => {
  switch (tier) {
    case "FREE":
      return 1;

    case "PROFESSIONAL":
      return 2;

    case "ENTERPRISE":
      return 3;

    default:
      return 1;
  }
};

export const hasMinimumPlan = (currentTier: Tier, requiredTier: Tier) => {
  return getTierLevel(currentTier) >= getTierLevel(requiredTier);
};
