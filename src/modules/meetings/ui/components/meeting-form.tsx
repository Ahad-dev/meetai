import React, { useState } from 'react'
import { MeetingGetOne} from '../../types'
import { useTRPC } from '@/trpc/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { meetingInsertSchema } from '../../schemas';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import GeneratedAvatar from '@/components/generated-avatar';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { toast } from 'sonner';
import { CommandSelect } from './command-select';
import NewAgentDialog from '@/modules/agents/ui/components/new-agent-dialog';


interface MeetingFormProps {
    onSuccess?:(id?:string)=> void;
    onCancel?:()=> void;
    initialValues?:MeetingGetOne;
}

const MeetingForm = (
  {
    onSuccess,
    onCancel,
    initialValues
  }:MeetingFormProps
) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [agentSearch,setAgentSearch] = useState("");
  const [openNewAgentDialog,setOpenNewAgentDialog] = useState(false);

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search:agentSearch
    }),
  )

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess : async(data)=>{
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        )
        if(initialValues?.id){
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({id:initialValues.id})
          )
        }
        onSuccess?.(data.id);
      },
      onError: (error)=>{
        toast.error(error.message)

        // TODO : Check if error code is "FORBIDDEN", redirect to /upgrade
      }
    })
  )
    const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess : async(data)=>{
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );
        
        if(initialValues?.id){
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({id:initialValues.id})
          )
        }
        //TODO:Free Tier
        onSuccess?.();
      },
      onError: (error)=>{
        toast.error(error.message)

        // TODO : Check if error code is "FORBIDDEN", redirect to /upgrade
      }
    })
  )
  const form = useForm<z.infer<typeof meetingInsertSchema>>({
    resolver:zodResolver(meetingInsertSchema),
    defaultValues:{
      name:initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    }
  })

  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;
  const onSubmit = (values:z.infer<typeof meetingInsertSchema>)=>{
    if(isEdit){
      updateMeeting.mutate({
        ...values,
        id: initialValues?.id ?? "",
      });
    }else{
      createMeeting.mutate(values);
    }
  }
  return (
    <>
    <NewAgentDialog
      open={openNewAgentDialog}
      onOpenChange={setOpenNewAgentDialog}
    />
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)} >
        <FormField
          name='name'
          control={form.control}
          render={({field})=>(
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder='e.g. Math Consulator'/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        ></FormField>
        <FormField
          name='agentId'
          control={form.control}
          render={({field})=>(
            <FormItem>
              <FormLabel>Agents</FormLabel>
              <FormControl>
                <CommandSelect
                  options={(agents.data?.items??[]).map(agent=>(
                    {
                      id: agent.id,
                      value: agent.id,
                      children: (
                        <div className='flex items-center gap-2'>
                          <GeneratedAvatar
                            seed={agent.name}
                            variant='botttsNeutral'
                            className="border size-6"
                          />
                          <span>{agent.name}</span>
                        </div>
                      )
                    }
                  ))}
                  onSelect={field.onChange}
                  onSearch={setAgentSearch}
                  placeholder='Select an Agent'
                  value={field.value}
                />
              </FormControl>
              <FormDescription>
                Not found what you&apos; re looking for?{" "}
                <Button
                  variant='link'
                  className='p-0 text-primary hover:underline'
                  onClick={()=>setOpenNewAgentDialog(true)}
                >Create a new Agent</Button>
              </FormDescription>
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
    </>

  )
}

export default MeetingForm