'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/app/providers/supabase-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

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
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Account</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="bg-muted p-4 rounded-md space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : email ? (
          <>
            <p className="font-medium">Signed in as:</p>
            <p className="text-sm text-muted-foreground">{email}</p>

            <Button onClick={handleLogout} variant="outline" className="mt-3 w-fit">
              Log out
            </Button>

            {/* Change Password Form */}
            <form onSubmit={handleChangePassword} className="mt-6 flex flex-col space-y-2 max-w-sm">
              <label htmlFor="password" className="text-sm font-medium">
                Change Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-fit">
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
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Not signed in</p>
        )}
      </div>
    </div>
  )
}
