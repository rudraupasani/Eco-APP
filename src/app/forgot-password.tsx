import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useApp();

  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const isValidEmail = email.trim().length > 0 && email.includes('@');

  const handleSendLink = () => {
    if (!isValidEmail) return;
    setIsSubmitted(true);
    setResendCooldown(30);
    showToast('Reset instructions sent to your email.');
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
    showToast('New reset link sent.');
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
        {/* Top Header */}
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

        {!isSubmitted ? (
          <>
            {/* Heading */}
            <Animated.View
              entering={FadeInDown.duration(500).delay(100)}
              style={styles.headingBlock}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="key-outline" size={30} color={Theme.colors.text} />
              </View>
              <Text style={styles.heading}>Forgot password?</Text>
              <Text style={styles.subheading}>
                No worries. Enter the email address associated with your account and we’ll send you
                a secure link to reset your password.
              </Text>
            </Animated.View>

            {/* Email Form */}
            <Animated.View entering={FadeInDown.duration(500).delay(200)}>
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

              <TouchableOpacity
                style={[styles.primaryBtn, !isValidEmail && styles.primaryBtnDisabled]}
                onPress={handleSendLink}
                disabled={!isValidEmail}
                activeOpacity={0.88}
              >
                <Text style={styles.primaryBtnText}>Send Reset Link</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        ) : (
          /* Success confirmation */
          <Animated.View
            entering={ZoomIn.duration(400)}
            style={styles.successContainer}
          >
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-circle" size={54} color="#10B981" />
            </View>

            <Text style={styles.heading}>Check your inbox</Text>
            <Text style={styles.subheading}>
              We have sent password reset instructions to:
            </Text>
            <View style={styles.emailBadge}>
              <Ionicons name="mail" size={16} color={Theme.colors.text} />
              <Text style={styles.emailBadgeText}>{email}</Text>
            </View>

            <Text style={styles.instructionNote}>
              {"Didn't receive an email? Check your spam folder or request a new reset link."}
            </Text>

            <TouchableOpacity
              style={styles.resendBtn}
              onPress={handleResend}
              activeOpacity={0.8}
            >
              <Text style={styles.resendBtnText}>
                {resendCooldown > 0 ? `Resend email in ${resendCooldown}s` : 'Resend email'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryBtn, { width: '100%', marginTop: 16 }]}
              onPress={() => router.replace('/login' as any)}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryBtnText}>Back to Sign In</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Footer */}
        <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.footer}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <TouchableOpacity onPress={() => router.replace('/login' as any)}>
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
    marginBottom: 20,
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
  headingBlock: { marginTop: 24, marginBottom: 32 },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
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
  fieldGroup: { marginBottom: 20 },
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
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: Theme.typography.sizes.body, color: Theme.colors.text },
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
  successContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Theme.colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginVertical: 16,
  },
  emailBadgeText: {
    fontSize: Theme.typography.sizes.body,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.text,
  },
  instructionNote: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  resendBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  resendBtnText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.text,
    textDecorationLine: 'underline',
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
