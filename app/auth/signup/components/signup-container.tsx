import Link from "next/link";
import SignupForm from "./signup-form";
import SignupSocialAuth from "./signup-social-auth";

export default function SignupContainer() {
  return (
    <div className="flex-1 flex p-6 flex-col items-center justify-center h-full">
      <div className="w-full max-w-[400px]">
        <h3 className="text-xl font-medium text-center mb-6">
          Create your account
        </h3>
        <SignupForm />

        <div className="mt-6">
          <SignupSocialAuth />
        </div>
        <div className="mt-6 text-sm text-center">
          Already have an account?{" "}
          <Link href="/auth/login?returnTo=/" className="link">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
