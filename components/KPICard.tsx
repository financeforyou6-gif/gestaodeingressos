
import React, { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string;
  icon: ReactNode;
  isHighlighted?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, isHighlighted }) => {
  return (
    <div className={`bg-[#111111] p-5 rounded-xl border border-[#222] flex flex-col justify-between h-32 relative overflow-hidden group transition-all hover:border-[#333]`}>
      <div className="flex justify-between items-start">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">{title}</h3>
        <div className="bg-[#1a1a1a] p-2 rounded-lg border border-[#222] group-hover:bg-[#222] transition-colors">
          {icon}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className={`text-xl font-bold tracking-tight ${isHighlighted ? 'text-rose-600' : 'text-gray-100'}`}>
          {value}
        </span>
        {isHighlighted && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/5 blur-[40px] rounded-full -mr-16 -mt-16 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default KPICard;
