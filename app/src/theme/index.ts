export const colors = {
  // Primary palette — warm copper, evokes tools & craftsmanship
  // rather than generic SaaS violet
  primary: '#E2793D',
  primaryLight: '#F0985E',
  primaryDark: '#B85F2C',
  primaryGhost: 'rgba(226, 121, 61, 0.12)',

  // Accent — workshop teal, used for "available/verified" moments
  accent: '#3DBDA8',
  accentLight: '#5ED4C0',
  accentGhost: 'rgba(61, 189, 168, 0.12)',

  // Semantic (kept in the same warm family as primary)
  success: '#3DBD8C',
  successLight: 'rgba(61, 189, 140, 0.12)',
  warning: '#E2A73D',
  warningLight: 'rgba(226, 167, 61, 0.12)',
  error: '#E2503D',
  errorLight: 'rgba(226, 80, 61, 0.12)',
  info: '#3D8FE2',
  infoLight: 'rgba(61, 143, 226, 0.12)',

  // Neutrals — warm charcoal instead of blue-black
  background: '#14161B',
  surface: '#1B1E24',
  surfaceLight: '#242830',
  surfaceElevated: '#2A2F38',
  card: '#1E2128',
  border: '#2C3038',
  borderLight: '#3A3F49',

  // Text — warm off-white, not stark blue-white
  text: '#F3F1EC',
  textSecondary: '#A8ACB6',
  textMuted: '#6E7280',
  textInverse: '#14161B',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.55)',
  shimmer: '#2A2F38',

  // Status colors
  statusPending: '#E2A73D',
  statusAccepted: '#3D8FE2',
  statusInProgress: '#E2793D',
  statusCompleted: '#3DBD8C',
  statusRejected: '#E2503D',
  statusCancelled: '#8A8D95',
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    hero: 40,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  round: 50,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#E2793D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export type Theme = typeof theme;
export default theme;
