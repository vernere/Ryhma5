import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../utils/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export const useAuth = () => useContext(AuthContext);

export function useUserRow() {
  const { user } = useAuth();
  const [userRow, setUserRow] = useState(null);
  const [loadingUserRow, setLoading] = useState(true);
  const [errorUserRow, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    async function fetchRow() {
      if (!user) {
        setUserRow(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("users")
        .select("id, username, email, is_onboarded, created_at")
        .eq("id", user.id)
        .single();

      if (!alive) return;
      if (error) setError(error);
      setUserRow(data ?? null);
      setLoading(false);
    }

    fetchRow();
    return () => { alive = false; };
  }, [user]);

  return { userRow, loadingUserRow, errorUserRow };
}