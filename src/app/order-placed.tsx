import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function OrderPlacedScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useApp();

  const handleContinue = () => {
    router.replace('/(tabs)' as any);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.content}>
        {/* Animated Checkmark Circle */}
        <Animated.View entering={ZoomIn.duration(450).springify()} style={styles.checkCircle}>
          <Ionicons name="checkmark" size={36} color="#FFFFFF" />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.textContainer}>
          <Text style={styles.title}>Order placed</Text>
          <Text style={styles.subtitle}>
            Thank you for your order. We've sent a confirmation email with details to {user.email}.
          </Text>

          {user.activeOrder && (
            <View style={styles.orderInfoCard}>
              <Text style={styles.orderNumberLabel}>Order Reference</Text>
              <Text style={styles.orderNumberValue}>{user.activeOrder.orderId}</Text>
              <Text style={styles.deliveryEstimateText}>
                Estimated Delivery: {user.activeOrder.deliveryDate}
              </Text>
            </View>
          )}
        </Animated.View>
      </View>

      <TouchableOpacity
        style={styles.continueBtn}
        onPress={handleContinue}
        activeOpacity={0.88}
      >
        <Text style={styles.continueBtnText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.xl,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: Theme.typography.sizes.display,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Theme.spacing.xl,
  },
  orderInfoCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  orderNumberLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: Theme.colors.textMuted,
    fontWeight: Theme.typography.weights.semibold,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  orderNumberValue: {
    fontSize: Theme.typography.sizes.title,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  deliveryEstimateText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.badgeGreenText,
    fontWeight: Theme.typography.weights.medium,
  },
  continueBtn: {
    backgroundColor: Theme.colors.accent,
    height: 52,
    borderRadius: Theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    color: Theme.colors.accentInverse,
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
  },
});
