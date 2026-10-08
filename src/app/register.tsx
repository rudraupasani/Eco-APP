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
import { useApp } from '../context/AppContext';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const passwordsMatch = !confirmPassword || password === confirmPassword;
  const isFormValid =
    name.trim().length > 1 &&
    email.trim().includes('@') &&
    password.length >= 6 &&
    password === confirmPassword &&
    agreeTerms;

  const handleRegister = () => {
    if (!isFormValid) return;
    showToast('Account created successfully! Welcome to WEFT.');
    router.replace('/(tabs)' as any);
  };

  const handleSocialRegister = () => {
    showToast('Welcome to WEFT!');
    router.replace('/(tabs)' as any);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header with Back Button */}
        <Animated.View entering={FadeInUp.duration(400)} style={styles.topRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={22} color={Theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.brand}>WEFT</Text>
          <View style={{ width: 40 }} />
        </Animated.View>

        {/* Heading */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.headingBlock}>
          <Text style={styles.heading}>Create account</Text>
          <Text style={styles.subheading}>
            Join our conscious community for curated edits, exclusive drops, and personal fit sizing.
          </Text>
        </Animated.View>

        {/* Form Fields */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputWrapper, nameFocused && styles.inputWrapperFocused]}>
              <Ionicons
                name="person-outline"
                size={18}
                color={nameFocused ? Theme.colors.text : Theme.colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Jane Doe"
                placeholderTextColor={Theme.colors.textMuted}
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
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
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={passwordFocused ? Theme.colors.text : Theme.colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="At least 6 characters"
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

          {/* Confirm Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View
              style={[
                styles.inputWrapper,
                confirmPasswordFocused && styles.inputWrapperFocused,
                !passwordsMatch && styles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color={
                  !passwordsMatch
                    ? Theme.colors.error
                    : confirmPasswordFocused
                    ? Theme.colors.text
                    : Theme.colors.textMuted
                }
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Re-enter password"
                placeholderTextColor={Theme.colors.textMuted}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
              />
              <Pressable onPress={() => setShowConfirmPassword((p) => !p)} style={styles.eyeBtn}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={Theme.colors.textMuted}
                />
              </Pressable>
            </View>
            {!passwordsMatch && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
          </View>

          {/* Terms Agreement Checkbox */}
          <TouchableOpacity
            style={styles.termsRow}
            activeOpacity={0.8}
            onPress={() => setAgreeTerms(!agreeTerms)}
          >
            <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
              {agreeTerms && <Ionicons name="checkmark" size={14} color="#FFF" />}
            </View>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.primaryBtn, !isFormValid && styles.primaryBtnDisabled]}
            onPress={handleRegister}
            disabled={!isFormValid}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryBtnText}>Create Account</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Social Button */}
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={handleSocialRegister}
            activeOpacity={0.85}
          >
            <Ionicons name="logo-google" size={18} color={Theme.colors.text} />
            <Text style={styles.socialBtnText}>Sign up with Google</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer Link to Login */}
        <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login' as any)}>
            <Text style={styles.footerLink}>Sign in</Text>
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
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  brand: {
    fontSize: Theme.typography.sizes.title,
    fontWeight: Theme.typography.weights.bold,
    letterSpacing: 4,
    color: Theme.colors.text,
  },
  headingBlock: { marginTop: 16, marginBottom: 28 },
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
  fieldGroup: { marginBottom: 16 },
  label: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.text,
    marginBottom: 8,
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
  inputWrapperError: { borderColor: Theme.colors.error },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: Theme.typography.sizes.body, color: Theme.colors.text },
  eyeBtn: { padding: 4, marginLeft: 8 },
  errorText: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.error,
    marginTop: 4,
    marginLeft: 2,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Theme.colors.accent,
    borderColor: Theme.colors.accent,
  },
  termsText: {
    flex: 1,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
  },
  termsLink: {
    color: Theme.colors.text,
    fontWeight: Theme.typography.weights.semibold,
    textDecorationLine: 'underline',
  },
  primaryBtn: {
    backgroundColor: Theme.colors.accent,
    height: 54,
    borderRadius: Theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
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
    marginTop: 32,
  },
  footerText: { fontSize: Theme.typography.sizes.body, color: Theme.colors.textSecondary },
  footerLink: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
    textDecorationLine: 'underline',
  },
});
