import React, { useContext, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import {
  Text,
  Avatar,
  Button,
  Card,
  TextInput,
  Divider,
  useTheme,
  IconButton,
  List,
} from "react-native-paper";
import { AppContext } from "../context/AppContext";
import { supabase } from "../lib/supabase";

export default function ProfileScreen({ navigation }) {
  const { profile, session, refreshProfile } = useContext(AppContext);
  const theme = useTheme();

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form States
  const [name, setName] = useState(profile?.name || "");
  const [position, setPosition] = useState(profile?.position || "");
  const [workplace, setWorkplace] = useState(profile?.workplace || "");
  const [studentId, setStudentId] = useState(profile?.student_id || "");

  // Keep local form states in sync if global profile changes
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPosition(profile.position || "");
      setWorkplace(profile.workplace || "");
      setStudentId(profile.student_id || "");
    }
  }, [profile]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (err) {
      console.error("Logout Error:", err.message);
      Alert.alert("Logout Failed", "Could not sign out. Please try again.");
    }
  };

  const handleUpdateProfile = async () => {
    if (!name || !position || !workplace || !studentId) {
      return Alert.alert(
        "Missing Information",
        "All fields are required to maintain your intern record.",
      );
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name,
          position,
          workplace,
          student_id: studentId,
        })
        .eq("id", session.user.id);

      if (error) throw error;

      // Sync global state immediately
      if (refreshProfile) {
        await refreshProfile();
      }

      setIsEditing(false);
      Alert.alert("Success", "Profile details updated at Luna Edge.");
    } catch (err) {
      Alert.alert("Update Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View
          style={[styles.header, { backgroundColor: theme.colors.primary }]}
        >
          <View style={styles.avatarContainer}>
            <Avatar.Icon
              size={100}
              icon="account-circle"
              style={styles.avatar}
              color={theme.colors.primary}
            />
            <IconButton
              icon="camera-flip"
              size={20}
              containerColor="#fff"
              style={styles.editAvatarBtn}
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Image upload functionality requires Supabase Storage setup.",
                )
              }
            />
          </View>
          <Text variant="headlineSmall" style={styles.userName}>
            {profile?.name || "Intern User"}
          </Text>
          <Text variant="bodyMedium" style={styles.userEmail}>
            {session?.user?.email}
          </Text>
        </View>

        <View style={styles.content}>
          {/* Main Info Card */}
          <Card style={styles.card}>
            <Card.Title
              title="Official Information"
              right={(props) => (
                <IconButton
                  {...props}
                  icon={isEditing ? "close-circle" : "pencil-circle"}
                  onPress={() => setIsEditing(!isEditing)}
                />
              )}
            />
            <Card.Content>
              {isEditing ? (
                <View style={styles.editForm}>
                  <TextInput
                    label="Full Name"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={styles.input}
                  />
                  <TextInput
                    label="Position"
                    value={position}
                    onChangeText={setPosition}
                    mode="outlined"
                    style={styles.input}
                  />
                  <TextInput
                    label="Workplace"
                    value={workplace}
                    onChangeText={setWorkplace}
                    mode="outlined"
                    style={styles.input}
                  />
                  <TextInput
                    label="Student ID"
                    value={studentId}
                    onChangeText={setStudentId}
                    mode="outlined"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  <Button
                    mode="contained"
                    onPress={handleUpdateProfile}
                    loading={loading}
                    style={styles.saveBtn}
                    contentStyle={styles.btnContent}
                  >
                    Save Changes
                  </Button>
                </View>
              ) : (
                <View>
                  <List.Item
                    title="Position"
                    description={profile?.position || "Not Set"}
                    left={(p) => <List.Icon {...p} icon="briefcase-account" />}
                  />
                  <Divider />
                  <List.Item
                    title="Workplace"
                    description={profile?.workplace || "Not Set"}
                    left={(p) => <List.Icon {...p} icon="office-building" />}
                  />
                  <Divider />
                  <List.Item
                    title="Student ID"
                    description={profile?.student_id || "Not Set"}
                    left={(p) => (
                      <List.Icon {...p} icon="card-account-details" />
                    )}
                  />
                </View>
              )}
            </Card.Content>
          </Card>

          {/* Location & Status Card */}
          <Card style={styles.card}>
            <Card.Content>
              <List.Item
                title="Location"
                description="Bangkok, Thailand"
                left={(p) => <List.Icon {...p} icon="map-marker-radius" />}
              />
              <Divider />
              <List.Item
                title="Access Level"
                description={
                  profile?.role === "admin" ? "Supervisor" : "Active Intern"
                }
                left={(p) => <List.Icon {...p} icon="shield-check" />}
              />
            </Card.Content>
          </Card>

          {!isEditing && (
            <Button
              mode="contained"
              icon="logout"
              onPress={handleLogout}
              style={styles.logoutBtn}
              buttonColor={theme.colors.error}
              contentStyle={styles.btnContent}
            >
              Log Out
            </Button>
          )}

          <Text style={styles.footerVersion}>
            InternPortal v1.2.0 • Build for SIBA college
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    alignItems: "center",
    paddingVertical: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  avatarContainer: { position: "relative" },
  avatar: { backgroundColor: "#fff", elevation: 6 },
  editAvatarBtn: { position: "absolute", bottom: 0, right: 0, elevation: 4 },
  userName: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 15,
    letterSpacing: 0.5,
  },
  userEmail: { color: "rgba(255, 255, 255, 0.9)", marginTop: 4 },
  content: { padding: 20 },
  card: {
    borderRadius: 16,
    elevation: 3,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  editForm: { marginTop: 10 },
  input: { marginBottom: 12 },
  saveBtn: { marginTop: 10, borderRadius: 12 },
  logoutBtn: { marginTop: 15, borderRadius: 12 },
  btnContent: { height: 50 },
  footerVersion: {
    textAlign: "center",
    color: "#bdbdbd",
    marginTop: 30,
    fontSize: 12,
  },
});
