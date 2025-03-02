"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useOrganization } from "@/src/hooks/use-organization";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Building, 
  CreditCard, 
  BarChart, 
  FileText, 
  Home 
} from "lucide-react";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { currentOrganization } = useOrganization();

  const isOrgPath = pathname.startsWith("/org/");
  const orgSlug = currentOrganization?.slug;
  const isAdmin = currentOrganization?.userRole === "admin" || currentOrganization?.userRole === "owner";

  // Base navigation items
  const navigationItems = [
    {
      title: "Home",
      href: "/",
      icon: Home,
      variant: "ghost",
    },
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      variant: "ghost",
    },
  ];

  // Organization-specific navigation items
  const orgNavigationItems = orgSlug
    ? [
        {
          title: "Organization",
          href: `/org/${orgSlug}`,
          icon: Building,
          variant: "ghost",
        },
        {
          title: "Members",
          href: `/org/${orgSlug}/members`,
          icon: Users,
          variant: "ghost",
          adminOnly: false,
        },
        {
          title: "Analytics",
          href: `/org/${orgSlug}/analytics`,
          icon: BarChart,
          variant: "ghost",
          adminOnly: false,
        },
        {
          title: "Documents",
          href: `/org/${orgSlug}/documents`,
          icon: FileText,
          variant: "ghost",
          adminOnly: false,
        },
        {
          title: "Billing",
          href: `/org/${orgSlug}/billing`,
          icon: CreditCard,
          variant: "ghost",
          adminOnly: true,
        },
        {
          title: "Settings",
          href: `/org/${orgSlug}/settings`,
          icon: Settings,
          variant: "ghost",
          adminOnly: true,
        },
      ]
    : [];

  // Filter out admin-only items if user is not an admin
  const filteredOrgItems = orgNavigationItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  // Combine navigation items based on current path
  const items = isOrgPath && orgSlug ? filteredOrgItems : navigationItems;

  return (
    <nav className={cn("grid items-start gap-2", className)}>
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
            pathname === item.href
              ? "bg-muted text-primary"
              : "text-muted-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
      
      {/* Show link to dashboard or organization based on current path */}
      {isOrgPath && orgSlug ? (
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary text-muted-foreground mt-4"
        >
          <LayoutDashboard className="h-4 w-4" />
          All Organizations
        </Link>
      ) : orgSlug && (
        <Link
          href={`/org/${orgSlug}`}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary text-muted-foreground mt-4"
        >
          <Building className="h-4 w-4" />
          {currentOrganization.name}
        </Link>
      )}
    </nav>
  );
} 