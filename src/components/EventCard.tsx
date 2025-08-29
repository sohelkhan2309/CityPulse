import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing } from '../config/theme';
import { useFavoritesCtx } from '../context/FavoritesContext';
import { useRTL } from '../context/RTLContext';

type Props = {
  item: { id: string; title: string; image: string | null; venue: string; date: string; time: string; };
  onPress?: () => void;
};

const EventCard: React.FC<Props> = ({ item, onPress }) => {
  const { isFav, toggle } = useFavoritesCtx();
  const { rowDirStyle, textAlign } = useRTL();
  const fav = isFav(item.id);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ margin: spacing(2), backgroundColor: colors.card, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#1c2430' }}>
      {item.image ? <Image source={{ uri: item.image }} style={{ width: '100%', height: 160 }} /> : null}
      <View style={{ padding: spacing(2) }}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700', textAlign }}>{item.title}</Text>
        <View style={[{ marginTop: spacing(1), alignItems: 'center', justifyContent: 'space-between' }, rowDirStyle]}>
          <Text style={{ color: colors.muted, flex: 1, textAlign }}>{item.venue}</Text>
          <Text style={{ color: colors.muted }}>{item.date} {item.time}</Text>
        </View>
        <View style={[{ marginTop: spacing(2), justifyContent: 'flex-end' }, rowDirStyle]}>
          <TouchableOpacity onPress={() => toggle(item.id)}>
            <Text style={{ color: fav ? '#ffd166' : colors.accent, fontSize: 16 }}>{fav ? '★ Remove' : '☆ Add Favourite'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
