import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import * as Linking from 'expo-linking';

import { AppProvider } from './src/context/AppContext';
import LoginScreen from './src/screen/LoginScreen';
import RegisterScreen from './src/screen/RegisterScreen';
import SetupProfileScreen from './src/screen/SetupProfileScreen'; // New
import HomeScreen from './src/screen/HomeScreen';
import ProfileScreen from './src/screen/ProfileScreen';
import ForgotPasswordScreen from './src/screen/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screen/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

const prefix = Linking.createURL('/');

export default function App() {
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Login: 'login',
        Register: 'register',
        SetupProfile: 'setup-profile', // Added for deep linking support
        ForgotPassword: 'forgot-password',
        ResetPassword: 'reset-password',
        Home: 'home',
      },
    },
  };

  return (
    <AppProvider>
      <PaperProvider>
        <NavigationContainer linking={linking}>
          <Stack.Navigator 
            screenOptions={{ 
              headerStyle: { backgroundColor: '#6200ee' }, 
              headerTintColor: '#fff' 
            }}
          >
            {/* Authentication Flow */}
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Reset' }} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: 'New Password' }} />
            
            {/* Onboarding Flow (The Second Step) */}
            <Stack.Screen 
              name="SetupProfile" 
              component={SetupProfileScreen} 
              options={{ title: 'Complete Profile', headerLeft: () => null }} // Disable back button during setup
            />

            {/* Main Application Flow */}
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Intern Dashboard', headerBackVisible: false }} 
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AppProvider>
  );
}