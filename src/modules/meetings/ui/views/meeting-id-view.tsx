'use client'
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import MeetingIdViewHeader from "../components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useConfirm from "@/hooks/use-confirm";
import { useState } from "react";
import UpdateMeetingDialog from "../components/update-meeting-dialog";
import UpcommingState from "../components/upcomming-state";
import ActiveState from "../components/active-state";
import CancelState from "../components/cancel-state";
import ProcessingState from "../components/processing-state";

interface Props {
    meetingId:string
}

const MeetingIdView = ({ meetingId }: Props) => {
    const router = useRouter()
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const {data} = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({id: meetingId}),
    );

    const [RemoveConfirmation, ConfirmRemove] = useConfirm(
        "Are you sure you want to delete this meeting?",
        "The following action will remove this meeting"
    );

    const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: () => {
                // Handle successful deletion (e.g., show a toast, redirect, etc.)
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                // TODO Invalidate Free Tier Usage
                router.push('/meetings')
            },
            onError: (error) => {
                // Handle error (e.g., show an error message)
                toast.error("Failed to delete meeting");
            }
        })
    )

    const handleRemove = async ()=>{
        const ok = await ConfirmRemove();
        if(!ok) return;
        await removeMeeting.mutateAsync({ id:meetingId });
    }

    const isActive = data.status === 'active';
    const isUpcoming = data.status === 'upcoming';
    const isCancelled = data.status === 'cancelled';
    const isCompleted = data.status === 'completed';
    const isProcessing = data.status === 'processing';


    return (
        <>
            <RemoveConfirmation/>
            <UpdateMeetingDialog
                open={updateMeetingDialogOpen}
                onOpenChange={setUpdateMeetingDialogOpen}
                initialValues={data}
            />
            <div className="flex-1 py-4 px-4 md:px-8 fleex flex-col gap-y-4">
                <MeetingIdViewHeader
                meetingId={meetingId}
                meetingName={data?.name}
                onEdit={() => setUpdateMeetingDialogOpen(true)}
                onRemove={handleRemove}
                />
                {isCancelled && <CancelState/>}
                {isCompleted && <div>Completed State</div>}
                {isProcessing && <ProcessingState/>}
                {isActive && <ActiveState
                    meetingId={meetingId}
                />}
                {isUpcoming && <UpcommingState
                    meetingId={meetingId}
                    isCancelling={false}
                    onCancelMeeting={()=>{}}
                />}
            </div>
        </>
    )
}



export const MeetingIdViewLoading= ()=>{
  return(
    <LoadingState title='Loading Meeting' description='This may take a few seconds... '/>
  )
}

export const MeetingIdViewError = ()=>{
  return (
        <ErrorState
        title='Error Loading Meeting'
        description='Please Try again Later'
        />
  )
}


export default MeetingIdView;