import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../../stores/authStore'

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  it('initial state is not authenticated', () => {
    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('login sets token and user', () => {
    const user = { username: 'john', role: 'Waiter', fullName: 'John Doe' }
    
    useAuthStore.getState().login('token123', user)

    expect(useAuthStore.getState().token).toBe('token123')
    expect(useAuthStore.getState().user).toEqual(user)
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
  })

  it('login sets defaultView to waiter for non-admin', () => {
    const user = { username: 'john', role: 'Waiter', fullName: 'John Doe' }
    
    useAuthStore.getState().login('token123', user)

    expect(useAuthStore.getState().defaultView).toBe('waiter')
  })

  it('login sets defaultView to manager for Admin', () => {
    const user = { username: 'admin', role: 'Admin', fullName: 'Admin User' }
    
    useAuthStore.getState().login('token123', user)

    expect(useAuthStore.getState().defaultView).toBe('manager')
  })

  it('logout clears all auth state', () => {
    const user = { username: 'john', role: 'Waiter', fullName: 'John Doe' }
    useAuthStore.getState().login('token123', user)
    
    useAuthStore.getState().logout()

    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('logout preserves defaultView', () => {
    const user = { username: 'admin', role: 'Admin', fullName: 'Admin User' }
    useAuthStore.getState().login('token123', user)
    
    useAuthStore.getState().logout()

    expect(useAuthStore.getState().defaultView).toBe('manager')
  })
})
