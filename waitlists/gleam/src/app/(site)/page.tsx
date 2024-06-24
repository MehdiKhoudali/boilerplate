import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiGithub } from "react-icons/fi";
import { BsInstagram, BsTwitter } from "react-icons/bs";

import { Dela_Gothic_One } from "next/font/google";
const gothic = Dela_Gothic_One({ weight: ["400"], subsets: ["latin"] });

export default function Home() {
	return (
		<div className="w-full h-[100vh] flex items-center justify-center flex-col text-center relative overflow-hidden gap-6 pt-[500px]">
			<div
				className="absolute top-0 w-[40%] h-[50px] bg-gradient-to-b from-[#8b75fd] to-[#6f00ff] filter blur-[100px]"
				style={{ transform: "scale(1.5)" }}
			/>
			<div className="border rounded-full p-2 flex items-center justify-center gap-2">
				<p className="text-[10px]">Join the waitlist</p>
				<div className="h-[7px] w-[7px] bg-purple-600 rounded-full" />
			</div>
			<h1
				className={
					`sm:text-6xl md:text-7xl font-extrabold leading-snug animate-fade-in-3 z-10 cursor-default text-4xl text-center` +
					gothic.className
				}>
				Optimize Evolution <br />
				<span className="whitespace-nowrap bg-white bg-gradient-to-r from-purple-300 to-purple-800 bg-clip-text font-bold text-transparent duration-1000">
					Empowered
				</span>
			</h1>
			<div className="w-fit lg:w-[450px] mt-[10px] lg:mt-[30px] mb-[30px] lg:mb-[50px]">
				<div className="flex items-center justify-center gap-4">
					<Input placeholder="E-mail Address" className="bg-slate-800 py-5" />
					<Button className="whitespace-nowrap font-semibold p-5">
						Sign Up
					</Button>
				</div>
				<p className="text-xs text-slate-600 mt-[10px] mb-[20px]">
					Be first on sign up and updates.{" "}
					<span className="text-slate-300">On Point</span> ready.
				</p>
				<div className="flex items-center gap-2 justify-center text-slate-600">
					<span className="cursor-pointer hover:scale-110 hover:text-white transition-all">
						<FiGithub />
					</span>

					<span className="cursor-pointer hover:scale-110 hover:text-white transition-all">
						<BsTwitter />
					</span>

					<span className="cursor-pointer hover:scale-110 hover:text-white transition-all">
						<BsInstagram />
					</span>
				</div>
			</div>
			<div className="min-h-[650px] md:min-h-[852px] w-[90%] xl:w-[1200px] bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 rounded-lg flex items-center justify-center relative"></div>
		</div>
	);
}
