import Description from "@/components/typography/Description";
import Title from "@/components/typography/Title";
import { Button } from "@/components/ui/button";

const CTA = () => {
	return (
		<div className="flex flex-col items-center justify-center gap-8 w-full py-10">
			<div className="flex flex-col items-center justify-center gap-3">
				<Title>
					Embark on your <span className="italic">adventure</span> now
				</Title>
				<Description>
					Commence crafting real-time design experiences at no cost. Enhance
					your <br /> capabilities and work collaboratively.
				</Description>
			</div>
			<div className="flex items-center justify-center gap-4">
				<Button>Request Demo</Button>
				<Button variant="outline">Try for free</Button>
			</div>
		</div>
	);
};

export default CTA;
