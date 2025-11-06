'use client'

import { useSupabase } from '@/app/providers/supabase-provider'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const { supabase } = useSupabase()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-2 cursor-pointer hover:text-red-600 transition-colors px-2 py-1.5 text-sm"
    >
      <LogOut className="h-4 w-4" />
      <span>Log out</span>
    </button>
  )
}