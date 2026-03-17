import { useState, useEffect } from 'react';
import { useOrderStore } from '../../stores/orderStore';
import { getAuthHeaders } from '../../utils/api';
import styles from './ProductsView.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7089';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  destination: string;
  productType: string;
  stockQuantity?: number;
  emoji?: string;
  isActive: boolean;
}

const CATEGORIES = ['Platos', 'Entradas', 'Bebidas'];
const DESTINATIONS = ['Kitchen', 'Bar'];
const PRODUCT_TYPES = ['Service', 'Physical'];

export function ProductsView() {
  const { showNotification } = useOrderStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: 'Platos',
    destination: 'Kitchen',
    productType: 'Service',
    stockQuantity: 0,
    emoji: '',
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/products`, { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct 
        ? `${API_URL}/api/products/${editingProduct.id}`
        : `${API_URL}/api/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showNotification(
          editingProduct ? 'Producto actualizado' : 'Producto creado',
          'success'
        );
        setIsModalOpen(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      } else {
        showNotification('Error al guardar producto', 'error');
      }
    } catch (error) {
      showNotification('Error al guardar producto', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        showNotification('Producto eliminado', 'success');
        fetchProducts();
      }
    } catch (error) {
      showNotification('Error al eliminar producto', 'error');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      destination: product.destination,
      productType: product.productType,
      stockQuantity: product.stockQuantity || 0,
      emoji: product.emoji || '',
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      category: 'Platos',
      destination: 'Kitchen',
      productType: 'Service',
      stockQuantity: 0,
      emoji: '',
    });
  };

  const openNewModal = () => {
    setEditingProduct(null);
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Gestión de Productos</h2>
        <button onClick={openNewModal} className={styles.addButton}>
          + Nuevo Producto
        </button>
      </div>

      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.emoji}>{product.emoji || '🍽️'}</span>
                <span className={styles.name}>{product.name}</span>
              </div>
              <div className={styles.cardBody}>
                <p>Precio: ${product.price.toFixed(2)}</p>
                <p>Categoría: {product.category}</p>
                <p>Destino: {product.destination}</p>
                <p>Tipo: {product.productType}</p>
                {product.productType === 'Physical' && (
                  <p>Stock: {product.stockQuantity}</p>
                )}
              </div>
              <div className={styles.cardActions}>
                <button onClick={() => handleEdit(product)} className={styles.editButton}>
                  Editar
                </button>
                <button onClick={() => handleDelete(product.id)} className={styles.deleteButton}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>{editingProduct ? 'Editar' : 'Nuevo'} Producto</h3>
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
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelButton}>
                  Cancelar
                </button>
                <button type="submit" className={styles.saveButton}>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
