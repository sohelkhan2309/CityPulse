import React from 'react';
import { Platform, StatusBar, View } from 'react-native';

export const ScreenWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View style={{
      flex: 1,
      paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
      backgroundColor: '#0b0f14',
    }}>
      {children}
    </View>
  );
};
