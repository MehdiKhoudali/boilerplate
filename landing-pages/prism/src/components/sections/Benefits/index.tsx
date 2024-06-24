import Description from "@/components/typography/Description";
import Title from "@/components/typography/Title";
import { Badge } from "@/components/ui/badge";
import { CubeIcon, LightningBoltIcon, SymbolIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { motion } from "framer-motion";
import { FADE_UP_ANIMATION } from "@/utils";

const Benefits = () => {
	const [active, setActive] = useState(1);
	return (
		<div className="py-20 w-full bg-zinc-900 text-white flex items-center justify-center">
			<div className="flex items-center justify-center gap-5 w-full px-4 md:pl-10 xl:pl-32 lg:flex-row flex-col">
				<div className="flex flex-col items-start gap-2 flex-1">
					<Badge
						variant="outline"
						className="rounded-full text-zinc-400 font-light text-sm border-zinc-700">
						Empower your team
					</Badge>
					<Title className="xl:text-4xl text-left">
						Streamlined <span className="italic">workflows</span> driven by
						design <br /> for teams of all sizes
					</Title>
					<Description className="text-left">
						Gray possesses the ability to comprehend your design concepts,
						assimilate <br /> your input for further creative enhancement, and
						promptly transform <br /> them into stunning images.
					</Description>
					<div className="md:flex hidden items-start flex-col md:flex-row lg:flex-col mt-5 gap-2">
						{benefits.map((benefit, index) => (
							<div
								key={index}
								className={`flex items-start lg:items-center lg:flex-row flex-col gap-3 cursor-pointer hover:bg-neutral-800 px-5 py-6 rounded-lg border border-transparent hover:border hover:border-zinc-700 transition-all ${
									active === benefit.id
										? "border-neutral-700 border bg-zinc-800"
										: ""
								}`}
								onClick={() => {
									setActive(benefit.id);
								}}>
								{benefit.icon}
								<div className="flex flex-col items-start gap-1">
									<h3 className="text-md font-medium text-zinc-300">
										{benefit.title}
									</h3>
									<p className="text-md text-zinc-400 font-light max-w-md">
										{benefit.description}
									</p>
								</div>
							</div>
						))}
					</div>
					<div className="md:hidden flex items-start flex-col md:flex-row lg:flex-col mt-5 gap-2">
						{benefits.map((benefit, index) => (
							<div
								key={index}
								className={`flex items-start lg:items-center lg:flex-row flex-col gap-3 px-5 py-6 rounded-lg border border-transparent transition-all`}
								onClick={() => {
									setActive(benefit.id);
								}}>
								{benefit.icon}
								<div className="flex flex-col items-start gap-1">
									<h3 className="text-md font-medium text-zinc-300">
										{benefit.title}
									</h3>
									<p className="text-md text-zinc-400 font-light max-w-md">
										{benefit.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
				{active === 1 && (
					<motion.div
						className="h-[65vh] w-full bg-gradient-to-br from-zinc-700 via-neutral-900 to-zinc-900 rounded-lg flex-1"
						initial="hidden"
						animate="show"
						viewport={{ once: false }}
						variants={FADE_UP_ANIMATION}></motion.div>
				)}
				{active === 2 && (
					<motion.div
						className="h-[65vh] w-full bg-gradient-to-br from-zinc-700 via-neutral-900 to-zinc-900 rounded-lg flex-1"
						initial="hidden"
						animate="show"
						viewport={{ once: false }}
						variants={FADE_UP_ANIMATION}></motion.div>
				)}
				{active === 3 && (
					<motion.div
						className="h-[65vh] w-full bg-gradient-to-br from-zinc-700 via-neutral-900 to-zinc-900 rounded-lg flex-1"
						initial="hidden"
						animate="show"
						viewport={{ once: false }}
						variants={FADE_UP_ANIMATION}></motion.div>
				)}
			</div>
		</div>
	);
};

export default Benefits;

const benefits = [
	{
		id: 1,
		title: "Design to code",
		description:
			"Design to code is a workflow that allows you to go from a design to a live product.",
		icon: <SymbolIcon className="w-5 h-5 text-zinc-400" />,
	},
	{
		id: 2,
		title: "Automated code reviews",
		description:
			"Design to code is a workflow that allows you to go from a design to a live product.",
		icon: <CubeIcon className="w-5 h-5 text-zinc-400" />,
	},
	{
		id: 3,
		title: "Shared component library",
		description:
			"Design to code is a workflow that allows you to go from a design to a live product.",
		icon: <LightningBoltIcon className="w-5 h-5 text-zinc-400" />,
	},
];
