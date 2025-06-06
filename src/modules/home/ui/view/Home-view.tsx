"use client"
import {Button} from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"; //import the auth client
import { useRouter } from "next/navigation";
 


const HomeView = () => {

  const { data: session,isPending} = authClient.useSession() 
  const router = useRouter()


  if(isPending){
    return <p>loading...</p>
  }

  if(!session){
    return (
      <div className="flex flex-col gap-4 mt-5 mx-4">
        <p>You are not logged in</p>
      </div>
    )
  }


  if(session){
    return (
      <div className="flex flex-col gap-4 mt-5 mx-4">
        <p>You logged in as {session.user.name}</p>
        <Button onClick={()=>authClient.signOut({
          fetchOptions:{onSuccess:()=>router.push("/sign-in")},
        })}>
          Sign Out
        </Button>
      </div>
    )
  }
}

export default HomeView