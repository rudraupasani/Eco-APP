import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Theme } from '../constants/theme';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const isFormValid = email.trim().length > 0 && password.length >= 6;

  const handleLogin = () => {
    router.replace('/(tabs)' as any);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand & Guest Skip */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.topRow}>
          <View>
            <Text style={styles.brand}>WEFT</Text>
            <Text style={styles.tagline}>Wear what matters.</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)' as any)}
            style={styles.guestBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.guestBtnText}>Skip</Text>
            <Ionicons name="chevron-forward" size={14} color={Theme.colors.textMuted} />
          </TouchableOpacity>
        </Animated.View>

        {/* Heading */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.headingBlock}>
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>
            Sign in to your account to continue shopping.
          </Text>
        </Animated.View>

        {/* Form */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={emailFocused ? Theme.colors.text : Theme.colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={Theme.colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity onPress={() => router.push('/forgot-password' as any)}>
                <Text style={styles.forgotLink}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={passwordFocused ? Theme.colors.text : Theme.colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Min. 6 characters"
                placeholderTextColor={Theme.colors.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <Pressable onPress={() => setShowPassword((p) => !p)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={Theme.colors.textMuted}
                />
              </Pressable>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.primaryBtn, !isFormValid && styles.primaryBtnDisabled]}
            onPress={handleLogin}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryBtnText}>Sign In</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google */}
          <TouchableOpacity style={styles.socialBtn} onPress={handleLogin} activeOpacity={0.85}>
            <Ionicons name="logo-google" size={18} color={Theme.colors.text} />
            <Text style={styles.socialBtnText}>Continue with Google</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.footer}>
          <Text style={styles.footerText}>{"Don't have an account? "}</Text>
          <TouchableOpacity onPress={() => router.push('/register' as any)}>
            <Text style={styles.footerLink}>Create one</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: { paddingHorizontal: Theme.spacing.xl },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.surfaceSecondary,
    gap: 4,
  },
  guestBtnText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium,
    color: Theme.colors.textSecondary,
  },
  brand: {
    fontSize: Theme.typography.sizes.heading,
    fontWeight: Theme.typography.weights.bold,
    letterSpacing: 4,
    color: Theme.colors.text,
    marginBottom: 4,
  },
  tagline: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  headingBlock: { marginTop: 44, marginBottom: 32 },
  heading: {
    fontSize: Theme.typography.sizes.display,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
    marginBottom: 8,
  },
  subheading: {
    fontSize: Theme.typography.sizes.body,
    color: Theme.colors.textSecondary,
    lineHeight: 22,
  },
  fieldGroup: { marginBottom: 18 },
  label: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.text,
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotLink: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
    fontWeight: Theme.typography.weights.medium,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    height: 52,
    paddingHorizontal: Theme.spacing.md,
  },
  inputWrapperFocused: { borderColor: Theme.colors.text },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: Theme.typography.sizes.body, color: Theme.colors.text },
  eyeBtn: { padding: 4, marginLeft: 8 },
  primaryBtn: {
    backgroundColor: Theme.colors.accent,
    height: 54,
    borderRadius: Theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryBtnDisabled: { opacity: 0.42 },
  primaryBtnText: {
    color: Theme.colors.accentInverse,
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
    letterSpacing: 0.3,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Theme.colors.border },
  dividerText: { fontSize: Theme.typography.sizes.sm, color: Theme.colors.textMuted },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 54,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
  },
  socialBtnText: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 36,
  },
  footerText: { fontSize: Theme.typography.sizes.body, color: Theme.colors.textSecondary },
  footerLink: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
    textDecorationLine: 'underline',
  },
});
