import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../../theme';
import { useAuthStore } from '../../store';
import { getCategoriesApi, getProvidersByCategoryApi } from '../../api';
import { ServiceCategory, ProviderProfile } from '../../types';
import CategoryCard from '../../components/CategoryCard';
import ProviderCard from '../../components/ProviderCard';

// 4 columns, computed in pixels so the fixed `gap` between tiles never
// pushes the row past the screen width and causes an uneven wrap (which
// happened with the old `width: '22.5%'` + `gap` combo on narrower phones).
const GRID_COLUMNS = 4;
const screenWidth = Dimensions.get('window').width;
const gridHorizontalPadding = spacing.lg * 2;
const gridGap = spacing.md;
const categoryTileSize =
  (screenWidth - gridHorizontalPadding - gridGap * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

const HomeScreen = ({ navigation }: any) => {
  const user = useAuthStore((s) => s.user);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [topProviders, setTopProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [catRes, provRes] = await Promise.all([
        getCategoriesApi(),
        getProvidersByCategoryApi(),
      ]);
      setCategories(catRes.categories);
      // Keep the full list in state so search can match any provider, not
      // just the 5 shown by default — we only slice down for the plain view.
      setTopProviders(provRes.providers);
    } catch (error) {
      console.error('Failed to fetch home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const filteredCategories = useMemo(() => {
    if (!query.trim()) return categories;
    const q = query.trim().toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, query]);

  const filteredProviders = useMemo(() => {
    if (!query.trim()) {
      // "Top Rated" should mean top rated — sort before slicing so the
      // section actually reflects its own label.
      return [...topProviders]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
    }
    const q = query.trim().toLowerCase();
    return topProviders.filter(
      (p) =>
        p.user.name.toLowerCase().includes(q) ||
        p.categories.some((c) => c.name.toLowerCase().includes(q))
    );
  }, [topProviders, query]);

  const isSearching = query.trim().length > 0;
  const noResults = isSearching && filteredCategories.length === 0 && filteredProviders.length === 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {/* Welcome Banner */}
      <View style={styles.banner}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.bannerSubtitle}>What service do you need today?</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a service or pro..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {noResults ? (
        <View style={styles.noResultsContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="search-outline" size={28} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No matches for "{query.trim()}"</Text>
          <Text style={styles.emptyText}>Try a different service or provider name</Text>
        </View>
      ) : (
        <>
          {/* Service Categories */}
          {filteredCategories.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionAccentBar} />
                <Text style={styles.sectionTitle}>
                  {isSearching ? 'Matching Categories' : 'Service Categories'}
                </Text>
              </View>
              <View style={styles.categoryGrid}>
                {filteredCategories.map((cat, index) => (
                  <View key={cat.id} style={styles.categoryItem}>
                    <CategoryCard
                      category={cat}
                      index={index}
                      onPress={() => navigation.navigate('ServiceList', { category: cat })}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Top Providers */}
          {filteredProviders.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionAccentBar} />
                <Text style={styles.sectionTitle}>
                  {isSearching ? 'Matching Providers' : 'Top Rated Providers'}
                </Text>
              </View>
              {filteredProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  onPress={() =>
                    navigation.navigate('ProviderDetail', {
                      providerId: provider.userId,
                      providerName: provider.user.name,
                    })
                  }
                />
              ))}
            </View>
          )}
        </>
      )}

      <View style={{ height: spacing.xxl }} />
    </ScrollView>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  greeting: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  bannerSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionAccentBar: {
    width: 4,
    height: 16,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryItem: {
    width: categoryTileSize,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

export default HomeScreen;
