import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing } from '../theme';
import { Booking } from '../types';
import StatusBadge from './StatusBadge';

interface BookingCardProps {
  booking: Booking;
  userRole: 'HOMEOWNER' | 'PROVIDER';
  onPress?: () => void;
  onAction?: (action: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  userRole,
  onPress,
  onAction,
}) => {
  const otherUser = userRole === 'HOMEOWNER' ? booking.provider : booking.homeowner;
  const formattedDate = new Date(booking.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{booking.serviceCategory.name}</Text>
          <StatusBadge status={booking.status} />
        </View>
        <Text style={styles.bookingId}>#{booking.id}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={15} color={colors.textMuted} />
          <Text style={styles.detailText}>{otherUser.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={15} color={colors.textMuted} />
          <Text style={styles.detailText}>{formattedDate} • {booking.timeSlot}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={15} color={colors.textMuted} />
          <Text style={styles.detailText} numberOfLines={1}>{booking.address}</Text>
        </View>
      </View>

      {/* Provider actions */}
      {userRole === 'PROVIDER' && booking.status === 'PENDING' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.rejectBtn]}
            onPress={() => onAction?.('reject')}
          >
            <Ionicons name="close" size={18} color={colors.error} />
            <Text style={[styles.actionText, { color: colors.error }]}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.acceptBtn]}
            onPress={() => onAction?.('accept')}
          >
            <Ionicons name="checkmark" size={18} color={colors.success} />
            <Text style={[styles.actionText, { color: colors.success }]}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}

      {userRole === 'PROVIDER' && booking.status === 'ACCEPTED' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.completeBtn]}
            onPress={() => onAction?.('complete')}
          >
            <Ionicons name="checkmark-done" size={18} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primary }]}>Mark Complete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Homeowner cancel action */}
      {userRole === 'HOMEOWNER' && (booking.status === 'PENDING' || booking.status === 'ACCEPTED') && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.rejectBtn]}
            onPress={() => onAction?.('cancel')}
          >
            <Ionicons name="close-circle-outline" size={18} color={colors.error} />
            <Text style={[styles.actionText, { color: colors.error }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Review prompt */}
      {userRole === 'HOMEOWNER' && booking.status === 'COMPLETED' && !booking.review && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.reviewBtn]}
            onPress={() => onAction?.('review')}
          >
            <Ionicons name="star-outline" size={18} color={colors.warning} />
            <Text style={[styles.actionText, { color: colors.warning }]}>Rate & Review</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  serviceName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  bookingId: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  details: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  rejectBtn: {
    backgroundColor: colors.errorLight,
  },
  acceptBtn: {
    backgroundColor: colors.successLight,
  },
  completeBtn: {
    backgroundColor: colors.primaryGhost,
  },
  reviewBtn: {
    backgroundColor: colors.warningLight,
  },
  actionText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
});

export default BookingCard;
