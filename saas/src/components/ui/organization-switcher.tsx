import { useState } from "react";
import { useOrganization } from "@/src/hooks/use-organization";
import { Check, ChevronsUpDown, PlusCircle, Settings } from "lucide-react";
import { cn } from "@/src/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { Input } from "./input";
import { Label } from "./label";
import { useRouter } from "next/navigation";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface OrganizationSwitcherProps extends PopoverTriggerProps {
  className?: string;
  hidePersonal?: boolean;
}

export function OrganizationSwitcher({
  className,
  hidePersonal = false,
  ...props
}: OrganizationSwitcherProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showNewOrganizationDialog, setShowNewOrganizationDialog] = useState(false);
  const [newOrganizationName, setNewOrganizationName] = useState("");
  const [newOrganizationSlug, setNewOrganizationSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  const { 
    organizations, 
    currentOrganization, 
    isLoading, 
    setCurrentOrganizationId,
    refetchOrganizations
  } = useOrganization();

  const createOrganization = async () => {
    if (!newOrganizationName || !newOrganizationSlug) return;
    
    try {
      setIsCreating(true);
      
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newOrganizationName,
          slug: newOrganizationSlug,
        }),
      });
      
      if (response.ok) {
        setNewOrganizationName("");
        setNewOrganizationSlug("");
        setShowNewOrganizationDialog(false);
        await refetchOrganizations();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to create organization");
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      alert("Failed to create organization");
    } finally {
      setIsCreating(false);
    }
  };

  const onOrganizationSelect = async (organizationId: string) => {
    setOpen(false);
    await setCurrentOrganizationId(organizationId);
  };

  return (
    <Dialog open={showNewOrganizationDialog} onOpenChange={setShowNewOrganizationDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild {...props}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select organization"
            className={cn("w-full justify-between", className)}
          >
            {isLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : currentOrganization ? (
              <>
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarImage
                    src={currentOrganization.logo || ""}
                    alt={currentOrganization.name}
                  />
                  <AvatarFallback>
                    {currentOrganization.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {currentOrganization.name}
              </>
            ) : (
              "Select organization"
            )}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search organization..." />
              <CommandEmpty>No organization found.</CommandEmpty>
              {organizations?.organizations && organizations.organizations.length > 0 && (
                <CommandGroup heading="Organizations">
                  {organizations.organizations.map((orgUser) => (
                    <CommandItem
                      key={orgUser.organization.id}
                      onSelect={() => onOrganizationSelect(orgUser.organization.id)}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={orgUser.organization.logo || ""}
                          alt={orgUser.organization.name}
                        />
                        <AvatarFallback>
                          {orgUser.organization.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {orgUser.organization.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          currentOrganization?.id === orgUser.organization.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewOrganizationDialog(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Organization
                  </CommandItem>
                </DialogTrigger>
                {currentOrganization && (
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      router.push(`/org/${currentOrganization.slug}/settings`);
                    }}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
          <DialogDescription>
            Add a new organization to manage products and users.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization name</Label>
              <Input
                id="name"
                placeholder="Acme Inc."
                value={newOrganizationName}
                onChange={(e) => setNewOrganizationName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug
              </Label>
              <Input
                id="slug"
                placeholder="acme"
                value={newOrganizationSlug}
                onChange={(e) => setNewOrganizationSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              />
              <p className="text-xs text-muted-foreground">
                This will be used in the URL: untitledui.com/org/<span className="font-semibold">{newOrganizationSlug || "acme"}</span>
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowNewOrganizationDialog(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={createOrganization}
            disabled={isCreating || !newOrganizationName || !newOrganizationSlug}
          >
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 