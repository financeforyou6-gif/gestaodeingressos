
export interface Sale {
  id: string;
  conta: string;
  setor: string;
  custoSetor: number;
  custoPlano: number;
  valorVenda: number;
  lucro: number;
  nomePix: string;
  facial: 'ENVIADO' | 'PENDENTE';
  contato: string;
  pagamento: string;
  data: string;
}

export interface SectorStats {
  setor: string;
  lucro: number;
  vendas: number;
}

export interface ClientStats {
  nome: string;
  totalGasto: number;
  compras: number;
}
