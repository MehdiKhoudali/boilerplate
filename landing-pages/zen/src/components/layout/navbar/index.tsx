import { Button } from "@/components/ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useState } from "react";

type link = {
	label: string;
	href: string;
};

const links: link[] = [
	{
		label: "Home",
		href: "/",
	},
	{
		label: "About",
		href: "/#about",
	},
	{
		label: "Pricing",
		href: "/#pricing",
	},
	{
		label: "Trusted By",
		href: "/#testimonials",
	},
];

const Navbar = () => {
	const [toggle, setToggle] = useState(false);
	return (
		<nav className="flex items-center justify-between py-3 px-16 w-full z-50">
			<div className="flex items-center justify-start">
				<a href="/" className="font-bold text-2xl">
					Zen.
				</a>
			</div>
			<div className="items-center justify-end sm:flex hidden">
				{links.map((link) => (
					<a
						key={link.label}
						href={link.href}
						className="text-sm font-normal text-gray-400 hover:text-gray-200 ml-8"
					>
						{link.label}
					</a>
				))}
			</div>
			<Button size="sm" className="hidden sm:flex">
				Get a demo
			</Button>
			<div className="sm:hidden flex flex-1 justify-end items-center">
				<HamburgerMenuIcon onClick={() => setToggle(!toggle)} />

				<div
					className={`${
						!toggle ? "hidden" : "flex"
					} p-6 bg-slate-700 absolute top-[60px] right-[40px] mx-4 my-2 min-w-[180px] rounded-lg sidebar`}
				>
					<ul className="list-none flex justify-end items-start flex-1 flex-col">
						{links.map((nav, index) => (
							<li
								key={nav.label}
								className={`font-poppins font-medium cursor-pointer text-[16px]
									"text-dimWhite"
								 ${index === links.length - 1 ? "mb-0" : "mb-4"}`}
							>
								<a href={nav.href}>{nav.label}</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
