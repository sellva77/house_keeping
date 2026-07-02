import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing } from '../../theme';
import { createBookingApi } from '../../api';
import { useAuthStore } from '../../store';
import Button from '../../components/Button';
import Input from '../../components/Input';

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM',
];

const BookingFormScreen = ({ route, navigation }: any) => {
  const { providerId, providerName, categoryId, categoryName, hourlyRate } = route.params;
  const user = useAuthStore((s) => s.user);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [address, setAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Today plus the next 6 days, so users aren't forced to wait until tomorrow
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const now = new Date();
  const isToday = (d: Date) => d.toDateString() === now.toDateString();

  const isSlotPast = (slot: string) => {
    if (!selectedDate || !isToday(selectedDate)) return false;
    const [time, meridiem] = slot.split(' ');
    let [hour, minute] = time.split(':').map(Number);
    if (meridiem === 'PM' && hour !== 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;
    const slotDate = new Date(selectedDate);
    slotDate.setHours(hour, minute, 0, 0);
    return slotDate.getTime() < now.getTime();
  };

  const handleBooking = async () => {
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date');
      return;
    }
    if (!selectedTimeSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter your address');
      return;
    }

    setLoading(true);
    try {
      await createBookingApi({
        providerId,
        serviceCategoryId: categoryId,
        date: selectedDate.toISOString(),
        timeSlot: selectedTimeSlot,
        address: address.trim(),
        notes: notes.trim() || undefined,
      });
      Alert.alert('Booking Confirmed! 🎉', `Your ${categoryName} service with ${providerName} has been booked.`, [
        { text: 'View Bookings', onPress: () => navigation.popToTop() },
      ]);
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Failed to create booking';
      Alert.alert('Booking Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Service Info */}
          <View style={styles.serviceInfo}>
            <View style={styles.serviceIcon}>
              <Ionicons name="construct" size={24} color={colors.primary} />
            </View>
            <View style={styles.serviceDetails}>
              <Text style={styles.categoryName}>{categoryName}</Text>
              <Text style={styles.providerName}>with {providerName}</Text>
            </View>
            <Text style={styles.rate}>₹{hourlyRate}/hr</Text>
          </View>

          {/* Date Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateRow}
            >
              {dates.map((date, index) => {
                const isSelected =
                  selectedDate?.toDateString() === date.toDateString();
                const dayName = isToday(date)
                  ? 'Today'
                  : date.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = date.getDate();
                const monthName = date.toLocaleDateString('en-US', { month: 'short' });

                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                    onPress={() => {
                      setSelectedDate(date);
                      // Clear a time slot that's no longer valid for the newly picked day
                      if (isToday(date) && selectedTimeSlot) {
                        const stillValid = timeSlots.includes(selectedTimeSlot);
                        if (stillValid) {
                          const check = new Date(date);
                          const [time, meridiem] = selectedTimeSlot.split(' ');
                          let [hour, minute] = time.split(':').map(Number);
                          if (meridiem === 'PM' && hour !== 12) hour += 12;
                          if (meridiem === 'AM' && hour === 12) hour = 0;
                          check.setHours(hour, minute, 0, 0);
                          if (check.getTime() < now.getTime()) setSelectedTimeSlot('');
                        }
                      }
                    }}
                  >
                    <Text
                      style={[styles.dayName, isSelected && styles.dateTextSelected]}
                    >
                      {dayName}
                    </Text>
                    <Text
                      style={[styles.dayNum, isSelected && styles.dateTextSelected]}
                    >
                      {dayNum}
                    </Text>
                    <Text
                      style={[styles.monthName, isSelected && styles.dateTextSelected]}
                    >
                      {monthName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Time Slot Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Time</Text>
            <View style={styles.timeGrid}>
              {timeSlots.map((slot) => {
                const isSelected = selectedTimeSlot === slot;
                const isPast = isSlotPast(slot);
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.timeChip,
                      isSelected && styles.timeChipSelected,
                      isPast && styles.timeChipDisabled,
                    ]}
                    onPress={() => !isPast && setSelectedTimeSlot(slot)}
                    disabled={isPast}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        isSelected && styles.timeTextSelected,
                        isPast && styles.timeTextDisabled,
                      ]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Address */}
          <View style={styles.section}>
            <Input
              label="Service Address"
              placeholder="Enter your complete address"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={2}
              leftIcon={<Ionicons name="location-outline" size={20} color={colors.textMuted} />}
            />
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Input
              label="Additional Notes (Optional)"
              placeholder="Any special instructions..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              leftIcon={<Ionicons name="document-text-outline" size={20} color={colors.textMuted} />}
            />
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Confirm Button */}
      <View style={styles.bottomBar}>
        <Button
          title="Confirm Booking"
          onPress={handleBooking}
          loading={loading}
          size="lg"
          style={{ width: '100%' }}
          icon={<Ionicons name="checkmark-circle" size={20} color={colors.white} />}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  serviceDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  providerName: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rate: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  dateRow: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  dateCard: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 70,
  },
  dateCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayName: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  dayNum: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  monthName: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  dateTextSelected: {
    color: colors.white,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeChipSelected: {
    backgroundColor: colors.primaryGhost,
    borderColor: colors.primary,
  },
  timeChipDisabled: {
    opacity: 0.4,
  },
  timeText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  timeTextSelected: {
    color: colors.primary,
  },
  timeTextDisabled: {
    color: colors.textMuted,
  },
  bottomBar: {
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

export default BookingFormScreen;
