import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { getProvidersByCategoryApi } from '../../api';
import { ProviderProfile, ServiceCategory } from '../../types';
import ProviderCard from '../../components/ProviderCard';

type SortKey = 'rating' | 'priceLow' | 'priceHigh';

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'rating', label: 'Top Rated' },
  { key: 'priceLow', label: 'Price: Low to High' },
  { key: 'priceHigh', label: 'Price: High to Low' },
];

const ServiceListScreen = ({ route, navigation }: any) => {
  const category: ServiceCategory = route.params.category;
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('rating');

  const fetchProviders = useCallback(async () => {
    try {
      const { providers: data } = await getProvidersByCategoryApi(category.id);
      setProviders(data);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [category.id]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const sortedProviders = useMemo(() => {
    const list = [...providers];
    switch (sortKey) {
      case 'priceLow':
        return list.sort((a, b) => a.hourlyRate - b.hourlyRate);
      case 'priceHigh':
        return list.sort((a, b) => b.hourlyRate - a.hourlyRate);
      case 'rating':
      default:
        // Highest-rated first; providers with no reviews yet sink to the
        // bottom rather than outranking rated ones on a technicality.
        return list.sort((a, b) => {
          if (a.totalReviews === 0 && b.totalReviews === 0) return 0;
          if (a.totalReviews === 0) return 1;
          if (b.totalReviews === 0) return -1;
          return b.rating - a.rating;
        });
    }
  }, [providers, sortKey]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="search-outline" size={28} color={colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No providers found</Text>
      <Text style={styles.emptyText}>
        No service providers available for {category.name} right now.
      </Text>
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
      {providers.length > 0 && (
        <View style={styles.sortRow}>
          {sortOptions.map((opt) => {
            const active = sortKey === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.sortChip, active && styles.sortChipActive]}
                onPress={() => setSortKey(opt.key)}
              >
                <Text style={[styles.sortChipText, active && styles.sortChipTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      <FlatList
        data={sortedProviders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProviderCard
            provider={item}
            onPress={() =>
              navigation.navigate('ProviderDetail', {
                providerId: item.userId,
                providerName: item.user.name,
              })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={
          <Text style={styles.resultCount}>
            {providers.length} provider{providers.length !== 1 ? 's' : ''} available
          </Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchProviders();
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
  sortRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sortChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortChipText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  sortChipTextActive: {
    color: colors.white,
  },
  listContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  resultCount: {
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
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xxl,
  },
});

export default ServiceListScreen;
