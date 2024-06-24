import {
	FramerLogoIcon,
	GitHubLogoIcon,
	InstagramLogoIcon,
	TwitterLogoIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

const SocialLinks = () => {
	return (
		<div className="flex items-center gap-4">
			{links.map((link, index) => (
				<Link
					href={link.url}
					key={index}
					className="text-white/60 hover:text-white/100"
				>
					{link.icon}
				</Link>
			))}
		</div>
	);
};

export default SocialLinks;

const links = [
	{
		icon: <TwitterLogoIcon />,
		url: "#",
	},
	{
		icon: <InstagramLogoIcon />,
		url: "#",
	},
	{
		icon: <GitHubLogoIcon />,
		url: "#",
	},
	{
		icon: <FramerLogoIcon />,
		url: "#",
	},
];
