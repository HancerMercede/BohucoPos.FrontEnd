export const ERROR_MESSAGES = {
  fetchProducts: 'Error al cargar productos',
  submitOrder: 'Error al enviar orden',
  fetchOrders: 'Error al cargar órdenes',
  updateStatus: 'Error al actualizar estado',
  fetchTabs: 'Error al cargar cuentas',
  fetchTabDetails: 'Error al cargar detalles de cuenta',
  requestBill: 'Error al solicitar cuenta',
  closeTab: 'Error al cerrar cuenta',
  cancelTab: 'Error al cancelar cuenta',
  cancelItem: 'Error al cancelar ítem',
  login: 'Error al iniciar sesión',
  register: 'Error al registrar usuario',
  loadProducts: 'Error al cargar productos',
  saveProduct: 'Error al guardar producto',
  deleteProduct: 'Error al eliminar producto',
  fetchSales: 'Error al cargar ventas',
  fetchLowInventory: 'Error al cargar inventario',
  generic: 'Ha ocurrido un error. Por favor intenta de nuevo.',
} as const;

export type ErrorKey = keyof typeof ERROR_MESSAGES;

export const getErrorMessage = (key: ErrorKey): string => ERROR_MESSAGES[key];
