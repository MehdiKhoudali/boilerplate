import Title from "@/components/typography/Title";
import Image from "next/image";
import Marquee from "react-fast-marquee";

const Testimonials = () => {
	return (
		<div className="flex flex-col items-center justify-center gap-4 w-full py-16 bg-zinc-900 text-white">
			<div className="flex flex-col items-center justify-center gap-3 mb-16">
				<Title>
					We are trusted by{" "}
					<span className="text-primary-500 italic">1000+</span> companies
				</Title>
			</div>
			<Marquee
				direction="right"
				autoFill
				pauseOnHover
				gradient
				gradientWidth="300px"
				gradientColor="#1f1f1f">
				<div className="flex flex-col items-start justify-between gap-4 border rounded-md p-4 bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-800 w-[400px] h-[200px] mx-2">
					<div className="flex items-center gap-3">
						{/* image */}
						<div className="h-[40px] w-[40px] rounded-full bg-zinc-700 relative overflow-hidden">
							<Image
								src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=3280&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
								fill
								alt="name"
							/>
						</div>
						<div className="flex flex-col items-start">
							{/* name */}
							<p className="text-md font-semibold">John Doe</p>
							{/* company */}
							<p className="text-xs font-light text-zinc-400">@salmandotweb</p>
						</div>
					</div>

					<p className="text-sm text-zinc-400">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
						quos, voluptatum voluptatibus, voluptates, quia quod voluptate
						officiis nemo libero quibusdam doloribus. Quisquam quos, voluptatum
						voluptatibus, voluptates, quia quod voluptate officiis nemo libero
						quibusdam doloribus.
					</p>
				</div>
			</Marquee>
			<Marquee
				direction="left"
				autoFill
				pauseOnHover
				gradient
				gradientWidth="300px"
				gradientColor="#1f1f1f">
				<div className="flex flex-col items-start justify-between gap-4 border rounded-md p-4 bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-800 w-[400px] h-[200px] mx-2">
					<div className="flex items-center gap-3">
						{/* image */}
						<div className="h-[40px] w-[40px] rounded-full bg-zinc-700 relative overflow-hidden">
							<Image
								src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=3280&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
								fill
								alt="name"
							/>
						</div>
						<div className="flex flex-col items-start">
							{/* name */}
							<p className="text-md font-semibold">John Doe</p>
							{/* company */}
							<p className="text-xs font-light text-zinc-400">@salmandotweb</p>
						</div>
					</div>

					<p className="text-sm text-zinc-400">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
						quos, voluptatum voluptatibus, voluptates, quia quod voluptate
						officiis nemo libero quibusdam doloribus. Quisquam quos, voluptatum
						voluptatibus, voluptates, quia quod voluptate officiis nemo libero
						quibusdam doloribus.
					</p>
				</div>
			</Marquee>
		</div>
	);
};

export default Testimonials;
