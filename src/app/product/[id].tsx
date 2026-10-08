import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { UIHeader } from '../../components/UIHeader';
import { Theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { Review } from '../../types';

const { width } = Dimensions.get('window');

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity key={n} onPress={() => onChange(n)} activeOpacity={0.7}>
          <Ionicons
            name={n <= value ? 'star' : 'star-outline'}
            size={26}
            color={n <= value ? '#F2A900' : Theme.colors.borderDark}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <View style={reviewStyles.card}>
      <View style={reviewStyles.cardHeader}>
        <View style={reviewStyles.avatar}>
          <Text style={reviewStyles.avatarText}>{review.userName.slice(0, 1).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={reviewStyles.userName}>{review.userName}</Text>
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center', marginTop: 2 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Ionicons
                key={n}
                name={n <= review.rating ? 'star' : 'star-outline'}
                size={11}
                color={n <= review.rating ? '#F2A900' : Theme.colors.borderDark}
              />
            ))}
            <Text style={reviewStyles.dateText}> · {review.date}</Text>
          </View>
        </View>
        {review.verifiedPurchase && (
          <View style={reviewStyles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={12} color={Theme.colors.badgeGreenText} />
            <Text style={reviewStyles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>
      <Text style={reviewStyles.reviewTitle}>{review.title}</Text>
      <Text style={reviewStyles.reviewComment}>{review.comment}</Text>
      {review.fitFeedback && (
        <View style={reviewStyles.fitPill}>
          <Text style={reviewStyles.fitPillText}>Fit: {review.fitFeedback}</Text>
        </View>
      )}
    </View>
  );
}

function SuggestedCard({ product }: { product: { id: string; name: string; brand: string; price: number; images: string[] } }) {
  return (
    <TouchableOpacity
      style={suggestedStyles.card}
      activeOpacity={0.85}
      onPress={() => router.push(`/product/${product.id}` as any)}
    >
      <Image
        source={{ uri: product.images[0] }}
        style={suggestedStyles.image}
        contentFit="cover"
      />
      <View style={suggestedStyles.info}>
        <Text style={suggestedStyles.brand} numberOfLines={1}>{product.brand}</Text>
        <Text style={suggestedStyles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={suggestedStyles.price}>${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    products,
    wishlist,
    toggleWishlist,
    addToCart,
    openSizeModal,
    reviews,
    addReview,
    getSuggestedProducts,
  } = useApp();

  const product = products.find((p) => p.id === id) || products[0];
  const isWishlisted = wishlist.includes(product.id);
  const productReviews = reviews[product.id] || [];
  const suggested = getSuggestedProducts(product);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [draftRating, setDraftRating] = useState(5);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftComment, setDraftComment] = useState('');
  const [draftFit, setDraftFit] = useState<'Runs Small' | 'True to Size' | 'Runs Large'>('True to Size');
  const [activeReviewSlide, setActiveReviewSlide] = useState(0);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor.name);
  };

  const handleSubmitReview = () => {
    if (!draftTitle.trim() || !draftComment.trim()) return;
    addReview(product.id, {
      rating: draftRating,
      title: draftTitle.trim(),
      comment: draftComment.trim(),
      fitFeedback: draftFit,
    });
    setDraftRating(5);
    setDraftTitle('');
    setDraftComment('');
    setDraftFit('True to Size');
    setShowReviewModal(false);
  };

  const totalReviews = productReviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: productReviews.filter((r) => r.rating === star).length,
  }));

  return (
    <View style={styles.container}>
      <UIHeader showBack showCart rightAction={
        <TouchableOpacity
          style={styles.headerHeartBtn}
          onPress={() => toggleWishlist(product.id)}
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={20}
            color={isWishlisted ? '#E53E3E' : Theme.colors.text}
          />
        </TouchableOpacity>
      } />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Gallery */}
        <View style={styles.galleryContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / width);
              if (slide !== activeImageIndex) setActiveImageIndex(slide);
            }}
            scrollEventThrottle={16}
          >
            {product.images.map((imgUri, index) => (
              <Image
                key={index}
                source={{ uri: imgUri }}
                style={styles.galleryImage}
                contentFit="cover"
              />
            ))}
          </ScrollView>

          {product.images.length > 1 && (
            <View style={styles.paginationDots}>
              {product.images.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.galleryDot,
                    idx === activeImageIndex && styles.galleryDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Product Info */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.infoContainer}>
          {product.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>New arrival</Text>
            </View>
          )}

          <View style={styles.titlePriceRow}>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>${product.price}</Text>
          </View>

          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#F2A900" />
            <Text style={styles.ratingScore}>{product.rating}</Text>
            <Text style={styles.ratingDot}>•</Text>
            <Text style={styles.ratingCount}>{product.reviewCount} reviews</Text>
          </View>

          {/* Color Selector */}
          <View style={styles.sectionDivider} />
          <Text style={styles.sectionLabel}>Color: {selectedColor.name}</Text>
          <View style={styles.colorRow}>
            {product.colors.map((color) => {
              const isSelected = selectedColor.name === color.name;
              return (
                <TouchableOpacity
                  key={color.name}
                  onPress={() => setSelectedColor(color)}
                  style={[
                    styles.colorCircleOutline,
                    isSelected && styles.colorCircleSelected,
                  ]}
                >
                  <View style={[styles.colorCircleFill, { backgroundColor: color.hex }]} />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Delivery & Returns */}
          <View style={styles.sectionDivider} />
          <View style={styles.infoBoxGroup}>
            <View style={styles.infoBoxRow}>
              <Ionicons name="bus-outline" size={18} color={Theme.colors.text} />
              <Text style={styles.infoBoxText}>Free delivery, arrives {product.deliveryEstimate}</Text>
            </View>
            <View style={styles.infoBoxRow}>
              <Ionicons name="refresh-outline" size={18} color={Theme.colors.text} />
              <Text style={styles.infoBoxText}>Free returns within 30 days</Text>
            </View>
          </View>

          {/* Size Selector */}
          <View style={styles.sectionDivider} />
          <TouchableOpacity
            style={styles.sizeSelectorTrigger}
            onPress={() => openSizeModal(product)}
            activeOpacity={0.8}
          >
            <Text style={styles.sizeSelectorLabel}>+ Size {selectedSize}</Text>
            <Ionicons name="chevron-down" size={18} color={Theme.colors.text} />
          </TouchableOpacity>
        </Animated.View>

        {/* ── REVIEWS SECTION ── */}
        <View style={reviewStyles.section}>
          <View style={reviewStyles.sectionHeader}>
            <Text style={reviewStyles.sectionTitle}>Customer Reviews</Text>
            <TouchableOpacity
              style={reviewStyles.writeBtn}
              onPress={() => setShowReviewModal(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={15} color={Theme.colors.accentInverse} />
              <Text style={reviewStyles.writeBtnText}>Write a Review</Text>
            </TouchableOpacity>
          </View>

          {totalReviews > 0 && (
            <View style={reviewStyles.breakdown}>
              <View style={reviewStyles.overallScore}>
                <Text style={reviewStyles.overallNumber}>{product.rating}</Text>
                <View style={{ flexDirection: 'row', gap: 3, marginVertical: 4 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Ionicons
                      key={n}
                      name={n <= Math.round(product.rating) ? 'star' : 'star-outline'}
                      size={14}
                      color="#F2A900"
                    />
                  ))}
                </View>
                <Text style={reviewStyles.overallSubtext}>{totalReviews} reviews</Text>
              </View>
              <View style={reviewStyles.barGroup}>
                {ratingCounts.map(({ star, count }) => (
                  <View key={star} style={reviewStyles.barRow}>
                    <Text style={reviewStyles.barLabel}>{star}</Text>
                    <Ionicons name="star" size={10} color="#F2A900" />
                    <View style={reviewStyles.barTrack}>
                      <View
                        style={[
                          reviewStyles.barFill,
                          {
                            width: totalReviews > 0
                              ? `${Math.round((count / totalReviews) * 100)}%` as any
                              : '0%',
                          },
                        ]}
                      />
                    </View>
                    <Text style={reviewStyles.barCount}>{count}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {productReviews.length === 0 ? (
            <View style={reviewStyles.emptyState}>
              <Ionicons name="chatbubble-outline" size={36} color={Theme.colors.borderDark} />
              <Text style={reviewStyles.emptyText}>No reviews yet</Text>
              <Text style={reviewStyles.emptySubText}>Be the first to share your thoughts!</Text>
            </View>
          ) : productReviews.length > 2 ? (
            // Horizontal slider for > 2 reviews
            <View>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                  const slide = Math.round(e.nativeEvent.contentOffset.x / (width - Theme.spacing.lg * 2));
                  if (slide !== activeReviewSlide) setActiveReviewSlide(slide);
                }}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={width - Theme.spacing.lg * 2}
                contentContainerStyle={{ gap: 0 }}
              >
                {productReviews.map((rev) => (
                  <View key={rev.id} style={reviewStyles.sliderCard}>
                    <ReviewCard review={rev} />
                  </View>
                ))}
              </ScrollView>
              {/* Slider pagination dots */}
              <View style={reviewStyles.sliderDots}>
                {productReviews.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      reviewStyles.sliderDot,
                      idx === activeReviewSlide && reviewStyles.sliderDotActive,
                    ]}
                  />
                ))}
              </View>
            </View>
          ) : (
            productReviews.map((rev) => <ReviewCard key={rev.id} review={rev} />)
          )}
        </View>

        {/* ── SUGGESTED PRODUCTS ── */}
        {suggested.length > 0 && (
          <View style={suggestedStyles.section}>
            <Text style={suggestedStyles.sectionTitle}>You Might Also Like</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={suggestedStyles.row}
            >
              {suggested.map((p) => (
                <SuggestedCard key={p.id} product={p} />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.sizePillBtn}
          onPress={() => openSizeModal(product)}
        >
          <Text style={styles.sizePillBtnText}>Size {selectedSize}</Text>
          <Ionicons name="chevron-down" size={14} color={Theme.colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addCartBtn}
          onPress={handleAddToCart}
          activeOpacity={0.9}
        >
          <Text style={styles.addCartBtnText}>Add to cart</Text>
        </TouchableOpacity>
      </View>

      {/* ── WRITE REVIEW MODAL ── */}
      <Modal
        visible={showReviewModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowReviewModal(false)}
      >
        <Pressable style={modalStyles.overlay} onPress={() => setShowReviewModal(false)} />
        <View style={[modalStyles.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <View style={modalStyles.handle} />
          <Text style={modalStyles.modalTitle}>Write a Review</Text>
          <Text style={modalStyles.productName}>{product.name}</Text>

          <Text style={modalStyles.fieldLabel}>Overall rating</Text>
          <StarPicker value={draftRating} onChange={setDraftRating} />

          <Text style={[modalStyles.fieldLabel, { marginTop: 16 }]}>How does it fit?</Text>
          <View style={modalStyles.fitRow}>
            {(['Runs Small', 'True to Size', 'Runs Large'] as const).map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[modalStyles.fitChip, draftFit === opt && modalStyles.fitChipActive]}
                onPress={() => setDraftFit(opt)}
                activeOpacity={0.75}
              >
                <Text style={[modalStyles.fitChipText, draftFit === opt && modalStyles.fitChipTextActive]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[modalStyles.fieldLabel, { marginTop: 16 }]}>Review title</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="e.g. Amazing quality!"
            placeholderTextColor={Theme.colors.textMuted}
            value={draftTitle}
            onChangeText={setDraftTitle}
            returnKeyType="next"
          />

          <Text style={[modalStyles.fieldLabel, { marginTop: 12 }]}>Your review</Text>
          <TextInput
            style={[modalStyles.input, modalStyles.inputMulti]}
            placeholder="Share your experience with this product..."
            placeholderTextColor={Theme.colors.textMuted}
            value={draftComment}
            onChangeText={setDraftComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[
              modalStyles.submitBtn,
              (!draftTitle.trim() || !draftComment.trim()) && modalStyles.submitBtnDisabled,
            ]}
            onPress={handleSubmitReview}
            activeOpacity={0.85}
          >
            <Text style={modalStyles.submitBtnText}>Submit Review</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  headerHeartBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  galleryContainer: {
    width: width,
    height: 360,
    backgroundColor: Theme.colors.surfaceSecondary,
    position: 'relative',
  },
  galleryImage: {
    width: width,
    height: 360,
  },
  paginationDots: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  galleryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  galleryDotActive: {
    width: 16,
    backgroundColor: '#000000',
  },
  infoContainer: {
    padding: Theme.spacing.lg,
  },
  newBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Theme.colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Theme.borderRadius.xs,
    marginBottom: Theme.spacing.sm,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: Theme.typography.weights.medium,
    color: Theme.colors.textSecondary,
  },
  titlePriceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: Theme.typography.sizes.heading,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
    marginRight: Theme.spacing.md,
  },
  price: {
    fontSize: Theme.typography.sizes.heading,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
  },
  brand: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.bold,
    letterSpacing: 1.2,
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: Theme.spacing.md,
  },
  description: {
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: Theme.spacing.md,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingScore: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
    marginLeft: 4,
  },
  ratingDot: {
    marginHorizontal: 6,
    color: Theme.colors.textMuted,
  },
  ratingCount: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginVertical: Theme.spacing.lg,
  },
  sectionLabel: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorCircleOutline: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleSelected: {
    borderColor: Theme.colors.text,
  },
  colorCircleFill: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  infoBoxGroup: {
    gap: 12,
  },
  infoBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoBoxText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.text,
    fontWeight: Theme.typography.weights.medium,
  },
  sizeSelectorTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.surfaceSecondary,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 14,
    borderRadius: Theme.borderRadius.md,
  },
  sizeSelectorLabel: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.text,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
    flexDirection: 'row',
    gap: 12,
  },
  sizePillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Theme.colors.surfaceSecondary,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: Theme.borderRadius.full,
  },
  sizePillBtnText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.text,
  },
  addCartBtn: {
    flex: 1,
    backgroundColor: Theme.colors.accent,
    height: 50,
    borderRadius: Theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCartBtnText: {
    color: Theme.colors.accentInverse,
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
  },
});

