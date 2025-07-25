import React from 'react'
import { AgentGetOne } from '../../types'
import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { agentInsertSchema } from '../../schemas';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import GeneratedAvatar from '@/components/generated-avatar';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { toast } from 'sonner';


interface AgentFormProps {
    onSuccess?:()=> void;
    onCancel?:()=> void;
    initialValues?:AgentGetOne;
}

const AgentForm = (
  {
    onSuccess,
    onCancel,
    initialValues
  }:AgentFormProps
) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess : async()=>{
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        )
        if(initialValues?.id){
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({id:initialValues.id})
          )
        }
        onSuccess?.();
      },
      onError: (error)=>{
        toast.error(error.message)

        // TODO : Check if error code is "FORBIDDEN", redirect to /upgrade
      }
    })
  )
    const updateAgent = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess : async()=>{
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        )
        

        //TODO:Free Tier
        onSuccess?.();
      },
      onError: (error)=>{
        toast.error(error.message)

        // TODO : Check if error code is "FORBIDDEN", redirect to /upgrade
      }
    })
  )
  const form = useForm<z.infer<typeof agentInsertSchema>>({
    resolver:zodResolver(agentInsertSchema),
    defaultValues:{
      name:initialValues?.name ?? "",
      instructions:initialValues?.instructions ?? ""
    
    }
  })

  const isEdit = !!initialValues?.id;
  const isPending = createAgent.isPending || updateAgent.isPending;
  const onSubmit = (values:z.infer<typeof agentInsertSchema>)=>{
    if(isEdit){
      updateAgent.mutate({
        ...values,
        id: initialValues.id
      });
    }else{
      createAgent.mutate(values);
    }
  }
  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)} >
        <GeneratedAvatar
          seed={form.watch("name")}
          variant='botttsNeutral'
          className='border size-24'
        />
        <FormField
          name='name'
          control={form.control}
          render={({field})=>(
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder='e.g. Math tutor'/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        ></FormField>
        <FormField
          name='instructions'
          control={form.control}
          render={({field})=>(
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Input {...field} placeholder='You are a helpful assistant that can answer questions and help with assigments'/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        ></FormField>
        <div className='flex gap-4'>
          {
            onCancel && (
              <Button
                variant={"ghost"}
                disabled={isPending}
                type='button'
                onClick={()=>onCancel()}
              >Cancel</Button>
          )}
          <Button disabled={isPending} type='submit'>
            {isEdit ? "Update":"Create"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AgentForm