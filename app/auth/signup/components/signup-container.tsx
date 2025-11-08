import Link from "next/link";
import SignupForm from "./signup-form";
import SignupSocialAuth from "./signup-social-auth";

export default function SignupContainer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-700/15 rounded-3xl blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/15 rounded-3xl blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/30 backdrop-blur-sm">
              <span className="text-sm font-semibold text-white">Join Us</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Create Account
            </h1>
            <p className="text-lg text-white/80">
              Start sharing amazing deals with your community
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white backdrop-blur-xl rounded-3xl border border-blue-100 shadow-2xl shadow-blue-100/15 p-8">
            <SignupSocialAuth />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-100" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-blue-700 font-medium">
                  Or continue with email
                </span>
              </div>
            </div>

            <SignupForm />
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white/80">
              Already have an account?{" "}
              <Link
                href="/auth/login?returnTo=/"
                className="font-semibold text-white hover:text-white/70 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-6 text-xs text-center text-white/60">
            By creating an account, you agree to our{" "}
            <Link href="#" className="text-white hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-white hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
