import { cn } from "@/utils";
import { FC } from "react";

interface indexProps {
	children: React.ReactNode;
	className?: string;
}

const Description: FC<indexProps> = ({ children, className }) => {
	return (
		<h1
			className={cn(
				"text-[13px] text-center font-normal md:text-[18px] text-zinc-500",
				className
			)}>
			{children}
		</h1>
	);
};

export default Description;
