import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import type { Location } from "react-router-dom";

const useSurveyBuilderModalLocation = (location: Location) => {
  const navigate = useNavigate();

  const openScratch = location.state?.openScratch ?? false;
  const openAssistant = location.state?.openAssistant ?? false;

  useEffect(() => {
    if (openScratch || openAssistant) {
      // Clear navigation state
      navigate(location.pathname, { replace: true });
    }
  }, [openScratch, openAssistant, navigate, location.pathname]);

  return {
    isOpen: openScratch,
    isOpenAssistant: openAssistant,
  };
};

export default useSurveyBuilderModalLocation;
