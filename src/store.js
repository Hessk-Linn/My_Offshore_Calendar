import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const DEFAULT_STATE = {
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
  lastUpdated: 0,
};

// Helper to push state changes directly to Firestore
// Because we enabled offline persistence in firebase.js,
// Firestore will cache writes locally if offline, and sync to cloud automatically when online!
const saveToFirestore = async (uid, state) => {
  if (!uid) return;
  try {
    const userDocRef = doc(db, 'users', uid);
    const dataToSave = {
      anchorDate: state.anchorDate,
      rotationOn: state.rotationOn,
      rotationOff: state.rotationOff,
      rotationPreset: state.rotationPreset,
      normalRate: state.normalRate,
      travelRate: state.travelRate,
      allowances: state.allowances,
      currency: state.currency,
      mmkMonthlyAmount: state.mmkMonthlyAmount,
      travelDays: state.travelDays,
      theme: state.theme,
      lastUpdated: state.lastUpdated,
    };
    await setDoc(userDocRef, dataToSave, { merge: true });
  } catch (error) {
    console.error('Firestore save failed (will retry when online):', error);
  }
};

export const useStore = create(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,
      
      // User Auth State
      user: null, // { uid: string, email: string }

      // Actions
      setUser: (user) => set({ user }),

      setAnchorDate: (date) => {
        const timestamp = Date.now();
        set({ anchorDate: date, lastUpdated: timestamp });
        const { user } = get();
        if (user) saveToFirestore(user.uid, get());
      },

      setRates: (rates) => {
        const timestamp = Date.now();
        set((state) => ({ ...state, ...rates, lastUpdated: timestamp }));
        const { user } = get();
        if (user) saveToFirestore(user.uid, get());
      },

      setMmkMonthlyAmount: (amount) => {
        const timestamp = Date.now();
        set({ mmkMonthlyAmount: amount, lastUpdated: timestamp });
        const { user } = get();
        if (user) saveToFirestore(user.uid, get());
      },

      toggleTravelDay: (date) => {
        const timestamp = Date.now();
        set((state) => {
          const exists = state.travelDays.includes(date);
          const updatedTravelDays = exists 
            ? state.travelDays.filter(d => d !== date)
            : [...state.travelDays, date];
          return {
            travelDays: updatedTravelDays,
            lastUpdated: timestamp
          };
        });
        const { user } = get();
        if (user) saveToFirestore(user.uid, get());
      },

      setCurrency: (currency) => {
        const timestamp = Date.now();
        set({ currency, lastUpdated: timestamp });
        const { user } = get();
        if (user) saveToFirestore(user.uid, get());
      },

      setRotationPreset: (preset) => {
        const [on, off] = preset.split('/').map(Number);
        const timestamp = Date.now();
        set({ rotationPreset: preset, rotationOn: on, rotationOff: off, lastUpdated: timestamp });
        const { user } = get();
        if (user) saveToFirestore(user.uid, get());
      },

      setTheme: (theme) => {
        const timestamp = Date.now();
        set({ theme, lastUpdated: timestamp });
        const { user } = get();
        if (user) saveToFirestore(user.uid, get());
      },

      resetAll: () => {
        const timestamp = Date.now();
        set({
          ...DEFAULT_STATE,
          lastUpdated: timestamp,
        });
        const { user } = get();
        if (user) saveToFirestore(user.uid, get());
      },

      // Bi-directional cloud sync on initial login or reconnect
      syncWithFirestore: async (uid) => {
        if (!uid) return;
        try {
          const userDocRef = doc(db, 'users', uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            const cloudData = docSnap.data();
            const localState = get();

            // Last-Write-Wins Conflict Resolution:
            if ((cloudData.lastUpdated || 0) > localState.lastUpdated) {
              set({
                anchorDate: cloudData.anchorDate || '',
                rotationOn: cloudData.rotationOn ?? 28,
                rotationOff: cloudData.rotationOff ?? 28,
                rotationPreset: cloudData.rotationPreset || '28/28',
                normalRate: cloudData.normalRate ?? 0,
                travelRate: cloudData.travelRate ?? 0,
                allowances: cloudData.allowances ?? 0,
                currency: cloudData.currency || 'USD',
                mmkMonthlyAmount: cloudData.mmkMonthlyAmount ?? 0,
                travelDays: cloudData.travelDays || [],
                theme: cloudData.theme || 'dark',
                lastUpdated: cloudData.lastUpdated || 0,
              });
              console.log('🔄 Synced from Cloud (Cloud is newer)');
            } else if (localState.lastUpdated > (cloudData.lastUpdated || 0)) {
              await saveToFirestore(uid, localState);
              console.log('🔄 Synced to Cloud (Local is newer)');
            } else {
              console.log('🔄 Cloud and Local are already synchronized');
            }
          } else {
            // First time login - upload current local state to create their cloud profile
            console.log('📤 Cloud profile empty. Uploading local state...');
            await saveToFirestore(uid, get());
          }
        } catch (error) {
          console.error('Failed to sync with Firestore:', error);
        }
      },
    }),
    {
      name: 'offshore-rotation-storage',
      // Don't persist the firebase 'user' object across sessions directly from store, 
      // let Firebase Auth listener handle it natively to ensure token validity.
      partialize: (state) => {
        const { user, ...rest } = state;
        return rest;
      }
    }
  )
);
