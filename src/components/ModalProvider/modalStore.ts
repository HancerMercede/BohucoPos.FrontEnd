import { create } from 'zustand';

type ModalVariant = 
  | { variant: 'note'; data: { itemId: string; initialNote: string; onSave: (itemId: string, note: string) => void } }
  | { variant: 'confirm'; data: { title: string; message: string; onConfirm: () => void; onCancel: () => void } }
  | { variant: 'product'; data: { product: any; onSave: (data: any) => void } }
  | null;

interface ModalStore {
  modal: ModalVariant;
  openModal: (modal: ModalVariant) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modal: null,
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
}));

export const modals = {
  openNote: (itemId: string, initialNote: string, onSave: (itemId: string, note: string) => void) => 
    useModalStore.getState().openModal({ variant: 'note', data: { itemId, initialNote, onSave } }),
  
  openConfirm: (title: string, message: string, onConfirm: () => void, onCancel: () => void) => 
    useModalStore.getState().openModal({ variant: 'confirm', data: { title, message, onConfirm, onCancel } }),
  
  openProduct: (product: any, onSave: (data: any) => void) => 
    useModalStore.getState().openModal({ variant: 'product', data: { product, onSave } }),
  
  close: () => useModalStore.getState().closeModal(),
};
