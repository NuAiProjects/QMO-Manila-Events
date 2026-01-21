import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export interface AdminProfile {
  id: number;
  email: string;
  firstname: string;
  username: string;
  role: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      const authUser = data.user ?? null;
      setUser(authUser);

      if (authUser?.email) {
        const { data: profileData } = await supabase
          .from("nu_users")
          .select("*")
          .eq("email", authUser.email)
          .single();

        setProfile(profileData ?? null);
      }

      setLoading(false);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}
