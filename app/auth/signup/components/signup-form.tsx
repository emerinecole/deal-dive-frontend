'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signup } from "@/lib/services/auth-service";
import { APP_ROUTES } from "@/constants/app-routes";
import { Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push(APP_ROUTES.HOME);
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-blue-50/60 border border-blue-300 rounded-2xl p-6 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-blue-900">
                Account Created! 🎉
              </h3>
              <p className="text-sm text-blue-700/80">
                Check your email to verify your account. Redirecting...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50/60 border border-red-300 rounded-2xl p-6 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-red-600">Oops!</h3>
              <p className="text-sm text-blue-700/80">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="fullName" className="flex items-center gap-2 text-sm font-semibold text-blue-900">
            <User className="h-4 w-4 text-blue-600" />
            Full Name <span className="text-red-600">*</span>
          </label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="h-12 text-base rounded-xl border border-blue-200 focus-visible:ring-blue-300 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-blue-900">
            <Mail className="h-4 w-4 text-blue-600" />
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
            className="h-12 text-base rounded-xl border border-blue-200 focus-visible:ring-blue-300 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-blue-900">
            <Lock className="h-4 w-4 text-blue-600" />
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
            className="h-12 text-base rounded-xl border border-blue-200 focus-visible:ring-blue-300 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-semibold text-blue-900">
            <Lock className="h-4 w-4 text-blue-600" />
            Confirm Password <span className="text-red-600">*</span>
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••••••"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="h-12 text-base rounded-xl border border-blue-200 focus-visible:ring-blue-300 transition-all"
          />
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
              Creating Account...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4 text-white" />
              Create Account
              <ArrowRight className="ml-2 h-4 w-4 text-white" />
            </>
          )}
        </Button>
      </form>
    </>
  );
}
