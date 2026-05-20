import { endpoints } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/http/api-client";
import { setAuthToken, clearAuthToken } from "@/lib/http/auth-token";
import type { LoginInput, LoginResponse } from "@/types/auth";

export const authApi = {
  login: async (payload: LoginInput): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse, LoginInput>(
      endpoints.authLogin,
      payload,
    );

    if (response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post<void>(endpoints.authLogout);
    } finally {
      clearAuthToken();
    }
  },
};
