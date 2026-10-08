import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { UIHeader } from '../components/UIHeader';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const { user, getCartTotal, getCartCount, placeOrder } = useApp();

  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express'>('standard');
  const deliveryFee = deliveryOption === 'express' ? 12 : 0;
  const subtotal = getCartTotal() || 624;
  const total = subtotal + deliveryFee;
  const itemCount = getCartCount() || 3;

  const handlePlaceOrder = () => {
    placeOrder();
    router.replace('/order-placed');
  };

  return (
    <View style={styles.container}>
      <UIHeader showBack title="Checkout" subtitle={`${itemCount} items • $${total}`} showSearch={false} showCart={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Express Pay Button (Apple Pay) */}
        <Animated.View entering={FadeInDown.duration(300)}>
          <TouchableOpacity
            style={styles.applePayBtn}
            activeOpacity={0.85}
            onPress={handlePlaceOrder}
          >
            <Ionicons name="logo-apple" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.applePayText}>Pay</Text>
          </TouchableOpacity>

          <Text style={styles.orDividerText}>or pay with card</Text>
        </Animated.View>

        {/* DELIVER TO Section */}
        <Text style={styles.sectionHeader}>DELIVER TO</Text>
        <TouchableOpacity style={styles.addressCard} activeOpacity={0.8}>
          <View style={styles.addressInfo}>
            <Text style={styles.addressLabel}>{user.address.label}</Text>
            <Text style={styles.addressStreet}>{user.address.street}</Text>
            <Text style={styles.addressPostal}>{user.address.postalCode}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Theme.colors.textMuted} />
        </TouchableOpacity>

        {/* DELIVERY Options */}
        <Text style={styles.sectionHeader}>DELIVERY</Text>
        <View style={styles.deliveryOptionsGroup}>
          <TouchableOpacity
            style={styles.deliveryRow}
            onPress={() => setDeliveryOption('standard')}
            activeOpacity={0.8}
          >
            <View style={styles.radioCircle}>
              {deliveryOption === 'standard' && <View style={styles.radioCircleInner} />}
            </View>
            <View style={styles.deliveryDetails}>
              <Text style={styles.deliveryTitle}>Standard</Text>
              <Text style={styles.deliverySub}>Arrives Wed 12 Aug</Text>
            </View>
            <Text style={styles.deliveryPriceText}>Free</Text>
          </TouchableOpacity>

          <View style={styles.deliveryDivider} />

          <TouchableOpacity
            style={styles.deliveryRow}
            onPress={() => setDeliveryOption('express')}
            activeOpacity={0.8}
          >
            <View style={styles.radioCircle}>
              {deliveryOption === 'express' && <View style={styles.radioCircleInner} />}
            </View>
            <View style={styles.deliveryDetails}>
              <Text style={styles.deliveryTitle}>Express</Text>
              <Text style={styles.deliverySub}>Arrives tomorrow</Text>
            </View>
            <Text style={styles.deliveryPriceText}>$12</Text>
          </TouchableOpacity>
        </View>

        {/* PAYMENT Method */}
        <Text style={styles.sectionHeader}>PAYMENT</Text>
        <TouchableOpacity style={styles.paymentCard} activeOpacity={0.8}>
          <View style={styles.paymentLeft}>
            <Ionicons name="card-outline" size={20} color={Theme.colors.text} />
            <Text style={styles.paymentText}>
              {user.paymentMethod.brand} ending {user.paymentMethod.last4}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Theme.colors.textMuted} />
        </TouchableOpacity>

        {/* Price Breakdown Summary */}
        <View style={styles.priceBreakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Subtotal</Text>
            <Text style={styles.breakdownValue}>${subtotal}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Delivery</Text>
            <Text style={styles.breakdownValue}>{deliveryFee === 0 ? 'Free' : `$${deliveryFee}`}</Text>
          </View>
          <View style={styles.breakdownDivider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.placeOrderBtn}
          onPress={handlePlaceOrder}
          activeOpacity={0.9}
        >
          <Text style={styles.placeOrderBtnText}>Place order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.sm,
    paddingBottom: 110,
  },
  applePayBtn: {
    backgroundColor: '#000000',
    height: 50,
    borderRadius: Theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  applePayText: {
    color: '#FFFFFF',
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
  },
  orDividerText: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: Theme.typography.weights.bold,
    letterSpacing: 1.2,
    color: Theme.colors.textMuted,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xs,
  },
  addressCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
    marginBottom: 2,
  },
  addressStreet: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.textSecondary,
  },
  addressPostal: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.textSecondary,
  },
  deliveryOptionsGroup: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: Theme.spacing.md,
    overflow: 'hidden',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  deliveryDivider: {
    height: 1,
    backgroundColor: Theme.colors.surfaceSecondary,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Theme.colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Theme.colors.text,
  },
  deliveryDetails: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
  },
  deliverySub: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.textSecondary,
  },
  deliveryPriceText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
  },
  paymentCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  paymentText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium,
    color: Theme.colors.text,
  },
  priceBreakdownCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  breakdownLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
  },
  breakdownValue: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.text,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: Theme.colors.surfaceSecondary,
    marginVertical: Theme.spacing.sm,
  },
  totalLabel: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
  },
  totalValue: {
    fontSize: Theme.typography.sizes.title,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
  },
  placeOrderBtn: {
    backgroundColor: Theme.colors.accent,
    height: 52,
    borderRadius: Theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeOrderBtnText: {
    color: Theme.colors.accentInverse,
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
  },
});
