"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useOrganization } from "@/src/hooks/use-organization";
import { PageHeader } from "@/src/components/ui/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Plus, Building, Users, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";

type Organization = {
  id: string;
  name: string;
  slug: string;
  userRole: string;
};

export default function OrganizationsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { organizations, isLoading: isLoadingOrgs } = useOrganization();
  
  const [isLoading, setIsLoading] = useState(true);
  const [userOrganizations, setUserOrganizations] = useState<Organization[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgSlug, setNewOrgSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      if (status === "loading") return;
      
      try {
        setIsLoading(true);
        const response = await fetch("/api/organizations");
        
        if (response.ok) {
          const data = await response.json();
          
          if (data?.organizations) {
            const orgs = data.organizations.map((ou: any) => ({
              id: ou.organization.id,
              name: ou.organization.name,
              slug: ou.organization.slug,
              userRole: ou.role,
            }));
            
            setUserOrganizations(orgs);
          }
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
        setErrorMessage("Failed to fetch organizations");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrganizations();
  }, [status]);

  const handleCreateOrganization = async () => {
    if (!newOrgName || !newOrgSlug) return;
    
    try {
      setIsCreating(true);
      setErrorMessage(null);
      
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newOrgName,
          slug: newOrgSlug,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        setSuccessMessage("Organization created successfully");
        
        setNewOrgName("");
        setNewOrgSlug("");
        setShowCreateDialog(false);
        
        // Redirect to the new organization
        router.push(`/org/${data.slug}`);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "Failed to create organization");
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      setErrorMessage("Failed to create organization");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to lowercase and replace spaces with hyphens
    setNewOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewOrgName(e.target.value);
    // Auto-generate slug from name if slug is empty
    if (!newOrgSlug) {
      setNewOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
    }
  };

  return (
    <div className="">
      <PageHeader
        title="Organizations"
        subtitle="Manage your organizations"
        actions={[
          {
            label: "Create Organization",
            icon: <Plus className="h-4 w-4" />,
            onClick: () => setShowCreateDialog(true),
          },
        ]}
      />

      {/* Error message display */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{errorMessage}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setErrorMessage(null)}
          >
            <span className="sr-only">Dismiss</span>
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}

      {/* Success message display */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{successMessage}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setSuccessMessage(null)}
          >
            <span className="sr-only">Dismiss</span>
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="grid mx-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-48">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : userOrganizations.length === 0 ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>No Organizations</CardTitle>
            <CardDescription>
              You don't have any organizations yet. Create your first organization to get started.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Organization
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid mx-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {userOrganizations.map((org) => (
            <Card key={org.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  {org.name}
                </CardTitle>
                <CardDescription>
                  {org.userRole.charAt(0) + org.userRole.slice(1).toLowerCase()} Role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Organization slug: {org.slug}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/org/${org.slug}/members`}>
                    <Users className="h-4 w-4 mr-2" />
                    Members
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/org/${org.slug}`}>
                    Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Organization Modal */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create Organization</h2>
              <button 
                onClick={() => setShowCreateDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Create a new organization to collaborate with your team.
            </p>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Organization Name
                </label>
                <input
                  id="name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Acme Inc."
                  value={newOrgName}
                  onChange={handleNameChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium">
                  Organization Slug
                </label>
                <input
                  id="slug"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="acme"
                  value={newOrgSlug}
                  onChange={handleSlugChange}
                />
                <p className="text-xs text-gray-500">
                  This will be used in the URL: /org/<span className="font-semibold">{newOrgSlug || "acme"}</span>
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateOrganization}
                disabled={isCreating || !newOrgName || !newOrgSlug}
              >
                {isCreating ? "Creating..." : "Create Organization"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 