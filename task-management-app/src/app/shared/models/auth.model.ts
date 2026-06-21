export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  username?: string;
}

export interface StoredCredentials {
  username: string;
  password: string;
}
