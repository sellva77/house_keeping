export const colors = {
  // Primary palette
  primary: '#6C63FF',
  primaryLight: '#8B85FF',
  primaryDark: '#4E47CC',
  primaryGhost: 'rgba(108, 99, 255, 0.1)',

  // Accent
  accent: '#FF6584',
  accentLight: '#FF8FA3',

  // Semantic
  success: '#00C853',
  successLight: 'rgba(0, 200, 83, 0.12)',
  warning: '#FFB300',
  warningLight: 'rgba(255, 179, 0, 0.12)',
  error: '#FF3D57',
  errorLight: 'rgba(255, 61, 87, 0.12)',
  info: '#2196F3',
  infoLight: 'rgba(33, 150, 243, 0.12)',

  // Neutrals (dark mode first)
  background: '#0F0F1A',
  surface: '#1A1A2E',
  surfaceLight: '#252540',
  surfaceElevated: '#2A2A45',
  card: '#1E1E35',
  border: '#2E2E4A',
  borderLight: '#3A3A55',

  // Text
  text: '#F0F0F5',
  textSecondary: '#A0A0B8',
  textMuted: '#6B6B85',
  textInverse: '#0F0F1A',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shimmer: '#2A2A45',

  // Status colors
  statusPending: '#FFB300',
  statusAccepted: '#2196F3',
  statusInProgress: '#6C63FF',
  statusCompleted: '#00C853',
  statusRejected: '#FF3D57',
  statusCancelled: '#9E9E9E',
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
    shadowColor: '#6C63FF',
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
