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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, typography, borderRadius, spacing } from '../../theme';
import { getMyBookingsApi, completeBookingApi } from '../../api';
import { Booking } from '../../types';
import BookingCard from '../../components/BookingCard';

type FilterTab = 'ACCEPTED' | 'COMPLETED';

const MyJobsScreen = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('ACCEPTED');

  const fetchJobs = useCallback(async () => {
    try {
      const { bookings: data } = await getMyBookingsApi(activeTab);
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchJobs();
    }, [fetchJobs])
  );

  const handleAction = async (booking: Booking, action: string) => {
    if (action === 'complete') {
      Alert.alert('Complete Job', `Mark job #${booking.id} as completed?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              await completeBookingApi(booking.id);
              Alert.alert('Job Completed! 🎉', 'Great work!');
              fetchJobs();
            } catch (error) {
              Alert.alert('Error', 'Failed to complete job');
            }
          },
        },
      ]);
    }
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name={activeTab === 'ACCEPTED' ? 'briefcase-outline' : 'checkmark-done-outline'}
        size={48}
        color={colors.textMuted}
      />
      <Text style={styles.emptyTitle}>
        {activeTab === 'ACCEPTED' ? 'No active jobs' : 'No completed jobs'}
      </Text>
      <Text style={styles.emptyText}>
        {activeTab === 'ACCEPTED'
          ? 'Accept booking requests to see them here'
          : 'Completed jobs will appear here'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ACCEPTED' && styles.tabActive]}
          onPress={() => setActiveTab('ACCEPTED')}
        >
          <Ionicons
            name="briefcase"
            size={16}
            color={activeTab === 'ACCEPTED' ? colors.white : colors.textMuted}
          />
          <Text style={[styles.tabText, activeTab === 'ACCEPTED' && styles.tabTextActive]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'COMPLETED' && styles.tabActive]}
          onPress={() => setActiveTab('COMPLETED')}
        >
          <Ionicons
            name="checkmark-done"
            size={16}
            color={activeTab === 'COMPLETED' ? colors.white : colors.textMuted}
          />
          <Text style={[styles.tabText, activeTab === 'COMPLETED' && styles.tabTextActive]}>
            Completed
          </Text>
        </TouchableOpacity>
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
              userRole="PROVIDER"
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
                fetchJobs();
              }}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      )}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.white,
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
});

export default MyJobsScreen;
