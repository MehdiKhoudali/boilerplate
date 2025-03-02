"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { useOrganization } from "@/src/hooks/use-organization";
import { PageHeader } from "@/src/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { OrganizationUserRole } from "@prisma/client";
import { Users, Settings, Activity, UserPlus, Calendar, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

type OrganizationUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  joinedAt: string;
  invitationAccepted?: boolean;
  user?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
};

// Loading skeleton component for cards
function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-1/4 mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex space-x-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  const params = useParams();
  const { currentOrganization, currentRole } = useOrganization();
  const [organization, setOrganization] = useState<any>(null);
  const [users, setUsers] = useState<OrganizationUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (!params?.slug) {
        setError("No organization slug provided");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Fetch organization by slug
        const response = await fetch(`/api/organizations/slug/${params.slug}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch organization");
        }
        
        const data = await response.json();
        console.log("Organization data fetched:", data);
        setOrganization(data);
        
        // Fetch organization users
        if (data?.id) {
          try {
            const usersResponse = await fetch(`/api/organizations/${data.id}/users`);
            
            if (usersResponse.ok) {
              const usersData = await usersResponse.json();
              console.log("Users data fetched:", usersData);
              
              if (Array.isArray(usersData)) {
                setUsers(usersData);
              } else {
                console.error("Users data is not an array:", usersData);
                setUsers([]);
              }
            } else {
              // Handle the case where user doesn't have permission to view users
              console.error("Failed to fetch users:", await usersResponse.text());
              setUsers([]);
              // Don't set an error for the whole page if just the users fetch fails
            }
          } catch (userError) {
            console.error("Error fetching users:", userError);
            setUsers([]);
            // Don't set an error for the whole page if just the users fetch fails
          }
        } else {
          setError("Organization ID is missing");
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrganizationData();
  }, [params?.slug]);

  // Helper function to get user initials
  const getInitials = (user: OrganizationUser) => {
    if (user.user?.name) {
      return user.user.name
        .split(" ")
        .map(part => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    if (user.name) {
      return user.name
        .split(" ")
        .map(part => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    const email = user.user?.email || user.email;
    return email.substring(0, 2).toUpperCase();
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container py-6">
        <Skeleton className="h-12 w-3/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <Skeleton className="h-64 w-full mt-6" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container py-6">
        <div className="p-8 text-center border border-red-200 rounded-lg bg-red-50">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <p className="text-lg text-red-500 font-medium">Error: {error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!organization) {
    return (
      <div className="container py-6">
        <div className="p-8 text-center border border-gray-200 rounded-lg bg-gray-50">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Organization not found</p>
          <Button 
            asChild
            className="mt-4"
          >
            <Link href="/dashboard">
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Check if user has admin or owner role
  const isAdminOrOwner = currentRole === OrganizationUserRole.OWNER || 
                         currentRole === OrganizationUserRole.ADMIN;
                         
  // Check if user is owner (for settings access)
  const isOwner = currentRole === OrganizationUserRole.OWNER;

  // Count active and pending users
  const activeUsers = users.filter(u => u.invitationAccepted).length;
  const pendingUsers = users.filter(u => !u.invitationAccepted).length;

  // Get creation date
  const creationDate = organization.createdAt ? formatDate(organization.createdAt) : "N/A";

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{organization.name}</h1>
          <p className="text-muted-foreground mt-1">
            {organization.description || "Team Workspace"}
          </p>
        </div>
        {isAdminOrOwner && (
          <Button asChild>
            <Link href={`/org/${organization.slug}/members`}>
              <UserPlus className="h-4 w-4 mr-2" />
              Manage Members
            </Link>
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-primary" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-2xl font-bold">{users.length || "—"}</div>
            <div className="flex items-center gap-2 mt-1">
              {users.length > 0 ? (
                <>
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    {activeUsers} active
                  </Badge>
                  {pendingUsers > 0 && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                      {pendingUsers} pending
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {isAdminOrOwner ? "No members yet" : "Restricted access"}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link 
              href={`/org/${organization.slug}/members`}
              className="text-sm text-primary hover:underline inline-flex items-center"
            >
              {isAdminOrOwner ? "View all members" : "View members"}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-3 w-3">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              Created On
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xl font-medium">{creationDate}</div>
            <p className="text-xs text-muted-foreground mt-1">
              by {organization.createdByName || "Unknown"}
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="text-sm text-muted-foreground">
              Organization ID: {organization.id?.substring(0, 8)}...
            </div>
          </CardFooter>
        </Card>
        
        {isOwner && (
          <Card className="border-dashed border-primary/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Settings className="h-4 w-4 mr-2 text-primary" />
                Organization Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm">
                Manage your organization settings, members, and permissions.
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" asChild className="w-full">
                <Link href={`/org/${organization.slug}/settings`}>
                  Go to Settings
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
      
      {/* Recent Members */}
      <h2 className="text-xl font-semibold mb-4">Recent Members</h2>
      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="divide-y">
            {users.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">
                  {isAdminOrOwner 
                    ? "No members found" 
                    : "You don't have permission to view the member list"}
                </p>
              </div>
            ) : (
              users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.image || user.user?.image || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {user.name || user.user?.name || user.email}
                        {!user.invitationAccepted && (
                          <Badge variant="outline" className="ml-2 text-xs">Pending</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.role}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Joined {user.joinedAt ? formatDate(user.joinedAt) : "N/A"}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
        {users.length > 5 && (
          <CardFooter className="border-t px-6 py-3">
            <Button variant="ghost" asChild className="w-full">
              <Link href={`/org/${organization.slug}/members`}>
                View All Members
              </Link>
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {/* Recent Activity */}
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12 border border-dashed rounded-lg">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No recent activity</h3>
            <p className="text-sm text-muted-foreground">
              Activity will appear here as your team collaborates
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}