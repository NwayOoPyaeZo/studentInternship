import React, { useState } from 'react';
import { View, StyleSheet, Alert, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Avatar, useTheme } from 'react-native-paper';
import { supabase } from '../lib/supabase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const theme = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Missing Information", "Please enter your email and password to continue.");
    }

    setLoading(true);
    try {
      // 1. Authenticate the user
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (authError) {
        if (authError.message.includes("Email not confirmed")) {
          Alert.alert("Verify Your Email", "Please check your inbox for the verification link.");
        } else {
          Alert.alert("Login Failed", "Invalid email or password.");
        }
        setLoading(false);
        return;
      }

      if (user) {
        // 2. CHECK: Does this user have a completed profile?
        // We look for 'name' because it's a required field in your setup screen.
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();

        // 3. ROUTE: Send to Setup if profile is missing, otherwise Home
        if (!profile || !profile.name) {
          navigation.replace('SetupProfile'); 
        } else {
          navigation.replace('Home');
        }
      }
    } catch (err) {
      Alert.alert("Connection Error", "Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.flex}
      >
        <View style={styles.center}>
          <Avatar.Icon size={84} icon="account-tie" style={styles.avatar} />
          <Text variant="headlineMedium" style={styles.authTitle}>InternPortal</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Secure access for engineering interns</Text>
        </View>

        <View style={styles.form}>
          <TextInput 
            label="Email Address" 
            mode="outlined" 
            autoCapitalize="none" 
            keyboardType="email-address"
            value={email} 
            onChangeText={setEmail} 
            left={<TextInput.Icon icon="email-outline" />}
            style={styles.inputSpacing} 
          />
          
          <TextInput 
            label="Password" 
            mode="outlined" 
            secureTextEntry={secureText} 
            value={password} 
            onChangeText={setPassword} 
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon 
                icon={secureText ? "eye" : "eye-off"} 
                onPress={() => setSecureText(!secureText)} 
              />
            }
            style={styles.inputSpacing} 
          />

          <TouchableOpacity 
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPasswordContainer}
          >
            <Text style={[styles.linkText, { color: theme.colors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button 
            mode="contained" 
            loading={loading} 
            disabled={loading} 
            onPress={handleLogin} 
            style={styles.mainBtn}
            contentStyle={styles.btnContent}
          >
            Login
          </Button>

          <View style={styles.footer}>
            <Text variant="bodyMedium">New here? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                Create an Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, justifyContent: 'center' },
  authContainer: { flex: 1, paddingHorizontal: 32, backgroundColor: '#fff' },
  center: { alignItems: 'center', marginBottom: 48 },
  avatar: { backgroundColor: '#6200ee' },
  authTitle: { marginTop: 16, fontWeight: 'bold', color: '#6200ee' },
  subtitle: { color: '#757575', marginTop: 4 },
  form: { width: '100%' },
  inputSpacing: { marginBottom: 12 },
  forgotPasswordContainer: { alignSelf: 'flex-end', marginBottom: 24 },
  mainBtn: { borderRadius: 12 },
  btnContent: { height: 54 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  linkText: { fontWeight: 'bold' },
});