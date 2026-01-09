
import React from 'react';
import { Sale } from '../types';
import { Edit2, Trash2 } from 'lucide-react';

interface SalesTableProps {
  sales: Sale[];
  onEdit?: (sale: Sale) => void;
  onDelete?: (id: string) => void;
}

const SalesTable: React.FC<SalesTableProps> = ({ sales, onEdit, onDelete }) => {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-[#222]">
          {[
            'CONTA', 'SETOR', 'CUSTO SETOR', 'CUSTO PLANO',
            'VALOR VENDA', 'LUCRO', 'NOME (PIX)', 'STATUS',
            'CONTATO', 'PAGAMENTO', 'DATA', 'AÇÕES'
          ].map(header => (
            <th key={header} className="px-4 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-[#0f0f0f]">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#1a1a1a]">
        {sales.length === 0 ? (
          <tr>
            <td colSpan={12} className="px-6 py-12 text-center text-gray-500">
              Nenhuma venda encontrada
            </td>
          </tr>
        ) : (
          sales.map((sale) => (
            <tr key={sale.id} className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-4 py-4 text-xs font-medium text-gray-100 whitespace-nowrap max-w-[150px] truncate" title={sale.conta}>
                {sale.conta || '-'}
              </td>
              <td className="px-4 py-4 text-xs font-bold text-gray-200 whitespace-nowrap tracking-tight">
                <span className="px-2 py-1 rounded bg-[#1a1a1a] border border-[#333]">
                  {sale.setor}
                </span>
              </td>
              <td className="px-4 py-4 text-xs font-medium text-gray-300 whitespace-nowrap">
                R$ {sale.custoSetor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-4 text-xs font-medium text-gray-300 whitespace-nowrap">
                R$ {sale.custoPlano.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-4 text-xs font-medium text-gray-100 whitespace-nowrap">
                R$ {sale.valorVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-4 text-xs font-bold whitespace-nowrap">
                <span className={sale.lucro >= 0 ? 'text-green-500' : 'text-red-500'}>
                  R$ {sale.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </td>
              <td className="px-4 py-4 text-xs font-medium text-gray-100 whitespace-nowrap">
                {sale.nomePix}
              </td>
              <td className="px-4 py-4 text-xs whitespace-nowrap">
                <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold ${sale.facial === 'ENVIADO'
                    ? 'bg-green-500/10 text-green-500 border border-green-500/30'
                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                  }`}>
                  {sale.facial}
                </span>
              </td>
              <td className="px-4 py-4 text-xs font-medium text-gray-300 whitespace-nowrap tracking-tight">
                {sale.contato || '-'}
              </td>
              <td className="px-4 py-4 text-xs font-medium text-gray-300 whitespace-nowrap">
                {sale.pagamento || '-'}
              </td>
              <td className="px-4 py-4 text-xs font-medium text-gray-300 whitespace-nowrap">
                {sale.data}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(sale)}
                      className="p-1.5 rounded-lg hover:bg-[#222] text-gray-400 hover:text-blue-400 transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={14} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(sale.id)}
                      className="p-1.5 rounded-lg hover:bg-[#222] text-gray-400 hover:text-red-400 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default SalesTable;
