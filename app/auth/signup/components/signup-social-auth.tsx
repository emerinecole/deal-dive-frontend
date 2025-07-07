import { Button } from "@/components/ui/button";
import { getUrl } from "@/lib/services/url-service";
import Image from "next/image";

export default function SignupSocialAuth() {
  const location = getUrl();
  const redirectUri = `${location}/auth/login`;
  const getSocialAuthUrl = (provider: string) => {
    return `https://${process.env.NEXT_PUBLIC_SIGNUP_SOCIAL_DOMAIN}/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_SIGNUP_SOCIAL_AUTH_APP_CLIENT_ID}&connection=${provider}&redirect_uri=${redirectUri}`;
  };
  const googleAuthUrl = getSocialAuthUrl("google-oauth2");
  const microsoftAuthUrl = getSocialAuthUrl("windowslive");

  return (
    <div className="flex flex-col gap-3">
      <a href={googleAuthUrl}>
        <Button
          variant="outline"
          className="w-full flex items-center justify-start"
        >
          <Image
            src="/images/auth-providers/google.png"
            width={20}
            height={20}
            alt="Google logo"
          />

          <span className="flex-1 text-center">Continue with Google</span>
          <div className="w-5"></div>
        </Button>
      </a>
      <a href={microsoftAuthUrl}>
        <Button variant="outline" className="w-full">
          <Image
            src="/images/auth-providers/microsoft.png"
            width={20}
            height={20}
            alt="Microsoft logo"
          />
          <span className="flex-1 text-center">Continue with Microsoft</span>
          <div className="w-5"></div>
        </Button>
      </a>
    </div>
  );
}
