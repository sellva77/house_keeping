import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../theme';
import { ServiceCategory } from '../types';

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  broom: 'sparkles',
  water: 'water',
  flash: 'flash',
  construct: 'construct',
  'color-palette': 'color-palette',
  snow: 'snow',
  leaf: 'leaf',
  bug: 'bug',
};

const gradientColors: string[] = [
  '#6C63FF',
  '#FF6584',
  '#FFB300',
  '#00C853',
  '#2196F3',
  '#E040FB',
  '#FF6E40',
  '#00BCD4',
];

interface CategoryCardProps {
  category: ServiceCategory;
  index: number;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index, onPress }) => {
  const accentColor = gradientColors[index % gradientColors.length];
  const iconName = iconMap[category.icon] || 'build';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.iconContainer, { backgroundColor: accentColor + '20' }]}>
        <Ionicons name={iconName} size={28} color={accentColor} />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    aspectRatio: 1,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text,
    textAlign: 'center',
  },
});

export default CategoryCard;
