import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, typography, borderRadius, spacing } from '../../theme';
import { getMyBookingsApi, cancelBookingApi, createReviewApi } from '../../api';
import { Booking } from '../../types';
import BookingCard from '../../components/BookingCard';
import RatingStars from '../../components/RatingStars';
import Button from '../../components/Button';

type FilterTab = 'ALL' | 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';

const tabs: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'ACCEPTED', label: 'Active' },
  { key: 'COMPLETED', label: 'Done' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');

  // Review modal state
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewBookingId, setReviewBookingId] = useState<number | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const status = activeTab === 'ALL' ? undefined : activeTab;
      const { bookings: data } = await getMyBookingsApi(status);
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchBookings();
    }, [fetchBookings])
  );

  const handleAction = async (booking: Booking, action: string) => {
    if (action === 'cancel') {
      Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelBookingApi(booking.id);
              fetchBookings();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel booking');
            }
          },
        },
      ]);
    } else if (action === 'review') {
      setReviewBookingId(booking.id);
      setReviewRating(5);
      setReviewComment('');
      setReviewModal(true);
    }
  };

  const submitReview = async () => {
    if (!reviewBookingId) return;
    setReviewLoading(true);
    try {
      await createReviewApi({
        bookingId: reviewBookingId,
        rating: reviewRating,
        comment: reviewComment.trim() || undefined,
      });
      setReviewModal(false);
      Alert.alert('Thank you! ⭐', 'Your review has been submitted.');
      fetchBookings();
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Failed to submit review';
      Alert.alert('Error', msg);
    } finally {
      setReviewLoading(false);
    }
  };

  const emptyCopy: Record<FilterTab, { title: string; text: string }> = {
    ALL: { title: 'No bookings yet', text: 'Book a service and it will show up here' },
    PENDING: { title: 'Nothing pending', text: "Requests waiting on a provider's response appear here" },
    ACCEPTED: { title: 'No active jobs', text: 'Bookings a provider has accepted appear here' },
    COMPLETED: { title: 'No completed jobs', text: 'Finished bookings will appear here' },
    CANCELLED: { title: 'No cancelled bookings', text: "You're all clear here" },
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="calendar-outline" size={28} color={colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>{emptyCopy[activeTab].title}</Text>
      <Text style={styles.emptyText}>{emptyCopy[activeTab].text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <FlatList
          horizontal
          data={tabs}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tab, activeTab === item.key && styles.tabActive]}
              onPress={() => setActiveTab(item.key)}
            >
              <Text style={[styles.tabText, activeTab === item.key && styles.tabTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              userRole="HOMEOWNER"
              onAction={(action) => handleAction(item, action)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchBookings();
              }}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      )}

      {/* Review Modal */}
      <Modal visible={reviewModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate & Review</Text>
            <View style={styles.modalStars}>
              <RatingStars
                rating={reviewRating}
                size={36}
                interactive
                onRate={setReviewRating}
              />
            </View>
            <TextInput
              style={styles.reviewInput}
              placeholder="Write your review (optional)..."
              placeholderTextColor={colors.textMuted}
              value={reviewComment}
              onChangeText={setReviewComment}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="ghost"
                onPress={() => setReviewModal(false)}
              />
              <Button
                title="Submit Review"
                onPress={submitReview}
                loading={reviewLoading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabsContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.white,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginTop: spacing.lg,
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.xxl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xxl,
    paddingBottom: spacing.huge,
  },
  modalTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  modalStars: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  reviewInput: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    fontSize: typography.sizes.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: spacing.xl,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
});

export default MyBookingsScreen;
