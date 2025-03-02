"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Palette,
  Database,
  Link as LinkIcon,
  Clock,
  Bell,
  Users,
  Shield,
  KeyRound,
  CreditCard,
  Download,
  Upload,
  MoreVertical,
  LogOut,
  Settings,
  HelpCircle,
  User,
  Info,
} from "lucide-react";
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuBadge,
} from "@/src/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { OrganizationSwitcher } from "@/src/components/ui/organization-switcher";
import { useOrganization } from "@/src/hooks/use-organization";

const GeneralLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Organizations",
    href: "/org",
    icon: Users,
  },
  {
    title: "Pricing",
    href: "/pricing",
    icon: CreditCard,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];

const CompanyLinks = [
  {
    title: "Support",
    href: "/support",
    icon: HelpCircle,
  },
  {
    title: "About",
    href: "/about",
    icon: Info,
  },
];

const AppSidebar = () => {
  const { data: session } = useSession();
  const { currentOrganization } = useOrganization();

  return (
    <SidebarProvider>
      <Sidebar className="border-r bg-background flex flex-col justify-between">
        <div>
          <SidebarHeader className="px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-foreground flex items-center justify-center">
                <span className="text-sm font-semibold text-background">UI</span>
              </div>
              <span className="font-semibold">Untitled UI</span>
              <span className="text-xs text-muted-foreground ml-auto">v1.0</span>
            </div>
          </SidebarHeader>

          <div className="px-4 py-2">
            <OrganizationSwitcher />
          </div>

          <SidebarContent className="px-2">
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 mb-2">GENERAL</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {GeneralLinks.map((link, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={link.href}
                          className="flex items-center gap-3 w-full"
                        >
                          <link.icon className="h-4 w-4" />
                          <span>{link.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <div className="flex items-center justify-between px-2 mb-2">
                <SidebarGroupLabel>Company</SidebarGroupLabel>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {CompanyLinks.map((link, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={link.href}
                          className="flex items-center gap-3 w-full"
                        >
                          <link.icon className="h-4 w-4" />
                          <span>{link.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </div>

        <div className="border-t mt-auto p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-purple-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 10V3L4 14H11V21L20 10H13Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-medium">Daily AI Limit</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            Number of AI-generated words in the last 24 hours
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">0/400</span>
            <Button variant="outline" size="sm">
              Upgrade to Pro
            </Button>
          </div>
        </div>

        {session?.user && (
          <div className=" border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 px-2 h-auto">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image!} alt={session.user.name!} />
                    <AvatarFallback>
                      {session.user.name?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{session?.user?.name}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" side="right">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </Sidebar>
    </SidebarProvider>
  );
};

export default AppSidebar;
