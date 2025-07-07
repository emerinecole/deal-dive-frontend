import { OAuth2Error } from "@auth0/nextjs-auth0/errors";
import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";
import { getUrl } from "@/lib/services/url-service";

if (!process.env.NEXT_PUBLIC_AUTH0_AUDIENCE) {
  throw new Error("NEXT_PUBLIC_AUTH0_AUDIENCE is not set");
}

const appBaseUrl = getUrl();

export const auth0 = new Auth0Client({
  appBaseUrl,
  authorizationParameters: {
    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
  },
  async onCallback(error) {
    // redirect the user to a custom error page
    if (error?.cause instanceof OAuth2Error) {
      if (error.cause.message.includes("verify your email")) {
        return NextResponse.redirect(new URL(`/auth/verify-email`, appBaseUrl));
      }
    }

    // Otherwise, redirect to the home page
    return NextResponse.redirect(new URL("/", appBaseUrl));
  },
});
