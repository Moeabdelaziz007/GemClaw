import { StateCreator } from 'zustand';

export interface AuthSlice {
  hydratedUserId: string | null;
  setHydratedUserId: (userId: string | null) => void;
  clearUserScopedState: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  hydratedUserId: null,
  setHydratedUserId: (userId) => set({ hydratedUserId: userId }),
  clearUserScopedState: () => {
    // This is called on logout to reset user-specific data
    // The actual reset of other slices will be handled by the store if needed
    // or by calling set() on the individual slices
    set({ hydratedUserId: null });
  },
});
