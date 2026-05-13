import { createContext, useContext, useState, useMemo } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const userJson = localStorage.getItem('user')
      if (!userJson || userJson === 'null' || userJson === 'undefined') {
        return null
      }
      return JSON.parse(userJson)
    } catch (err) {
      console.error('Failed to parse user from localStorage:', err)
      localStorage.removeItem('user')
      return null
    }
  })

  const login = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, logout }), [user])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}