import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing } from '../theme';

interface RatingStarsProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  totalReviews?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 16,
  showValue = false,
  totalReviews,
  interactive = false,
  onRate,
}) => {
  const stars = [1, 2, 3, 4, 5];
  // A provider with no reviews yet isn't "0.0 stars" (which reads as poorly
  // rated) — it's simply unrated. Show a neutral "New" chip instead so
  // fresh providers aren't penalized visually against established ones.
  const isUnrated = showValue && totalReviews === 0;

  const renderStar = (index: number) => {
    const filled = rating >= index;
    const halfFilled = rating >= index - 0.5 && rating < index;

    const iconName = filled ? 'star' : halfFilled ? 'star-half' : 'star-outline';
    const iconColor = filled || halfFilled ? '#FFB300' : colors.textMuted;

    if (interactive) {
      return (
        <TouchableOpacity key={index} onPress={() => onRate?.(index)} activeOpacity={0.7}>
          <Ionicons name={iconName} size={size} color={iconColor} style={{ marginRight: 2 }} />
        </TouchableOpacity>
      );
    }

    return (
      <Ionicons key={index} name={iconName} size={size} color={iconColor} style={{ marginRight: 2 }} />
    );
  };

  if (isUnrated) {
    return (
      <View style={styles.container}>
        <View style={styles.newChip}>
          <Text style={[styles.newChipText, { fontSize: size - 3 }]}>New</Text>
        </View>
        <Text style={[styles.reviewCount, { fontSize: size - 4, marginLeft: spacing.xs }]}>
          No reviews yet
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>{stars.map(renderStar)}</View>
      {showValue && (
        <Text style={[styles.ratingText, { fontSize: size - 2 }]}>
          {rating.toFixed(1)}
        </Text>
      )}
      {totalReviews !== undefined && totalReviews > 0 && (
        <Text style={[styles.reviewCount, { fontSize: size - 4 }]}>
          ({totalReviews})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: colors.text,
    fontWeight: typography.weights.semibold,
    marginLeft: spacing.sm,
  },
  reviewCount: {
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
  newChip: {
    backgroundColor: colors.infoLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  newChipText: {
    color: colors.info,
    fontWeight: typography.weights.semibold,
  },
});

export default RatingStars;
