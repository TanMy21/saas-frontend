import { User } from "../utils/types";

const useBuilderTourEnable = (user: User | null): boolean => {
  if (!user) return false;
  if (import.meta.env.VITE_ENABLE_BUILDER_TOUR !== "true") return false;
  const { hasCompletedBuilderTour, hasSkippedBuilderTour } = user.tours;
  return !hasCompletedBuilderTour && !hasSkippedBuilderTour;
};

export default useBuilderTourEnable;
