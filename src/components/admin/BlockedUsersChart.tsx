import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#ff0000', '#36a2eb'];

const BlockedUsersChart = ({ data }: any) => {
    const chartData = [
        { name: 'Blocked Users', value: data[0] },
        { name: 'Active Users', value: data[1] - data[0] },
    ];

    return (
        <PieChart width={400} height={300} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
            >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
};

export default BlockedUsersChart;
