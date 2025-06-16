import React from "react"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader
} from "@/components/ui/drawer"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog"

import { useIsMobile } from "@/hooks/use-mobile"

interface ResponsiveDialogProps {
    title:string,
    description:string,
    children:React.ReactNode,
    open:Boolean,
    onOpenChange:(open:boolean) => void

}

const ResponsiveDialog = ({
    title,
    description,
    children,
    onOpenChange,
    open=false
}:ResponsiveDialogProps) => {
    const isMobile = useIsMobile();

    if(isMobile){
        return (
            <Drawer open={!!open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader>{title}</DrawerHeader>
                    <DrawerDescription>{description}</DrawerDescription>
                <div className="p-4">
                    {children}
                </div>
                </DrawerContent>
            </Drawer>
        )
    }
  return (
    <Dialog open={!!open} onOpenChange={onOpenChange} >
        <DialogContent>
            <DialogHeader>{title}</DialogHeader>
            <DialogDescription>{description}</DialogDescription>
            <div>
                {children}
            </div>
        </DialogContent>

    </Dialog>

  )
}

export default ResponsiveDialog