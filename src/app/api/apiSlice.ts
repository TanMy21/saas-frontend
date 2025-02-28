import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

import { setCredentials, logOut } from "../slices/authSlice";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL as string,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {


  let result = await baseQuery(args, api, extraOptions);


  if (result?.error?.status === 403) {
    // send refresh token to get new access token
    const refreshResult = await baseQuery("/refresh", api, extraOptions);

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials(refreshResult?.data));

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (
        typeof refreshResult?.error?.status === "number" &&
        [403, 401, 500].includes(refreshResult?.error?.status)
      ) {
        localStorage.removeItem("persist");
        api.dispatch(logOut());
        (refreshResult?.error?.data as { message: string }).message =
          "Your login has expired. Please Login again ";
      }
      return refreshResult;
    }
  }

  if (result?.error?.status === 429) {
    // Display a notification or alert to the user
    (result.error.data as { message: string }).message =
      "Too many requests. Please wait for a minute and try again.";
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Surveys",
    "Workspaces",
    "Elements",
    "Flow",
    "Options",
    "Results",
    "Insights",
  ],
  endpoints: () => ({}),
});
