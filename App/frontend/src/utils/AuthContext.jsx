import {createContext, useEffect, useState} from 'react';
import {supabase} from '../lib/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [passwordRecovery, setPasswordRecovery] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            const { data: userData, error } = await supabase
                .from("users")
                .select("username")
                .eq("id", data.session?.user?.id);

            data.session.user.username = userData ? userData[0].username : null;
            setUser(data.session?.user ?? null);
            setLoading(false);
        };

        getSession();

        const {data: listener} = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);

            if (_event === "PASSWORD_RECOVERY") {
                setPasswordRecovery(true);
            } else if (_event === "TOKEN_REFRESHED") {
                console.log('Token refreshed, re-establishing subscriptions...');
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const usernameToId = async (username) => {
        const {data, error} = await supabase
            .from('users')
            .select('id')
            .eq('username', username)
            .single();
        if (error) {
            console.error('Error fetching user ID:', error);
            return null;
        }
        return data?.id || null;
    };

    const signUp = async (email, password) => {
        const {data, error} = await supabase.auth.signUp({email, password});
        if (error) throw error;
        return data.user;
    };

    const signIn = async (email, password) => {
        const {data, error} = await supabase.auth.signInWithPassword({email, password});
        if (error) throw error;
        return data.user;
    };

    const signOut = async () => {
        const {error} = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
    };

    const resetPassword = async (email) => {
        const {data, error} = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: import.meta.env.VITE_CHANGE_PASSWORD_URL
        });
        if (error) throw error;
        return data;
    };

    const changePassword = async (password) => {
        const {data, error} = await supabase.auth.updateUser({password});
        if (error) throw error;
        return data;
    };

    return (<AuthContext.Provider value={{
        user, loading, signUp, usernameToId, signIn, signOut, resetPassword, passwordRecovery, setPasswordRecovery, changePassword
    }}>
        {children}
    </AuthContext.Provider>);
};