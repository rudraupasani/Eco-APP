import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { CartItem } from '../types';

interface CartItemRowProps {
  item: CartItem;
  readOnly?: boolean;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item, readOnly = false }) => {
  const { updateQuantity, removeFromCart } = useApp();
  const { product, selectedSize, selectedColor, quantity } = item;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: product.images[0] }}
        style={styles.image}
        contentFit="cover"
      />

      <View style={styles.details}>
        <View style={styles.headerRow}>
          <Text style={styles.brand}>{product.brand}</Text>
          {!readOnly && (
            <TouchableOpacity
              onPress={() => removeFromCart(product.id, selectedSize)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-outline" size={18} color={Theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {product.name}
        </Text>

        <View style={styles.specRow}>
          <Text style={styles.specText}>Size: {selectedSize}</Text>
          <Text style={styles.specDot}>•</Text>
          <Text style={styles.specText}>{selectedColor.name}</Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>${product.price * quantity}</Text>

          {!readOnly ? (
            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(product.id, selectedSize, quantity - 1)}
              >
                <Ionicons name="remove" size={14} color={Theme.colors.text} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(product.id, selectedSize, quantity + 1)}
              >
                <Ionicons name="add" size={14} color={Theme.colors.text} />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.qtyBadgeText}>Qty: {quantity}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  image: {
    width: 80,
    height: 96,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.surfaceSecondary,
  },
  details: {
    flex: 1,
    marginLeft: Theme.spacing.md,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    fontSize: 10,
    fontWeight: Theme.typography.weights.bold,
    letterSpacing: 1,
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.medium,
    color: Theme.colors.text,
    marginVertical: 2,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  specText: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.textSecondary,
  },
  specDot: {
    marginHorizontal: 6,
    color: Theme.colors.textMuted,
    fontSize: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surfaceSecondary,
    borderRadius: Theme.borderRadius.full,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold,
    paddingHorizontal: 8,
    color: Theme.colors.text,
  },
  qtyBadgeText: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.textSecondary,
    fontWeight: Theme.typography.weights.medium,
  },
});
