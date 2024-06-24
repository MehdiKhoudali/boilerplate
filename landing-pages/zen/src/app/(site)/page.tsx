"use client";

import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/CTA";
import ExtendedFeatures from "@/components/sections/ExtendedFeatures";
import Features from "@/components/sections/Features";
import Header from "@/components/sections/Hero";
import Testimonials from "@/components/sections/Testimonials";

export default function Home() {
	return (
		<main>
			<Header />
			<div className="flex items-center w-full justify-start flex-col gap-24 md:gap-32 md:max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] mx-auto px-6 my-40">
				<Features />
				<ExtendedFeatures />
				<Testimonials />
				<CTA />
			</div>
			<Footer />
		</main>
	);
}
