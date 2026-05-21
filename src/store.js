import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      // Rotation Settings
      anchorDate: new Date().toISOString().split('T')[0],
      rotationOn: 28,
      rotationOff: 28,
      rotationPreset: '28/28',
      
      // Financial Settings
      normalRate: 0,
      travelRate: 0,
      allowances: 0,
      currency: 'USD',
      mmkMonthlyAmount: 0, // Manual MMK amount for tax calculation when currency is USD
      
      // Theme
      theme: 'dark',

      // User Data
      travelDays: [], // Array of ISO date strings

      // Actions
      setAnchorDate: (date) => set({ anchorDate: date }),
      setRates: (rates) => set((state) => ({ ...state, ...rates })),
      setMmkMonthlyAmount: (amount) => set({ mmkMonthlyAmount: amount }),
      toggleTravelDay: (date) => set((state) => {
        const exists = state.travelDays.includes(date);
        return {
          travelDays: exists 
            ? state.travelDays.filter(d => d !== date)
            : [...state.travelDays, date]
        };
      }),
      setCurrency: (currency) => set({ currency }),
      setRotationPreset: (preset) => {
        const [on, off] = preset.split('/').map(Number);
        set({ rotationPreset: preset, rotationOn: on, rotationOff: off });
      },
      setTheme: (theme) => set({ theme }),
      resetAll: () => set({
        anchorDate: '',
        rotationOn: 28,
        rotationOff: 28,
        rotationPreset: '28/28',
        normalRate: 0,
        travelRate: 0,
        allowances: 0,
        currency: 'USD',
        mmkMonthlyAmount: 0,
        travelDays: [],
        theme: 'dark',
      }),
    }),
    {
      name: 'offshore-rotation-storage',
    }
  )
);
