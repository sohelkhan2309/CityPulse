import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import Header from '../components/Header';
import EventCard from '../components/EventCard';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors, spacing } from '../config/theme';
import { useFavoritesCtx } from '../context/FavoritesContext';
import { fetchEventById } from '../api/api';

const FavouritesScreen: React.FC<any> = ({ navigation }) => {
  const { ids } = useFavoritesCtx();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const results: any[] = [];
      for (const id of ids) {
        try {
          const json = await fetchEventById(id);
          results.push({
            id: json.id,
            title: json.name,
            image: json.images?.[0]?.url || null,
            venue: json._embedded?.venues?.[0]?.name || '—',
            date: json.dates?.start?.localDate || '',
            time: json.dates?.start?.localTime || '',
          });
        } catch {}
      }
      setItems(results);
      setLoading(false);
    })();
  }, [ids.join(',')]);

  return (
    <ScreenWrapper>
      <Header title="Favourites" showBack onBack={() => navigation.goBack()} />
      {loading ? <ActivityIndicator color={colors.accent} style={{ marginTop: spacing(2) }} /> : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              item={item}
              onPress={() => navigation.navigate('Detail', { id: item.id, title: item.title })}
            />
          )}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: spacing(4) }}>
              <Text style={{ fontSize: 16, color: colors.text }}>
                Favorite events will appear here
              </Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: spacing(6) }} />}
        />
      )}
    </ScreenWrapper>
  );
};

export default FavouritesScreen;
