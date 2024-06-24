import Description from "@/components/typography/Description";
import Title from "@/components/typography/Title";

const Offers = [
	{
		title: "AI-powered",
	},
	{
		title: "SEO-friendly",
	},
	{
		title: "Mobile-friendly",
	},
	{
		title: "Easy to use",
	},
];

const WhatWeOffer = () => {
	return (
		<div className="flex flex-col items-center justify-center gap-10 w-full py-10 relative">
			<div className="flex flex-col items-center justify-center gap-3">
				<Title>
					Harness AI-driven <span className="italic">functionalities</span> and
					enhancements
				</Title>
				<Description>
					When {"you're"} prepared, simply click publish to transform your
					website sketches into tangible designs effortlessly.{" "}
					<br className="md:block hidden" /> No need for manual creation,
					specialized skills, or extensive adjustments.
				</Description>
			</div>

			<div className="grid auto-rows-[100%] md:auto-rows-[400px] grid-cols-1 md:grid-cols-3 gap-4 w-[95%] lg:w-[80%] mb-[600px] md:mb-[0px]">
				{Offers.map((_, i) => (
					<div
						key={i}
						className={`row-span-1 rounded-xl border-2 border-slate-400/10 bg-gradient-to-r from-neutral-700 to-neutral-900 p-4 relative flex items-center justify-center ${
							i === 2 || i === 1 ? "md:col-span-2 col-span-1" : ""
						}`}>
						<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-neutral-700 to-neutral-900 rounded-xl opacity-50" />
						<div className="flex flex-col items-center justify-center gap-4">
							<Title className="text-white">{_.title}</Title>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default WhatWeOffer;