const reviewStyles = StyleSheet.create({
  section: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xl,
    borderTopWidth: 8,
    borderTopColor: Theme.colors.surfaceSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.title,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
  },
  writeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Theme.colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Theme.borderRadius.full,
  },
  writeBtnText: {
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.accentInverse,
  },
  breakdown: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: Theme.spacing.xl,
    backgroundColor: Theme.colors.surfaceSecondary,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.lg,
  },
  overallScore: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
  },
  overallNumber: {
    fontSize: 36,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
    lineHeight: 40,
  },
  overallSubtext: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  barGroup: {
    flex: 1,
    gap: 6,
    justifyContent: 'center',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  barLabel: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    width: 10,
    textAlign: 'right',
  },
  barTrack: {
    flex: 1,
    height: 5,
    backgroundColor: Theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: 5,
    backgroundColor: '#F2A900',
    borderRadius: 3,
  },
  barCount: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    width: 14,
    textAlign: 'right',
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.lg,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Theme.colors.surfaceTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
  },
  userName: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.text,
  },
  dateText: {
    fontSize: 11,
    color: Theme.colors.textMuted,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Theme.colors.badgeGreen,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.xs,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.badgeGreenText,
  },
  reviewTitle: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
    marginBottom: 4,
  },
  reviewComment: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
  },
  fitPill: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: Theme.colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Theme.borderRadius.xs,
  },
  fitPillText: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    fontWeight: Theme.typography.weights.medium,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.textSecondary,
  },
  emptySubText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textMuted,
  },
  sliderCard: {
    width: width - Theme.spacing.lg * 2,
  },
  sliderDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  sliderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.borderDark,
  },
  sliderDotActive: {
    width: 18,
    backgroundColor: Theme.colors.accent,
  },
});

