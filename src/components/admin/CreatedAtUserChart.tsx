import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import CreatedAtUser from '../../types/stats/CreatedAtUser';
import dayjs from 'dayjs';

const CreatedAtUserChart = ({ data }: { data: CreatedAtUser[] }) => {
    
    const formattedData = data.map((item) => ({
        createdAt: dayjs(item.createdat).format('DD.MM.YYYY'),
        count: item.count
    }));

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="createdAt" height={80} tickMargin={12}/>
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line dataKey="count" stroke="#001EB5" fill="#001EB5" name="New users" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default CreatedAtUserChart;
