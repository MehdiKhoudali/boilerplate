"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useOrganization } from "@/src/hooks/use-organization";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Button } from "@/src/components/ui/button";
import { 
  Users, 
  Settings, 
  Home,
  AlertCircle,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { OrganizationSwitcher } from "@/src/components/ui/organization-switcher";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { organizations, currentOrganization, isLoading, refetchOrganizations } = useOrganization();
  const [isVerifying, setIsVerifying] = useState(true);
  const [organizationData, setOrganizationData] = useState<any>(null);
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renderCount, setRenderCount] = useState(0);

  // Debug logging - track component renders
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    console.log(`OrganizationLayout render #${renderCount + 1}`);
  }, []);

  useEffect(() => {
    const verifyAccess = async () => {
      if (isLoading) return;
      
      try {
        setIsVerifying(true);
        console.log("Verifying access to organization:", params?.slug);
        
        if (!params?.slug) {
          setError("No organization slug provided");
          router.push("/dashboard");
          return;
        }
        
        // Check if the user has access to this organization
        const response = await fetch(`/api/organizations/slug/${params.slug}`);
        
        if (!response.ok) {
          console.error("No access to organization or not found:", params.slug);
          setError(`No access to organization or not found: ${params.slug}`);
          // Redirect to dashboard if organization not found or no access
          router.push("/dashboard");
          return;
        }
        
        const data = await response.json();
        console.log("Organization data fetched:", data);
        setOrganizationData(data);
        setError(null);
      } catch (error) {
        console.error("Error verifying organization access:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
        router.push("/dashboard");
      } finally {
        setIsVerifying(false);
        setVerificationAttempted(true);
      }
    };
    
    if (!isLoading && !verificationAttempted) {
      verifyAccess();
    }
    
    // Add a timeout to ensure verification state doesn't get stuck
    const timeout = setTimeout(() => {
      if (isVerifying && !verificationAttempted) {
        console.log("Verification timeout reached, forcing verification state to false");
        setIsVerifying(false);
        setVerificationAttempted(true);
        setError("Verification timed out. Please try again.");
      }
    }, 10000); // 10 seconds timeout
    
    return () => clearTimeout(timeout);
  }, [params?.slug, router, isLoading, verificationAttempted]);

  // Add console log to track rendering
  console.log("Organization layout rendering for slug:", params?.slug, {
    isLoading,
    isVerifying,
    verificationAttempted,
    currentOrganization,
    organizationData,
    error,
    renderCount: renderCount + 1
  });

  // Create navigation items for the top navigation - removed documents, billing, analytics
  const navItems = [
    {
      title: "Overview",
      href: `/org/${params?.slug}`,
      icon: <Home className="h-4 w-4" />,
      isActive: pathname === `/org/${params?.slug}`
    },
    {
      title: "Members",
      href: `/org/${params?.slug}/members`,
      icon: <Users className="h-4 w-4" />,
      isActive: pathname === `/org/${params?.slug}/members`
    },
    {
      title: "Settings",
      href: `/org/${params?.slug}/settings`,
      icon: <Settings className="h-4 w-4" />,
      isActive: pathname === `/org/${params?.slug}/settings`
    }
  ];

  // Show loading state
  if (isLoading || isVerifying) {
    return (
      <div className="flex flex-col h-screen">
        <div className="border-b bg-background p-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-40" />
              <div className="flex space-x-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-24" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="container mx-auto space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="max-w-md p-8 text-center border border-red-200 rounded-lg bg-red-50">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Access Error</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <Button 
            onClick={() => router.push("/dashboard")}
            className="bg-primary hover:bg-primary/90"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Always render the layout with children to fix the blank page issue
  return (
    <div className="flex flex-col h-screen">
      {/* Top navigation bar */}
      <div className="border-b bg-background">
        <div className="container mx-auto py-3">
          <div className="flex items-center justify-between">
            {/* Organization switcher */}
            <div className="flex items-center">
              <OrganizationSwitcher />
            </div>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm transition-colors ${
                    item.isActive 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile dropdown menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <span className="mr-2">Menu</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {navItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-2 w-full ${
                          item.isActive ? "font-medium" : ""
                        }`}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
} 