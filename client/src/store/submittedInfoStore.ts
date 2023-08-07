import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface ISubmittedInfoState {
  submittedInfo: any[] | null;
  listenToSubmittedInfo: (payload: any) => void;
}

const submittedInfoStore: StateCreator<ISubmittedInfoState> = (set) => ({
  submittedInfo: null,
  listenToSubmittedInfo: (payload) => set(() => ({ submittedInfo: payload })),
});

export const useSubmittedInfoStore = create<ISubmittedInfoState>()(
  devtools(submittedInfoStore)
);
