import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const ONBOARDING_SLIDES = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
    title: 'The whole store\nis the edit.',
    subtitle: 'Two hundred pieces from thirty brands. Nothing that only exists to fill a page.',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
    title: 'Precision sizing\nand recommendations.',
    subtitle: 'Know your exact fit before ordering based on real retention data.',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
    title: 'Curated essentials.\nDelivered fast.',
    subtitle: 'Enjoy complimentary express shipping and 30-day effortless returns.',
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slide = ONBOARDING_SLIDES[currentIndex];

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/(tabs)' as any);
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)' as any);
  };

  return (
    <View style={styles.container}>
      <Animated.View key={slide.id} entering={FadeIn.duration(400)} style={StyleSheet.absoluteFill}>
        <Image source={{ uri: slide.image }} style={styles.bgImage} contentFit="cover" />
        <View style={styles.overlay} />
      </Animated.View>

      {/* Top Header */}
      <View style={[styles.topHeader, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.brandName}>WEFT</Text>
      </View>

      {/* Bottom Content Area */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 24 }]}>
        <Animated.View key={`content-${slide.id}`} entering={FadeInRight.duration(350)} exiting={FadeOutLeft.duration(200)}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>
        </Animated.View>

        {/* Pagination Dots */}
        <View style={styles.paginationRow}>
          {ONBOARDING_SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Navigation Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext} style={styles.nextBtn} activeOpacity={0.9}>
            <Text style={styles.nextText}>
              {currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#000000" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
  },
  topHeader: {
    paddingHorizontal: Theme.spacing.lg,
    zIndex: 10,
  },
  brandName: {
    fontSize: Theme.typography.sizes.heading,
    fontWeight: Theme.typography.weights.bold,
    letterSpacing: 4,
    color: '#FFFFFF',
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Theme.spacing.xl,
    zIndex: 10,
  },
  title: {
    fontSize: Theme.typography.sizes.hero,
    fontWeight: Theme.typography.weights.bold,
    color: '#FFFFFF',
    lineHeight: 44,
    marginBottom: Theme.spacing.md,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.body,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    marginBottom: Theme.spacing.xl,
    maxWidth: width * 0.82,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Theme.spacing.xl,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#FFFFFF',
  },
  dotInactive: {
    width: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipBtn: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.medium,
  },
  nextBtn: {
    backgroundColor: '#FFFFFF',
    height: 48,
    paddingHorizontal: 24,
    borderRadius: Theme.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    color: '#000000',
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
  },
});
