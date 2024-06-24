import { Button } from "@/components/ui/button";
import FeatureCard from "./FeatureCard";

const ExtendedFeatures: React.FC = () => {
	return (
		<div className="flex flex-col items-start gap-12 w-full">
			<div className="flex items-center justify-center w-full flex-col gap-2">
				<h1 className="md:text-5xl text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-white to-[#7E808F] capitalize pb-1 text-center">
					Essential app that work for you <br className="hidden md:block" /> and
					your customers
				</h1>
			</div>
			<div className="flex flex-col gap-6 w-full">
				<FeatureCard>
					<div className="flex flex-col items-start gap-4 w-full md:w-1/2 z-50">
						<h1 className="text-xl md:text-2xl font-medium">
							End to end encrypted <br className="hidden md:block" /> messaging
							app
						</h1>
						<p className="text-base font-normal text-white/80">
							We are the first company to offer end to end encrypted{" "}
							<br className="hidden md:block" /> messaging app with a focus on
							security and privacy.
						</p>
						<Button size="sm">Learn More</Button>
					</div>

					<div className="w-full md:w-1/2 rounded-md h-[300px] bg-secondary/30 border border-white/10"></div>
				</FeatureCard>
				<div className="flex items-start w-full gap-6 md:flex-row flex-col">
					<FeatureCard className="md:w-[40%] w-full md:flex-col items-start gap-4 md:p-8">
						<div className="w-full h-[280px] md:h-[300px] rounded-md bg-secondary/30 border border-white/10"></div>
						<div className="flex flex-col items-start gap-2">
							<h1 className="text-xl font-medium">Mobile Applications</h1>
							<p className="text-base font-light text-white/80">
								We are the first company to offer end to end encrypted messaging
								app with a focus on security and privacy.
							</p>
						</div>
					</FeatureCard>
					<FeatureCard className="md:w-[60%] flex-col md:flex-col items-start gap-4 md:p-8">
						<div className="flex flex-col items-start w-full justify-start gap-2">
							<h1 className="text-xl font-medium">
								Upload, share and collaborate
							</h1>
							<p className="text-base font-light text-white/80">
								We are the first company to offer end to end encrypted messaging{" "}
								<br />
								app with a focus on security and privacy.
							</p>
						</div>
						<div className="w-full h-[300px] rounded-md bg-secondary/30 border border-white/10"></div>
					</FeatureCard>
				</div>
			</div>

			<div className="flex items-center justify-center gap-4 w-full">
				<Button size="sm">Get Started</Button>
				<Button variant="outline" size="sm">
					Learn More
				</Button>
			</div>
		</div>
	);
};

export default ExtendedFeatures;
