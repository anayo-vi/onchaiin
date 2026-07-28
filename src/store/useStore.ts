import { create } from 'zustand';
import { CryptoCurrency } from '@/types';

interface AppState {
  activeCurrency: CryptoCurrency;
  setActiveCurrency: (currency: CryptoCurrency) => void;
  unreadNotifications: number;
  setUnreadNotifications: (count: number) => void;
  decrementNotifications: () => void;
  isQuickActionModalOpen: boolean;
  quickActionType: 'DEPOSIT' | 'WITHDRAW' | 'GIFT_CARD' | null;
  openQuickAction: (type: 'DEPOSIT' | 'WITHDRAW' | 'GIFT_CARD') => void;
  closeQuickAction: () => void;
  userBalanceFilter: string;
  setUserBalanceFilter: (filter: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeCurrency: 'USDT',
  setActiveCurrency: (currency) => set({ activeCurrency: currency }),
  unreadNotifications: 2,
  setUnreadNotifications: (count) => set({ unreadNotifications: count }),
  decrementNotifications: () =>
    set((state) => ({ unreadNotifications: Math.max(0, state.unreadNotifications - 1) })),
  isQuickActionModalOpen: false,
  quickActionType: null,
  openQuickAction: (type) => set({ isQuickActionModalOpen: true, quickActionType: type }),
  closeQuickAction: () => set({ isQuickActionModalOpen: false, quickActionType: null }),
  userBalanceFilter: 'ALL',
  setUserBalanceFilter: (filter) => set({ userBalanceFilter: filter }),
}));
