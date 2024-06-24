import Gradient from "@/components/common/Gradient";
import { cn } from "@/utils";

const FeatureCard = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div
			className={cn(
				"w-full min-h-fit md:min-h-[500px] rounded-lg border border-slate-400/20 relative overflow-hidden flex md:items-center items-start justify-center gap-6 md:justify-between p-3 sm:p-8 md:p-16 md:flex-row flex-col",
				className
			)}
		>
			<Gradient />

			{children}
		</div>
	);
};

export default FeatureCard;
