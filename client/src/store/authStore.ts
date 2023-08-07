import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

export interface ICurrentUser {
  email: string;
  uid: string;
  displayName: string;
}

interface IAuthState {
  authenticated: boolean;
  currentUser: ICurrentUser | null;
  signIn: (user: any) => void;
  signOut: () => void;
}

const authStore: StateCreator<IAuthState> = (set) => ({
  authenticated: false,
  currentUser: null,
  signIn: (user) => {
    set(() => ({
      authenticated: true,
      currentUser: {
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
      },
    }));
  },
  signOut: () => set(() => ({ authenticated: false, currentUser: null })),
});

export const useAuthStore = create<IAuthState>()(devtools(authStore));
