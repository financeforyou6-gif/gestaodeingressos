
import React, { useState, useMemo, useEffect } from 'react';
import {
  Ticket,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Plus,
  Search,
  Calendar,
  BarChart3,
  Filter,
  RefreshCw,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { MOCK_SALES } from './data';
import { Sale, SectorStats, ClientStats } from './types';
import KPICard from './components/KPICard';
import SectorProfitChart from './components/SectorProfitChart';
import RankingList from './components/RankingList';
import SalesTable from './components/SalesTable';
import SaleForm from './components/SaleForm';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';

const App: React.FC = () => {
  // Estados
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtros
  const [selectedDate, setSelectedDate] = useState<string>('Todos os Jogos');
  const [selectedSetor, setSelectedSetor] = useState<string>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [selectedPagamento, setSelectedPagamento] = useState<string>('Todos');

  // Carregar dados
  const loadSales = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from('sales')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Função para converter data ISO para DD/MM/AA
        const formatDate = (dateStr: string): string => {
          if (!dateStr) return '';
          // Se já está no formato DD/MM/AA, retorna direto
          if (dateStr.includes('/')) return dateStr;
          // Converte de YYYY-MM-DD para DD/MM/AA
          const date = new Date(dateStr);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = String(date.getFullYear()).slice(-2);
          return `${day}/${month}/${year}`;
        };

        const formattedData: Sale[] = (data || []).map(item => ({
          id: item.id,
          conta: item.conta || '',
          setor: item.setor || '',
          custoSetor: parseFloat(item.custo_setor) || 0,
          custoPlano: parseFloat(item.custo_plano) || 0,
          valorVenda: parseFloat(item.valor_venda) || 0,
          lucro: parseFloat(item.lucro) || 0,
          nomePix: item.nome_pix || '',
          facial: (item.status === 'ENVIADO' ? 'ENVIADO' : 'PENDENTE') as 'ENVIADO' | 'PENDENTE',
          contato: item.contato || '',
          pagamento: item.pagamento || '',
          data: formatDate(item.data)
        }));

        setSales(formattedData);
      } else {
        // Supabase não configurado - mostra lista vazia
        console.warn('Supabase não configurado. Configure as variáveis de ambiente.');
        setSales([]);
      }
    } catch (error) {
      console.error('Error loading sales:', error);
      // Em caso de erro, mostra lista vazia em vez de dados mock
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  // Deletar venda
  const handleDeleteSale = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta venda?')) return;

    try {
      if (isSupabaseConfigured() && supabase) {
        await supabase.from('sales').delete().eq('id', id);
      }
      setSales(prev => prev.filter(sale => sale.id !== id));
    } catch (error) {
      console.error('Error deleting sale:', error);
    }
  };

  // Editar venda
  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setShowForm(true);
  };

  // Salvar venda
  const handleSaveSale = (sale: Sale) => {
    if (editingSale) {
      setSales(prev => prev.map(s => s.id === sale.id ? sale : s));
    } else {
      setSales(prev => [sale, ...prev]);
    }
    setEditingSale(null);
  };

  // Valores únicos para filtros
  const availableDates = useMemo(() => {
    const dates = ['Todos os Jogos', ...new Set(sales.map(s => s.data))];
    return dates;
  }, [sales]);

  const availableSetores = useMemo(() => {
    const setores = ['Todos', ...new Set(sales.map(s => s.setor))];
    return setores;
  }, [sales]);

  const availablePagamentos = useMemo(() => {
    const pagamentos = ['Todos', ...new Set(sales.map(s => s.pagamento).filter(Boolean))];
    return pagamentos;
  }, [sales]);

  // Filtrar vendas
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      // Filtro por data
      if (selectedDate !== 'Todos os Jogos' && sale.data !== selectedDate) return false;

      // Filtro por setor
      if (selectedSetor !== 'Todos' && sale.setor !== selectedSetor) return false;

      // Filtro por status
      if (selectedStatus !== 'Todos' && sale.facial !== selectedStatus) return false;

      // Filtro por pagamento
      if (selectedPagamento !== 'Todos' && sale.pagamento !== selectedPagamento) return false;

      // Filtro por busca
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          sale.nomePix.toLowerCase().includes(search) ||
          sale.conta.toLowerCase().includes(search) ||
          sale.contato.toLowerCase().includes(search) ||
          sale.setor.toLowerCase().includes(search)
        );
      }

      return true;
    });
  }, [sales, selectedDate, selectedSetor, selectedStatus, selectedPagamento, searchTerm]);

  // Calcular KPIs
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

  // Calcular rankings
  const rankings = useMemo(() => {
    const sectorMap: Record<string, SectorStats> = {};
    const clientMap: Record<string, ClientStats> = {};

    filteredSales.forEach(sale => {
      if (!sectorMap[sale.setor]) {
        sectorMap[sale.setor] = { setor: sale.setor, lucro: 0, vendas: 0 };
      }
      sectorMap[sale.setor].lucro += sale.lucro;
      sectorMap[sale.setor].vendas += 1;

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

  // Limpar filtros
  const clearFilters = () => {
    setSelectedDate('Todos os Jogos');
    setSelectedSetor('Todos');
    setSelectedStatus('Todos');
    setSelectedPagamento('Todos');
    setSearchTerm('');
  };

  const hasActiveFilters = selectedDate !== 'Todos os Jogos' || selectedSetor !== 'Todos' ||
    selectedStatus !== 'Todos' || selectedPagamento !== 'Todos' || searchTerm !== '';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="animate-spin text-rose-600" size={24} />
          <span className="text-gray-400">Carregando dados...</span>
        </div>
      </div>
    );
  }

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
            <p className="text-gray-500 text-sm">
              Dashboard de vendas e análise de performance
              {!isSupabaseConfigured() && (
                <span className="text-amber-500 ml-2">(Modo Demo)</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadSales}
            className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] hover:bg-[#252525] px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300"
          >
            <RefreshCw size={16} />
            Atualizar
          </button>
          <button
            onClick={() => {
              setEditingSale(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white shadow-lg shadow-rose-600/20"
          >
            <Plus size={16} />
            Nova Venda
          </button>
        </div>
      </header>

      {/* Filtros */}
      <section className="bg-[#111111] p-4 rounded-xl border border-[#222]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-rose-600 font-semibold text-xs uppercase tracking-widest">
            <Filter size={14} />
            Filtros
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <X size={12} />
              Limpar filtros
            </button>
          )}
        </div>

        {/* Linha de Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Filtro por Data/Jogo */}
          <div>
            <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <Calendar size={12} />
              Jogo/Data
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-rose-600"
            >
              {availableDates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Setor */}
          <div>
            <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <MapPin size={12} />
              Setor
            </label>
            <select
              value={selectedSetor}
              onChange={(e) => setSelectedSetor(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-rose-600"
            >
              {availableSetores.map(setor => (
                <option key={setor} value={setor}>{setor}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Status */}
          <div>
            <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <CheckCircle size={12} />
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-rose-600"
            >
              <option value="Todos">Todos</option>
              <option value="ENVIADO">Enviado</option>
              <option value="PENDENTE">Pendente</option>
            </select>
          </div>

          {/* Filtro por Pagamento */}
          <div>
            <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <CreditCard size={12} />
              Pagamento
            </label>
            <select
              value={selectedPagamento}
              onChange={(e) => setSelectedPagamento(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-rose-600"
            >
              {availablePagamentos.map(pag => (
                <option key={pag} value={pag}>{pag}</option>
              ))}
            </select>
          </div>

          {/* Busca */}
          <div>
            <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <Search size={12} />
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nome, CPF, contato..."
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-rose-600"
            />
          </div>
        </div>

        {/* Resumo dos filtros */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-[#222] flex items-center gap-2 text-xs text-gray-500">
            <span>Exibindo {filteredSales.length} de {sales.length} vendas</span>
          </div>
        )}
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
            {rankings.topClients.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum cliente recorrente encontrado</p>
            ) : (
              rankings.topClients.map((client, idx) => (
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
              ))
            )}
          </div>
        </div>
      </section>

      {/* Sales Table */}
      <section className="bg-[#111111] rounded-xl border border-[#222] overflow-hidden">
        <div className="p-6 border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-rose-600"><BarChart3 size={20} /></div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Tabela de Vendas</h3>
            <span className="text-xs text-gray-500">({filteredSales.length} registros)</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <SalesTable
            sales={filteredSales}
            onEdit={handleEditSale}
            onDelete={handleDeleteSale}
          />
        </div>
      </section>

      <footer className="mt-auto py-8 text-center text-gray-600 text-xs flex items-center justify-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured() ? 'bg-green-500' : 'bg-amber-500'}`}></div>
        Sistema Operacional • 2025 • Gestão de Ingressos v1.0
        {!isSupabaseConfigured() && ' (Demo)'}
      </footer>

      {/* Modal do Formulário */}
      {showForm && (
        <SaleForm
          onClose={() => {
            setShowForm(false);
            setEditingSale(null);
          }}
          onSave={handleSaveSale}
          editingSale={editingSale}
        />
      )}
    </div>
  );
};

export default App;
