import Description from "@/components/typography/Description";
import Title from "@/components/typography/Title";
import { useState } from "react";
import { motion } from "framer-motion";
import { FADE_UP_ANIMATION } from "@/utils";
import Image from "next/image";

const features = [
	{
		id: 1,
		title: "AI-Driven",
		description:
			"AI interprets and grasps your blueprints, and with merely a brief directive.",
	},
	{
		id: 2,
		title: "Automatic",
		description:
			"AI interprets and grasps your blueprints, and with merely a brief directive.",
	},
	{
		id: 3,
		title: "Efficient",
		description:
			"AI interprets and grasps your blueprints, and with merely a brief directive.",
	},
	{
		id: 4,
		title: "Intuitive",
		description:
			"AI interprets and grasps your blueprints, and with merely a brief directive.",
	},
];

const Features = () => {
	const [active, setActive] = useState(1);
	return (
		<div className="flex flex-col items-center justify-center gap-14 bg-secondary w-full py-20 overflow-hidden">
			<div className="flex flex-col items-center justify-center gap-3">
				<Title>
					Venture beyond the <span className="italic">pace</span> of imagination
				</Title>
				<Description>
					AI interprets and grasps your blueprints, and with merely a brief
					directive, <br className="md:block hidden" />
					carries out intricate tasks on its own.
				</Description>
			</div>

			<div className="flex flex-col items-center gap-8 md:gap-16 justify-center lg:max-w-7xl">
				<div className="flex items-center justify-start gap-5 w-[100vw] xl:w-[100%] overflow-x-auto">
					{features.map((feature) => (
						<div
							key={feature.id}
							className={`flex flex-col items-start justify-center gap-2 shadow-sm p-6 rounded-sm bg-opacity-50 opacity-70 cursor-pointer ${
								feature.id === active
									? "bg-white border -rotate-1 bg-opacity-100 opacity-100"
									: "bg-zinc-200 border-transparent hover:bg-opacity-100 hover:opacity-100"
							} min-w-[300px]`}
							onClick={() => {
								setActive(feature.id);
							}}>
							<h3 className="text-[17px] font-semibold">{feature.title}</h3>
							<p className="text-[14px]">{feature.description}</p>
						</div>
					))}
				</div>
				{active === 1 && (
					<motion.div
						className="h-[400px] md:h-[500px] w-[100%] lg:w-[80%] bg-gradient-to-r from-zinc-700 via-zinc-900 to-black md:rounded-lg flex items-center justify-center"
						initial="hidden"
						animate="show"
						viewport={{ once: false }}
						variants={FADE_UP_ANIMATION}>
						<Image
							src="/images/CreditCard.png"
							width={300}
							height={300}
							alt="Credit Card"
							layout="fixed"
						/>
					</motion.div>
				)}
				{active === 2 && (
					<motion.div
						className="h-[400px] md:h-[500px] w-[100%] lg:w-[80%] bg-gradient-to-r from-zinc-700 via-zinc-900 to-black md:rounded-lg flex items-center justify-center"
						initial="hidden"
						animate="show"
						viewport={{ once: false }}
						variants={FADE_UP_ANIMATION}>
						<Image
							src="/images/CreditCard.png"
							width={300}
							height={300}
							alt="Credit Card"
							layout="fixed"
						/>
					</motion.div>
				)}
				{active === 3 && (
					<motion.div
						className="h-[400px] md:h-[500px] w-[100%] lg:w-[80%] bg-gradient-to-r from-zinc-700 via-zinc-900 to-black md:rounded-lg flex items-center justify-center"
						initial="hidden"
						animate="show"
						viewport={{ once: false }}
						variants={FADE_UP_ANIMATION}>
						<Image
							src="/images/CreditCard.png"
							width={300}
							height={300}
							alt="Credit Card"
							layout="fixed"
						/>
					</motion.div>
				)}
				{active === 4 && (
					<motion.div
						className="h-[400px] md:h-[500px] w-[100%] lg:w-[80%] bg-gradient-to-r from-zinc-700 via-zinc-900 to-black md:rounded-lg flex items-center justify-center"
						initial="hidden"
						animate="show"
						viewport={{ once: false }}
						variants={FADE_UP_ANIMATION}>
						<Image
							src="/images/CreditCard.png"
							width={300}
							height={300}
							alt="Credit Card"
							layout="fixed"
						/>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default Features;
