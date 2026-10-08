import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ProductCard } from '../components/ProductCard';
import { MOCK_SUGGESTED_SEARCHES } from '../constants/mockData';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { products } = useApp();

  const [query, setQuery] = useState('warm layer under $200');
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesQuery = query
      ? p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        (query.includes('200') && p.price < 200) ||
        (query.includes('layer') && (p.category === 'Knits' || p.category === 'Outerwear'))
      : true;

    if (selectedQuickFilter === 'Under $150') return matchesQuery && p.price < 150;
    if (selectedQuickFilter === 'Wool only') return matchesQuery && p.description.toLowerCase().includes('wool');
    if (selectedQuickFilter === 'My size') return matchesQuery && p.sizes.includes('S');

    return matchesQuery;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search Header Input Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={Theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.plusPrefix}>+</Text>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Ask or search anything..."
            placeholderTextColor={Theme.colors.textMuted}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={Theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Result summary banner */}
        <View style={styles.resultSummaryRow}>
          <Text style={styles.resultSummaryText}>
            {filteredProducts.length > 0
              ? `${filteredProducts.length} pieces fit. That is the whole list.`
              : 'Nothing on the floor fits. We do not pad results.'}
          </Text>
        </View>

        {/* Quick Filters */}
        <View style={styles.quickFiltersRow}>
          {['Under $150', 'Wool only', 'My size'].map((filter) => {
            const isSelected = selectedQuickFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedQuickFilter(isSelected ? null : filter)}
                style={[
                  styles.quickFilterChip,
                  isSelected && styles.quickFilterChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.quickFilterText,
                    isSelected && styles.quickFilterTextSelected,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Product Results Grid */}
        {filteredProducts.length > 0 ? (
          <View style={styles.gridContainer}>
            {filteredProducts.map((product, index) => (
              <Animated.View
                key={product.id}
                entering={FadeInDown.delay(index * 60).duration(300)}
                style={{ width: '48%' }}
              >
                <ProductCard product={product} />
              </Animated.View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateTitle}>No exact matches found</Text>
            <Text style={styles.emptyStateSub}>Try adjusting your prompt or filters.</Text>
          </View>
        )}

        {/* OTHERS ASKED Prompts Section */}
        <View style={styles.othersAskedSection}>
          <Text style={styles.othersAskedHeader}>OTHERS ASKED</Text>

          {MOCK_SUGGESTED_SEARCHES.map((promptText, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.promptRow}
              onPress={() => setQuery(promptText)}
            >
              <Text style={styles.promptText}>+ {promptText}</Text>
            </TouchableOpacity>
          ))}
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    height: 44,
    backgroundColor: Theme.colors.surfaceSecondary,
    borderRadius: Theme.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
  },
  plusPrefix: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.medium,
    color: Theme.colors.text,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
    paddingBottom: 40,
  },
  resultSummaryRow: {
    marginBottom: Theme.spacing.md,
  },
  resultSummaryText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
    fontWeight: Theme.typography.weights.medium,
  },
  quickFiltersRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Theme.spacing.xl,
  },
  quickFilterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.surfaceSecondary,
  },
  quickFilterChipSelected: {
    backgroundColor: Theme.colors.accent,
  },
  quickFilterText: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.medium,
    color: Theme.colors.textSecondary,
  },
  quickFilterTextSelected: {
    color: Theme.colors.accentInverse,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.xl,
  },
  emptyStateContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
  },
  emptyStateSub: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  othersAskedSection: {
    marginTop: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  othersAskedHeader: {
    fontSize: 10,
    fontWeight: Theme.typography.weights.bold,
    letterSpacing: 1.2,
    color: Theme.colors.textMuted,
    marginBottom: Theme.spacing.sm,
  },
  promptRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.surfaceSecondary,
  },
  promptText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium,
    color: Theme.colors.text,
  },
});
