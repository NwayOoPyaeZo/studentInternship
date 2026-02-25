import React, { useState, createContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const [attendance, setAttendance] = useState({});
  const [dailyLogs, setDailyLogs] = useState({});
  const [todos, setTodos] = useState([]);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
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
      profile, setProfile 
    }}>
      {children}
    </AppContext.Provider>
  );
};