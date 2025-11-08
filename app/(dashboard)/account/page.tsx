'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/app/providers/supabase-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

// Account page handles supabase clients for logging out and updating passwords
export default function AccountPage() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [newPassword, setNewPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setEmail(user?.email ?? null)
      setLoading(false)
    }

    getUser()

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null)
    })

    return () => subscription.subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage(null)

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setPasswordMessage(error.message)
    } else {
      setPasswordMessage('Password updated successfully!')
      setNewPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6">
      <div className="relative z-0 max-w-2xl mx-auto space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-blue-900">Account</h1>
          <p className="text-blue-700">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-blue-200 rounded-3xl shadow-2xl shadow-blue-100 p-6 space-y-4">
          {loading ? (
            <p className="text-sm text-blue-700">Loading...</p>
          ) : email ? (
            <>
              {/* Go to My Deals button */}
              <Button
                onClick={() => router.push('/my-deals')}
                className="mt-3 w-fit bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg shadow-blue-300/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Go to My Deals
              </Button>

              {/* Change Password Form */}
              <form onSubmit={handleChangePassword} className="mt-6 flex flex-col space-y-2 max-w-sm">
                <label htmlFor="password" className="text-sm font-medium text-blue-900">
                  Change Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="text-blue-900 placeholder:text-blue-400"
                />
                <Button
                  type="submit"
                  className="w-fit bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg shadow-blue-300/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Update Password
                </Button>

                {passwordMessage && (
                  <p
                    className={`text-sm ${
                      passwordMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {passwordMessage}
                  </p>
                )}
              </form>

              {/* Signed in as + Email + Logout at bottom */}
              <div className="mt-6 border-t border-blue-200 pt-4 space-y-2">
                <p className="font-medium text-blue-900">Signed in as:</p>
                <p className="text-sm text-blue-600">{email}</p>

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="mt-3 w-fit bg-white/80 text-blue-900 border-blue-200 hover:bg-white/90"
                >
                  Log out
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-blue-700">Not signed in</p>
          )}
        </div>
      </div>
    </div>
  )
}
