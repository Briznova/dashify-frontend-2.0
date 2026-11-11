const ACCESS_TOKEN_KEY = "dashify.api.access-token";
const REFRESH_TOKEN_KEY = "dashify.api.refresh-token";

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  rememberMe: boolean;
};

function getStorage(rememberMe: boolean): Storage {
  return rememberMe ? window.localStorage : window.sessionStorage;
}

export function getAccessToken(): string | null {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
    ?? window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY)
    ?? window.sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function saveAuthTokens(tokens: AuthTokens): void {
  clearAuthTokens();
  const storage = getStorage(tokens.rememberMe);
  storage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearAuthTokens(): void {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}
