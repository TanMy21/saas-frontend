import { useEffect } from "react";

import { selectUser, fetchUser } from "../app/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../app/typedReduxHooks";

const useFetchAuthenticatedUser = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);
};

export default useFetchAuthenticatedUser;
