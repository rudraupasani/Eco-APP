import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ProductCard } from '../../components/ProductCard';
import { UIHeader } from '../../components/UIHeader';
import { Theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

export default function SavedScreen() {
  const { products, wishlist } = useApp();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <View style={styles.container}>
      <UIHeader
        title="Saved"
        subtitle={`${savedProducts.length} saved`}
        showSearch
        showCart
      />

      {savedProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="heart-outline" size={32} color={Theme.colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Your saved list is empty</Text>
          <Text style={styles.emptySub}>
            Tap the heart icon on any product to save it to your personal edit.
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => router.push('/(tabs)/shop')}
          >
            <Text style={styles.exploreBtnText}>Explore products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={savedProducts}
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
      )}
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
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
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
    lineHeight: 20,
    marginBottom: Theme.spacing.xl,
  },
  exploreBtn: {
    backgroundColor: Theme.colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.full,
  },
  exploreBtnText: {
    color: Theme.colors.accentInverse,
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold,
  },
});
