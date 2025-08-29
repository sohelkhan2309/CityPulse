import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../config/theme';

type Props = {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onPressProfile?: () => void;
  onPressFavourites?: () => void;
  onToggleRTL?: () => void;
  onLogout?: () => void;
};

const Header: React.FC<Props> = ({ title = 'City Pulse', showBack, onBack, onPressProfile, onPressFavourites, onToggleRTL, onLogout }) => {
  const [open, setOpen] = useState(false);

  if (showBack) {
    return (
      <View style={{ padding: spacing(2), backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: '#1c2430', zIndex: 100 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={onBack} style={{ paddingRight: spacing(1) }}>
            <Text style={{ color: colors.accent }}>◀</Text>
          </TouchableOpacity>
          <Text numberOfLines={1} style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>{title}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ padding: spacing(2), backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: '#1c2430', zIndex: 100 }}>
      <View style={{ position: 'relative', height: 28, justifyContent: 'center' }}>
        <Text numberOfLines={1} style={{ color: colors.text, fontSize: 20, fontWeight: '700', position: 'absolute', left: spacing(1), right: spacing(10) }}>
          {title}
        </Text>
        <TouchableOpacity onPress={() => setOpen(o => !o)} style={{ position: 'absolute', right: spacing(1), zIndex: 1000 }}>
          <Text style={{ color: colors.accent }}>More ▾</Text>
        </TouchableOpacity>
        {open && (
          <View style={{ position: 'absolute', top: spacing(4), right: spacing(1), backgroundColor: colors.card, borderRadius: 8, padding: spacing(1), borderWidth: 1, borderColor: '#1c2430', zIndex: 1000, elevation: 12, minWidth: 160 }}>
            <TouchableOpacity onPress={() => { setOpen(false); onPressProfile && onPressProfile(); }} style={{ padding: spacing(1) }}>
              <Text style={{ color: colors.text }}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setOpen(false); onPressFavourites && onPressFavourites(); }} style={{ padding: spacing(1) }}>
              <Text style={{ color: colors.text }}>Favourites</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setOpen(false); onToggleRTL && onToggleRTL(); }} style={{ padding: spacing(1) }}>
              <Text style={{ color: colors.text }}>Switch LTR/RTL</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setOpen(false); onLogout && onLogout(); }} style={{ padding: spacing(1) }}>
              <Text style={{ color: colors.danger }}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default Header;
