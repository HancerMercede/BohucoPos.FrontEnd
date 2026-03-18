import styles from './ProductList.module.css';

export interface Product {
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

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        No hay productos
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {products.map((product) => (
        <div 
          key={product.id} 
          className={`${styles.item} ${!product.isActive ? styles.inactive : ''}`}
        >
          <span className={styles.emoji}>{product.emoji || '🍽️'}</span>
          
          <div className={styles.info}>
            <span className={styles.name}>{product.name}</span>
            <span className={styles.meta}>
              {product.category} · {product.destination} · {product.productType}
            </span>
          </div>
          
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          
          <span className={`${styles.status} ${product.isActive ? styles.active : styles.inactiveStatus}`}>
            {product.isActive ? 'Activo' : 'Inactivo'}
          </span>
          
          <div className={styles.actions}>
            <button onClick={() => onEdit(product)} className={styles.editButton}>
              Editar
            </button>
            <button onClick={() => onDelete(product.id)} className={styles.deleteButton}>
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
