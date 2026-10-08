import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface UIHeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export const UIHeader: React.FC<UIHeaderProps> = ({
  title,
  showBack = false,
  showSearch = true,
  showCart = true,
  subtitle,
  rightAction,
}) => {
  const insets = useSafeAreaInsets();
  const { getCartCount } = useApp();
  const cartCount = getCartCount();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={22} color={Theme.colors.text} />
          </TouchableOpacity>
        ) : title ? (
          <View>
            <Text style={styles.headerTitle}>{title}</Text>
            {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
          </View>
        ) : (
          <Text style={styles.brandTitle}>WEFT</Text>
        )}
      </View>

      {showBack && title && (
        <View style={styles.centerSection}>
          <Text style={styles.centerTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}

      <View style={styles.rightSection}>
        {rightAction ? (
          rightAction
        ) : (
          <>
            {showSearch && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push('/search')}
              >
                <Ionicons name="search-outline" size={20} color={Theme.colors.text} />
              </TouchableOpacity>
            )}

            {showCart && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push('/cart')}
              >
                <Ionicons name="bag-handle-outline" size={21} color={Theme.colors.text} />
                {cartCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
    zIndex: 100,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 40,
  },
  centerSection: {
    position: 'absolute',
    left: 70,
    right: 70,
    alignItems: 'center',
  },
  centerTitle: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.text,
  },
  brandTitle: {
    fontSize: Theme.typography.sizes.heading,
    fontWeight: Theme.typography.weights.bold,
    letterSpacing: 3,
    color: Theme.colors.text,
  },
  headerTitle: {
    fontSize: Theme.typography.sizes.heading,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
  },
  headerSubtitle: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: '#000000',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: Theme.typography.weights.bold,
  },
});
