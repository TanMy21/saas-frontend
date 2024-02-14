import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { setCredentials, logOut } from "../slices/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8686",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // const acc_token = Cookies.get("acc_tk");
    /* console.log("Slice Token: ", acc_token);*/
    // const state = getState() as RootState;
    const token = (getState() as RootState).auth.token;
    console.log("Slice Token: ", token);
    if (token) {
      console.log("Inside if token: ", token);
      headers.set("authorization", `Bearer ${token}`);
    }
    console.log("Slice Headers: ", headers.get("authorization"));
    console.log("Slice Token: ", token);
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // console.log(args) // request url, method, body
  // console.log(api) // signal, dispatch, getState()
  // console.log(extraOptions) //custom like {shout: true}

  let result = await baseQuery(args, api, extraOptions);
  console.log("Slice Result: ", result);
  // If you want, handle other status codes, too
  if (result?.error?.status === 403) {
    console.log("sending refresh token");

    // send refresh token to get new access token
    const refreshResult = await baseQuery("/refresh", api, extraOptions);
    console.log("Refresh Send: ", refreshResult);
    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials(refreshResult?.data));

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        (refreshResult.error.data as { message: string }).message =
          "Your login has expired. ";
      }
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: () => ({}),
});
