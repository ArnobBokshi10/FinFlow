"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { User } from "@/lib/types"
import { toast } from "sonner"
import { prisma } from "@/lib/db"

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  updateProfile: (data: Partial<User>) => void
  loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const updateProfile = async (data: Partial<User>) => {
    if (!user?.id) return

    try {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data
      })

      setUser(updatedUser)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, updateProfile, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}