import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Briefcase, CreditCard, LogOut, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { User } from "next-auth";
import { signOut } from "next-auth/react";

const ProfileDropdown = ({ user }: { user: User }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-12 items-center gap-4">
          <span>{user?.name}</span>
          <Avatar className="">
            <AvatarImage className="" src={user?.image!} alt={user?.email!} />
            <AvatarFallback>
              {user?.email
                ?.split(" ")
                .map((n) => n[0]?.toUpperCase() + n[1]?.toUpperCase())}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link prefetch={true} href="/workspaces">
            <DropdownMenuItem>
              <Briefcase className="mr-2 h-4 w-4" />
              Workspaces
            </DropdownMenuItem>
          </Link>
          <Link prefetch={true} href="/profile">
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
          </Link>
          <Link prefetch={true} href="/upgrade">
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              Pricing plans
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
