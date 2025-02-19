import Sidebar from "@/src/components/layout/Sidebar";

const LandingLayout = async ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="flex items-start h-screen w-full">
			<div className="h-full w-[250px]">
				<Sidebar />
			</div>
			<div className="h-full w-[100%] overflow-hidden">
				{children}
			</div>
		</main>
	);
};
export default LandingLayout;
