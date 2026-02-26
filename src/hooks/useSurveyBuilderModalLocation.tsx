import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import type { Location } from "react-router-dom";

const useSurveyBuilderModalLocation = (location: Location) => {
  const navigate = useNavigate();

  const openScratch = location.state?.openScratch ?? false;
  const openImport = location.state?.openImport ?? false;
  const openGenerate = location.state?.openGenerate ?? false;

  useEffect(() => {
    if (openScratch || openImport || openGenerate) {
      // Clear navigation state
      navigate(location.pathname, { replace: true });
    }
  }, [openScratch, openImport, openGenerate, navigate, location.pathname]);

  return {
    isOpen: openScratch,
    isOpenImport: openImport,
    isOpenGenerate: openGenerate,
  };
};

export default useSurveyBuilderModalLocation;
