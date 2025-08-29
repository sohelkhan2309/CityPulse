import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, Text, TextInput, View } from 'react-native';
import { colors, spacing } from '../config/theme';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useAuth } from '../context/AuthContext';
import auth from '@react-native-firebase/auth';

const SignupScreen: React.FC<any> = ({ navigation }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name is required.');
      return false;
    }

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

  const onSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // firebase auth signup
      await auth().createUserWithEmailAndPassword(email, password);
      setLoading(false);

      Alert.alert(
        'Alert!',
        'Do you want to enable Biometric for quick login?',
        [
          {
            text: 'No, Proceed',
            onPress: async () => {
              const res = await signup({ name, email, password, biometric: false });
              if (res.ok) navigation.replace('Home');
              else Alert.alert('Signup', res.message || 'Signup failed');
            },
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              const res = await signup({ name, email, password, biometric: true });
              if (res.ok) navigation.replace('Home');
              else Alert.alert('Signup', res.message || 'Signup failed');
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      let errorMessage = '';
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Try logging in instead.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "That email address is invalid!";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      } else {
        errorMessage = "Something went wrong. Please try again.";
      }
      Alert.alert('Signup Error', errorMessage);
    }
  };

  return (
    <ScreenWrapper>
      <View style={{ padding: spacing(3) }}>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: spacing(3) }}>
          Signup
        </Text>
        <TextInput
          placeholder="Name"
          placeholderTextColor={colors.muted}
          value={name}
          onChangeText={setName}
          style={{
            backgroundColor: colors.card,
            color: colors.text,
            padding: spacing(2),
            borderRadius: 8,
            marginBottom: spacing(2),
          }}
        />
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
          placeholder="Password (min 6 chars)"
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
          <Button title="Create account" onPress={onSignup} />
        )}
        <View style={{ height: spacing(2) }} />
        <Button title="Back to Login" onPress={() => navigation.goBack()} />
      </View>
    </ScreenWrapper>
  );
};

export default SignupScreen;