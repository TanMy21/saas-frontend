import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

import { showToast } from "../../utils/showToast";
import { logOut, setCredentials } from "../slices/authSlice";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL as string,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("x-no-csrf", `present`);

    return headers;
  },
});

type QueryResult = Awaited<ReturnType<typeof baseQuery>>;
type QueryApi = Parameters<typeof baseQuery>[1];
type QueryOptions = Parameters<typeof baseQuery>[2];

let refreshInFlight: Promise<QueryResult> | null = null;

function refreshSession(
  api: QueryApi,
  extraOptions: QueryOptions,
): Promise<QueryResult> {
  if (refreshInFlight) return refreshInFlight;

  const runRefresh = async (): Promise<QueryResult> => {
    const result = await baseQuery(
      {
        url: "/refresh",
        method: "GET",
        timeout: 15000,
      },
      { ...api, signal: new AbortController().signal },
      extraOptions,
    );

    if (result.error) {
      if (result.error.status === 401) {
        api.dispatch(logOut());
      }
      return result;
    }

    const data = result.data;
    if (
      typeof data !== "object" ||
      data === null ||
      !("accessToken" in data) ||
      typeof data.accessToken !== "string" ||
      !data.accessToken
    ) {
      return {
        error: {
          status: "CUSTOM_ERROR",
          error: "Refresh returned no access token.",
        },
      };
    }

    if (localStorage.getItem("persist") !== "true") {
      showToast.error("Please login again.");

      return {
        error: {
          status: 401,
          data: { message: "Signed out." },
        },
      };
    }

    api.dispatch(setCredentials({ accessToken: data.accessToken }));
    return result;
  };

  refreshInFlight = (async (): Promise<QueryResult> => {
    let attempt = 0;

    for (;;) {
      const result =
        typeof navigator !== "undefined" && "locks" in navigator
          ? await navigator.locks.request(
              `feedflo-refresh:${import.meta.env.VITE_BASE_URL}`,
              runRefresh,
            )
          : await runRefresh();

      const error = result.error;
      const status =
        error?.status === "PARSING_ERROR"
          ? error.originalStatus
          : error?.status;

      const temporary =
        status === "FETCH_ERROR" ||
        status === "TIMEOUT_ERROR" ||
        status === 408 ||
        status === 429 ||
        (typeof status === "number" && status >= 500 && status <= 599);

      if (
        !temporary ||
        attempt >= 3 ||
        localStorage.getItem("persist") !== "true"
      ) {
        if (error) {
          api.dispatch(logOut());
          window.location.replace("/login?reason=reconnect-failed");
        }

        return result;
      }
      let delay = 1000 * 2 ** attempt;
      attempt += 1;
      const retryAfter = result.meta?.response?.headers.get("Retry-After");

      if (retryAfter) {
        const seconds = Number(retryAfter);
        const requestedDelay = Number.isFinite(seconds)
          ? seconds * 1000
          : Date.parse(retryAfter) - Date.now();

        if (Number.isFinite(requestedDelay)) {
          delay = Math.max(delay, requestedDelay);
        }
      }

      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, delay);
      });

      if (localStorage.getItem("persist") !== "true") {
        return result;
      }
    }
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

function isAccessTokenFailure(error: FetchBaseQueryError | undefined): boolean {
  if (!error) return false;
  if (error.status === 401) return true;
  if (error.status !== 403) return false;

  const data = error.data;
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    data.message === "Forbidden"
  );
}

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? args : args.url;

  if (url === "/refresh") {
    return refreshSession(api, extraOptions);
  }

  const tokenBefore = (api.getState() as RootState).auth.token;
  let result = await baseQuery(args, api, extraOptions);

  if (
    tokenBefore &&
    url !== "/login" &&
    url !== "/auth/token" &&
    isAccessTokenFailure(result.error)
  ) {
    const currentToken = (api.getState() as RootState).auth.token;

    if (currentToken && currentToken !== tokenBefore) {
      return baseQuery(args, api, extraOptions);
    }

    const refreshed = await refreshSession(api, extraOptions);
    if (refreshed.error) return refreshed;

    result = await baseQuery(args, api, extraOptions);
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
    "Behavior",
    "Insights",
    "QuestionPreferences",
    "Organization",
    "Generate",
  ],
  endpoints: () => ({}),
});
