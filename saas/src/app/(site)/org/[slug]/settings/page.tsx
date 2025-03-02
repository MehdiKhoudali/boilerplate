"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrganization } from "@/src/hooks/use-organization";
import { PageHeader } from "@/src/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { OrganizationUserRole } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/src/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { ChevronDown, MoreVertical, Trash, UserPlus } from "lucide-react";

export default function OrganizationSettings() {
  const params = useParams();
  const router = useRouter();
  const { currentOrganization, currentRole, refetchOrganizations } = useOrganization();
  
  const [organization, setOrganization] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingName, setBillingName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const [users, setUsers] = useState<any[]>([]);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<OrganizationUserRole>(OrganizationUserRole.MEMBER);
  const [isInviting, setIsInviting] = useState(false);
  
  // Check if user has permission to manage organization
  const canManageOrganization = currentRole === OrganizationUserRole.OWNER || 
                               currentRole === OrganizationUserRole.ADMIN;
  
  // Check if user is owner
  const isOwner = currentRole === OrganizationUserRole.OWNER;
  
  useEffect(() => {
    const fetchOrganization = async () => {
      if (!params?.slug) {
        setError("No organization slug provided");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch organization by slug
        const response = await fetch(`/api/organizations/slug/${params.slug}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch organization");
        }
        
        const data = await response.json();
        console.log("Organization data fetched:", data);
        setOrganization(data);
        setName(data?.name || "");
        setDescription(data?.description || "");
        setBillingEmail(data?.billingEmail || "");
        setBillingName(data?.billingName || "");
        setBillingAddress(data?.billingAddress || "");
        
        // Fetch organization users
        if (data?.id) {
          const usersResponse = await fetch(`/api/organizations/${data.id}/users`);
          
          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            console.log("Fetched users data:", usersData);
            
            // Ensure we have an array of users with the correct structure
            if (Array.isArray(usersData)) {
              setUsers(usersData);
            } else {
              console.error("Users data is not an array:", usersData);
              setUsers([]);
            }
          } else {
            console.error("Failed to fetch users:", await usersResponse.text());
            setUsers([]);
          }
        } else {
          setError("Organization ID is missing");
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrganization();
  }, [params?.slug]);
  
  const handleSave = async () => {
    if (!organization?.id) {
      setError("Organization ID is missing");
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
      
      const response = await fetch(`/api/organizations/${organization.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          billingEmail,
          billingName,
          billingAddress,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update organization");
      }
      
      const updatedOrg = await response.json();
      setOrganization(updatedOrg);
      
      console.log("Organization settings updated successfully");
      
      // Refresh organization data
      await refetchOrganizations();
      
    } catch (error) {
      console.error("Error updating organization:", error);
      setError(error instanceof Error ? error.message : "Failed to update organization settings");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!organization?.id) {
      setError("Organization ID is missing");
      return;
    }
    
    try {
      setIsDeleting(true);
      setError(null);
      
      const response = await fetch(`/api/organizations/${organization.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete organization");
      }
      
      console.log("Organization deleted successfully");
      
      // Refresh organization data and redirect
      await refetchOrganizations();
      router.push("/dashboard");
      
    } catch (error) {
      console.error("Error deleting organization:", error);
      setError(error instanceof Error ? error.message : "Failed to delete organization");
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleInviteUser = async () => {
    if (!organization?.id) {
      setError("Organization ID is missing");
      return;
    }
    
    if (!inviteEmail) {
      setError("Email is required");
      return;
    }
    
    try {
      setIsInviting(true);
      setError(null);
      
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
      
      // Reset form and close dialog
      setInviteEmail("");
      setInviteRole(OrganizationUserRole.MEMBER);
      setShowInviteDialog(false);
      
      // Refresh users list
      if (organization?.id) {
        const usersResponse = await fetch(`/api/organizations/${organization.id}/users`);
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(Array.isArray(usersData) ? usersData : []);
        }
      }
      
      console.log("User invited successfully");
      
    } catch (error: any) {
      console.error("Error inviting user:", error);
      setError(error.message || "Failed to invite user");
    } finally {
      setIsInviting(false);
    }
  };
  
  const handleUpdateUserRole = async (userId: string, role: OrganizationUserRole) => {
    if (!organization?.id) return;
    
    console.log("Updating user role:", { userId, role, organizationId: organization.id });
    
    try {
      const response = await fetch(`/api/organizations/${organization.id}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update user role");
      }
      
      // Refresh users list
      if (organization?.id) {
        const usersResponse = await fetch(`/api/organizations/${organization.id}/users`);
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          console.log("Updated users data:", usersData);
          setUsers(usersData);
        }
      }
      
      console.log("User role updated successfully");
      
    } catch (error: any) {
      console.error("Error updating user role:", error);
      console.log(error.message || "Failed to update user role");
    }
  };
  
  const handleRemoveUser = async (userId: string) => {
    if (!organization?.id) return;
    
    console.log("Removing user:", { userId, organizationId: organization.id });
    
    try {
      const response = await fetch(`/api/organizations/${organization.id}/users/${userId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove user");
      }
      
      // Refresh users list
      if (organization?.id) {
        const usersResponse = await fetch(`/api/organizations/${organization.id}/users`);
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          console.log("Updated users data after removal:", usersData);
          setUsers(usersData);
        }
      }
      
      console.log("User removed successfully");
      
    } catch (error: any) {
      console.error("Error removing user:", error);
      console.log(error.message || "Failed to remove user");
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="p-8 text-center">
          <p className="text-lg">Loading organization settings...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error && !organization) {
    return (
      <div className="container py-6">
        <div className="p-8 text-center">
          <p className="text-lg text-red-500">Error: {error}</p>
          <Button 
            className="mt-4" 
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  // Show not found state
  if (!organization) {
    return (
      <div className="container py-6">
        <div className="p-8 text-center">
          <p className="text-lg">Organization not found</p>
          <Button 
            className="mt-4" 
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}
      
      <PageHeader
        title="Organization Settings"
        subtitle={`Manage settings for ${organization.name}`}
      />
      
      <Tabs defaultValue="general" className="mt-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Update your organization's basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!canManageOrganization}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={!canManageOrganization}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={organization.slug}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  The slug cannot be changed after creation
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isOwner && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}>
                      {isDeleting ? "Deleting..." : "Delete Organization"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        organization and remove all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button 
                onClick={handleSave} 
                disabled={isSaving || !canManageOrganization}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="members" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Members</CardTitle>
                <CardDescription>
                  Manage members of your organization
                </CardDescription>
              </div>
              {canManageOrganization && (
                <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite a team member</DialogTitle>
                      <DialogDescription>
                        Invite a new user to join your organization.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@company.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              {inviteRole}
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full">
                            <DropdownMenuItem onClick={() => setInviteRole(OrganizationUserRole.ADMIN)}>
                              {OrganizationUserRole.ADMIN}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setInviteRole(OrganizationUserRole.MEMBER)}>
                              {OrganizationUserRole.MEMBER}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setInviteRole(OrganizationUserRole.GUEST)}>
                              {OrganizationUserRole.GUEST}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowInviteDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleInviteUser}
                        disabled={isInviting || !inviteEmail}
                      >
                        {isInviting ? "Inviting..." : "Send Invitation"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No members found
                  </div>
                ) : (
                  <div className="divide-y">
                    {users.map((user) => (
                      <div key={user.user?.id || user.id} className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={user.user?.image || user.image || ""} />
                            <AvatarFallback>
                              {(user.user?.name || user.name)?.charAt(0) || (user.user?.email || user.email)?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.user?.name || user.name || "Unnamed User"}</p>
                            <p className="text-sm text-muted-foreground">{user.user?.email || user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {user.role}
                            {!user.invitationAccepted && " (Pending)"}
                          </span>
                          {canManageOrganization && (user.user?.id || user.id) !== organization.createdById && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleUpdateUserRole((user.user?.id || user.id), OrganizationUserRole.ADMIN)}
                                  disabled={user.role === OrganizationUserRole.ADMIN}
                                >
                                  Make Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleUpdateUserRole((user.user?.id || user.id), OrganizationUserRole.MEMBER)}
                                  disabled={user.role === OrganizationUserRole.MEMBER}
                                >
                                  Make Member
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleUpdateUserRole((user.user?.id || user.id), OrganizationUserRole.GUEST)}
                                  disabled={user.role === OrganizationUserRole.GUEST}
                                >
                                  Make Guest
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleRemoveUser((user.user?.id || user.id))}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Remove User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Update your organization's billing details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="billingEmail">Billing Email</Label>
                <Input
                  id="billingEmail"
                  type="email"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  disabled={!canManageOrganization}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingName">Billing Name</Label>
                <Input
                  id="billingName"
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  disabled={!canManageOrganization}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingAddress">Billing Address</Label>
                <Input
                  id="billingAddress"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  disabled={!canManageOrganization}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSave} 
                disabled={isSaving || !canManageOrganization}
                className="ml-auto"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 