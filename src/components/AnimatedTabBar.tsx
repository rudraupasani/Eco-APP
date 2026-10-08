import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

export const AnimatedTabBar: React.FC<any> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const { wishlist } = useApp();

  const icons: Record<string, { outline: keyof typeof Ionicons.glyphMap; solid: keyof typeof Ionicons.glyphMap; label: string }> = {
    index: { outline: 'home-outline', solid: 'home', label: 'Home' },
    shop: { outline: 'grid-outline', solid: 'grid', label: 'Shop' },
    saved: { outline: 'heart-outline', solid: 'heart', label: 'Saved' },
    profile: { outline: 'person-outline', solid: 'person', label: 'Profile' },
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.bar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const iconInfo = icons[route.name] || {
            outline: 'ellipse-outline',
            solid: 'ellipse',
            label: route.name,
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={isFocused ? iconInfo.solid : iconInfo.outline}
                  size={22}
                  color={isFocused ? Theme.colors.text : Theme.colors.textMuted}
                />
                {route.name === 'saved' && wishlist.length > 0 && (
                  <View style={styles.savedBadgeDot} />
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? Theme.colors.text : Theme.colors.textMuted },
                  isFocused && styles.labelFocused,
                ]}
              >
                {iconInfo.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  bar: {
    flexDirection: 'row',
    height: 52,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Theme.spacing.md,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    position: 'relative',
  },
  savedBadgeDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E53E3E',
  },
  label: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: Theme.typography.weights.regular,
  },
  labelFocused: {
    fontWeight: Theme.typography.weights.semibold,
  },
});
