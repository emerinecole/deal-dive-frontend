import { API } from "@/constants/api";
import { SignupFormInputs } from "@/lib/schemas/signup-schema";
import { unauthenticatedApiClient } from "../api-client";

export async function signup(userData: SignupFormInputs) {
  return unauthenticatedApiClient.post(API.USER.SIGNUP, {
    organization_name: userData.organizationName,
    full_name: userData.fullName,
    email: userData.email,
    password: userData.password,
    industry_name: userData.industry,
  });
}
