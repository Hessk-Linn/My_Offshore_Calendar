import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      // Rotation Settings
      anchorDate: new Date().toISOString().split('T')[0],
      rotationOn: 28,
      rotationOff: 28,
      
      // Financial Settings
      normalRate: 0,
      travelRate: 0,
      allowances: 0,
      currency: 'USD',
      
      // User Data
      travelDays: [], // Array of ISO date strings

      // Actions
      setAnchorDate: (date) => set({ anchorDate: date }),
      setRates: (rates) => set((state) => ({ ...state, ...rates })),
      toggleTravelDay: (date) => set((state) => {
        const exists = state.travelDays.includes(date);
        return {
          travelDays: exists 
            ? state.travelDays.filter(d => d !== date)
            : [...state.travelDays, date]
        };
      }),
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'offshore-rotation-storage',
    }
  )
);
