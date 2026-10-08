import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  horizontal?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, horizontal = false }) => {
  const { wishlist, toggleWishlist, openSizeModal } = useApp();
  const isWishlisted = wishlist.includes(product.id);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const navigateToDetail = () => {
    router.push({
      pathname: '/product/[id]',
      params: { id: product.id },
    });
  };

  if (horizontal) {
    return (
      <Animated.View style={[styles.horizontalCard, animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={navigateToDetail}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.horizontalInner}
        >
          <Image source={{ uri: product.images[0] }} style={styles.horizontalImage} contentFit="cover" />
          <View style={styles.horizontalInfo}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.title} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={styles.price}>${product.price}</Text>
            {product.sizeAdvice && <Text style={styles.sizeAdvice}>{product.sizeAdvice}</Text>}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={navigateToDetail}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.cardInner}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.images[0] }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />

          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => toggleWishlist(product.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={18}
              color={isWishlisted ? '#E53E3E' : Theme.colors.text}
            />
          </TouchableOpacity>

          {product.tag && (
            <View style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>{product.tag}</Text>
            </View>
          )}
        </View>

        <View style={styles.details}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {product.name}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price}</Text>
            {product.sizeAdvice && <Text style={styles.sizeAdvice}>{product.sizeAdvice}</Text>}
          </View>

          <View style={styles.metaRow}>
            <View style={styles.colorSwatches}>
              {product.colors.slice(0, 3).map((color, idx) => (
                <View
                  key={idx}
                  style={[styles.colorDot, { backgroundColor: color.hex }]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.quickAddBtn}
              onPress={() => openSizeModal(product)}
            >
              <Ionicons name="add-outline" size={16} color={Theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginBottom: Theme.spacing.md,
  },
  cardInner: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: Theme.colors.surfaceSecondary,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Theme.borderRadius.xs,
  },
  tagBadgeText: {
    fontSize: 10,
    color: Theme.colors.textSecondary,
    fontWeight: Theme.typography.weights.medium,
  },
  details: {
    padding: Theme.spacing.md,
  },
  brand: {
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium,
    color: Theme.colors.text,
    marginBottom: 6,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  price: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
  },
  sizeAdvice: {
    fontSize: 11,
    color: Theme.colors.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.surfaceSecondary,
  },
  colorSwatches: {
    flexDirection: 'row',
    gap: 5,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  quickAddBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Horizontal variant
  horizontalCard: {
    width: 240,
    marginRight: Theme.spacing.md,
  },
  horizontalInner: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  horizontalImage: {
    width: '100%',
    height: 160,
    backgroundColor: Theme.colors.surfaceSecondary,
  },
  horizontalInfo: {
    padding: Theme.spacing.sm,
  },
});
