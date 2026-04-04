import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
  id: string
  email: string
  name?: string
  city?: string
  business?: string
  referralSource?: string
  onboardingComplete: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (data: Partial<User>) => void
  completeOnboarding: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, _password: string) => {
    const existingUser = localStorage.getItem(`user_${email}`)
    if (existingUser) {
      const userData = JSON.parse(existingUser)
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      if (userData.onboardingComplete) {
        navigate('/dashboard')
      } else {
        navigate('/onboarding')
      }
    } else {
      throw new Error('User not found. Please sign up first.')
    }
  }

  const signup = async (email: string, _password: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      email,
      onboardingComplete: false,
    }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    localStorage.setItem(`user_${email}`, JSON.stringify(newUser))
    navigate('/onboarding')
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    navigate('/login')
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      localStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser))
    }
  }

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, onboardingComplete: true }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      localStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser))
      navigate('/dashboard')
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signup, logout, updateUser, completeOnboarding }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
