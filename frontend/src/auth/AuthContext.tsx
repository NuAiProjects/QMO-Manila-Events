import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/api";

type Profile = {
  firstname: string;
  role: string;
  email: string;
};

type AuthContextType = {
  user: any;
  profile: Profile | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // 1️⃣ Restore session
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (!mounted) return;

        setUser(session?.user ?? null);

        // 2️⃣ Load profile (NON-BLOCKING)
        if (session) {
          apiFetch("/api/v1/me")
            .then(setProfile)
            .catch(() => setProfile(null));
        } else {
          setProfile(null);
        }
      } finally {
        // 3️⃣ ALWAYS end loading
        if (mounted) setLoading(false);
      }
    };

    init();

    // 4️⃣ Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);

        if (session) {
          apiFetch("/api/v1/me")
            .then(setProfile)
            .catch(() => setProfile(null));
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
