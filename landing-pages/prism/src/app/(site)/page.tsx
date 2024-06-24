"use client";

import Footer from "@/components/layout/Footer";
import Menu from "@/components/layout/Menu";
import Benefits from "@/components/sections/Benefits";
import CTA from "@/components/sections/CTA";
import Features from "@/components/sections/Features";
import Hero from "@/components/sections/Hero";
import Pricing from "@/components/sections/Pricing";
import Testimonials from "@/components/sections/Testimonials";
import WhatWeOffer from "@/components/sections/WhatWeOffer";
import { Inter_Tight } from "next/font/google";

const font = Inter_Tight({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
});

export default function Home() {
	return (
		<main
			className={`${font.className} flex flex-col items-center justify-center gap-10`}>
			<div className="md:min-h-screen flex flex-col items-center justify-start gap-24 relative">
				<Menu />
				<Hero />
			</div>
			<Features />
			<WhatWeOffer />
			<Benefits />
			<Pricing />
			<Testimonials />
			<CTA />
			<Footer />
		</main>
	);
}
