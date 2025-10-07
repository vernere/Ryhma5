import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);

            supabase
                .from("users")
                .select("username, is_onboarded")
                .eq("id", user.id)
                .single()
                .then(({ data, error }) => {
                    if (error) {
                        console.error("Error fetching profile:", error);
                    } else {
                        setProfile(data);
                    }
                    setLoading(false);
                });

            const subscription = supabase
                .channel(`profile-updates-${user.id}`)
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "users",
                        filter: `id=eq.${user.id}`,
                    },
                    (payload) => {
                        console.log("Profile updated:", payload.new);
                        setProfile(payload.new);
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(subscription);
            };
        } else {
            setProfile(null);
            setLoading(false);
        }
    }, [user]);

    return (
        <ProfileContext.Provider value={{ profile, loading }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext);