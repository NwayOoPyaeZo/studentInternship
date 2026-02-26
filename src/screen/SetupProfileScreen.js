import React, { useState, useContext } from 'react';
import { StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { supabase } from '../lib/supabase';
import { AppContext } from '../context/AppContext'; // Import the Context

export default function SetupProfileScreen({ navigation }) {
  // 1. Connect to AppContext to refresh global data
  const { refreshProfile } = useContext(AppContext);

  const [fullName, setFullName] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [studentId, setStudentId] = useState('');
  const [position, setPosition] = useState(''); 
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!fullName || !workplace || !studentId || !position) {
      return Alert.alert("Missing Details", "Please fill in all fields to continue.");
    }

    setLoading(true);
    try {
      // 2. Get the current Auth user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // 3. Upsert the profile data
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            name: fullName,
            workplace: workplace,
            student_id: studentId,
            position: position,
            role: 'student',    
            email: user.email
          }, { onConflict: 'id' });

        if (error) throw error;

        // 4. CRITICAL: Update the global AppContext so other screens see the changes
        if (refreshProfile) {
          await refreshProfile();
        }

        Alert.alert("Success!", "Profile completed.");
        
        // 5. Replace navigation so user can't go "back" to setup
        navigation.replace('Home'); 
      }
    } catch (err) {
      Alert.alert("Save Failed", err.message);
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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text variant="headlineSmall" style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Finalize your details for the {workplace || 'workplace'} portal.</Text>

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
            label="Workplace"
            placeholder="e.g. Luna Edge"
            mode="outlined"
            value={workplace}
            onChangeText={setWorkplace}
            style={styles.input}
            left={<TextInput.Icon icon="office-building" />}
          />

          <TextInput
            label="Position"
            placeholder="e.g. Software Engineer Intern"
            mode="outlined"
            value={position}
            onChangeText={setPosition}
            style={styles.input}
            left={<TextInput.Icon icon="briefcase" />}
          />

          <Button
            mode="contained"
            loading={loading}
            onPress={handleSaveProfile}
            style={styles.button}
            contentStyle={{ height: 54 }}
          >
            Finish Setup
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 30, flexGrow: 1, justifyContent: 'center' },
  title: { textAlign: 'center', fontWeight: 'bold', color: '#6200ee' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: 30, marginTop: 5 },
  input: { marginBottom: 15 },
  button: { marginTop: 10, borderRadius: 12 },
});