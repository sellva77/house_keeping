// ===== User & Auth =====

export type UserRole = 'HOMEOWNER' | 'PROVIDER';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  avatar: string | null;
  address: string | null;
  bio: string | null;
  createdAt: string;
  providerProfile?: ProviderProfile | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
}

// ===== Service Category =====

export interface ServiceCategory {
  id: number;
  name: string;
  icon: string;
  description: string | null;
}

// ===== Provider =====

export interface ProviderProfile {
  id: number;
  userId: number;
  skills: string | null;
  experience: number;
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  serviceArea: string | null;
  isAvailable: boolean;
  user: Pick<User, 'id' | 'name' | 'email' | 'phone' | 'avatar' | 'bio'>;
  categories: ServiceCategory[];
}

// ===== Booking =====

export type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

export interface Booking {
  id: number;
  homeownerId: number;
  providerId: number;
  serviceCategoryId: number;
  date: string;
  timeSlot: string;
  address: string;
  notes: string | null;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  homeowner: Pick<User, 'id' | 'name' | 'avatar' | 'phone'>;
  provider: Pick<User, 'id' | 'name' | 'avatar' | 'phone'>;
  serviceCategory: ServiceCategory;
  review?: Review | null;
}

export interface CreateBookingPayload {
  providerId: number;
  serviceCategoryId: number;
  date: string;
  timeSlot: string;
  address: string;
  notes?: string;
}

// ===== Review =====

export interface Review {
  id: number;
  bookingId: number;
  authorId: number;
  providerId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  author: Pick<User, 'id' | 'name' | 'avatar'>;
}

export interface CreateReviewPayload {
  bookingId: number;
  rating: number;
  comment?: string;
}

// ===== Navigation =====

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type HomeownerStackParamList = {
  HomeownerTabs: undefined;
  ServiceList: { category: ServiceCategory };
  ProviderDetail: { providerId: number; providerName: string };
  BookingForm: {
    providerId: number;
    providerName: string;
    categoryId: number;
    categoryName: string;
    hourlyRate: number;
  };
};

export type ProviderStackParamList = {
  ProviderTabs: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  HomeownerMain: undefined;
  ProviderMain: undefined;
};
