export interface UserInfo {
  accessToken: string;
}

export type AuthInitialState = {
  token: string | null;
};
