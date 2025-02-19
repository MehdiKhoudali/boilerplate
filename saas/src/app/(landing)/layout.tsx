"use client";

import { Badge } from "@/src/components/ui/badge";
import Link from "next/link";
import { ThemeProvider } from "@/src/components/theme-provider";
import dynamic from "next/dynamic";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  const CrispWithNoSSR = dynamic(() => import("../../config/crisp"));

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <main className="flex flex-col">
        {children}
      </main>
    </ThemeProvider>
  );
};
export default LandingLayout;
