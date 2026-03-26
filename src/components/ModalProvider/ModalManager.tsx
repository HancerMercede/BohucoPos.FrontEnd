import { useModalStore } from './modalStore';
import { Portal } from './Portal';
import { NoteModal } from '../NoteModal/NoteModal';
import { ConfirmModal } from '../../views/ProductsView/ConfirmModal/ConfirmModal';

export function ModalManager() {
  const { modal, closeModal } = useModalStore();

  if (!modal) return null;

  return (
    <Portal>
      {modal.variant === 'note' && (
        <NoteModal 
          itemId={modal.data.itemId}
          initialNote={modal.data.initialNote}
          onSave={modal.data.onSave}
          onClose={closeModal}
        />
      )}
      
      {modal.variant === 'confirm' && (
        <ConfirmModal 
          title={modal.data.title}
          message={modal.data.message}
          onConfirm={() => { modal.data.onConfirm(); closeModal(); }}
          onCancel={() => { modal.data.onCancel(); closeModal(); }}
        />
      )}
      
      {modal.variant === 'product' && (
        <div className="product-modal-todo">
          {/* TODO: Add ProductModal */}
          <button onClick={closeModal}>Cerrar</button>
        </div>
      )}
    </Portal>
  );
}
