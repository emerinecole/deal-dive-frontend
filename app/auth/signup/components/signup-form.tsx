"use client";

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
      // Redirect to home page after successful signup
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
        <div className="mb-6 bg-gradient-to-r from-secondary/20 to-secondary/10 border-2 border-secondary/30 rounded-2xl p-6 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-secondary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-secondary">
                Account Created! 🎉
              </h3>
              <p className="text-sm text-muted-foreground">
                Check your email to verify your account. Redirecting...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-destructive/10 border-2 border-destructive/30 rounded-2xl p-6 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-destructive">Oops!</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="fullName" className="flex items-center gap-2 text-sm font-semibold">
            <User className="h-4 w-4 text-primary" />
            Full Name <span className="text-destructive">*</span>
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
            className="h-12 text-base rounded-xl border-border/50 focus-visible:ring-primary/20 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold">
            <Mail className="h-4 w-4 text-primary" />
            Email <span className="text-destructive">*</span>
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
            className="h-12 text-base rounded-xl border-border/50 focus-visible:ring-primary/20 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold">
            <Lock className="h-4 w-4 text-primary" />
            Password <span className="text-destructive">*</span>
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
            className="h-12 text-base rounded-xl border-border/50 focus-visible:ring-primary/20 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-semibold">
            <Lock className="h-4 w-4 text-primary" />
            Confirm Password <span className="text-destructive">*</span>
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
            className="h-12 text-base rounded-xl border-border/50 focus-visible:ring-primary/20 transition-all"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full h-12 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-6",
            "bg-gradient-to-r from-primary via-primary to-secondary hover:from-primary/90 hover:to-secondary/90",
            "shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              Creating Account...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </>
  );
}