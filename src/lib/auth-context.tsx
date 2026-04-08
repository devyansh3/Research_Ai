import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginRequest,
  logoutRequest,
  meRequest,
  signupRequest,
  type AuthUser,
} from "./api/auth-api";

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  city?: string;
  business?: string;
  referralSource?: string;
  onboardingComplete?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toUser(authUser: AuthUser): User {
  return {
    id: String(authUser.id),
    email: authUser.email,
    role: authUser.role,
    onboardingComplete: true,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function bootstrap(): Promise<void> {
      try {
        const me = await meRequest();
        if (!cancelled) setUser(toUser(me));
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const loggedIn = await loginRequest({ email, password });
    setUser(toUser(loggedIn));
    navigate("/dashboard");
  };

  const signup = async (email: string, password: string) => {
    const created = await signupRequest({ email, password });
    setUser({ ...toUser(created), onboardingComplete: false });
    navigate("/onboarding");
  };

  const logout = () => {
    void (async () => {
      try {
        await logoutRequest();
      } finally {
        setUser(null);
        navigate("/login");
      }
    })();
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      // Onboarding/profile persistence is intentionally disabled in this phase.
      setUser({ ...user, ...data });
    }
  };

  const completeOnboarding = () => {
    if (user) {
      setUser({ ...user, onboardingComplete: true });
      navigate("/dashboard");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signup, logout, updateUser, completeOnboarding }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
