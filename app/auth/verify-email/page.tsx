import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { APP_ROUTES } from "@/constants/app-routes";
import { MailCheck } from "lucide-react";

export default function VerifyEmail() {
  return (
    <div className="flex justify-center px-4">
      <div className="max-w-md w-full bg-white pt-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-fit p-3 bg-primary/10 rounded-full">
            <MailCheck className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">
            Please verify your email
          </h3>
        </div>

        <p className="text-gray-600 text-center text-sm leading-relaxed">
          We sent a verification link to your email address.
          <br /> Click the link to verify your account and continue.
        </p>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-xs flex flex-col gap-4">
            <Separator />

            <a href={APP_ROUTES.AUTH.LOGIN} className="w-full">
              <Button variant="outline" className="w-full">
                Already verified? Sign in
              </Button>
            </a>

            <a href={APP_ROUTES.AUTH.LOGOUT} className="w-full">
              <Button variant="ghost" className="w-full text-gray-600">
                Switch accounts
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
