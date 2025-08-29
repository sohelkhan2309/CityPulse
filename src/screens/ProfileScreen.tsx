import React from 'react';
import { Text, View } from 'react-native';
import Header from '../components/Header';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors, spacing } from '../config/theme';
import { useAuth } from '../context/AuthContext';

const ProfileScreen: React.FC<any> = ({ navigation }) => {
  const { user } = useAuth();
  return (
    <ScreenWrapper>
      <Header title="Profile" showBack onBack={() => navigation.goBack()} />
      <View style={{ padding: spacing(3) }}>
        {user ? (
          <>
            <Text style={{ color: colors.text, fontSize: 18, marginBottom: spacing(1) }}>Name: {user.name}</Text>
            <Text style={{ color: colors.text, fontSize: 18, marginBottom: spacing(1) }}>Email: {user.email}</Text>
          </>
        ) : <Text style={{ color: colors.muted }}>No user</Text>}
      </View>
    </ScreenWrapper>
  );
};

export default ProfileScreen;
