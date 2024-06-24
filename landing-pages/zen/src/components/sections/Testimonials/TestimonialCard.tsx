interface TestimonialCardProps {
	testimonial: {
		user: {
			name: string;
			title: string;
		};
		quote: string;
	};
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
	return (
		<div className="px-4 py-6 border border-slate-400/10 rounded-sm h-fit bg-secondary/10 flex flex-col items-start justify-center gap-4">
			<div className="flex items-center gap-3">
				<div className="h-12 w-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-700 via-orange-300 to-rose-800 rounded-full"></div>
				<div className="flex flex-col items-start">
					<h1 className="text-base font-medium">{testimonial.user.name}</h1>
					<p className="text-sm font-light text-white/80">
						{testimonial.user.title}
					</p>
				</div>
			</div>
			<p className="text-sm font-light text-white/70">{testimonial.quote}</p>
		</div>
	);
};

export default TestimonialCard;
