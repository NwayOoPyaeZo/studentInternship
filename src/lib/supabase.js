import { URL, URLSearchParams } from 'react-native-url-polyfill';

// 1. Force the polyfill into the environment FIRST
global.URL = URL;
global.URLSearchParams = URLSearchParams;

// 2. Now import the Supabase client library
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fymkxoqgnbiwravjmrby.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5bWt4b3FnbmJpd3JhdmptcmJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MDc0MDMsImV4cCI6MjA4NzM4MzQwM30.Gu6g-5KwdBKxo6ChYtVr6vMq1FGIMBOej9DLExdEexU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