const suggestedStyles = StyleSheet.create({
  section: {
    paddingTop: Theme.spacing.xl,
    paddingBottom: Theme.spacing.xl,
    borderTopWidth: 8,
    borderTopColor: Theme.colors.surfaceSecondary,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.title,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.lg,
  },
  row: {
    paddingHorizontal: Theme.spacing.lg,
    gap: 12,
  },
  card: {
    width: 150,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  image: {
    width: 150,
    height: 160,
    backgroundColor: Theme.colors.surfaceSecondary,
  },
  info: {
    padding: 10,
    gap: 3,
  },
  brand: {
    fontSize: 10,
    fontWeight: Theme.typography.weights.bold,
    letterSpacing: 1,
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.text,
    lineHeight: 17,
  },
  price: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
    marginTop: 2,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Theme.colors.overlay,
  },
  sheet: {
    backgroundColor: Theme.colors.surface,
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: 12,
    maxHeight: '85%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Theme.colors.borderDark,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: Theme.typography.sizes.title,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
    marginBottom: 4,
  },
  productName: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.text,
    marginBottom: 8,
  },
  fitRow: {
    flexDirection: 'row',
    gap: 8,
  },
  fitChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
  },
  fitChipActive: {
    backgroundColor: Theme.colors.accent,
    borderColor: Theme.colors.accent,
  },
  fitChipText: {
    fontSize: 12,
    fontWeight: Theme.typography.weights.medium,
    color: Theme.colors.textSecondary,
  },
  fitChipTextActive: {
    color: Theme.colors.accentInverse,
  },
  input: {
    backgroundColor: Theme.colors.surfaceSecondary,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 12,
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.text,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  inputMulti: {
    height: 100,
    paddingTop: 12,
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: Theme.colors.accent,
    borderRadius: Theme.borderRadius.full,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitBtnText: {
    color: Theme.colors.accentInverse,
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
  },
});
