import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { FADE_UP_ANIMATION } from "@/utils";

const Hero = () => {
	return (
		<motion.div
			className="w-full flex items-center justify-center flex-col text-center gap-12"
			initial="hidden"
			animate="show"
			viewport={{ once: true }}
			variants={{
				hidden: {},
				show: {
					transition: {
						staggerChildren: 0.15,
					},
				},
			}}>
			{/* <motion.div
				className="absolute top-[200px] right-[-150px] lg:block hidden"
				variants={FADE_UP_ANIMATION}>
				<Image src="/images/card-1.svg" alt="Cards" width={300} height={300} />
			</motion.div> */}
			<div className="flex flex-col items-center justify-center gap-4">
				<motion.h1
					className="text-3xl font-semibold sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-zinc-400 via-zinc-900 to-zinc-900"
					variants={FADE_UP_ANIMATION}>
					Manage your <span className="italic">business</span> expenses{" "}
					<br className="md:block hidden" /> with ease and speed.
				</motion.h1>
				<motion.p
					className="text-lg text-zinc-500"
					variants={FADE_UP_ANIMATION}>
					Prism is a simple and intuitive expense tracker that helps you manage
					your business <br className="md:block hidden" /> expenses with ease
					and speed.
				</motion.p>
				<motion.div
					className="flex items-center justify-center gap-6"
					variants={FADE_UP_ANIMATION}>
					<Button variant="default">Get Started</Button>
				</motion.div>
			</div>
			<motion.div
				className="min-h-[250px] md:min-h-[300px] lg:min-h-[800px] w-[90%] lg:w-[1000px] xl:w-[1300px] bg-gradient-to-b from-gray-700 via-gray-900 to-black rounded-lg flex items-center justify-center relative overflow-hidden p-10"
				variants={FADE_UP_ANIMATION}>
				<Image
					src="/images/dashboard.png"
					alt="Dashboard"
					fill
					objectFit="cover"
					objectPosition="top"
				/>
			</motion.div>
		</motion.div>
	);
};

export default Hero;
