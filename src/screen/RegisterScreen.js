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

  // Auth States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Profile States
  const [fullName, setFullName] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [studentId, setStudentId] = useState("");

  const [loading, setLoading] = useState(false);

  // Validation
  const isEmailInvalid = () => email.length > 0 && !email.includes("@");
  const isFormIncomplete = () =>
    !email || !password || !fullName || !studentId || !workplace;

  const handleRegister = async () => {
    if (isFormIncomplete()) return Alert.alert("Error", "Fill all fields.");
    setLoading(true);

    try {
      // 1. Sign up the user in Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (data?.user) {
        // 2. THE NUCLEAR UPSERT
        // We use .upsert to tell the DB: "If you see this ID, just OVERWRITE it."
        const { error: profileError } = await supabase.from("profiles").upsert(
          {
            id: data.user.id,
            name: fullName,
            workplace: workplace,
            position: "Intern",
            student_id: studentId,
            role: "student",
            email: email,
          },
          { onConflict: "id" }, // This is the magic line that kills the pkey error
        );

        if (profileError) throw profileError;

        Alert.alert(
          "Success!",
          "Account created. Check your Gmail for the link.",
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
            Student Registration
          </Text>
          <Text style={styles.subtitle}>
            Setup your intern profile for {workplace || "your workplace"}.
          </Text>

          <TextInput
            label="Full Name"
            mode="outlined"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Student ID"
            mode="outlined"
            keyboardType="numeric"
            value={studentId}
            onChangeText={setStudentId}
            style={styles.input}
            left={<TextInput.Icon icon="card-account-details" />}
          />

          <TextInput
            label="Workplace (e.g., Luna Edge)"
            mode="outlined"
            value={workplace}
            onChangeText={setWorkplace}
            style={styles.input}
            left={<TextInput.Icon icon="office-building" />}
          />

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
            Create Student Account
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
  scrollContent: { padding: 25, paddingBottom: 40 },
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
