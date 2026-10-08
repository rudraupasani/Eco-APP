import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { UIHeader } from '../../components/UIHeader';
import { Theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

export default function ProfileScreen() {
  const { user, showToast } = useApp();

  const handleAction = (title: string) => {
    showToast(`${title} settings coming soon`);
  };

  return (
    <View style={styles.container}>
      <UIHeader title="Profile" showSearch={false} showCart />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Badge */}
        <Animated.View entering={FadeInDown.duration(350)} style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user.avatarInitials}</Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </Animated.View>

        {/* Active Order Banner */}
        {user.activeOrder && (
          <TouchableOpacity
            style={styles.orderBannerCard}
            onPress={() => handleAction('Order status')}
            activeOpacity={0.88}
          >
            <View style={styles.orderBannerIcon}>
              <Ionicons name="cube-outline" size={20} color={Theme.colors.text} />
            </View>

            <View style={styles.orderBannerContent}>
              <Text style={styles.orderBannerTitle}>{user.activeOrder.status}</Text>
              <Text style={styles.orderBannerSub}>
                Order {user.activeOrder.orderId} • {user.activeOrder.itemCount} items
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color={Theme.colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Section ACCOUNT */}
        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="receipt-outline"
            title="Orders"
            onPress={() => handleAction('Orders')}
          />
          <MenuItem
            icon="location-outline"
            title="Addresses"
            onPress={() => handleAction('Addresses')}
          />
          <MenuItem
            icon="card-outline"
            title="Payment methods"
            onPress={() => handleAction('Payment methods')}
          />
          <MenuItem
            icon="person-outline"
            title="Personal details"
            isLast
            onPress={() => handleAction('Personal details')}
          />
        </View>

        {/* Section SETTINGS */}
        <Text style={styles.sectionHeader}>SETTINGS</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            onPress={() => handleAction('Notifications')}
          />
          <MenuItem
            icon="globe-outline"
            title="Language"
            value="English"
            onPress={() => handleAction('Language')}
          />
          <MenuItem
            icon="cash-outline"
            title="Currency"
            value="USD"
            onPress={() => handleAction('Currency')}
          />
          <MenuItem
            icon="shield-checkmark-outline"
            title="Privacy"
            isLast
            onPress={() => handleAction('Privacy')}
          />
        </View>

        {/* Help & Sign out */}
        <View style={[styles.menuGroup, { marginTop: Theme.spacing.lg }]}>
          <MenuItem
            icon="help-circle-outline"
            title="Help centre"
            onPress={() => handleAction('Help centre')}
          />
          <MenuItem
            icon="log-out-outline"
            title="Sign out"
            titleColor="#E53E3E"
            isLast
            onPress={() => {
              showToast('Signed out successfully');
              router.replace('/login' as any);
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  titleColor?: string;
  isLast?: boolean;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  value,
  titleColor,
  isLast = false,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.menuItem, !isLast && styles.menuItemBorder]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuItemLeft}>
      <Ionicons name={icon} size={19} color={titleColor || Theme.colors.text} />
      <Text style={[styles.menuItemTitle, titleColor ? { color: titleColor } : null]}>
        {title}
      </Text>
    </View>

    <View style={styles.menuItemRight}>
      {value && <Text style={styles.menuItemValue}>{value}</Text>}
      <Ionicons name="chevron-forward" size={16} color={Theme.colors.textMuted} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: 40,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.surfaceTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
  },
  userInfo: {
    marginLeft: Theme.spacing.md,
  },
  userName: {
    fontSize: Theme.typography.sizes.title,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
  },
  userEmail: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  orderBannerCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  orderBannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  orderBannerContent: {
    flex: 1,
  },
  orderBannerTitle: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
  },
  orderBannerSub: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: Theme.typography.weights.bold,
    letterSpacing: 1.2,
    color: Theme.colors.textMuted,
    marginBottom: Theme.spacing.xs,
    marginTop: Theme.spacing.md,
  },
  menuGroup: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: Theme.spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.surfaceSecondary,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemTitle: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.medium,
    color: Theme.colors.text,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuItemValue: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
  },
});
