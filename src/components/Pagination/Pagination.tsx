import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.container}>
      <div className={styles.pageInfo}>
        <span className={styles.pageLabel}>Página</span>
        <p className={styles.pageNumber}>
          {currentPage} de {totalPages}
        </p>
      </div>

      <div className={styles.buttons}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.button}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.button}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
