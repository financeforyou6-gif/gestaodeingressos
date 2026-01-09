
import React from 'react';
import { Sale } from '../types';

interface SalesTableProps {
  sales: Sale[];
}

const SalesTable: React.FC<SalesTableProps> = ({ sales }) => {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-[#222]">
          {[
            'CONTA', 'SETOR', 'CUSTO SETOR', 'CUSTO PLANO', 
            'VALOR VENDA', 'LUCRO', 'NOME (PIX)', 'FACIAL', 
            'CONTATO', 'PAGAMENTO', 'DATA'
          ].map(header => (
            <th key={header} className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-[#0f0f0f]">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#1a1a1a]">
        {sales.map((sale) => (
          <tr key={sale.id} className="hover:bg-white/[0.02] transition-colors">
            <td className="px-6 py-5 text-xs font-bold text-gray-100 whitespace-nowrap">{sale.conta || '-'}</td>
            <td className="px-6 py-5 text-xs font-extrabold text-gray-200 whitespace-nowrap tracking-tight">{sale.setor}</td>
            <td className="px-6 py-5 text-xs font-bold text-gray-100 whitespace-nowrap">R$ {sale.custoSetor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            <td className="px-6 py-5 text-xs font-bold text-gray-100 whitespace-nowrap">R$ {sale.custoPlano.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            <td className="px-6 py-5 text-xs font-bold text-gray-100 whitespace-nowrap leading-tight">
              R$ <br /> {sale.valorVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </td>
            <td className="px-6 py-5 text-xs font-bold text-rose-600 whitespace-nowrap leading-tight">
              R$ <br /> {sale.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </td>
            <td className="px-6 py-5 text-xs font-bold text-gray-100 whitespace-nowrap">{sale.nomePix}</td>
            <td className="px-6 py-5 text-xs font-bold text-gray-100 whitespace-nowrap">
              <span className="px-2 py-0.5 rounded-md border border-[#333] text-[10px] uppercase font-bold text-gray-300">
                {sale.facial}
              </span>
            </td>
            <td className="px-6 py-5 text-xs font-bold text-gray-100 whitespace-nowrap tracking-tighter">{sale.contato}</td>
            <td className="px-6 py-5 text-xs font-bold text-gray-100 whitespace-nowrap">{sale.pagamento}</td>
            <td className="px-6 py-5 text-xs font-bold text-gray-100 whitespace-nowrap">{sale.data}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SalesTable;
