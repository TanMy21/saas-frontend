import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

export const useCanvasLoadingAndError = (
  isLoading: boolean,
  isFetching: boolean,
  isError: boolean,
  setLoading: (val: boolean) => void
) => {
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(isLoading || isFetching);

    if (isError) {
      navigate("/login");
    }
  }, [isLoading, isFetching, isError]);
};