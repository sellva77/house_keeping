import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { getProvidersByCategoryApi } from '../../api';
import { ProviderProfile, ServiceCategory } from '../../types';
import ProviderCard from '../../components/ProviderCard';

const ServiceListScreen = ({ route, navigation }: any) => {
  const category: ServiceCategory = route.params.category;
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color={colors.textMuted} />
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
      <FlatList
        data={providers}
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
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginTop: spacing.lg,
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
