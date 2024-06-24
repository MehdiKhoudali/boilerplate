import Link from "next/link";
import links from "./links.json";
import SocialLinks from "./socialLinks";

const Footer = () => {
	return (
		<div className="flex items-start justify-start gap-8 w-full h-[100%] overflow-y-auto relative overflow-x-hidden">
			<div className="flex flex-col items-start justify-start w-full p-5 sm:p-10 m-auto max-w-full lg:max-w-7xl gap-8">
				<div className="flex items-start justify-between w-full h-full gap-12 lg:gap-28 lg:flex-row flex-col">
					<h1 className="text-2xl font-bold">Zen.</h1>
					<div className="flex items-start justify-between w-full h-full gap-8 flex-wrap">
						{links.map((link, index) => (
							<div className="flex flex-col items-start gap-4" key={index}>
								<h3 className="text-lg font-bold">{link.title}</h3>
								<ul className="flex flex-col items-start gap-3">
									{link.links.map((link, index) => (
										<Link
											href={link.url}
											key={index}
											className="hover:underline"
										>
											<li className="text-sm font-medium text-white/80">
												{link.label}
											</li>
										</Link>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
				<div className="w-full h-[.5px] bg-slate-400/50"></div>
				<div className="w-full flex items-center justify-between gap-4 md:flex-row flex-col">
					<div className="flex items-center gap-4">
						<p className="text-sm font-light text-white/60">© 2023</p>
						<Link href="/terms" className="hover:underline">
							<p className="text-sm font-light text-white/60">Terms</p>
						</Link>
						<Link href="/privacy" className="hover:underline">
							<p className="text-sm font-light text-white/60">Privacy</p>
						</Link>
					</div>
					<SocialLinks />
				</div>
			</div>
		</div>
	);
};

export default Footer;
