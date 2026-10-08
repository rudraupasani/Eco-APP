import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { UIHeader } from '../../components/UIHeader';
import { MOCK_CATEGORIES } from '../../constants/mockData';
import { Theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

export default function HomeScreen() {
  const { products, activeFilter, setActiveFilter, wishlist, toggleWishlist } = useApp();

  const filteredProducts = activeFilter === 'All'
    ? products
    : products.filter((p) => p.category.toLowerCase() === activeFilter.toLowerCase());

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}` as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Header */}
      <UIHeader showSearch showCart />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category Horizontal Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {MOCK_CATEGORIES.map((cat) => {
            const isSelected = activeFilter === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveFilter(cat)}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipSelected,
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Winter Archive Hero Banner Card */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.heroCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
            }}
            style={styles.heroImage}
            contentFit="cover"
            priority="high"
          />
          <View style={styles.heroOverlay} />

          <View style={styles.heroContent}>
            <View style={styles.heroDiscountBadge}>
              <Text style={styles.heroDiscountText}>Up to 30% off outerwear</Text>
            </View>

            <Text style={styles.heroTitle}>Winter Archive</Text>
            <Text style={styles.heroSubtitle}>
              Layers built for weather. Cut once, kept for years.
            </Text>

            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => router.push('/(tabs)/shop')}
              activeOpacity={0.85}
            >
              <Text style={styles.heroButtonText}>Shop now →</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* "Your Edit is Ready" Box */}
        <View style={styles.editReadyCard}>
          <View style={styles.editReadyLeft}>
            <Text style={styles.editReadyTitle}>+ Your edit is ready</Text>
            <Text style={styles.editReadySub}>8 pieces • Friday edit</Text>
          </View>

          <TouchableOpacity
            style={styles.openButton}
            onPress={() => router.push('/(tabs)/shop')}
            activeOpacity={0.8}
          >
            <Text style={styles.openButtonText}>Open</Text>
          </TouchableOpacity>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Selected for you</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/shop')}>
            <Text style={styles.seeAllText}>See all ({products.length})</Text>
          </TouchableOpacity>
        </View>

        {/* Product Cards List */}
        <View style={styles.productListContainer}>
          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            return (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                onPress={() => handleProductPress(product)}
                activeOpacity={0.92}
              >
                {/* Image Container */}
                <View style={styles.productImageWrapper}>
                  <Image
                    source={{ uri: product.images[0] }}
                    style={styles.productImage}
                    contentFit="cover"
                  />

                  {/* Wishlist Heart Button */}
                  <TouchableOpacity
                    style={styles.heartButton}
                    onPress={() => toggleWishlist(product.id)}
                    activeOpacity={0.8}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={isWishlisted ? 'heart' : 'heart-outline'}
                      size={18}
                      color={isWishlisted ? '#E53E3E' : '#111111'}
                    />
                  </TouchableOpacity>

                  {/* Rarely returned or tag badge */}
                  {product.tag && (
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagBadgeText}>{product.tag}</Text>
                    </View>
                  )}
                </View>

                {/* Details */}
                <View style={styles.productDetails}>
                  <Text style={styles.productBrand}>{product.brand}</Text>
                  <Text style={styles.productName} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <View style={styles.productPriceRow}>
                    <Text style={styles.productPrice}>${product.price}</Text>
                    {product.sizeAdvice && (
                      <Text style={styles.productSize}>{product.sizeAdvice}</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 28,
  },

  /* Categories */
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.surfaceSecondary,
  },
  categoryChipSelected: {
    backgroundColor: Theme.colors.accent,
  },
  categoryText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium,
    color: Theme.colors.text,
  },
  categoryTextSelected: {
    color: Theme.colors.accentInverse,
  },

  /* Hero Card */
  heroCard: {
    marginHorizontal: 16,
    height: 390,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    backgroundColor: '#333333',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 22,
  },
  heroDiscountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.full,
    marginBottom: 10,
  },
  heroDiscountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: Theme.typography.weights.semibold,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: Theme.typography.weights.bold,
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: Theme.typography.sizes.body,
    color: 'rgba(255, 255, 255, 0.92)',
    marginBottom: 18,
    lineHeight: 20,
    maxWidth: '92%',
  },
  heroButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroButtonText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.bold,
    color: '#000000',
  },

  /* "Your Edit is Ready" Box */
  editReadyCard: {
    marginHorizontal: 16,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  editReadyLeft: {},
  editReadyTitle: {
    fontSize: 16,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
  },
  editReadySub: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  openButton: {
    backgroundColor: Theme.colors.surfaceSecondary,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: Theme.borderRadius.full,
  },
  openButtonText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.text,
  },

  /* Section Header */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
  },
  seeAllText: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.textSecondary,
    fontWeight: Theme.typography.weights.medium,
  },

  /* Products List */
  productListContainer: {
    paddingHorizontal: 16,
  },
  productCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: 16,
  },
  productImageWrapper: {
    width: '100%',
    height: 220,
    position: 'relative',
    backgroundColor: Theme.colors.surfaceSecondary,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tagBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.text,
  },
  productDetails: {
    padding: 14,
  },
  productBrand: {
    fontSize: 10,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  productName: {
    fontSize: 16,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
    marginBottom: 6,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
  },
  productSize: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    fontWeight: Theme.typography.weights.medium,
  },
});
