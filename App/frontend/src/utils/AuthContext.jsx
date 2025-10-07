import { createContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [passwordRecovery, setPasswordRecovery] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let userId = null;
        let userSubscription = null;

        const getSession = async () => {
            const { data } = await supabase.auth.getSession();

            if (data.session === null) {
                setLoading(false);
                return;
            }

            userId = data.session.user.id;

            const { data: userData } = await supabase
                .from("users")
                .select("username, is_onboarded")
                .eq("id", userId);

            data.session.user = { ...data.session.user, ...userData?.[0] };
            setUser(data.session.user ?? null);
            setLoading(false);
            
            userSubscription = supabase
                .channel(`user-updates-${userId}`)
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "users",
                        filter: `id=eq.${userId}`,
                    },
                    (payload) => {
                        console.log("User updated:", payload);
                        setUser((prevUser) => ({
                            ...prevUser,
                            ...payload.new,
                        }));
                    }
                )
                .subscribe();
        };

        getSession();

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
                if (_event === "PASSWORD_RECOVERY") setPasswordRecovery(true);
            }
        );

        return () => {
            listener.subscription.unsubscribe();
            if (userSubscription) supabase.removeChannel(userSubscription);
        };
    }, []);

    const usernameToId = async (username) => {
        const { data, error } = await supabase
            .from("users")
            .select("id")
            .eq("username", username)
            .single();
        if (error) {
            console.error("Error fetching user ID:", error);
            return null;
        }
        return data?.id || null;
    };

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        return data.user;
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data.user;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
    };

    const resetPassword = async (email) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(
            email,
            {
                redirectTo: import.meta.env.VITE_CHANGE_PASSWORD_URL,
            }
        );
        if (error) throw error;
        return data;
    };

    const changePassword = async (password) => {
        const { data, error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        return data;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signUp,
                usernameToId,
                signIn,
                signOut,
                resetPassword,
                passwordRecovery,
                setPasswordRecovery,
                changePassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
