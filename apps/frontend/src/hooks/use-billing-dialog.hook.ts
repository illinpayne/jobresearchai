import { create } from 'zustand';

interface BillingDialogStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useBillingDialog = create<BillingDialogStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
