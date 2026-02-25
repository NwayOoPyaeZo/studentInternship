import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import * as Linking from 'expo-linking'; // Ensure you have expo-linking installed

import { AppProvider } from './src/context/AppContext';
import LoginScreen from './src/screen/LoginScreen';
import RegisterScreen from './src/screen/RegisterScreen';
import HomeScreen from './src/screen/HomeScreen';
import ProfileScreen from './src/screen/ProfileScreen';
import ForgotPasswordScreen from './src/screen/ForgotPasswordScreen'; // New
import ResetPasswordScreen from './src/screen/ResetPasswordScreen';   // New

const Stack = createNativeStackNavigator();

// Define your deep link prefix (e.g., internportal://)
const prefix = Linking.createURL('/');

export default function App() {
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Login: 'login',
        Register: 'register',
        ForgotPassword: 'forgot-password',
        ResetPassword: 'reset-password', // This matches the redirect in Supabase
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
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Reset' }} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: 'New Password' }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Intern Dashboard', headerBackVisible: false }} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AppProvider>
  );
}