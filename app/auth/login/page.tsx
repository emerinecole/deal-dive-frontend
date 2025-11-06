'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/services/auth-service";
import { APP_ROUTES } from "@/constants/app-routes";
import SignupSocialAuth from "../signup/components/signup-social-auth";
import { Sparkles, Mail, Lock, ArrowRight, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signIn(formData.email, formData.password);
      router.push(APP_ROUTES.HOME);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-blue-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
      </div>

      {/* Logos */}
      <div className="absolute top-8 left-8 flex items-center gap-4">
        <Image
          src="/images/deal-dive/iconLogo.png"
          alt="Icon Logo"
          width={56}
          height={56}
          className="drop-shadow-md"
        />
        <Image
          src="/images/deal-dive/nameLogo.png"
          alt="Name Logo"
          width={200} // Larger name logo
          height={48}
          className="drop-shadow-md"
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 mt-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-blue-200/20 border border-primary/30 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-blue-900" />
              <span className="text-sm font-semibold text-blue-900">Welcome Back</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-blue-900">
              Sign In
            </h1>
            <p className="text-lg text-blue-700/80">
              Continue your deal hunting journey
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-100/60 border-2 border-red-300 rounded-2xl p-6 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-200/50 flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-red-700">Oops!</h3>
                  <p className="text-sm text-blue-900">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-blue-200 shadow-2xl shadow-blue-200/10 p-8">
            <SignupSocialAuth />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-200/40" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-blue-700/80">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                  <Mail className="h-4 w-4 text-blue-500" />
                  Email <span className="text-red-600">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="h-12 text-base rounded-xl border-blue-200 focus-visible:ring-blue-200/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                  <Lock className="h-4 w-4 text-blue-500" />
                  Password <span className="text-red-600">*</span>
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="h-12 text-base rounded-xl border-blue-200 focus-visible:ring-blue-200/50 transition-all"
                />
              </div>

              <div className="text-right">
                <Link
                  href="#"
                  className="text-sm font-medium text-blue-900 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full h-12 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-6",
                  "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-700",
                  "shadow-lg shadow-blue-200/30 disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-blue-200/30 border-t-blue-900 rounded-full animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-blue-900">
              Don&apos;t have an account?{" "}
              <Link
                href={APP_ROUTES.AUTH.SIGNUP}
                className="font-semibold text-blue-700 hover:text-blue-500 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
