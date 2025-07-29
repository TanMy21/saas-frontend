import type { Location } from "react-router-dom";

const useSurveyBuilderModalLocation = (location: Location) => {
  return {
    isOpen: location.state?.openModal || false,
    isOpenImport: location.state?.openModalImport || false,
    isOpenGenerate: location.state?.openModalGenerate || false,
  };
};

export default useSurveyBuilderModalLocation;
