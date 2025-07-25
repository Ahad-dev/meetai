"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Loader, Loader2, OctagonAlertIcon } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa6";

const formSchema = z.object({
  email:z.string().email(),
  password:z.string().min(1,{message:"Password is Required"}),
  name:z.string().min(1,{message:"Name is Required"}),
  confirmPassword:z.string().min(1,{message:"Confirm Password is Required"})
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });



const SignUpView = () => {

  const router = useRouter();
  const [error,setError] = useState<string|null>(null)
  const [pending,setPending] = useState<Boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      email:"",
      password:"",
      name:"",
      confirmPassword:""
    },
  })

  const onSubmit = async(data: z.infer<typeof formSchema>)=>{
    setError(null)
    setPending(true);

    await authClient.signUp.email({
      email:data.email,
      password:data.password,
      name:data.name
    },
    {
      onSuccess:()=>{
        router.push("/");
      },
      onError:({error})=>{
        setPending(false);
        setError(error.message)
      }
    }
  )}

  
  const onSocial = async (provider:"google"|"github") => {
    setError(null);
    setPending(true);

    await authClient.signIn.social({
      provider,
      callbackURL:"/"
    },
      {
        onSuccess: () => {
          setPending(false);
        },
        onError: ({ error }) => {
          setPending(false);
          setError(error.message);
        },
      }
    );
  };


  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">
                    Welcome
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    Create your account
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({field})=>(
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="John Doe"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({field})=>(
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({field})=>(
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({field})=>(
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </div>
                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="h-4 w-4 !text-destructive"/>
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full "
                  disabled = {!!pending}
                >
                  {!pending? "Sign In": <Loader2 className="h-4 w-4 animate-spin" size={10}/>}
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:item-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button onClick={()=>onSocial("google")} variant={"outline"} type="button" className="w-full">
                    <FaGoogle/>
                  </Button>
                  <Button
                    onClick={() => onSocial("github")}
                    variant={"outline"}
                    type="button"
                    className="w-full"
                  >
                    <FaGithub/>
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link className="underline underline-offset-4 font-semibold" href={"/sign-in"}>Sign In</Link>
                </div>
              </div>
            </form>
          </Form>

          <div className="bg-radial relative hidden from-green-700 to-green-900 md:flex flex-col gap-y-4 items-center justify-center">
            <img src="/logo.svg" alt="logo" className="h-[92px] w-[92px]" />
            <p className="text-2xl font-semibold text-white text-center">
              Meet.AI
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to out <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
      </div>
    </div>
  );
};

export default SignUpView;
