import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../theme';
import { BookingStatus } from '../types';

interface StatusBadgeProps {
  status: BookingStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pending', color: colors.statusPending, bg: colors.warningLight },
  ACCEPTED: { label: 'Accepted', color: colors.statusAccepted, bg: colors.infoLight },
  IN_PROGRESS: { label: 'In Progress', color: colors.statusInProgress, bg: colors.primaryGhost },
  COMPLETED: { label: 'Completed', color: colors.statusCompleted, bg: colors.successLight },
  REJECTED: { label: 'Rejected', color: colors.statusRejected, bg: colors.errorLight },
  CANCELLED: { label: 'Cancelled', color: colors.statusCancelled, bg: 'rgba(158, 158, 158, 0.12)' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = statusConfig[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, size === 'md' && styles.badgeMd]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }, size === 'md' && styles.textMd]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs + 2,
  },
  text: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  textMd: {
    fontSize: typography.sizes.sm,
  },
});

export default StatusBadge;
