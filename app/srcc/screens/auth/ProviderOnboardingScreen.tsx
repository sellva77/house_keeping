import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../../theme';
import { useAuthStore } from '../../store';
import { getCategoriesApi, completeOnboardingApi } from '../../api';
import { ServiceCategory } from '../../types';
import Button from '../../components/Button';
import Input from '../../components/Input';

const ProviderOnboardingScreen = () => {
  const { user, setAuth } = useAuthStore();
  const token = useAuthStore((s) => s.token);

  // Step state
  const [step, setStep] = useState(0);

  // Form data
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { categories: data } = await getCategoriesApi();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const steps = [
    { title: 'Select Services', subtitle: 'What services do you offer?' },
    { title: 'Your Skills', subtitle: 'Tell us about your expertise' },
    { title: 'Pricing & Area', subtitle: 'Set your rate and service area' },
  ];

  const canProceed = () => {
    if (step === 0) return selectedCategoryIds.length > 0;
    if (step === 1) return skills.trim().length > 0;
    if (step === 2) return hourlyRate.trim().length > 0 && parseFloat(hourlyRate) > 0;
    return false;
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { user: updatedUser } = await completeOnboardingApi({
        skills: skills.trim(),
        experience: parseInt(experience) || 0,
        hourlyRate: parseFloat(hourlyRate),
        serviceArea: serviceArea.trim() || undefined,
        bio: bio.trim() || undefined,
        categoryIds: selectedCategoryIds,
      });
      // Update auth store with refreshed user (now has providerProfile with categories)
      await setAuth(updatedUser, token!);
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Failed to complete setup';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    broom: 'sparkles',
    water: 'water',
    flash: 'flash',
    construct: 'construct',
    'color-palette': 'color-palette',
    snow: 'snow',
    leaf: 'leaf',
    bug: 'bug',
  };

  const gradientColors = [
    '#6C63FF', '#FF6584', '#FFB300', '#00C853',
    '#2196F3', '#E040FB', '#FF6E40', '#00BCD4',
  ];

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.welcome}>Welcome, {user?.name?.split(' ')[0]}! 👋</Text>
            <Text style={styles.headerTitle}>{steps[step].title}</Text>
            <Text style={styles.headerSubtitle}>{steps[step].subtitle}</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            {steps.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  i <= step && styles.progressDotActive,
                  i < step && styles.progressDotCompleted,
                ]}
              />
            ))}
          </View>

          {/* Step 0: Service Categories */}
          {step === 0 && (
            <View style={styles.stepContent}>
              <Text style={styles.label}>Select the services you provide:</Text>
              {categoriesLoading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
              ) : (
                <View style={styles.categoryGrid}>
                  {categories.map((cat, index) => {
                    const isSelected = selectedCategoryIds.includes(cat.id);
                    const accent = gradientColors[index % gradientColors.length];
                    const iconName = iconMap[cat.icon] || 'build';
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.categoryCard,
                          isSelected && { borderColor: accent, backgroundColor: accent + '15' },
                        ]}
                        onPress={() => toggleCategory(cat.id)}
                        activeOpacity={0.7}
                      >
                        {isSelected && (
                          <View style={[styles.checkMark, { backgroundColor: accent }]}>
                            <Ionicons name="checkmark" size={12} color={colors.white} />
                          </View>
                        )}
                        <View style={[styles.categoryIcon, { backgroundColor: accent + '20' }]}>
                          <Ionicons name={iconName} size={24} color={accent} />
                        </View>
                        <Text style={styles.categoryName}>{cat.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* Step 1: Skills & Experience */}
          {step === 1 && (
            <View style={styles.stepContent}>
              <Input
                label="Skills & Specializations"
                placeholder="e.g., Pipe Repair, Leak Detection, Drain Cleaning"
                value={skills}
                onChangeText={setSkills}
                multiline
                numberOfLines={3}
                leftIcon={<Ionicons name="construct-outline" size={20} color={colors.textMuted} />}
              />
              <Input
                label="Years of Experience"
                placeholder="e.g., 5"
                value={experience}
                onChangeText={setExperience}
                keyboardType="numeric"
                leftIcon={<Ionicons name="briefcase-outline" size={20} color={colors.textMuted} />}
              />
              <Input
                label="About You (Optional)"
                placeholder="Tell homeowners about yourself and your work..."
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                leftIcon={<Ionicons name="person-outline" size={20} color={colors.textMuted} />}
              />
            </View>
          )}

          {/* Step 2: Rate & Service Area */}
          {step === 2 && (
            <View style={styles.stepContent}>
              <Input
                label="Hourly Rate (₹)"
                placeholder="e.g., 350"
                value={hourlyRate}
                onChangeText={setHourlyRate}
                keyboardType="numeric"
                leftIcon={<Ionicons name="cash-outline" size={20} color={colors.textMuted} />}
              />
              <Input
                label="Service Area (Optional)"
                placeholder="e.g., Downtown, Suburbs, Citywide"
                value={serviceArea}
                onChangeText={setServiceArea}
                leftIcon={<Ionicons name="location-outline" size={20} color={colors.textMuted} />}
              />

              {/* Summary */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Your Profile Summary</Text>
                <View style={styles.summaryRow}>
                  <Ionicons name="list-outline" size={16} color={colors.primary} />
                  <Text style={styles.summaryText}>
                    {selectedCategoryIds.length} service{selectedCategoryIds.length !== 1 ? 's' : ''} selected
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Ionicons name="construct-outline" size={16} color={colors.primary} />
                  <Text style={styles.summaryText} numberOfLines={1}>{skills || 'No skills entered'}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Ionicons name="briefcase-outline" size={16} color={colors.primary} />
                  <Text style={styles.summaryText}>{experience || '0'} years experience</Text>
                </View>
                {hourlyRate ? (
                  <View style={styles.summaryRow}>
                    <Ionicons name="cash-outline" size={16} color={colors.primary} />
                    <Text style={styles.summaryText}>₹{hourlyRate}/hr</Text>
                  </View>
                ) : null}
              </View>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Navigation */}
      <View style={styles.bottomBar}>
        {step > 0 && (
          <Button
            title="Back"
            variant="ghost"
            onPress={() => setStep(step - 1)}
            style={{ flex: 0.4 }}
          />
        )}
        <Button
          title={step === steps.length - 1 ? 'Complete Setup' : 'Next'}
          onPress={handleNext}
          loading={loading}
          disabled={!canProceed()}
          size="lg"
          style={{ flex: 1 }}
          icon={
            step === steps.length - 1 ? (
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
            ) : undefined
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.huge,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  welcome: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xxxl,
  },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceLight,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  progressDotCompleted: {
    backgroundColor: colors.success,
  },
  stepContent: {
    flex: 1,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  checkMark: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  categoryName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.md,
  },
  summaryTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  summaryText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
});

export default ProviderOnboardingScreen;
