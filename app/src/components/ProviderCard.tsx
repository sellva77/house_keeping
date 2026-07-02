import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../theme';
import { ProviderProfile } from '../types';
import RatingStars from './RatingStars';

interface ProviderCardProps {
  provider: ProviderProfile;
  onPress: () => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {provider.user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        {provider.isAvailable && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {provider.user.name}
        </Text>
        <View style={styles.ratingRow}>
          <RatingStars
            rating={provider.rating}
            size={14}
            showValue
            totalReviews={provider.totalReviews}
          />
        </View>
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="briefcase-outline" size={13} color={colors.textMuted} />
            <Text style={styles.detailText}>{provider.experience}yr exp</Text>
          </View>
          {provider.serviceArea && (
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={13} color={colors.textMuted} />
              <Text style={styles.detailText} numberOfLines={1}>
                {provider.serviceArea.split(',')[0]}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.priceAmount}>₹{provider.hourlyRate}</Text>
        <Text style={styles.priceUnit}>/hr</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.card,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 3,
  },
  ratingRow: {
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  detailText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginLeft: spacing.sm,
  },
  priceAmount: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  priceUnit: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
});

export default ProviderCard;
