import React, { useState, useEffect } from 'react';
import {
    Save,
    X,
    Calculator,
    User,
    Phone,
    CreditCard,
    Calendar,
    MapPin,
    DollarSign,
    FileText,
    CheckCircle,
    Clock,
    Plus,
    Trash2,
    Edit2
} from 'lucide-react';
import { Sale } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface SaleFormProps {
    onClose: () => void;
    onSave: (sale: Sale) => void;
    editingSale?: Sale | null;
}

const SETORES = [
    'SETOR PRETO',
    'SETOR VERMELHO',
    'VERMELHO SUPERIOR',
    'SETOR MARROM',
    'SETOR LARANJA',
    'SETOR AMARELO',
    'SETOR VERDE',
    'SETOR AZUL'
];

const PAGAMENTOS = [
    'Nubank',
    'Infinite',
    'Itaú',
    'Bradesco',
    'Santander',
    'Caixa',
    'Banco do Brasil',
    'Inter',
    'C6 Bank',
    'PicPay',
    'Mercado Pago',
    'Outro'
];

const SaleForm: React.FC<SaleFormProps> = ({ onClose, onSave, editingSale }) => {
    const [formData, setFormData] = useState<Partial<Sale>>({
        conta: '',
        setor: 'SETOR PRETO',
        custoSetor: 0,
        custoPlano: 0,
        valorVenda: 0,
        lucro: 0,
        nomePix: '',
        facial: 'PENDENTE',
        contato: '',
        pagamento: 'Nubank',
        data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingSale) {
            setFormData(editingSale);
        }
    }, [editingSale]);

    // Calcular lucro automaticamente
    useEffect(() => {
        const valorVenda = formData.valorVenda || 0;
        const custoSetor = formData.custoSetor || 0;
        const custoPlano = formData.custoPlano || 0;
        const lucro = valorVenda - custoSetor - custoPlano;

        setFormData(prev => ({ ...prev, lucro }));
    }, [formData.valorVenda, formData.custoSetor, formData.custoPlano]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const saleData: Sale = {
                id: editingSale?.id || crypto.randomUUID(),
                conta: formData.conta || '',
                setor: formData.setor || 'SETOR PRETO',
                custoSetor: formData.custoSetor || 0,
                custoPlano: formData.custoPlano || 0,
                valorVenda: formData.valorVenda || 0,
                lucro: formData.lucro || 0,
                nomePix: formData.nomePix || '',
                facial: formData.facial as 'ENVIADO' | 'PENDENTE',
                contato: formData.contato || '',
                pagamento: formData.pagamento || '',
                data: formData.data || ''
            };

            if (isSupabaseConfigured() && supabase) {
                const dbData = {
                    id: saleData.id,
                    conta: saleData.conta,
                    setor: saleData.setor,
                    custo_setor: saleData.custoSetor,
                    custo_plano: saleData.custoPlano,
                    valor_venda: saleData.valorVenda,
                    lucro: saleData.lucro,
                    nome_pix: saleData.nomePix,
                    status: saleData.facial,
                    contato: saleData.contato,
                    pagamento: saleData.pagamento,
                    data: saleData.data
                };

                if (editingSale) {
                    await supabase.from('sales').update(dbData).eq('id', saleData.id);
                } else {
                    await supabase.from('sales').insert([dbData]);
                }
            }

            onSave(saleData);
            onClose();
        } catch (error) {
            console.error('Error saving sale:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all";
    const labelClass = "flex items-center gap-2 text-sm font-medium text-gray-400 mb-2";

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111111] border border-[#222] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-[#111111] border-b border-[#222] p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {editingSale ? 'Editar Venda' : 'Nova Venda'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Preencha os dados do ingresso vendido
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#222] rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Dados do Cliente */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-rose-600 uppercase tracking-wider">
                            Dados do Cliente
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>
                                    <User size={14} />
                                    Nome (PIX)
                                </label>
                                <input
                                    type="text"
                                    name="nomePix"
                                    value={formData.nomePix}
                                    onChange={handleChange}
                                    placeholder="Nome do cliente"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    <Phone size={14} />
                                    Contato
                                </label>
                                <input
                                    type="text"
                                    name="contato"
                                    value={formData.contato}
                                    onChange={handleChange}
                                    placeholder="+55 11 99999-9999"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>
                                <FileText size={14} />
                                Conta / CPF
                            </label>
                            <input
                                type="text"
                                name="conta"
                                value={formData.conta}
                                onChange={handleChange}
                                placeholder="CPF ou identificador da conta"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Dados do Ingresso */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-rose-600 uppercase tracking-wider">
                            Dados do Ingresso
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>
                                    <MapPin size={14} />
                                    Setor
                                </label>
                                <select
                                    name="setor"
                                    value={formData.setor}
                                    onChange={handleChange}
                                    className={inputClass}
                                    required
                                >
                                    {SETORES.map(setor => (
                                        <option key={setor} value={setor}>{setor}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    <Calendar size={14} />
                                    Data
                                </label>
                                <input
                                    type="text"
                                    name="data"
                                    value={formData.data}
                                    onChange={handleChange}
                                    placeholder="DD/MM/AA"
                                    className={inputClass}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dados Financeiros */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-rose-600 uppercase tracking-wider">
                            Dados Financeiros
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className={labelClass}>
                                    <DollarSign size={14} />
                                    Custo Setor
                                </label>
                                <input
                                    type="number"
                                    name="custoSetor"
                                    value={formData.custoSetor}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    <DollarSign size={14} />
                                    Custo Plano
                                </label>
                                <input
                                    type="number"
                                    name="custoPlano"
                                    value={formData.custoPlano}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    <DollarSign size={14} />
                                    Valor Venda
                                </label>
                                <input
                                    type="number"
                                    name="valorVenda"
                                    value={formData.valorVenda}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    <Calculator size={14} />
                                    Lucro
                                </label>
                                <input
                                    type="number"
                                    name="lucro"
                                    value={formData.lucro}
                                    readOnly
                                    className={`${inputClass} bg-[#0a0a0a] ${formData.lucro && formData.lucro >= 0 ? 'text-green-500' : 'text-red-500'}`}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>
                                    <CreditCard size={14} />
                                    Pagamento
                                </label>
                                <select
                                    name="pagamento"
                                    value={formData.pagamento}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    {PAGAMENTOS.map(pag => (
                                        <option key={pag} value={pag}>{pag}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    {formData.facial === 'ENVIADO' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                    Status
                                </label>
                                <select
                                    name="facial"
                                    value={formData.facial}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option value="PENDENTE">PENDENTE</option>
                                    <option value="ENVIADO">ENVIADO</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-4 pt-4 border-t border-[#222]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-[#333] text-gray-400 rounded-lg font-medium hover:bg-[#1a1a1a] transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {isSubmitting ? 'Salvando...' : (editingSale ? 'Atualizar' : 'Salvar Venda')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SaleForm;
