import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '../../stores/cartStore'
import type { MenuItem } from '../../types'

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart()
  })

  it('addToCart adds new item to empty cart', () => {
    const item: MenuItem = {
      id: 'p1',
      name: 'Hamburguesa',
      price: 15.50,
      category: 'Platos',
      dest: 'Kitchen',
      emoji: '🍔'
    }

    useCartStore.getState().addToCart(item)

    const cart = useCartStore.getState().cart
    expect(cart).toHaveLength(1)
    expect(cart[0].id).toBe('p1')
    expect(cart[0].qty).toBe(1)
  })

  it('addToCart increments qty for existing item', () => {
    const item: MenuItem = {
      id: 'p1',
      name: 'Hamburguesa',
      price: 15.50,
      category: 'Platos',
      dest: 'Kitchen',
      emoji: '🍔'
    }

    useCartStore.getState().addToCart(item)
    useCartStore.getState().addToCart(item)

    const cart = useCartStore.getState().cart
    expect(cart).toHaveLength(1)
    expect(cart[0].qty).toBe(2)
  })

  it('updateCartQty increments quantity', () => {
    const item: MenuItem = {
      id: 'p1',
      name: 'Hamburguesa',
      price: 15.50,
      category: 'Platos',
      dest: 'Kitchen',
      emoji: '🍔'
    }

    useCartStore.getState().addToCart(item)
    useCartStore.getState().updateCartQty('p1', 1)

    expect(useCartStore.getState().cart[0].qty).toBe(2)
  })

  it('updateCartQty decrements quantity', () => {
    const item: MenuItem = {
      id: 'p1',
      name: 'Hamburguesa',
      price: 15.50,
      category: 'Platos',
      dest: 'Kitchen',
      emoji: '🍔'
    }

    useCartStore.getState().addToCart(item)
    useCartStore.getState().addToCart(item)
    useCartStore.getState().updateCartQty('p1', -1)

    expect(useCartStore.getState().cart[0].qty).toBe(1)
  })

  it('updateCartQty removes item when qty becomes 0', () => {
    const item: MenuItem = {
      id: 'p1',
      name: 'Hamburguesa',
      price: 15.50,
      category: 'Platos',
      dest: 'Kitchen',
      emoji: '🍔'
    }

    useCartStore.getState().addToCart(item)
    useCartStore.getState().updateCartQty('p1', -1)

    expect(useCartStore.getState().cart).toHaveLength(0)
  })

  it('removeFromCart removes item from cart', () => {
    const item: MenuItem = {
      id: 'p1',
      name: 'Hamburguesa',
      price: 15.50,
      category: 'Platos',
      dest: 'Kitchen',
      emoji: '🍔'
    }

    useCartStore.getState().addToCart(item)
    useCartStore.getState().removeFromCart('p1')

    expect(useCartStore.getState().cart).toHaveLength(0)
  })

  it('clearCart removes all items', () => {
    const item1: MenuItem = {
      id: 'p1',
      name: 'Hamburguesa',
      price: 15.50,
      category: 'Platos',
      dest: 'Kitchen',
      emoji: '🍔'
    }
    const item2: MenuItem = {
      id: 'p2',
      name: 'Cerveza',
      price: 5.00,
      category: 'Bebidas',
      dest: 'Bar',
      emoji: '🍺'
    }

    useCartStore.getState().addToCart(item1)
    useCartStore.getState().addToCart(item2)
    useCartStore.getState().clearCart()

    expect(useCartStore.getState().cart).toHaveLength(0)
    expect(useCartStore.getState().sent).toBe(false)
  })

  it('updateCartNote updates note for item', () => {
    const item: MenuItem = {
      id: 'p1',
      name: 'Hamburguesa',
      price: 15.50,
      category: 'Platos',
      dest: 'Kitchen',
      emoji: '🍔'
    }

    useCartStore.getState().addToCart(item)
    useCartStore.getState().updateCartNote('p1', 'Sin cebolla')

    expect(useCartStore.getState().cart[0].notes).toBe('Sin cebolla')
  })

  it('setCart replaces entire cart', () => {
    const cartItems = [
      { id: 'p1', name: 'Item 1', price: 10, category: 'Platos' as const, dest: 'Kitchen' as const, emoji: '', qty: 2, notes: '' }
    ]

    useCartStore.getState().setCart(cartItems)

    expect(useCartStore.getState().cart).toHaveLength(1)
    expect(useCartStore.getState().cart[0].id).toBe('p1')
  })

  it('sent flag is initially false', () => {
    expect(useCartStore.getState().sent).toBe(false)
  })

  it('sent flag is set to false on clearCart', () => {
    useCartStore.setState({ sent: true })
    useCartStore.getState().clearCart()

    expect(useCartStore.getState().sent).toBe(false)
  })
})
