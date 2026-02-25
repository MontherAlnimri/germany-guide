"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        const { data, error: e } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (e) setError(e.message); else setProfile(data as Profile);
      } catch { setError("Failed to fetch profile"); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return { error: "No profile" };
    const { data, error: e } = await supabase.from("profiles").update(updates).eq("id", profile.id).select().single();
    if (e) return { error: e.message };
    setProfile(data as Profile);
    return { error: null };
  };

  return { profile, loading, error, updateProfile };
}
