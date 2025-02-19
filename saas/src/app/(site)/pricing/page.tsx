"use client";

import { useState } from "react";
import { Check, Zap, Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/hooks/use-toast";
import { PageHeader } from "@/src/components/ui/page-header";

const PricingPage = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubscription = async (priceId: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/stripe", {
        method: "GET",
        headers: {
          priceId: priceId,
        },
      });

      const data = await response.json();

      if (data.url) {
        router.push(data.url);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-y-scroll">
      <PageHeader
        title="Pricing"
        subtitle="All your pricing plans"
        actions={[
          {
            label: "Create new",
            icon: <Plus className="h-4 w-4" />,
            onClick: () => {
              /* Add your handler */
            },
          },
          {
            label: "Update your plan",
            variant: "outline",
            onClick: () => {
              /* Add your handler */
            },
          },
        ]}
      />

      <section className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl">
            Choose the perfect plan for your needs. All plans include a 14-day
            free trial.
          </p>
        </div>

        <Tabs
          defaultValue="monthly"
          className="flex flex-col items-center space-y-6"
        >
          <TabsList className="grid w-[280px] sm:w-[340px] grid-cols-2 p-1">
            <TabsTrigger value="monthly" className="text-xs sm:text-sm">
              Monthly billing
            </TabsTrigger>
            <TabsTrigger value="yearly" className="text-xs sm:text-sm">
              Yearly billing (Save 20%)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {monthlyPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative flex flex-col ${
                    plan.recommended
                      ? "border-primary shadow-md scale-[1.02] z-10"
                      : "bg-card/50"
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-3 py-0.5 text-xs font-medium text-white bg-primary rounded-full">
                      Popular
                    </div>
                  )}
                  <CardHeader className="space-y-1.5 p-4">
                    <div className="space-y-1.5">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground min-h-[32px]">
                        {plan.description}
                      </p>
                    </div>
                    <div className="pt-2 space-y-1.5">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold tracking-tight">
                          ${plan.price}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          /month
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {plan.icon}
                        <span className="text-xs text-muted-foreground">
                          {plan.quota}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow p-4 pt-0">
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full"
                      size="sm"
                      variant={plan.recommended ? "default" : "outline"}
                      onClick={() => handleSubscription(plan.priceId)}
                      disabled={loading}
                    >
                      Get started
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="yearly" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {yearlyPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative flex flex-col ${
                    plan.recommended
                      ? "border-primary shadow-md scale-[1.02] z-10"
                      : "bg-card/50"
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-3 py-0.5 text-xs font-medium text-white bg-primary rounded-full">
                      Popular
                    </div>
                  )}
                  <CardHeader className="space-y-1.5 p-4">
                    <div className="space-y-1.5">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground min-h-[32px]">
                        {plan.description}
                      </p>
                    </div>
                    <div className="pt-2 space-y-1.5">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold tracking-tight">
                          ${plan.price}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          /year
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {plan.icon}
                        <span className="text-xs text-muted-foreground">
                          {plan.quota}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow p-4 pt-0">
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full"
                      size="sm"
                      variant={plan.recommended ? "default" : "outline"}
                      onClick={() => handleSubscription(plan.priceId)}
                      disabled={loading}
                    >
                      Get started
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default PricingPage;

const monthlyPlans = [
  {
    priceId: "price_monthly_basic",
    name: "Basic",
    price: 10,
    description: "Perfect for individuals and small teams getting started.",
    recommended: false,
    icon: <Zap className="h-5 w-5 text-primary" />,
    quota: "400 AI Words per day",
    features: [
      "400 AI Words daily limit",
      "Basic email support",
      "3 projects",
      "1 team member",
      "Basic analytics dashboard",
      "Standard templates",
    ],
  },
  {
    priceId: "price_monthly_pro",
    name: "Pro",
    price: 29,
    description: "Best for professionals and growing teams.",
    recommended: true,
    icon: <Zap className="h-5 w-5 text-primary" />,
    quota: "2000 AI Words per day",
    features: [
      "2000 AI Words daily limit",
      "Priority email & chat support",
      "Unlimited projects",
      "Up to 5 team members",
      "Advanced analytics & reporting",
      "Custom templates",
      "API access (100k requests/mo)",
    ],
  },
  {
    priceId: "price_monthly_enterprise",
    name: "Enterprise",
    price: 99,
    description: "For large teams with advanced needs.",
    recommended: false,
    icon: <Zap className="h-5 w-5 text-primary" />,
    quota: "Unlimited AI Words",
    features: [
      "Unlimited AI Words",
      "24/7 phone & priority support",
      "Unlimited projects",
      "Unlimited team members",
      "Custom analytics",
      "Custom templates",
      "API access (unlimited)",
      "Custom integrations",
      "Dedicated account manager",
    ],
  },
];

const yearlyPlans = monthlyPlans.map((plan) => ({
  ...plan,
  priceId: plan.priceId.replace("monthly", "yearly"),
  price: Math.floor(plan.price * 12 * 0.8), // 20% discount for yearly
}));
