import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

function loadStoredAuth() {
  const storedUser = localStorage.getItem('user')
  const storedToken = localStorage.getItem('token')
  if (storedUser && storedToken) {
    try {
      return { user: JSON.parse(storedUser), token: storedToken }
    } catch (err) {
      console.error('Failed to parse user from localStorage:', err)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }
  return { user: null, token: null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadStoredAuth().user)
  const [token, setToken] = useState(() => loadStoredAuth().token)
  const [loading, setLoading] = useState(false)

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', authToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const isAuthenticated = () => {
    return user !== null && token !== null
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      logout, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
