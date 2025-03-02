"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { toast } from "@/src/components/ui/use-toast";

const InvitationPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    const fetchInvitation = async () => {
      if (status === "loading") return;
      
      if (status === "unauthenticated") {
        // Redirect to sign in page with return URL
        router.push(`/sign-in?from=/invitations/${params.token}`);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Fetch invitation details
        const response = await fetch(`/api/organizations/invitations/${params.token}`, {
          method: "GET",
        });
        
        if (!response.ok) {
          throw new Error("Invitation not found or already accepted");
        }
        
        const data = await response.json();
        setInvitation(data);
      } catch (error) {
        console.error("Error fetching invitation:", error);
        toast({
          title: "Error",
          description: "Invitation not found or already accepted",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInvitation();
  }, [params.token, router, status]);

  const handleAcceptInvitation = async () => {
    try {
      setIsAccepting(true);
      
      const response = await fetch(`/api/organizations/invitations/${params.token}`, {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error("Failed to accept invitation");
      }
      
      const data = await response.json();
      
      toast({
        title: "Success",
        description: "You have successfully joined the organization",
      });
      
      // Redirect to the organization page
      router.push(`/org/${data.organization.slug}`);
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast({
        title: "Error",
        description: "Failed to accept invitation",
        variant: "destructive",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading invitation...</p>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invitation Not Found</CardTitle>
            <CardDescription>
              This invitation may have expired or already been accepted.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Organization Invitation</CardTitle>
          <CardDescription>
            You have been invited to join {invitation.organization.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Organization</p>
              <p className="text-sm">{invitation.organization.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Role</p>
              <p className="text-sm">{invitation.role}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Invited By</p>
              <p className="text-sm">{invitation.invitedBy?.name || invitation.invitedBy?.email || "Unknown"}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={handleAcceptInvitation} 
            className="w-full"
            disabled={isAccepting}
          >
            {isAccepting ? "Accepting..." : "Accept Invitation"}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push("/dashboard")} 
            className="w-full"
          >
            Decline
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InvitationPage; 