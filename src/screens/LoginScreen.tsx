import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, Text, TextInput, View } from 'react-native';
import { colors, spacing } from '../config/theme';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import auth from '@react-native-firebase/auth';

const USER_KEY = 'app_user';

const LoginScreen: React.FC<any> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Email and password are required.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters.');
      return false;
    }

    return true;
  };

  const onLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // firebase auth signin
      await auth().signInWithEmailAndPassword(email, password);
      setLoading(false);

      const res = await login(email, password);
      if (res.ok) navigation.replace('Home');
      else Alert.alert('Login', res.message || 'Login failed');
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      let errorMessage = '';
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "That email address is invalid.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled. Contact support.";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email. Please sign up.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Try again.";
          break;
        default:
          errorMessage = "Something went wrong. Please try again later.";
          break;
      }
      Alert.alert('Login Error', errorMessage);
    }
  };

  const onLoginWithBioMetric = async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const { available } = await rnBiometrics.isSensorAvailable();

      if (!available) {
        Alert.alert('Error', 'Biometric authentication not available on this device');
        return;
      }

      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Login with Biometrics',
      });

      if (success) {
        const raw = await AsyncStorage.getItem(USER_KEY);
        if (!raw) {
          Alert.alert('Error', 'No saved user found. Please login with email/password first.');
          return;
        }

        const savedUser = JSON.parse(raw);
        if (!savedUser.biometric) {
          Alert.alert('Error', 'Biometric login not enabled for this user');
          return;
        }

        const res = await login(savedUser.email, savedUser.password);
        if (res.ok) {
          navigation.replace('Home');
        } else {
          Alert.alert('Login', res.message || 'Biometric login failed');
        }
      } else {
        Alert.alert('Cancelled', 'Biometric login cancelled');
      }
    } catch (e) {
      console.log('Biometric error', e);
      Alert.alert('Error', 'Biometric authentication failed');
    }
  };

  return (
    <ScreenWrapper>
      <View style={{ padding: spacing(3) }}>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: spacing(3) }}>
          Login
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.muted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            backgroundColor: colors.card,
            color: colors.text,
            padding: spacing(2),
            borderRadius: 8,
            marginBottom: spacing(2),
          }}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          style={{
            backgroundColor: colors.card,
            color: colors.text,
            padding: spacing(2),
            borderRadius: 8,
            marginBottom: spacing(3),
          }}
        />

        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: spacing(2) }} />
        ) : (
          <Button title="Login" onPress={onLogin} />
        )}
        <View style={{ height: spacing(2) }} />
        <Button title="Login with Biometric" onPress={onLoginWithBioMetric} />

        <View style={{ height: spacing(2) }} />
        <Button title="Go to Signup" onPress={() => navigation.navigate('Signup')} />
      </View>
    </ScreenWrapper>
  );
};

export default LoginScreen;