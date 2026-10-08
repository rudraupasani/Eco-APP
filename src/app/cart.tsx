import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { CartItemRow } from '../components/CartItemRow';
import { UIHeader } from '../components/UIHeader';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { cart, getCartTotal, getCartCount } = useApp();
  const subtotal = getCartTotal();
  const itemCount = getCartCount();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <View style={styles.container}>
      <UIHeader showBack title="Bag" subtitle={`${itemCount} items • $${subtotal}`} showSearch={false} showCart={false} />

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="bag-handle-outline" size={32} color={Theme.colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Your bag is empty</Text>
          <Text style={styles.emptySub}>Looks like you haven't added any items to your bag yet.</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => router.push('/(tabs)/shop')}
          >
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Free Shipping Banner */}
            <View style={styles.shippingBanner}>
              <Ionicons name="sparkles-outline" size={16} color={Theme.colors.text} />
              <Text style={styles.shippingBannerText}>
                You qualify for complimentary Standard Delivery
              </Text>
            </View>

            {/* Cart Items */}
            <View style={styles.itemsList}>
              {cart.map((item, index) => (
                <Animated.View
                  key={`${item.product.id}-${item.selectedSize}`}
                  entering={FadeInDown.delay(index * 50).duration(300)}
                >
                  <CartItemRow item={item} />
                </Animated.View>
              ))}
            </View>

            {/* Subtotal Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Standard Delivery</Text>
                <Text style={styles.freeBadgeText}>Free</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${subtotal}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Sticky Checkout CTA */}
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
              activeOpacity={0.9}
            >
              <Text style={styles.checkoutBtnText}>Checkout (${subtotal})</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </>
      )}
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
    paddingBottom: 100,
  },
  shippingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Theme.colors.surfaceSecondary,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 10,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.md,
  },
  shippingBannerText: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.medium,
    color: Theme.colors.text,
  },
  itemsList: {
    marginBottom: Theme.spacing.lg,
  },
  summaryCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.text,
  },
  freeBadgeText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold,
    color: '#2B6118',
  },
  summaryDivider: {
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
  checkoutBtn: {
    backgroundColor: Theme.colors.accent,
    height: 52,
    borderRadius: Theme.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkoutBtnText: {
    color: Theme.colors.accentInverse,
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.xxl,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
  },
  emptyTitle: {
    fontSize: Theme.typography.sizes.heading,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  emptySub: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
  },
  shopBtn: {
    backgroundColor: Theme.colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.full,
  },
  shopBtnText: {
    color: Theme.colors.accentInverse,
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold,
  },
});
