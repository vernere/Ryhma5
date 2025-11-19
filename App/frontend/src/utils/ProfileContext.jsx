import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { i18n } = useTranslation();

    useEffect(() => {
        if (user) {
            setLoading(true);

            supabase
                .from("users")
                .select("username, is_onboarded, language")
                .eq("id", user.id)
                .single()
                .then(({ data, error }) => {
                    if (error) {
                        console.error("Error fetching profile:", error);
                    } else {
                        setProfile(data);
                        if (data.language) {
                            i18n.changeLanguage(data.language);
                        }
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

ProfileProvider.propTypes = {
    children: PropTypes.node.isRequired,
};