import type { AuthUser } from "@/types/auth";

const TOKEN_KEY = "qr-access-token";
const USER_KEY = "qr-access-user";
const EXPIRY_KEY = "qr-access-expires";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export function getAuthExpiry(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(EXPIRY_KEY);
}

export function setAuthExpiry(expiresAt: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(EXPIRY_KEY, expiresAt);
}

export function clearAuthExpiry(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(EXPIRY_KEY);
}

export function getSavedUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function saveUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSavedUser(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(USER_KEY);
}

export function clearAuthData(): void {
  clearAuthToken();
  clearSavedUser();
  clearAuthExpiry();
}
