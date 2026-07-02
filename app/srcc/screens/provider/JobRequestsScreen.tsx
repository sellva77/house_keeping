import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, typography, spacing } from '../../theme';
import { getMyBookingsApi, acceptBookingApi, rejectBookingApi } from '../../api';
import { Booking } from '../../types';
import BookingCard from '../../components/BookingCard';

const JobRequestsScreen = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      const { bookings: data } = await getMyBookingsApi('PENDING');
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchRequests();
    }, [fetchRequests])
  );

  const handleAction = async (booking: Booking, action: string) => {
    if (action === 'accept') {
      Alert.alert('Accept Booking', `Accept booking #${booking.id} from ${booking.homeowner.name}?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              await acceptBookingApi(booking.id);
              Alert.alert('Accepted! ✅', 'The booking has been accepted.');
              fetchRequests();
            } catch (error) {
              Alert.alert('Error', 'Failed to accept booking');
            }
          },
        },
      ]);
    } else if (action === 'reject') {
      Alert.alert('Reject Booking', `Reject booking #${booking.id}?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await rejectBookingApi(booking.id);
              fetchRequests();
            } catch (error) {
              Alert.alert('Error', 'Failed to reject booking');
            }
          },
        },
      ]);
    }
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="inbox-outline" size={48} color={colors.textMuted} />
      <Text style={styles.emptyTitle}>No pending requests</Text>
      <Text style={styles.emptyText}>New booking requests will appear here</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            userRole="PROVIDER"
            onAction={(action) => handleAction(item, action)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={
          bookings.length > 0 ? (
            <Text style={styles.headerText}>
              {bookings.length} pending request{bookings.length !== 1 ? 's' : ''}
            </Text>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchRequests();
            }}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
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
  listContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  headerText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
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
  },
});

export default JobRequestsScreen;
