"use client";

import { Button } from "@/src/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Login() {
	const router = useRouter();

	return (
		<div className="flex h-screen w-full">
			{/* Left: Sign-in form */}
			<div className="flex w-[50%] flex-col items-center justify-center gap-8 p-8">
				<div className="flex flex-col items-center gap-6 text-center">
					<h1 className="text-3xl font-normal">Welcome back</h1>
					<p className="text-base text-muted-foreground">
						Sign in with Google to continue writing
					</p>
				</div>

				<Button
					variant="outline"
					className="flex w-auto items-center justify-center gap-3 rounded-md px-24 py-6 text-base font-normal"
					onClick={() => signIn("google", { callbackUrl: "/" })}
				>
					<Image
						src="/images/google.svg"
						width={20}
						height={20}
						alt="Google"
						className="filter-none dark:filter invert"
					/>
					Sign in with Google
				</Button>
			</div>

			{/* Right: Full-height background image */}
			<div className="w-[50%]">
				<Image
					src="https://cdn.leonardo.ai/users/d97ca639-ae7c-4c1a-ab52-c64c8858a853/generations/d4e5f829-7e5d-4156-8517-f7c4339149b7/Leonardo_Phoenix_10_A_majestic_Roman_city_bathed_in_warm_golde_2.jpg"
					alt="Sign in Background"
					className="h-full w-full"
					width={1080}
					height={1080}
				/>
			</div>
		</div>
	);
}
