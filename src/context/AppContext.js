import React, { useState, createContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const [attendance, setAttendance] = useState({});
  const [dailyLogs, setDailyLogs] = useState({});
  const [todos, setTodos] = useState([]);
  const [profile, setProfile] = useState(null); // Initialize as null to track loading state

  // Function to fetch profile data from Supabase
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn("Profile fetch error:", error.message);
        setProfile({}); // Set empty object if not found
      } else {
        setProfile(data); // This now contains student_id, workplace, position, etc.
      }
    } catch (err) {
      console.error("Context Error:", err);
    }
  };

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsReady(true);
    });

    // 2. Listen for Auth Changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null); // Clear profile on logout
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isReady) return null;

  return (
    <AppContext.Provider value={{ 
      session, 
      attendance, setAttendance,
      dailyLogs, setDailyLogs,
      todos, setTodos,
      profile, setProfile,
      refreshProfile: () => session?.user && fetchProfile(session.user.id) // Helper to reload profile
    }}>
      {children}
    </AppContext.Provider>
  );
};