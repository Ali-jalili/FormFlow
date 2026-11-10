/** @format */

import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { supabase } from "../../lib/supabaseClient";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) return setUser(session.user);
        else {
          setUser(null);
        }

        setIsLoading(false);
      },
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
      setIsLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    setUser(data.user);

    return data.user;
  }

  async function handleSignup(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) throw error;

    // When email confirmation is enabled, Supabase creates the account but
    // no session exists yet — report that so the UI can tell the user to
    // confirm their email before logging in.
    return {
      user: data.user,
      session: data.session,
      needsEmailConfirmation: !data.session,
    };
  }

  async function handleLogout() {
    // Drop any per-user caches so the next sign-in never sees stale data.
    queryClient.clear();

    // Remove all builder drafts / dismissed-banner keys from this browser.
    const keysToRemove = Object.keys(localStorage).filter(
      (key) =>
        key.startsWith("form-draft-") ||
        key.startsWith("published-banner-dismissed-"),
    );

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    await supabase.auth.signOut();
  }

  const value = { user, isLoading, handleLogin, handleSignup, handleLogout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
