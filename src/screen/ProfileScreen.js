import React, { useContext } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Text, Avatar, Button, Card, List, Divider, useTheme } from 'react-native-paper';
import { AppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export default function ProfileScreen({ navigation }) {
  const { profile, session } = useContext(AppContext);
  const theme = useTheme();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout Error:", error.message);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <Avatar.Icon size={100} icon="account" style={styles.avatar} />
          <Text variant="headlineSmall" style={styles.userName}>
            {profile?.full_name || "Intern User"}
          </Text>
          <Text variant="bodyMedium" style={styles.userEmail}>
            {session?.user?.email}
          </Text>
        </View>

        <View style={styles.content}>
          {/* Internship Details */}
          <Card style={styles.card}>
            <Card.Content>
              <List.Section title="Internship Information">
                <List.Item
                  title="Role"
                  description="Software Engineering Intern"
                  left={props => <List.Icon {...props} icon="briefcase-outline" />}
                />
                <Divider />
                <List.Item
                  title="Location"
                  description="Bangkok, Thailand"
                  left={props => <List.Icon {...props} icon="map-marker-outline" />}
                />
                <Divider />
                <List.Item
                  title="Current Project"
                  description="Coffbee Cafe Website"
                  left={props => <List.Icon {...props} icon="code-tags" />}
                />
              </List.Section>
            </Card.Content>
          </Card>

          {/* Account Actions */}
          <Button 
            mode="contained" 
            icon="logout" 
            onPress={handleLogout} 
            style={styles.logoutBtn}
            buttonColor={theme.colors.error}
          >
            Log Out
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { alignItems: 'center', paddingVertical: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatar: { backgroundColor: '#fff', elevation: 4 },
  userName: { color: '#fff', fontWeight: 'bold', marginTop: 15 },
  userEmail: { color: 'rgba(255, 255, 255, 0.8)', marginTop: 4 },
  content: { padding: 20 },
  card: { borderRadius: 12, elevation: 2, marginBottom: 20 },
  logoutBtn: { marginTop: 10, borderRadius: 8 },
});