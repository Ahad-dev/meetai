"use client"
import {Button} from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"; //import the auth client
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
 


const HomeView = () => {
  

  const trpc = useTRPC();
  const {data} = useQuery(trpc.hello.queryOptions({text:"Ahad"}));

    return (
      <div className="flex flex-col gap-4 mt-5 mx-4">
        <h1 className="text-2xl font-bold">Home View</h1>
        <p className="text-lg">Welcome to the home view!</p>
        <p className="text-lg">Greeting: {data?.greeting}</p>
      </div>
    )
  }

export default HomeView