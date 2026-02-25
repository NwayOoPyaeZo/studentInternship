import React, { useState } from 'react';
import { StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform, View } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { supabase } from '../lib/supabase';

export default function ResetPasswordScreen({ navigation }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const theme = useTheme();

  const handleUpdatePassword = async () => {
    // 1. Validation Logic
    if (!newPassword || newPassword.length < 6) {
      return Alert.alert("Security", "Password must be at least 6 characters long.");
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert("Mismatch", "Passwords do not match. Please try again.");
    }

    setLoading(true);
    try {
      /**
       * PROFESSIONAL NOTE: When a user arrives here via a recovery link, 
       * Supabase has already established a temporary "recovery" session.
       * updateUser({ password }) is the secure way to finalize the change.
       */
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (error) throw error;

      Alert.alert(
        "Password Updated", 
        "Your new password is set! You can now log in to the InternPortal.",
        [{ text: "Login Now", onPress: () => navigation.replace('Login') }]
      );
    } catch (err) {
      Alert.alert("Update Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.content}
      >
        <View style={styles.headerContainer}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
            Secure Your Account
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Almost there! Please enter your new password below to regain access.
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="New Password"
            mode="outlined"
            secureTextEntry={secureText}
            value={newPassword}
            onChangeText={setNewPassword}
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon 
                icon={secureText ? "eye" : "eye-off"} 
                onPress={() => setSecureText(!secureText)} 
              />
            }
            style={styles.input}
            outlineStyle={{ borderRadius: 12 }}
          />

          <TextInput
            label="Confirm New Password"
            mode="outlined"
            secureTextEntry={secureText}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            left={<TextInput.Icon icon="lock-check-outline" />}
            style={styles.input}
            outlineStyle={{ borderRadius: 12 }}
          />

          <Button
            mode="contained"
            loading={loading}
            disabled={loading}
            onPress={handleUpdatePassword}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Update Password
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, paddingHorizontal: 30, justifyContent: 'center' },
  headerContainer: { marginBottom: 40 },
  title: { fontWeight: 'bold', letterSpacing: 0.5, marginBottom: 12 },
  subtitle: { color: '#666', lineHeight: 24 },
  form: { width: '100%' },
  input: { marginBottom: 15 },
  button: { borderRadius: 12, marginTop: 15, elevation: 2 },
  buttonContent: { height: 54 },
  buttonLabel: { fontSize: 16, fontWeight: 'bold' },
});