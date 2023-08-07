import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface IModalState {
  modalType: string | null;
  modalProps?: any;
  openModal: (type: string, props?: any) => void;
  closeModal: () => void;
}

const modalStore: StateCreator<IModalState> = (set) => ({
  modalType: null,
  modalProps: null,
  openModal: (type, props = null) =>
    set(() => ({ modalType: type, modalProps: props })),
  closeModal: () => set(() => ({ modalType: null })),
});

export const useModalStore = create<IModalState>()(devtools(modalStore));
