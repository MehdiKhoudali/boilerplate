"use client";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/src/components/ui/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Building, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to your dashboard"
        actions={[]}
      />

      {/* Welcome Card */}
      <Card className="mt-6 mx-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Welcome to Your Dashboard
          </CardTitle>
          <CardDescription>
            Manage your organizations and team collaborations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            View and manage your organizations to collaborate with your team members.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/org">
              View Organizations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
