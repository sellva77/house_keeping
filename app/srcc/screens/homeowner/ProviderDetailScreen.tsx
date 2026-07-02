import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../../theme';
import { getProviderDetailApi } from '../../api';
import { ProviderProfile, Review } from '../../types';
import Button from '../../components/Button';
import RatingStars from '../../components/RatingStars';
import Card from '../../components/Card';

const ProviderDetailScreen = ({ route, navigation }: any) => {
  const { providerId } = route.params;
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProvider();
  }, []);

  const fetchProvider = async () => {
    try {
      const { provider: data, reviews: reviewData } = await getProviderDetailApi(providerId);
      setProvider(data);
      setReviews(reviewData);
    } catch (error) {
      console.error('Failed to fetch provider:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !provider) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const skillsList = provider.skills?.split(',').map((s) => s.trim()) || [];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {provider.user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{provider.user.name}</Text>
          <View style={styles.ratingContainer}>
            <RatingStars
              rating={provider.rating}
              size={18}
              showValue
              totalReviews={provider.totalReviews}
            />
          </View>
          {provider.user.bio && (
            <Text style={styles.bio}>{provider.user.bio}</Text>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{provider.experience}</Text>
            <Text style={styles.statLabel}>Years Exp</Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={styles.statValue}>₹{provider.hourlyRate}</Text>
            <Text style={styles.statLabel}>Per Hour</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{provider.totalReviews}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Skills */}
        {skillsList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills & Services</Text>
            <View style={styles.skillsRow}>
              {skillsList.map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Service Area */}
        {provider.serviceArea && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Area</Text>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
              <Text style={styles.infoText}>{provider.serviceArea}</Text>
            </View>
          </View>
        )}

        {/* Categories */}
        {provider.categories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.skillsRow}>
              {provider.categories.map((cat) => (
                <View key={cat.id} style={[styles.skillChip, styles.categoryChip]}>
                  <Text style={[styles.skillText, { color: colors.accent }]}>{cat.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Reviews {reviews.length > 0 ? `(${reviews.length})` : ''}
          </Text>
          {reviews.length === 0 ? (
            <Text style={styles.noReviews}>No reviews yet</Text>
          ) : (
            reviews.map((review) => (
              <Card key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerAvatar}>
                    <Text style={styles.reviewerInitial}>
                      {review.author.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>{review.author.name}</Text>
                    <RatingStars rating={review.rating} size={12} />
                  </View>
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
                {review.comment && (
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                )}
              </Card>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Book Button */}
      <View style={styles.bookContainer}>
        <Button
          title={`Book Now — ₹${provider.hourlyRate}/hr`}
          onPress={() =>
            navigation.navigate('BookingForm', {
              providerId: provider.userId,
              providerName: provider.user.name,
              categoryId: provider.categories[0]?.id || 1,
              categoryName: provider.categories[0]?.name || 'Service',
              hourlyRate: provider.hourlyRate,
            })
          }
          size="lg"
          style={{ width: '100%' }}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: spacing.lg,
    ...shadows.glow,
  },
  avatarText: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  name: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  ratingContainer: {
    marginBottom: spacing.md,
  },
  bio: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  skillChip: {
    backgroundColor: colors.primaryGhost,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  categoryChip: {
    backgroundColor: 'rgba(255, 101, 132, 0.1)',
  },
  skillText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  noReviews: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  reviewCard: {
    marginBottom: spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  reviewerInitial: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  reviewComment: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bookContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default ProviderDetailScreen;
