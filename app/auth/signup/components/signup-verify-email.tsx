import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { MailCheck } from "lucide-react";

export function SignupVerifyEmail({ email }: { email: string }) {
  return (
    <div className="my-4">
      <Alert>
        <MailCheck className="h-4 w-4" />
        <AlertTitle>Check your email</AlertTitle>
        <AlertDescription>
          We sent a verification link to{" "}
          <span className="font-medium">{email}</span>. <br />
          Click the link to verify your account and continue.
        </AlertDescription>
      </Alert>
    </div>
  );
}
