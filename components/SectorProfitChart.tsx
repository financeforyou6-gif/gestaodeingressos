
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { SectorStats } from '../types';

interface SectorProfitChartProps {
  data: SectorStats[];
}

const SectorProfitChart: React.FC<SectorProfitChartProps> = ({ data }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#222" />
          <XAxis 
            type="number" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#444', fontSize: 10 }}
            tickFormatter={(val) => `R$${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
          />
          <YAxis 
            dataKey="setor" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#666', fontSize: 9, fontWeight: 700 }}
            width={100}
          />
          <Tooltip 
            cursor={{ fill: '#1a1a1a' }}
            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
            itemStyle={{ color: '#e11d48', fontWeight: 'bold' }}
            formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
          />
          <Bar 
            dataKey="lucro" 
            fill="#e11d48" 
            radius={[0, 4, 4, 0]} 
            barSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SectorProfitChart;
