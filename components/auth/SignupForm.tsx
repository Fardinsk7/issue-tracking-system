"use client";

import React, { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Requests from "@/lib/request";

import Alert from "@/components/components/Alert";

const formSchema = z.object({
  phone_number: z.number(),
});

interface Error {
  name: string;
  phone: string | number;
  email: string;
  organization: string;
}

interface SignupFormData {
  name: string;
  phone: string | number;
  email: string;
  organization: string;
}

export default function SignUpForm({
  setIsLoading,
  isLoading,
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    organization: "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone_number: 0,
    },
  });

  const router = useRouter();

  const [reqError, setReqError] = useState("");

  const [errors, setErrors] = useState<Error>();

  async function onSubmit(formData: SignupFormData) {
    try {
      setIsLoading(true);
      setReqError("");

      const request = new Requests();
      const response = await request.post("/api/signup", formData);

      if (response.status === "failed" || response.status === "error") {
        throw new Error(response.message);
      }

      router.push("/home")
    } catch (err) {
      setReqError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignup(): Promise<any> {
    try {
      const errors = validateForm(formData);

      if (!Object.values(errors).some((val) => typeof val === "string")) {
        onSubmit(formData);
      } else {
        setErrors(errors);
      }
    } catch {}
  }

  function validateForm(form: SignupFormData) {
    let newErrors: Error = {
      email: null,
      name: null,
      phone: null,
      organization: null,
    };

    if (!form.name) newErrors.name = "Name is required";
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (!form.organization)
      newErrors.organization = "Organization name is required";

    return newErrors;
  }

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <>
      <div
        className={`mt-0 flex-col sm:w-[400px] ${
          isLoading ? "hidden" : "flex"
        }`}
      >
        <div className="flex flex-col text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-accent ">
            Create Account
          </h1>
          <p className="text-md font-medium text-muted-foreground">
            create your account to get started.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSignup)}
            className="space-y-3 mt-8"
          >
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <div className="flex flex-col gap-y-4">
                  <FormItem>
                    <FormLabel className="text-md">Full Name</FormLabel>
                    <FormControl>
                      <div className="flex flex-col">
                        <input
                          placeholder="Enter Name"
                          type="text"
                          className="focus:border-accent bg-transparent outline-none w-[100%] border-b-[2px] border-black py-2 block text-md"
                          onChange={(e) => handleChange("name", e.target.value)}
                        />
                        {errors?.name && (
                          <p className="mt-1 text-red-500 text-xs italic">
                            {errors.name}
                          </p>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormLabel className="text-md">Phone Number</FormLabel>
                    <FormControl>
                      <div className="flex flex-col">
                        <input
                          placeholder="Enter Phone Number"
                          type="text"
                          className="focus:border-accent bg-transparent outline-none w-[100%] border-b-[2px] border-black py-2 block text-md"
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                        />
                        {errors?.phone && (
                          <p className="mt-1 text-red-500 text-xs italic">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormLabel className="text-md">Organization Name</FormLabel>
                    <FormControl>
                      <div className="flex flex-col">
                        <input
                          placeholder="Enter Organization Name"
                          type="text"
                          className="focus:border-accent bg-transparent outline-none w-[100%] border-b-[2px] border-black py-2 block text-md"
                          onChange={(e) =>
                            handleChange("organization", e.target.value)
                          }
                        />
                        {errors?.organization && (
                          <p className="mt-1 text-red-500 text-xs italic">
                            {errors.organization}
                          </p>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                </div>
              )}
            />
            <Button
              type="submit"
              className="mt-2 w-[100%] py-2 block bg-accent"
            >
              Sign up
            </Button>
          </form>
        </Form>

        <p className="mt-3 px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>

        {reqError && <Alert title={reqError} isVisible={true} />}
      </div>
    </>
  );
}
