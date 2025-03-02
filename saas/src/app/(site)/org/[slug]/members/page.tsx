"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrganization } from "@/src/hooks/use-organization";
import { PageHeader } from "@/src/components/ui/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Users, UserPlus, RefreshCw, AlertCircle, ArrowLeft, Mail, X } from "lucide-react";
import { OrganizationUserRole } from "@prisma/client";
import Link from "next/link";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

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

// Loading skeleton component for user list
function UserListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-4 border rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}

export default function OrganizationMembersPage() {
  const params = useParams();
  const router = useRouter();
  const { currentOrganization, currentRole } = useOrganization();
  const [organizationUsers, setOrganizationUsers] = useState<OrganizationUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organization, setOrganization] = useState<any>(null);
  
  // Invite dialog state
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<OrganizationUserRole>(OrganizationUserRole.MEMBER);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  // Check if user has permission to manage organization
  const canManageOrganization = currentRole === OrganizationUserRole.OWNER || 
                               currentRole === OrganizationUserRole.ADMIN;
                               
  // Check if user is owner (for more restricted operations)
  const isOwner = currentRole === OrganizationUserRole.OWNER;
  
  // Check if user can assign a specific role
  const canAssignRole = (role: OrganizationUserRole) => {
    if (isOwner) {
      return true; // Owner can assign any role
    } else if (currentRole === OrganizationUserRole.ADMIN) {
      // Admin can assign Member or Admin roles, but not Owner
      return role !== OrganizationUserRole.OWNER;
    }
    return false; // Regular members can't assign roles
  };

  // Minimal effect to fetch organization users
  useEffect(() => {
    async function fetchUsers() {
      if (!params?.slug) {
        setError("No organization slug provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // First get the organization by slug
        console.log(`Fetching organization by slug: ${params.slug}`);
        const orgResponse = await fetch(`/api/organizations/slug/${params.slug}`);
        if (!orgResponse.ok) {
          throw new Error(`Failed to fetch organization: ${await orgResponse.text()}`);
        }
        
        const orgData = await orgResponse.json();
        console.log("Organization data:", orgData);
        setOrganization(orgData);
        
        // Then fetch the users
        console.log(`Fetching users for organization: ${orgData?.id}`);
        if (!orgData?.id) {
          throw new Error("Organization ID is missing");
        }
        
        const usersResponse = await fetch(`/api/organizations/${orgData.id}/users`);
        if (!usersResponse.ok) {
          const errorText = await usersResponse.text();
          console.error("Error fetching users:", errorText);
          
          // If the error is "Forbidden", redirect to the organization overview page
          if (errorText.includes("Forbidden") || usersResponse.status === 403) {
            console.log("Access forbidden, redirecting to organization overview");
            router.push(`/org/${params.slug}`);
            return;
          }
          
          throw new Error(`Failed to fetch organization users: ${errorText}`);
        }
        
        const usersData = await usersResponse.json();
        console.log("Users data:", usersData);
        setOrganizationUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        
        // Check if the error message contains "Forbidden" and redirect
        if (err instanceof Error && 
            (err.message.includes("Forbidden") || err.message.includes("403"))) {
          console.log("Access forbidden, redirecting to organization overview");
          router.push(`/org/${params.slug}`);
          return;
        }
        
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    
    fetchUsers();
  }, [params?.slug, router]);

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

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case OrganizationUserRole.OWNER:
        return "bg-purple-100 text-purple-800";
      case OrganizationUserRole.ADMIN:
        return "bg-blue-100 text-blue-800";
      case OrganizationUserRole.MEMBER:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle invite member dialog
  const handleInviteMember = () => {
    setShowInviteDialog(true);
  };
  
  // Handle invite submission
  const handleInviteSubmit = async () => {
    if (!organization?.id) {
      setInviteError("Organization ID is missing");
      return;
    }
    
    if (!inviteEmail) {
      setInviteError("Email is required");
      return;
    }
    
    // Validate that the user can assign this role
    if (!canAssignRole(inviteRole)) {
      setInviteError("You don't have permission to assign this role");
      return;
    }
    
    try {
      setIsInviting(true);
      setInviteError(null);
      setInviteSuccess(null);
      
      const response = await fetch(`/api/organizations/${organization.id}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to invite user");
      }
      
      // Show success message
      setInviteSuccess(`Invitation sent to ${inviteEmail}`);
      
      // Reset form
      setInviteEmail("");
      
      // Refresh users list
      if (organization?.id) {
        const usersResponse = await fetch(`/api/organizations/${organization.id}/users`);
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setOrganizationUsers(Array.isArray(usersData) ? usersData : []);
        }
      }
      
      // Close dialog after a delay
      setTimeout(() => {
        setShowInviteDialog(false);
        setInviteSuccess(null);
      }, 2000);
      
    } catch (error) {
      console.error("Error inviting user:", error);
      setInviteError(error instanceof Error ? error.message : "Failed to invite user");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organization Members</h1>
          <p className="text-muted-foreground mt-1">
            {organizationUsers.filter(u => u.invitationAccepted).length} active, 
            {organizationUsers.filter(u => !u.invitationAccepted).length} pending
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            asChild
          >
            <Link href={`/org/${params?.slug || ''}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          
          {canManageOrganization && (
            <Button 
              className="flex items-center"
              onClick={handleInviteMember}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          )}
        </div>
          </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle>Members ({organizationUsers.length})</CardTitle>
          <CardDescription>
            Manage members and invitations for your organization.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <UserListSkeleton />
          ) : error ? (
            <div className="text-center text-red-500 p-10 border border-dashed rounded-lg">
              <AlertCircle className="h-10 w-10 mx-auto mb-2" />
              <p className="text-lg font-semibold">Error</p>
              <p>{error}</p>
              <Button 
                variant="outline" 
                className="mt-4 flex items-center"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : organizationUsers.length === 0 ? (
            <div className="text-center p-10 border border-dashed rounded-lg">
              <Users className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              <p className="text-lg font-semibold">No members found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Invite members to collaborate with you in this organization.
              </p>
              {canManageOrganization && (
                <Button 
                  className="mt-4 flex items-center"
                  onClick={handleInviteMember}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {organizationUsers.map((user) => (
                <div key={user.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
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
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground hidden md:block">
                      Joined {user.joinedAt ? formatDate(user.joinedAt) : "N/A"}
                    </div>
                    <Badge className={`${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </Badge>
                    {canManageOrganization && (
                      <Button variant="ghost" size="sm">
                        ⋯
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-muted/50 px-6 py-3">
          <Button 
            variant="outline" 
            className="flex items-center ml-auto"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardFooter>
      </Card>
      
      {/* Invite Member Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Invite a new member to join your organization.
            </DialogDescription>
          </DialogHeader>
          
          {inviteSuccess ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-600 flex items-center">
              <div className="mr-2 flex-shrink-0 bg-green-100 rounded-full p-1">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.66675 10.1147L12.7947 3.98599L13.7381 4.92866L6.66675 12L2.42875 7.76199L3.37208 6.81866L6.66675 10.1147Z" fill="currentColor"/>
                </svg>
              </div>
              <p>{inviteSuccess}</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                {inviteError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 flex items-center text-sm">
                    <X className="h-4 w-4 mr-2 flex-shrink-0" />
                    <p>{inviteError}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="email"
                      type="email"
                      placeholder="colleague@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select 
                    value={inviteRole} 
                    onValueChange={(value) => setInviteRole(value as OrganizationUserRole)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={OrganizationUserRole.MEMBER}>Member</SelectItem>
                      {canAssignRole(OrganizationUserRole.ADMIN) && (
                        <SelectItem value={OrganizationUserRole.ADMIN}>Admin</SelectItem>
                      )}
                      {canAssignRole(OrganizationUserRole.OWNER) && (
                        <SelectItem value={OrganizationUserRole.OWNER}>Owner</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
        <Button 
          variant="outline" 
                  onClick={() => setShowInviteDialog(false)}
                  disabled={isInviting}
        >
                  Cancel
        </Button>
                <Button 
                  onClick={handleInviteSubmit}
                  disabled={isInviting || !inviteEmail}
                  className="ml-2"
                >
                  {isInviting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Invitation
                    </>
                  )}
        </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}