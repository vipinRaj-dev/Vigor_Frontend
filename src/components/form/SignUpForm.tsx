"use client";

import { baseUrl } from "@/Details/PortDetails";
import axios from "axios";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";


import { useState } from "react";
import { useRouter } from "next/navigation";



const FormSchema = z
.object({
  name: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must have than 8 characters"),
  confirmPassword: z
  .string()
  .min(1, "Confirm password is required")
  .min(8, "Password must have than 8 characters"),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
    path: ["confirmPassword"],
  });
  






  const SignUpForm = () => {
    
    const router = useRouter();
    
    const [error , setError] = useState<string | null>(null);
    
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    });
    

    const onSubmit  = async (data: z.infer<typeof FormSchema>) => {    
      try {
        const response = await axios.post(`${baseUrl}/auth/registration`, data);
        if (response.status === 201) {
          console.log('User created');
          setError(null);
          router.push('/sign-in');
        }
      } catch (error:Error | any) {
        if (error.response && error.response.status === 409) {
          setError('User already exists');
        } else {
          console.error(error);
        }
      }
    };
    return (
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2">
      {error && <p className="text-red-500 text-center text-2xl">{error}</p>}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="John Jacob" {...field} />
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
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" {...field} />
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
                  placeholder="Enter password"
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
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter Confirm password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full mt-7" type="submit">
          Sign Up
        </Button>
        <p className="text-center mt-4">
          Don't have an account?
          <Link className="hover:underline" href="/sign-in">
            Sign in
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignUpForm;