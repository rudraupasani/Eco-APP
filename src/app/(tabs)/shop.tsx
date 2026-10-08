import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ProductCard } from '../../components/ProductCard';
import { UIHeader } from '../../components/UIHeader';
import { Theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

export default function ShopScreen() {
  const { products } = useApp();
  const [activeSort, setActiveSort] = useState<'featured' | 'priceAsc' | 'priceDesc'>('featured');
  const [filterCount, setFilterCount] = useState(3);

  const sortedProducts = [...products].sort((a, b) => {
    if (activeSort === 'priceAsc') return a.price - b.price;
    if (activeSort === 'priceDesc') return b.price - a.price;
    return 0;
  });

  return (
    <View style={styles.container}>
      <UIHeader title="New in" subtitle={`${products.length * 6} pieces • 12 brands`} showSearch showCart />

      <FlatList
        data={sortedProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 50).duration(300)}
            style={{ width: '48.5%' }}
          >
            <ProductCard product={item} />
          </Animated.View>
        )}
      />

      {/* Floating Sort / Filter Button Pill */}
      <View style={styles.floatingButtonContainer}>
        <View style={styles.filterPill}>
          <TouchableOpacity
            style={styles.pillAction}
            onPress={() => {
              setActiveSort((prev) => (prev === 'priceAsc' ? 'priceDesc' : 'priceAsc'));
            }}
          >
            <Text style={styles.pillText}>Sort</Text>
          </TouchableOpacity>

          <View style={styles.pillDivider} />

          <TouchableOpacity style={styles.pillAction}>
            <Text style={styles.pillText}>Filters ({filterCount})</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  listContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.sm,
    paddingBottom: 90,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: Theme.borderRadius.full,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  pillAction: {
    paddingHorizontal: 8,
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold,
  },
  pillDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
});
