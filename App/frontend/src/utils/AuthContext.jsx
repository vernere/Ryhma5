import {createContext, useEffect, useState} from 'react';
import {supabase} from '../lib/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const {data} = await supabase.auth.getSession();
            setUser(data.session?.user ?? null);
            setLoading(false);
        };

        getSession();

        const {data: listener} = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

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

    return (
        <AuthContext.Provider value={{user, loading, signUp, signIn, signOut, resetPassword, changePassword}}>
            {children}
        </AuthContext.Provider>
    );
};