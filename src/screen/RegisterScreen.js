import React, { useState } from "react";
import {
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  HelperText,
  useTheme,
} from "react-native-paper";
import { supabase } from "../lib/supabase";

export default function RegisterScreen({ navigation }) {
  const theme = useTheme();

  // Auth States Only
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation
  const isEmailInvalid = () => email.length > 0 && !email.includes("@");
  const isFormIncomplete = () => !email || !password;

  const handleRegister = async () => {
    if (isFormIncomplete()) return Alert.alert("Error", "Please enter an email and password.");
    setLoading(true);

    try {
      // 1. Simple Auth Sign Up
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password 
      });

      if (error) throw error;

      if (data.user) {
        Alert.alert(
          "Verification Sent", 
          "Please check your email to verify your account. After that, you can log in to set up your profile.",
          [{ text: "Go to Login", onPress: () => navigation.navigate('Login') }]
        );
      }
    } catch (err) {
      Alert.alert("Registration Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text variant="headlineSmall" style={styles.title}>
            Join InternPortal
          </Text>
          <Text style={styles.subtitle}>
            Create your account to get started.
          </Text>

          <View style={styles.authSection}>
            <TextInput
              label="Email"
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              error={isEmailInvalid()}
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
            />
            <HelperText type="error" visible={isEmailInvalid()}>
              Invalid email address.
            </HelperText>
          </View>

          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
          />

          <Button
            mode="contained"
            loading={loading}
            disabled={loading || isEmailInvalid()}
            onPress={handleRegister}
            style={styles.registerBtn}
            contentStyle={{ height: 54 }}
          >
            Sign Up
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            Already have an account? Login
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 25, justifyContent: 'center', flexGrow: 1 },
  title: { textAlign: "center", fontWeight: "bold", color: "#6200ee" },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 25,
    marginTop: 5,
  },
  input: { marginBottom: 12 },
  authSection: { marginTop: 5 },
  registerBtn: { marginTop: 15, borderRadius: 12 },
  backBtn: { marginTop: 10 },
});