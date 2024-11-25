import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import UserAirlineRatio from '../../types/stats/UserAirlineRatio';

const AirlineUserChart = ({ data }: { data: UserAirlineRatio[] }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="4 5" />
                <XAxis dataKey="airline" />
                <YAxis allowDecimals={false}/>
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#001EB5" name="Users assigned" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default AirlineUserChart;
