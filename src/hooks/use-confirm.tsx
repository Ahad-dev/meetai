import ResponsiveDialog from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { JSX, useState } from "react"


const useConfirm = (title,description):[
    ()=>JSX.Element,()=>Promise<unknown>] => {
        const [promise,setPromise] = useState<{resolve:(value:boolean)=>void;} | null>(null);
        
        const handleClose = ()=>{
            setPromise(null);
        }
        const confirm = ()=>{
            return new Promise((resolve)=>{
                setPromise({resolve})
            })
        }
        const handleConfirm = ()=>{
            promise?.resolve(true);
            handleClose();
        };
        const handleCancel = ()=>{
            promise?.resolve(false);
            handleClose();
        };
        const ConfirmationDialog = ()=>(
            <ResponsiveDialog
                open={promise !== null}
                onOpenChange={handleClose}
                title = {title}
                description = {description}
            >
                <div className="pt-4 w-full flex flex-col-reverse gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
                    <Button variant={"outline"} className="w-full lg:w-auto" onClick={handleCancel}>Cancel</Button>
                    <Button className="w-full lg:w-auto" onClick={handleConfirm}>Confirm</Button>
                </div>
            </ResponsiveDialog>
        )
        return [ConfirmationDialog,confirm];

}

export default useConfirm