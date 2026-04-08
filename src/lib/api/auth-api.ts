import { apiClient } from "./http";

export interface AuthUser {
  id: number;
  email: string;
  role: string;
}

interface AuthPayload {
  email: string;
  password: string;
}

export async function signupRequest(payload: AuthPayload): Promise<AuthUser> {
  const response = await apiClient.post<AuthUser>("/api/v1/auth/signup", payload);
  return response.data;
}

export async function loginRequest(payload: AuthPayload): Promise<AuthUser> {
  const response = await apiClient.post<AuthUser>("/api/v1/auth/login", payload);
  return response.data;
}

export async function meRequest(): Promise<AuthUser> {
  const response = await apiClient.get<AuthUser>("/api/v1/auth/me");
  return response.data;
}

export async function logoutRequest(): Promise<void> {
  await apiClient.post("/api/v1/auth/logout");
}
