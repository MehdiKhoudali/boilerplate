import TestimonialCard from "./TestimonialCard";
import { testimonials } from "./testimonials";

const Testimonials = () => {
	return (
		<div className="flex flex-col items-start gap-16 w-full">
			<div className="flex items-center justify-center w-full flex-col gap-2 md:gap-4">
				<h1 className="md:text-4xl text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-white to-[#7E808F] capitalize pb-1 text-center">
					What our customers are saying
				</h1>
				<p className="text-base font-light text-white/80 text-center">
					We are the first company to offer end to end encrypted messaging{" "}
					<br className="hidden md:block" /> app with a focus on security and
					privacy.
				</p>
			</div>
			<div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-5 w-full">
				{testimonials.map((testimonial, index) => (
					<TestimonialCard key={index} testimonial={testimonial} />
				))}
			</div>
		</div>
	);
};

export default Testimonials;
