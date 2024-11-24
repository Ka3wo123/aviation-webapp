import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import CreatedAtUser from '../../types/stats/CreatedAtUser';
import dayjs from 'dayjs';

const CreatedAtUserChart = ({ data }: { data: CreatedAtUser[] }) => {
    
    const formattedData = data.map((item) => ({
        createdAt: dayjs(item.createdat).format('YYYY-MM-DD'),
        count: item.count
    }));

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="4 5" />
                <XAxis dataKey="createdAt" tick={{ textAnchor: 'end' }} height={80} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line dataKey="count" stroke="#001EB5" fill="#001EB5" name="New users" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default CreatedAtUserChart;
