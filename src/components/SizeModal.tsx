import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

export const SizeModal: React.FC = () => {
  const { selectedSizeModalProduct, closeSizeModal, addToCart } = useApp();
  const product = selectedSizeModalProduct;

  const [selectedSize, setSelectedSize] = useState<string>('S');

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    closeSizeModal();
  };

  return (
    <Modal
      visible={!!product}
      transparent
      animationType="fade"
      onRequestClose={closeSizeModal}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={closeSizeModal} />

        <Animated.View
          entering={SlideInDown.springify().damping(18)}
          exiting={SlideOutDown.duration(200)}
          style={styles.sheetContainer}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Your size +</Text>
            <TouchableOpacity onPress={closeSizeModal} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Size Pills */}
          <View style={styles.sizeOptionsRow}>
            {product.sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <TouchableOpacity
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  style={[
                    styles.sizePill,
                    isSelected && styles.sizePillSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      isSelected && styles.sizeTextSelected,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Fit Advice Box */}
          <View style={styles.fitAdviceBox}>
            <Text style={styles.fitAdviceHeadline}>+ Runs a size large. Take {selectedSize}.</Text>
            <Text style={styles.fitAdviceSubtext}>
              {product.fitRecommendation ||
                `Based on your last ${product.brand} order, 94% who took ${selectedSize} kept it.`}
            </Text>
          </View>

          {/* Submit CTA Button */}
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleAddToCart}
            activeOpacity={0.88}
          >
            <Text style={styles.ctaText}>Add {selectedSize} to cart</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    backgroundColor: Theme.colors.surface,
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxl,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Theme.colors.borderDark,
    alignSelf: 'center',
    marginBottom: Theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontSize: Theme.typography.sizes.heading,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
  },
  closeBtn: {
    padding: 4,
  },
  sizeOptionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Theme.spacing.xl,
  },
  sizePill: {
    flex: 1,
    height: 44,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sizePillSelected: {
    backgroundColor: Theme.colors.accent,
    borderColor: Theme.colors.accent,
  },
  sizeText: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.text,
  },
  sizeTextSelected: {
    color: Theme.colors.accentInverse,
  },
  fitAdviceBox: {
    backgroundColor: Theme.colors.surfaceSecondary,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  fitAdviceHeadline: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
    marginBottom: 4,
  },
  fitAdviceSubtext: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
  },
  ctaButton: {
    backgroundColor: Theme.colors.accent,
    height: 54,
    borderRadius: Theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: Theme.colors.accentInverse,
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.semibold,
  },
});
