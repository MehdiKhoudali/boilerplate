import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { PHProvider } from "../providers/PosthogProvider";
import { OrganizationProvider } from "@/src/hooks/use-organization";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/src/components/theme-provider";
import { Session } from "@/src/providers/SessionProvider";

export const metadata: Metadata = {
	title: "Untitled UI",
	description: "Untitled UI",
};

const font = Inter({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
	display: "swap",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const CrispWithNoSSR = dynamic(() => import("../config/crisp"));
	return (
		<html lang="en" suppressHydrationWarning>
			<CrispWithNoSSR />
			<PHProvider>
				<body className={font.className}>
					<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
					<Session>
						<OrganizationProvider>
							<ThemeProvider
								attribute="class"
								defaultTheme="light"
								enableSystem
								disableTransitionOnChange
							>
								{children}
							</ThemeProvider>
						</OrganizationProvider>
					</Session>
				</body>
			</PHProvider>
		</html>
	);
}
