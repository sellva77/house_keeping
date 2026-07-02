import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../../theme';
import { useAuthStore } from '../../store';
import { getCategoriesApi, getProvidersByCategoryApi } from '../../api';
import { ServiceCategory, ProviderProfile } from '../../types';
import CategoryCard from '../../components/CategoryCard';
import ProviderCard from '../../components/ProviderCard';

const HomeScreen = ({ navigation }: any) => {
  const user = useAuthStore((s) => s.user);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [topProviders, setTopProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [catRes, provRes] = await Promise.all([
        getCategoriesApi(),
        getProvidersByCategoryApi(),
      ]);
      setCategories(catRes.categories);
      setTopProviders(provRes.providers.slice(0, 5));
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

      {/* Search Bar (visual only) */}
      <TouchableOpacity style={styles.searchBar} activeOpacity={0.7}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <Text style={styles.searchPlaceholder}>Search for services...</Text>
      </TouchableOpacity>

      {/* Service Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service Categories</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat, index) => (
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

      {/* Top Providers */}
      {topProviders.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Rated Providers</Text>
          {topProviders.map((provider) => (
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
    paddingVertical: spacing.md + 2,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  searchPlaceholder: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryItem: {
    width: '22.5%',
    minWidth: 75,
  },
});

export default HomeScreen;
