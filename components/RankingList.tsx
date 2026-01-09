
import React, { ReactNode } from 'react';
import { SectorStats } from '../types';

interface RankingListProps {
  title: string;
  data: SectorStats[];
  type: 'profit' | 'sales';
  icon: ReactNode;
}

const RankingList: React.FC<RankingListProps> = ({ title, data, type, icon }) => {
  const maxValue = Math.max(...data.map(d => type === 'profit' ? d.lucro : d.vendas));

  return (
    <div className="flex flex-col h-full">
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest mb-6 text-gray-100">
        <span className="text-rose-600">{icon}</span>
        {title}
      </h3>
      <div className="flex flex-col gap-5">
        {data.map((item, idx) => {
          const value = type === 'profit' ? item.lucro : item.lucro * 1.5; // Simulate higher sale value for the sales ranking example
          const label = type === 'profit' ? `R$ ${item.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : `R$ ${(item.vendas * 110).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
          
          return (
            <div key={item.setor} className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <div className="flex gap-3 items-center">
                  <div className="w-5 h-5 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-[10px] font-bold text-gray-400">
                    {idx + 1}
                  </div>
                  <span className="text-xs font-bold text-gray-200 tracking-wide uppercase">{item.setor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-100">{label}</span>
                  <span className="text-[10px] text-gray-500 lowercase">({item.vendas} vendas)</span>
                </div>
              </div>
              <div className="h-0.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-600" 
                  style={{ width: `${(type === 'profit' ? item.lucro / maxValue : item.vendas / maxValue) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RankingList;
