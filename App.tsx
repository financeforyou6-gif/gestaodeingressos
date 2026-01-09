
import React, { useState, useMemo } from 'react';
import { 
  Ticket, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Edit3,
  Search,
  ChevronDown,
  Calendar,
  Filter,
  BarChart3,
  LayoutDashboard
} from 'lucide-react';
import { MOCK_SALES } from './data';
import { Sale, SectorStats, ClientStats } from './types';
import KPICard from './components/KPICard';
import SectorProfitChart from './components/SectorProfitChart';
import RankingList from './components/RankingList';
import SalesTable from './components/SalesTable';

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('Todos os Jogos');
  const availableDates = ['Todos os Jogos', '02/11/25', '04/11/25', '05/11/25', '06/11/25'];

  const filteredSales = useMemo(() => {
    if (selectedDate === 'Todos os Jogos') return MOCK_SALES;
    return MOCK_SALES.filter(sale => sale.data === selectedDate);
  }, [selectedDate]);

  const kpis = useMemo(() => {
    const totalLucro = filteredSales.reduce((acc, curr) => acc + curr.lucro, 0);
    const totalCusto = filteredSales.reduce((acc, curr) => acc + curr.custoSetor + curr.custoPlano, 0);
    const ingressosVendidos = filteredSales.length;
    const uniqueClients = new Set(filteredSales.map(s => s.nomePix)).size;
    const ticketMedio = ingressosVendidos > 0 ? (filteredSales.reduce((acc, curr) => acc + curr.valorVenda, 0) / ingressosVendidos) : 0;

    return {
      lucro: totalLucro,
      custo: totalCusto,
      ingressos: ingressosVendidos,
      clientes: uniqueClients,
      ticketMedio: ticketMedio
    };
  }, [filteredSales]);

  const rankings = useMemo(() => {
    const sectorMap: Record<string, SectorStats> = {};
    const clientMap: Record<string, ClientStats> = {};

    filteredSales.forEach(sale => {
      // Sector logic
      if (!sectorMap[sale.setor]) {
        sectorMap[sale.setor] = { setor: sale.setor, lucro: 0, vendas: 0 };
      }
      sectorMap[sale.setor].lucro += sale.lucro;
      sectorMap[sale.setor].vendas += 1;

      // Client logic
      if (!clientMap[sale.nomePix]) {
        clientMap[sale.nomePix] = { nome: sale.nomePix, totalGasto: 0, compras: 0 };
      }
      clientMap[sale.nomePix].totalGasto += sale.valorVenda;
      clientMap[sale.nomePix].compras += 1;
    });

    const rankingLucro = Object.values(sectorMap).sort((a, b) => b.lucro - a.lucro);
    const rankingVendas = Object.values(sectorMap).sort((a, b) => b.vendas - a.vendas);
    const topClients = Object.values(clientMap)
      .filter(c => c.compras > 1)
      .sort((a, b) => b.totalGasto - a.totalGasto)
      .slice(0, 5);

    return { rankingLucro, rankingVendas, topClients };
  }, [filteredSales]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 flex flex-col gap-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#1a1a1a] border border-[#333] rounded-xl flex items-center justify-center text-rose-600 shadow-lg shadow-rose-900/10">
            <Ticket size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight uppercase">Gestão de Ingressos</h1>
            <p className="text-gray-500 text-sm">Dashboard de vendas e análise de performance</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] hover:bg-[#252525] px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300">
          <Edit3 size={16} />
          Editar Dados
        </button>
      </header>

      {/* Date Filter */}
      <section className="bg-[#111111] p-4 rounded-xl border border-[#222]">
        <div className="flex items-center gap-2 mb-4 text-rose-600 font-semibold text-xs uppercase tracking-widest">
          <Calendar size={14} />
          Filtrar por Jogo
        </div>
        <div className="flex flex-wrap gap-2">
          {availableDates.map(date => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedDate === date 
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' 
                  : 'bg-[#1a1a1a] text-gray-400 border border-[#222] hover:border-[#444]'
              }`}
            >
              {date}
            </button>
          ))}
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard 
          title="Lucro Total" 
          value={`R$ ${kpis.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={<TrendingUp className="text-rose-600" size={20} />}
          isHighlighted
        />
        <KPICard 
          title="Custo Total" 
          value={`R$ ${kpis.custo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={<DollarSign className="text-gray-400" size={20} />}
        />
        <KPICard 
          title="Ingressos Vendidos" 
          value={kpis.ingressos.toString()} 
          icon={<Ticket className="text-gray-400" size={20} />}
        />
        <KPICard 
          title="Clientes" 
          value={kpis.clientes.toString()} 
          icon={<Users className="text-gray-400" size={20} />}
        />
        <KPICard 
          title="Ticket Médio" 
          value={`R$ ${kpis.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={<Target className="text-gray-400" size={20} />}
        />
      </section>

      {/* Charts & Rankings Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111111] p-6 rounded-xl border border-[#222]">
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-8 text-gray-400">Lucro por Setor</h3>
          <SectorProfitChart data={rankings.rankingLucro} />
        </div>
        
        <div className="bg-[#111111] p-6 rounded-xl border border-[#222] flex flex-col gap-6">
          <RankingList 
            title="Ranking por Lucro" 
            data={rankings.rankingLucro} 
            type="profit" 
            icon={<TrendingUp size={16} />}
          />
        </div>
      </section>

      {/* Bottom Rankings Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="bg-[#111111] p-6 rounded-xl border border-[#222]">
          <RankingList 
            title="Ranking por Lucro" 
            data={rankings.rankingLucro} 
            type="profit" 
            icon={<TrendingUp size={16} />}
          />
        </div>
        <div className="bg-[#111111] p-6 rounded-xl border border-[#222]">
          <RankingList 
            title="Ranking por Vendas" 
            data={rankings.rankingVendas} 
            type="sales" 
            icon={<span className="text-rose-600 font-bold">#</span>}
          />
        </div>
        <div className="bg-[#111111] p-6 rounded-xl border border-[#222]">
           <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest mb-2 text-gray-100">
            <Users className="text-rose-600" size={16} />
            Top 5 Clientes Recorrentes
          </h3>
          <p className="text-xs text-gray-500 mb-6">Clientes fiéis com mais de uma compra</p>
          <div className="flex flex-col gap-5">
            {rankings.topClients.map((client, idx) => (
              <div key={client.nome} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <div className="flex gap-3 items-center">
                    <span className="text-rose-600 font-bold italic text-sm">{idx + 1}º</span>
                    <span className="text-sm font-semibold text-gray-200">{client.nome}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-rose-600">R$ {client.totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span className="text-[10px] text-gray-500 uppercase">({client.compras} compras)</span>
                  </div>
                </div>
                <div className="h-0.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-rose-600" 
                    style={{ width: `${(client.totalGasto / rankings.topClients[0].totalGasto) * 100}%` }}
                   />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sales Table */}
      <section className="bg-[#111111] rounded-xl border border-[#222] overflow-hidden">
        <div className="p-6 border-b border-[#222] flex items-center justify-between">
           <div className="flex items-center gap-3">
            <div className="text-rose-600"><BarChart3 size={20} /></div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Tabela de Vendas</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              type="text" 
              placeholder="Pesquisar venda..." 
              className="bg-[#1a1a1a] border border-[#333] rounded-lg pl-9 pr-4 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-rose-600 transition-colors w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <SalesTable sales={filteredSales} />
        </div>
      </section>
      
      <footer className="mt-auto py-8 text-center text-gray-600 text-xs flex items-center justify-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
        Sistema Operacional • 2025 • Gestão de Ingressos v1.0
      </footer>
    </div>
  );
};

export default App;
