import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, VirtualIdentity } from '@/types';
export { useNotificationStore, useUnreadCount, useNotifications, useNotificationStats } from './notification';
export {
  useBrokerProtectionStore,
  useProtections,
  useSelectedProtection,
  useProtectionStats,
} from './broker-protection';
export {
  useMatchingStore,
  useMatches,
  useSelectedMatch,
  useMatchStats,
  usePendingMatches,
} from './matching';
export {
  useBenefitStore,
  useBenefits,
  useSelectedBenefit,
  useBenefitStats,
} from './benefit';
export {
  useProjectsStore,
  useProjects,
  useSelectedProject,
} from './projects';

// ==================== 认证状态 ====================
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (auth: AuthState['user'], accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateProfile: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: !!user }),
      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ==================== 虚拟身份状态 ====================
interface IdentityState {
  currentIdentity: VirtualIdentity | null;
  identities: VirtualIdentity[];
  setCurrentIdentity: (identity: VirtualIdentity) => void;
  addIdentity: (identity: VirtualIdentity) => void;
  removeIdentity: (identityId: string) => void;
}

export const useIdentityStore = create<IdentityState>()(
  persist(
    (set) => ({
      currentIdentity: null,
      identities: [],
      setCurrentIdentity: (identity) => set({ currentIdentity: identity }),
      addIdentity: (identity) =>
        set((state) => ({
          identities: [...state.identities, identity],
        })),
      removeIdentity: (identityId) =>
        set((state) => ({
          identities: state.identities.filter((id) => id.id !== identityId),
          currentIdentity:
            state.currentIdentity?.id === identityId ? null : state.currentIdentity,
        })),
    }),
    {
      name: 'identity-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ==================== 加载状态 ====================
interface LoadingState {
  isLoading: boolean;
  loadingText: string;
  setLoading: (loading: boolean, text?: string) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  loadingText: '',
  setLoading: (isLoading, loadingText = '') => set({ isLoading, loadingText }),
}));

// ==================== WebSocket 状态 ====================
interface WebSocketState {
  connected: boolean;
  reconnectAttempts: number;
  setConnected: (connected: boolean) => void;
  incrementReconnectAttempts: () => void;
  resetReconnectAttempts: () => void;
}

export const useWebSocketStore = create<WebSocketState>((set) => ({
  connected: false,
  reconnectAttempts: 0,
  setConnected: (connected) => set({ connected }),
  incrementReconnectAttempts: () =>
    set((state) => ({ reconnectAttempts: state.reconnectAttempts + 1 })),
  resetReconnectAttempts: () => set({ reconnectAttempts: 0 }),
}));
