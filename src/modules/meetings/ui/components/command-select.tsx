import { ReactNode,useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandResponsiveDialog } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CommandList } from "cmdk";

interface CommandSelectProps {
    options: Array<{
        id:string;
        value:string;
        children: ReactNode;
    }>
    onSelect: (value: string) => void;
    onSearch?: (value: string) => void;
    value: string;
    placeholder?: string;
    isSearchable?: boolean;
    className?: string;
}

export const CommandSelect = ({
    options,
    onSelect,
    onSearch,
    value,
    placeholder = "Select an option",
    isSearchable = true,
    className = ""
}: CommandSelectProps) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option)=>option.value === value);

  const handleOpenChange = (open:boolean)=>{
    onSearch?.("");
    setOpen(open)
  }


  return (
    <>
        <Button
            onClick={() => setOpen(true)}
            type="button"
            variant={"outline"}
            className={cn(
                "h-9 justify-between font-normal px-2",
                !selectedOption && "text-muted-foreground",
                className,
            )}
        >
            <div>
                {selectedOption?.children ?? placeholder}
            </div>
            <ChevronsUpDown/>
        </Button>
        <CommandResponsiveDialog
            shouldFilter = {!onSearch}
            open={open}
            onOpenChange={handleOpenChange}
        >
            <CommandInput
                placeholder="Search..."
                onValueChange={onSearch}
            />
            <CommandList>
                <CommandEmpty>
                    <span className="text-muted-foreground text-sm">
                        No Option Selected
                    </span>
                </CommandEmpty>
                {options.map((option) => (
                    <CommandItem
                        key={option.id}
                        value={option.value}
                        onSelect={() => {
                            onSelect(option.value);
                            setOpen(false);
                        }}
                        className={cn(
                            "cursor-pointer",
                            value === option.value && "bg-accent text-accent-foreground"
                        )}
                    >
                        {option.children}
                    </CommandItem>
                ))}
            </CommandList>
        </CommandResponsiveDialog>
    </>
);
}