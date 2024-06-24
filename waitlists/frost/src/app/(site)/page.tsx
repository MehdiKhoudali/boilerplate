"use client";

import Snowfall from "react-snowfall";

import { Poppins } from "next/font/google";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast"

import { motion } from "framer-motion";
import { FiGithub } from "react-icons/fi";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import Link from "next/link";
import { useState } from "react";

const font = Poppins({ weight: ["400"], subsets: ["latin"] });

export default function Home() {
	const { toast } = useToast();
	const [email, setEmail] = useState("");

	const subscribe = async (e: any) => {
		e.preventDefault(); // Prevent the default browser submit action
		const res = await fetch('/api/subscribe', {
		  method: 'POST',
		  body: JSON.stringify({ email }),
		  headers: {
			'Content-Type': 'application/json',
		  },
		});
	  
		const data = await res.json(); // Extract the JSON response from the server
	  
		if (res.ok) {
		  toast({
			title: 'Success!',
			description: data.message, // Use the server's success message
		  });
		  setEmail(''); // Clear the email input field
		} else {
		  toast({
			variant: 'destructive', 
			title: 'Uh oh! Something went wrong.',
			description: data.message || 'There was a problem with your request.', // Use the server's error message
		  });
		}
	  };

	return (
		<div
			className={
				`min-h-screen w-[100%] px-2 lg:px-0 flex items-center justify-center flex-col text-center relative z-50 mx-auto` +
				font.className
			}>
				<Toaster />
			<Snowfall
				snowflakeCount={200}
				color="grey"
				style={{
					position: "fixed",
					width: "100vw",
					height: "100vh",
					zIndex: -9,
				}}
				speed={"140" as any}
				radius={"12" as any}
			/>
			<div className="flex items-center gap-4 flex-col">
				<div className="p-[1px] bg-transparent  relative">
					<div className="p-2 ">
						<span className="absolute inset-0 px-3 rounded-3xl overflow-hidden">
							<motion.span
								className="w-[500%] aspect-square absolute bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] opacity-20"
								initial={{
									rotate: -90,
								}}
								animate={{
									rotate: 90,
								}}
								transition={{
									duration: 3.8,
									ease: "linear",
									repeat: Infinity,
									repeatType: "reverse",
								}}
								style={{
									translateX: "-50%",
									translateY: "-10%",
									zIndex: -1,
								}}
							/>
						</span>
						<span className="bg-clip-text text-transparent dark:bg-gradient-to-r bg-gradient-to-tr dark:from-white from-black to-neutral-600 dark:to-neutral-700">
							Launching Soon!
						</span>
					</div>
				</div>
				<h1 className="text-3xl font-bold sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent dark:bg-gradient-to-r bg-gradient-to-tr dark:from-white from-black to-neutral-600 dark:to-neutral-800 capitalize md:max-w-3xl lg:max-w-5xl">
					Optimize Evolution Empowered
				</h1>
				<p className="max-w-[600px] leading-7 text-center text-[16px] bg-clip-text text-transparent dark:bg-gradient-to-br bg-gradient-to-tr dark:from-white from-black to-neutral-600 dark:to-neutral-700">
					Something big is on the way! Dont miss out—sign up now to be the first
					to know when we launch. Stay tuned!
				</p>
				<div className="w-fit lg:w-[450px] mt-[10px] lg:mt-[30px] mb-[30px] lg:mb-[50px]">
					<form
						className="flex items-center justify-center gap-4"
						onSubmit={subscribe}>
						<Input
							placeholder="E-mail Address"
							className="bg-slate-900 py-5"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							type="email"
							required
						/>
						<Button
							className="whitespace-nowrap font-medium p-5 bg-slate-900"
							variant="secondary"
							type="submit">
							Join
						</Button>
					</form>

					<div className="flex items-center gap-2 justify-center text-slate-600 mt-6">
						<Link href="/" target="_blank">
							<span className="cursor-pointer hover:scale-110 hover:text-white transition-all">
								<FiGithub />
							</span>
						</Link>
						<Link href="/" target="_blank">
							<span className="cursor-pointer hover:scale-110 hover:text-white transition-all">
								<BsTwitter />
							</span>
						</Link>
						<Link href="/" target="_blank">
							<span className="cursor-pointer hover:scale-110 hover:text-white transition-all">
								<BsInstagram />
							</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
