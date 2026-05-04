import React from 'react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DashboardRecord } from '../../types';
import { COLORS } from '../../constants';
import './BarChart.css';

interface BarChartProps {
  data: DashboardRecord[];
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const chartData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(p => {
      const label = p.primaryTumor.replace(/_/g, ' ').toUpperCase();
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [data]);

  return (
    <div className="bar-chart-container text-left">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ReBarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fontSize: 9, fill: '#64748b', fontWeight: '700' }} 
              width={120}
              textAnchor="end"
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ fontSize: '11px', borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
              ))}
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
