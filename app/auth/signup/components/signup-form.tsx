"use client";

import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { getIndustries } from "@/lib/services/industry-service";
import { signup } from "@/lib/services/auth-service";
import { useState } from "react";
import { SignupVerifyEmail } from "./signup-verify-email";
import {
  signupFormSchema,
  SignupFormInputs,
} from "@/lib/schemas/signup-schema";
import { Industry } from "@/lib/types/industry";

export default function SignupForm() {
  const [signedUpEmail, setSignedUpEmail] = useState("");

  const {
    isPending: industryPending,
    error: industryError,
    data: industries,
  } = useQuery<Industry[]>({
    queryKey: ["industries"],
    queryFn: getIndustries,
  });
  const form = useForm<SignupFormInputs>({
    resolver: zodResolver(signupFormSchema),
    mode: "onTouched",
    defaultValues: {
      organizationName: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      industry: "",
    },
  });

  const {
    mutate: signupMutation,
    isPending: isSigningUp,
    error: signupError,
  } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      setSignedUpEmail(form.getValues("email"));
      form.reset();
    },
  });

  return (
    <Form {...form}>
      {signedUpEmail && <SignupVerifyEmail email={signedUpEmail} />}
      <form onSubmit={form.handleSubmit((data) => signupMutation(data))}>
        <div className="flex flex-col gap-4">
          {(industryError || signupError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {signupError?.message
                  ? signupError.message
                  : "Something went wrong please try again later."}
              </AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="organizationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organisation name</FormLabel>
                <FormControl>
                  <Input placeholder="Your company Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@doe.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="············"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="············"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={industryPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      {industryPending ? (
                        <SelectValue placeholder="Loading..." />
                      ) : (
                        <SelectValue placeholder="Select your industry" />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industries?.map(({ id, name }) => (
                      <SelectItem key={id} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={!!industryError || industryPending || isSigningUp}
          loading={isSigningUp}
          className="w-full mt-6"
        >
          Create account
        </Button>
      </form>
    </Form>
  );
}
