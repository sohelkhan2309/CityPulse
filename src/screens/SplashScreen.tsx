import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen: React.FC<any> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(async () => {
      const raw = await AsyncStorage.getItem('current_user');
      if (raw) navigation.replace('Home');
      else navigation.replace('Login');
    }, 2000); 

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>City Pulse</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 28, fontWeight: 'bold' },
});

export default SplashScreen;
