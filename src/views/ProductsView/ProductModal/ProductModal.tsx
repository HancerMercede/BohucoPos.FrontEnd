import { useState, useEffect } from 'react';
import styles from './ProductModal.module.css';
import type { Product } from '../ProductList/ProductList';

const CATEGORIES = ['Platos', 'Entradas', 'Bebidas'];
const DESTINATIONS = ['Kitchen', 'Bar'];
const PRODUCT_TYPES = ['Service', 'Physical'];

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => void;
}

export interface ProductFormData {
  name: string;
  price: number;
  category: string;
  destination: string;
  productType: string;
  stockQuantity: number;
  emoji: string;
  isActive: boolean;
}

const initialFormData: ProductFormData = {
  name: '',
  price: 0,
  category: 'Platos',
  destination: 'Kitchen',
  productType: 'Service',
  stockQuantity: 0,
  emoji: '',
  isActive: true,
};

export function ProductModal({ product, isOpen, onClose, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        destination: product.destination,
        productType: product.productType,
        stockQuantity: product.stockQuantity || 0,
        emoji: product.emoji || '',
        isActive: product.isActive ?? true,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <h3>{product ? 'Editar' : 'Nuevo'} Producto</h3>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <input
            type="number"
            placeholder="Precio"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            required
            step="0.01"
          />
          
          <input
            type="text"
            placeholder="Emoji"
            value={formData.emoji}
            onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
          />
          
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          >
            {DESTINATIONS.map((dest) => (
              <option key={dest} value={dest}>{dest}</option>
            ))}
          </select>
          
          <select
            value={formData.productType}
            onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
          >
            {PRODUCT_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          {formData.productType === 'Physical' && (
            <input
              type="number"
              placeholder="Stock"
              value={formData.stockQuantity}
              onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })}
            />
          )}
          
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            Activo
          </label>
          
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton}>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
