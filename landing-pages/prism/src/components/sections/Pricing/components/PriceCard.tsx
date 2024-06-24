import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";

interface Plan {
	currency: string;
	name: string;
	price: number;
	description: string;
	planType: string;
	recommended: boolean;
	features: string[];
}

interface PriceCardProps {
	plan: Plan;
}

const PriceCard = ({ plan }: PriceCardProps) => {
	return (
		<div
			className={`flex flex-col items-start justify-start p-6 rounded-lg ${
				plan.recommended
					? "bg-zinc-800 text-white"
					: " bg-slate-50 text-zinc-800 border border-zinc-200"
			} w-[95%] sm:w-[350px] gap-1`}>
			<h3 className="text-lg font-medium">{plan.name}</h3>
			<h2 className="text-4xl font-semibold">
				<span className="text-[16px] font-medium">{plan.currency}</span>
				{plan.price}
				<span className="text-[14px] font-normal text-zinc-400">
					/{plan.planType}
				</span>
			</h2>
			<h3 className="text-md font-light text-zinc-400">{plan.description}</h3>

			<div className="flex items-start gap-3 flex-col mt-4">
				<p className="text-md font-normal">Includes:</p>
				{plan.features.map((feature, index) => (
					<div className="flex items-center gap-2 w-full" key={index}>
						<CheckIcon className="w-5 h-5 text-green-500" />
						<p className="text-sm font-normal">{feature}</p>
					</div>
				))}
			</div>

			<Button
				className={`w-full mt-6 ${
					plan.recommended ? "bg-white text-zinc-900 hover:bg-slate-200" : ""
				}`}>
				Get started
			</Button>
		</div>
	);
};

export default PriceCard;
