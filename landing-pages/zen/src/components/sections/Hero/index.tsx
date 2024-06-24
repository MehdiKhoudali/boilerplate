import { BackgroundCellCore } from "@/components/common/BackgroundRipple";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
	return (
		<div className="w-full min-h-screen flex items-center justify-start flex-col overflow-hidden relative z-50">
			<Navbar />
			<div className="absolute bottom-0 left-0 right-0 top-0 bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_20%,transparent_80%)] opacity-50">
				<BackgroundCellCore />
			</div>
			<div className="flex flex-col items-center justify-center gap-12 text-center w-full mt-[50px] sm:mt-[110px] z-50 px-3 h-[70vh] md:h-fit">
				<div className="flex items-center flex-col justify-center w-full md:gap-0 gap-6">
					<h1 className="font-semibold bg-clip-text text-transparent bg-gradient-to-b from-white to-[#7E808F] capitalize min-h-[50px] lg:h-20 md:text-6xl text-4xl">
						A CRM dashboard for engineering teams
					</h1>
					<p className="text-sm text-white/70 font-light leading-normal md:text-lg">
						Manage your team, projects, tasks, and clients in one place with our
						CRM dashboard. <br className="hidden md:block" /> Keep track of
						everything and increase your
						{"team's"} productivity.
					</p>
					<div className="flex items-center justify-center gap-4 md:mt-6">
						<Button size="sm">Get a demo</Button>
						<Link href="/#pricing">
							<Button variant="outline" size="sm">
								View Pricing
							</Button>
						</Link>
					</div>
				</div>
				<div className="w-[90%] md:w-[70%] h-fit rounded-2xl bg-primary/80 relative overflow-hidden p-1 flex items-center justify-center">
					<Image
						src="/images/dashboard.png"
						height={100}
						width={800}
						objectFit="cover"
						objectPosition="center"
						className="w-full h-full rounded-2xl object-cover object-top"
						alt="dashboard"
					/>
				</div>
			</div>
		</div>
	);
};

export default Hero;
