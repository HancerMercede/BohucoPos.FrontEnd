import { useState, useEffect, useMemo } from 'react';
import { useNotificationStore } from '../../stores/notificationStore';
import { getAuthHeaders } from '../../utils/api';
import { ERROR_MESSAGES } from '../../constants/messages';
import { ProductSearch } from './ProductSearch';
import { ProductList, type Product } from './ProductList';
import { ProductModal, type ProductFormData } from './ProductModal';
import { ConfirmModal } from './ConfirmModal';
import { Pagination } from '../../components/Pagination';
import styles from './ProductsView.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7089';
const ITEMS_PER_PAGE = 5;

export function ProductsView() {
  const showNotification = useNotificationStore((s) => s.showNotification);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; productId: number | null }>({
    isOpen: false,
    productId: null,
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
      showNotification(ERROR_MESSAGES.loadProducts, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.destination.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleSave = async (formData: ProductFormData) => {
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
        fetchProducts();
      } else {
        showNotification('Error al guardar producto', 'error');
      }
    } catch (error) {
      showNotification('Error al guardar producto', 'error');
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirm({ isOpen: true, productId: id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.productId) return;
    try {
      const response = await fetch(`${API_URL}/api/products/${deleteConfirm.productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        showNotification('Producto eliminado', 'success');
        fetchProducts();
      }
    } catch (error) {
      showNotification('Error al eliminar producto', 'error');
    } finally {
      setDeleteConfirm({ isOpen: false, productId: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, productId: null });
  };

  const openNewModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Gestión de Productos</h2>
        <button onClick={openNewModal} className={styles.addButton}>
          + Nuevo Producto
        </button>
      </div>

      <ProductSearch value={searchTerm} onChange={setSearchTerm} />

      {isLoading ? (
        <p className={styles.loading}>Cargando...</p>
      ) : (
      <>
        <ProductList 
          products={paginatedProducts} 
          onEdit={(product) => {
            setEditingProduct(product);
            setIsModalOpen(true);
          }}
          onDelete={handleDeleteClick}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </>
      )}

      <ProductModal
        product={editingProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
      />

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Eliminar Producto"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
