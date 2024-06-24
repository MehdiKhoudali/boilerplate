"use client";

import {
	Card,
	Metric,
	Text,
	AreaChart,
	BadgeDelta,
	Flex,
	Grid,
} from "@tremor/react";

const data = [
	{
		Month: "Jan 21",
		Sales: 2890,
		Profit: 2400,
		Customers: 4938,
	},
	{
		Month: "Feb 21",
		Sales: 1890,
		Profit: 1398,
		Customers: 2938,
	},
	{
		Month: "Jul 21",
		Sales: 3490,
		Profit: 4300,
		Customers: 2345,
	},
];

const categories = [
	{
		title: "Sales",
		metric: "$ 12,699",
		metricPrev: "$ 9,456",
		delta: "34.3%",
		deltaType: "moderateIncrease",
	},
	{
		title: "Profit",
		metric: "$ 12,348",
		metricPrev: "$ 10,456",
		delta: "18.1%",
		deltaType: "moderateIncrease",
	},
	{
		title: "Customers",
		metric: "948",
		metricPrev: "1,082",
		delta: "12.3%",
		deltaType: "moderateDecrease",
	},
];

const valueFormatter = (number: number) =>
	`$${Intl.NumberFormat("us").format(number).toString()}`;

const DashboardStats = () => {
	return (
		<Grid numItemsSm={2} numItemsLg={3} className="gap-6 w-full">
			{categories.map((item) => (
				<Card key={item.title}>
					<Flex alignItems="start">
						<Text>{item.title}</Text>
						<BadgeDelta deltaType={item.deltaType}>{item.delta}</BadgeDelta>
					</Flex>
					<Flex
						className="space-x-3 truncate"
						justifyContent="start"
						alignItems="baseline"
					>
						<Metric>{item.metric}</Metric>
						<Text>from {item.metricPrev}</Text>
					</Flex>
					<AreaChart
						className="mt-6 h-12"
						data={data}
						index="Month"
						valueFormatter={valueFormatter}
						categories={[item.title]}
						colors={["blue"]}
						showXAxis={true}
						showGridLines={false}
						startEndOnly={true}
						showYAxis={false}
						showLegend={false}
					/>
				</Card>
			))}
		</Grid>
	);
};

export default DashboardStats;
