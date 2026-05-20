"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import {
  clearAuthData,
  getAuthExpiry,
  getAuthToken,
  getSavedUser,
  saveUser,
  setAuthExpiry,
} from "@/lib/http/auth-token";
import type { AuthUser } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check token validity on mount
  useEffect(() => {
    const token = getAuthToken();
    const saved = getSavedUser();
    const expiresAt = getAuthExpiry();

    if (token && saved && expiresAt) {
      if (new Date(expiresAt) <= new Date()) {
        clearAuthData();
      } else {
        setUser(saved);
      }
    }

    setIsLoading(false);
  }, []);

  // Listen for session expired events from api-client (401 responses)
  useEffect(() => {
    const handleExpired = (): void => {
      setUser(null);
    };
    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, []);

  // Redirect based on auth state
  useEffect(() => {
    if (isLoading) return;

    const isLoginPage = pathname === "/login";
    const hasToken = !!getAuthToken();

    if (!hasToken && !isLoginPage) {
      router.replace("/login");
    }

    if (hasToken && isLoginPage) {
      router.replace("/");
    }
  }, [isLoading, pathname, router]);

  const login = useCallback(async (username: string, password: string) => {
    const response = await authApi.login({ username, password });

    const authUser: AuthUser = {
      idUsuario: response.usuario.idUsuario,
      username: response.usuario.username,
      rol: response.usuario.rol,
      nombreCompleto: response.usuario.nombreCompleto,
    };

    saveUser(authUser);
    setAuthExpiry(response.expiraEn);
    setUser(authUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if logout API fails, clear local state
    }

    clearAuthData();
    setUser(null);
    router.replace("/login");
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
}
