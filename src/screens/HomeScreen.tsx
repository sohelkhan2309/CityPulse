import React from 'react';
import { ActivityIndicator, FlatList, TextInput, View } from 'react-native';
import Header from '../components/Header';
import EventCard from '../components/EventCard';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors, spacing } from '../config/theme';
import { useEvents } from '../hooks/useEvents';
import { useRTL } from '../context/RTLContext';
import { useAuth } from '../context/AuthContext';
import auth from '@react-native-firebase/auth';

const HomeScreen: React.FC<any> = ({ navigation }) => {
  const { query, setQuery, items, loading, onEnd, refresh, refreshing } = useEvents();
  const { toggleRTL } = useRTL();
  const { logout } = useAuth();

  return (
    <ScreenWrapper>
      <Header
        onPressProfile={() => navigation.navigate('Profile')}
        onPressFavourites={() => navigation.navigate('Favourites')}
        onToggleRTL={toggleRTL}
        onLogout={async () => {
          try {
            // firebase auth sign out
            await auth().signOut();
          } catch (error) {
            console.error(error);
          }
          await logout();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }}
      />
      <View style={{ paddingHorizontal: spacing(2), zIndex: 1 }}>
        <TextInput
          placeholder="Search by keyword or city"
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={(t) => setQuery(t)}
          autoCapitalize="none"
          style={{ backgroundColor: colors.card, color: colors.text, padding: spacing(2), borderRadius: 8, marginBottom: spacing(2) }}
        />
      </View>

      {loading && items.length === 0 ? <ActivityIndicator color={colors.accent} style={{ marginTop: spacing(2) }} /> : null}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            item={item}
            onPress={() => navigation.navigate('Detail', { id: item.id, title: item.title })}
          />
        )}
        onEndReached={onEnd}
        onEndReachedThreshold={0.6}
        refreshing={refreshing}
        onRefresh={refresh}
        ListFooterComponent={loading ? <ActivityIndicator color={colors.accent} style={{ marginVertical: spacing(2) }} /> : <View style={{ height: spacing(4) }} />}
      />
    </ScreenWrapper>
  );
};

export default HomeScreen;
