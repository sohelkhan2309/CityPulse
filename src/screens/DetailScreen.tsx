import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Platform, ScrollView, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Header from '../components/Header';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors, spacing } from '../config/theme';
import { useFavoritesCtx } from '../context/FavoritesContext';
import { fetchEventById } from '../api/api';

const DetailScreen: React.FC<any> = ({ route, navigation }) => {
  const { id, title } = route.params;
  const { isFav, toggle } = useFavoritesCtx();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const json = await fetchEventById(id);
        if (mounted) setEvent(json);
      } catch (e) {
        console.error('Error fetching event:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  let lat: number | null = null;
  let lng: number | null = null;
  let hasValidCoords = false;

  try {
    const venue = event?._embedded?.venues?.[0];
    if (venue?.location?.latitude && venue?.location?.longitude) {
      const parsedLat = parseFloat(venue.location.latitude);
      const parsedLng = parseFloat(venue.location.longitude);
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        lat = parsedLat;
        lng = parsedLng;
        hasValidCoords = true;
      }
    }
  } catch (err) {
    console.warn("Invalid location data:", err);
  }

  return (
    <ScreenWrapper>
      <Header title={title} showBack onBack={() => navigation.goBack()} />

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: spacing(2) }} />
      ) : !event ? (
        <Text style={{ color: colors.text, marginTop: spacing(2), textAlign: 'center' }}>
          Failed to load event.
        </Text>
      ) : (
        <ScrollView contentContainerStyle={{ padding: spacing(2) }}>
          {/* Event Image */}
          {event.images?.[0]?.url ? (
            <Image
              source={{ uri: event.images[0].url }}
              style={{ width: '100%', height: 220, borderRadius: 12 }}
              resizeMode="cover"
            />
          ) : null}

          {/* Event Title */}
          <Text
            style={{
              color: colors.text,
              fontSize: 22,
              fontWeight: '700',
              marginTop: spacing(2),
            }}
          >
            {event.name ?? 'Untitled Event'}
          </Text>

          {/* Venue */}
          <Text style={{ color: colors.muted, marginTop: spacing(1) }}>
            {event._embedded?.venues?.[0]?.name ?? '—'}
          </Text>

          {/* Date */}
          <Text style={{ color: colors.muted }}>
            {event?.dates?.start?.localDate ?? ''} {event?.dates?.start?.localTime ?? ''}
          </Text>

          {/* Favourites */}
          <View style={{ marginTop: spacing(2) }}>
            <Text
              onPress={() => toggle(id)}
              style={{
                color: isFav(id) ? '#ffd166' : colors.accent,
                fontSize: 16,
              }}
            >
              {isFav(id) ? '★ Remove from favourites' : '☆ Add to favourites'}
            </Text>
          </View>

          {/* Map (only render if coords are valid) */}
          {hasValidCoords ? (
            <View
              style={{
                height: 220,
                marginTop: spacing(2),
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              {
                Platform.OS === 'ios' ?
                  <MapView
                    style={{ flex: 1 }}
                    initialRegion={{
                      latitude: lat!,
                      longitude: lng!,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                    }}
                  >
                    <Marker
                      coordinate={{ latitude: lat!, longitude: lng! }}
                      title={event._embedded?.venues?.[0]?.name || 'Venue'}
                    />
                  </MapView>
                  :
                  null
              }
            </View>
          ) : (
            <Text style={{ color: colors.muted, marginTop: spacing(2), textAlign: 'center' }}>
              Location not available
            </Text>
          )}
        </ScrollView>
      )}
    </ScreenWrapper>
  );
};

export default DetailScreen;
