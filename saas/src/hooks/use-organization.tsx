"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { OrganizationType, OrganizationUserRoleType, UserWithOrganizations } from "@/types/organization";

interface OrganizationContextType {
  organizations: UserWithOrganizations | null;
  currentOrganization: OrganizationType | null;
  currentRole: OrganizationUserRoleType | null;
  isLoading: boolean;
  error: string | null;
  setCurrentOrganizationId: (id: string) => Promise<void>;
  refetchOrganizations: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [organizations, setOrganizations] = useState<UserWithOrganizations | null>(null);
  const [currentOrganization, setCurrentOrganization] = useState<OrganizationType | null>(null);
  const [currentRole, setCurrentRole] = useState<OrganizationUserRoleType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renderCount, setRenderCount] = useState(0);

  // Debug logging - track component renders
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    console.log(`OrganizationProvider render #${renderCount + 1}`);
  }, []);

  const fetchOrganizations = async (force = false) => {
    // Skip if session is loading or user is not authenticated
    if (status === "loading" || !session?.user?.id) {
      // If session is not loading and there's no user, we're not authenticated
      // so we should set loading to false
      if (status !== "loading") {
        console.log("No authenticated user, setting loading to false");
        setIsLoading(false);
        setFetchAttempted(true);
        setError("No authenticated user");
      }
      return;
    }
    
    // Skip if we've fetched within the last 5 seconds (unless forced)
    const now = Date.now();
    if (!force && now - lastFetchTime < 5000 && fetchAttempted) {
      console.log("Skipping organization fetch - throttled");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching organizations for user:", session.user.id);
      const response = await fetch("/api/organizations");
      
      if (response.ok) {
        const data = await response.json();
        console.log("Organizations data:", data);
        setOrganizations(data);
        setLastFetchTime(now);
        
        // Set current organization from session or default
        if (session.user.organizationId && session.user.organization) {
          console.log("Setting current organization from session:", session.user.organization);
          setCurrentOrganization(session.user.organization);
          setCurrentRole(session.user.organizationRole || null);
        } else if (data?.defaultOrganizationId) {
          const defaultOrg = data.organizations.find(
            (ou: any) => ou.organization.id === data.defaultOrganizationId
          );
          
          if (defaultOrg) {
            console.log("Setting current organization from default:", defaultOrg.organization);
            setCurrentOrganization(defaultOrg.organization);
            setCurrentRole(defaultOrg.role);
          }
        } else if (data?.organizations?.length > 0) {
          // If no default, use the first organization
          console.log("Setting current organization from first organization:", data.organizations[0].organization);
          setCurrentOrganization(data.organizations[0].organization);
          setCurrentRole(data.organizations[0].role);
        } else {
          console.log("No organizations found for user");
          setCurrentOrganization(null);
          setCurrentRole(null);
        }
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch organizations:", errorText);
        setError(`Failed to fetch organizations: ${errorText}`);
        setOrganizations(null);
        setCurrentOrganization(null);
        setCurrentRole(null);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      setOrganizations(null);
      setCurrentOrganization(null);
      setCurrentRole(null);
    } finally {
      setIsLoading(false);
      setFetchAttempted(true);
    }
  };

  // Debug logging for session state
  useEffect(() => {
    console.log("Session state changed:", { 
      status, 
      userId: session?.user?.id,
      isLoading,
      fetchAttempted
    });
  }, [session, status, isLoading, fetchAttempted]);

  useEffect(() => {
    // Only fetch when session changes and is not loading
    if (status !== "loading") {
      console.log("Session status is not loading, fetching organizations");
      fetchOrganizations();
    }
  }, [session?.user?.id, status]);

  // Add a timeout to ensure loading state doesn't get stuck
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading && !fetchAttempted) {
        console.log("Loading timeout reached, forcing loading state to false");
        setIsLoading(false);
        setFetchAttempted(true);
        setError("Organization data loading timed out. Please refresh the page.");
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, [isLoading, fetchAttempted]);

  // Debug logging for state changes
  useEffect(() => {
    console.log("Organization provider state:", {
      isLoading,
      fetchAttempted,
      hasOrganizations: organizations !== null,
      currentOrganization,
      currentRole,
      error,
      renderCount: renderCount + 1
    });
  }, [isLoading, organizations, currentOrganization, currentRole, fetchAttempted, error, renderCount]);

  const setCurrentOrganizationId = async (id: string) => {
    if (!organizations) return;
    
    const orgUser = organizations.organizations.find(
      (ou) => ou.organization.id === id
    );
    
    if (!orgUser) return;
    
    try {
      console.log("Setting default organization:", id);
      // Update default organization in the backend
      const response = await fetch("/api/organizations/default", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizationId: id }),
      });
      
      if (response.ok) {
        setCurrentOrganization(orgUser.organization);
        setCurrentRole(orgUser.role);
        console.log("Default organization updated successfully");
        
        // Reload the page to update the session
        window.location.reload();
      } else {
        const errorText = await response.text();
        console.error("Failed to set default organization:", errorText);
        setError(`Failed to set default organization: ${errorText}`);
      }
    } catch (error) {
      console.error("Error setting default organization:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        currentOrganization,
        currentRole,
        isLoading,
        error,
        setCurrentOrganizationId,
        refetchOrganizations: () => fetchOrganizations(true),
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  
  if (context === undefined) {
    throw new Error("useOrganization must be used within an OrganizationProvider");
  }
  
  return context;
} 