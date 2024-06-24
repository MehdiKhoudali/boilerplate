import { features } from "./features";

const Features: React.FC = () => {
	return (
		<div className="flex flex-col items-start gap-12 w-full">
			<div className="flex items-start lg:items-center justify-between w-full lg:flex-row flex-col gap-2">
				<h1 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-white to-[#7E808F] capitalize min-h-20">
					Powerful features to help you <br className="hidden md:block" />{" "}
					manage your leads
				</h1>
				<p className="text-sm text-white/70 font-light leading-normal sm:text-md">
					We provide all the tools you need to manage your <br /> leads
					efficiently and effectively.
				</p>
			</div>
			<div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-5 w-full">
				{features.map((feature, index) => (
					<div
						key={index}
						className="px-6 py-8 border border-slate-400/10 rounded-sm h-fit bg-secondary/10 flex flex-col items-start justify-center gap-2"
					>
						<div className="flex items-center justify-center rounded-full h-8 w-8 bg-primary mb-2">
							{feature.icon}
						</div>
						<h1 className="text-xl font-semibold">{feature.title}</h1>
						<p className="text-sm text-white/70 font-light leading-normal sm:text-md">
							{feature.description}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default Features;
