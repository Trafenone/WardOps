import { AuthResponse, LoginRequest, User } from "../lib/types";
import Cookies from "js-cookie";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7058";
const TOKEN_EXPIRY_DAYS = 7;

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/api/auth/login`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = response.data;
      this.setToken(data.token);
      this.setUser(data);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to login");
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const response = await axios.get<User>(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch {
      this.logout();
      return null;
    }
  }

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      Cookies.remove("token");
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (typeof window !== "undefined") {
      const cookieToken = Cookies.get("token");
      if (cookieToken) return cookieToken;
      return localStorage.getItem("token");
    }
    return null;
  }

  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      Cookies.set("token", token, {
        expires: TOKEN_EXPIRY_DAYS,
        sameSite: "strict",
        path: "/",
      });
    }
  }

  getUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        return JSON.parse(userStr);
      }
    }
    return null;
  }

  setUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }
}

export const authService = new AuthService();
export default authService;
