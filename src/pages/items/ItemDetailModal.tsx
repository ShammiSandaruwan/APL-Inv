// src/pages/items/ItemDetailModal.tsx
import React from 'react';
import Modal from '../../components/Modal';
import type { Item } from '../../types';

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ isOpen, onClose, item }) => {
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item.name}>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-scorpion">Item Code</h4>
          <p className="text-mine-shaft">{item.item_code}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-scorpion">Location</h4>
          <p className="text-mine-shaft">{item.buildings?.estates?.name} / {item.buildings?.name}</p>
        </div>
        {/* All other fields will be added here */}
      </div>
    </Modal>
  );
};

export default ItemDetailModal;
