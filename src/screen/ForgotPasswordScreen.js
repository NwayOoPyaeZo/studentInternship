import React, { useState } from 'react';
import { StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform, View } from 'react-native';
import { TextInput, Button, Text, IconButton, useTheme } from 'react-native-paper';
import { supabase } from '../lib/supabase';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleResetRequest = async () => {
    // Basic validation
    if (!email) {
      return Alert.alert("Required", "Please enter your email address to receive a reset link.");
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return Alert.alert("Invalid Email", "Please enter a valid email address.");
    }

    setLoading(true);
    try {
      /**
       * CRITICAL UPDATE: 
       * We changed 'internportal' to 'studentintern' to match your app.json scheme.
       * This ensures the link in the email opens your app instead of localhost:3000.
       */
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'studentintern://reset-password', 
      });

      if (error) throw error;

      Alert.alert(
        "Link Sent!",
        `We've sent a password reset link to ${email}. Please check your inbox and spam folder.`,
        [{ text: "Back to Login", onPress: () => navigation.navigate('Login') }]
      );
    } catch (err) {
      Alert.alert("Request Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Professional Header with Back Navigation */}
      <View style={styles.header}>
        <IconButton 
          icon="arrow-left" 
          size={28} 
          iconColor={theme.colors.primary} 
          onPress={() => navigation.goBack()} 
        />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.content}
      >
        <View style={styles.textContainer}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
            Forgot Password?
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Don't worry! Enter your registered email below and we'll send you instructions to reset your password.
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email Address"
            mode="outlined"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="done"
            value={email}
            onChangeText={setEmail}
            left={<TextInput.Icon icon="email-outline" />}
            style={styles.input}
            outlineStyle={{ borderRadius: 12 }}
          />

          <Button
            mode="contained"
            loading={loading}
            disabled={loading}
            onPress={handleResetRequest}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Send Reset Link
          </Button>

          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backToLoginTouch}
          >
            <Text style={[styles.linkText, { color: theme.colors.primary }]}>
              Suddenly remembered? Log In
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 10, paddingTop: 10 },
  content: { flex: 1, paddingHorizontal: 30, justifyContent: 'center' },
  textContainer: { marginBottom: 40 },
  title: { fontWeight: 'bold', letterSpacing: 0.5, marginBottom: 12 },
  subtitle: { color: '#666', lineHeight: 24 },
  form: { width: '100%' },
  input: { marginBottom: 25 },
  button: { borderRadius: 12, elevation: 2 },
  buttonContent: { height: 54 },
  buttonLabel: { fontSize: 16, fontWeight: 'bold' },
  backToLoginTouch: { marginTop: 25, alignSelf: 'center' },
  linkText: { fontWeight: '600' }
});