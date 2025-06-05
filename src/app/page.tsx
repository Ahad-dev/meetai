"use client"
import {Button} from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"; //import the auth client
 


const page = () => {
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
   
  const { data: session,isPending} = authClient.useSession() 


  const onSubmit = ()=>{
    authClient.signUp.email({
      email,
      password,
      name,
      
    },{
      onError:()=>{
        window.alert("Something Went Wronge")
      },
      onSuccess:()=>{
        window.alert("Successfully User Created")
      }
    })
  }
  const onLogin = ()=>{
    authClient.signIn.email({
      email,
      password,
    },{
      onError:()=>{
        window.alert("Something Went Wronge")
      },
      onSuccess:()=>{
        window.alert("Successfully User Logged In")
      }
    })
  }

  if(isPending){
    return <p>loading...</p>
  }


  if(session){
    return (
      <div className="flex flex-col gap-4 mt-5 mx-4">
        <p>You logged in as {session.user.name}</p>
        <Button onClick={()=>authClient.signOut()}>
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <>
    <div className="flex flex-col gap-4 mt-5 mx-4">
      <Input
        placeholder="name"
        type="text"
        value={name}
        onChange={({target})=>setName(target.value)}
      ></Input>
      <Input
        placeholder="email"
        type="email"
        value={email}
        onChange={({target})=>setEmail(target.value)}
      ></Input>
      <Input
        placeholder="password"
        type="password"
        value={password}
        onChange={({target})=>setPassword(target.value)}
      ></Input>
      <Button onClick={onSubmit}>Create User</Button>
    </div>
    <div className="flex flex-col gap-4 mt-5 mx-4">
      <Input
        placeholder="email"
        type="email"
        value={email}
        onChange={({target})=>setEmail(target.value)}
      ></Input>
      <Input
        placeholder="password"
        type="password"
        value={password}
        onChange={({target})=>setPassword(target.value)}
      ></Input>
      <Button onClick={onLogin}>Login User</Button>
    </div>
    </>

  )
}

export default page