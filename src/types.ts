/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RiskLevel = 'ELEVADO' | 'MÉDIO' | 'BAIXO';

export type InmateStatus = 
  | 'INTERNADO' 
  | 'CELA' 
  | 'TRANSFERIDO' 
  | 'EM_AUDIENCIA' 
  | 'HOSPITALIZADO' 
  | 'LIBERTADO';

export interface InmateCell {
  estabelecimento: string;
  pavilhao: string;
  bloco: string;
  cela: string;
}

export interface Inmate {
  id: string;
  rnr: string; // Registo Nacional de Recluso: e.g. RNR-AO-2026-XXXXX
  nome: string;
  dataNascimento: string;
  filiacaoPai: string;
  filiacaoMae: string;
  biometriaStatus: 'CAPTURADA' | 'PENDENTE';
  crime: string;
  estadoJuridico: 'PROVISÓRIO / DETIDO' | 'CONDENADO' | 'PRISÃO PREVENTIVA';
  fotoUrl: string;
  nivelRisco: RiskLevel;
  status: InmateStatus;
  cela: InmateCell;
  dataAdmissao: string;
  qrCodeSeguro: string; // Base64 or digital identifier
  historicoMovimentacoes: Array<{
    data: string;
    origem: string;
    destino: string;
    motivo: string;
    autorizador: string;
  }>;
}

export interface WeaponItem {
  id: string;
  registroSigae: string; // SIGAE-AO reference code
  tipo: 'FUSIL_AKM' | 'PISTOLA_MAKAROV' | 'COLETE_TACTICO' | 'RADIO_COMM';
  marca: string;
  modelo: string;
  numeroSerie: string;
  estado: 'DISPONÍVEL' | 'EM_SERVIÇO' | 'MANUTENÇÃO';
  agenteAtribuido?: string;
  dataAtribuicao?: string;
  municoesCalibre?: string;
  municoesQuantidade?: number;
}

export interface VisitRecord {
  id: string;
  visitanteNome: string;
  visitanteDocumento: string;
  reclusoRnr: string;
  parentesco: string;
  dataAgendada: string;
  biometriaStatus: 'VERIFICADO' | 'AGUARDANDO';
  status: 'SOLICITADO' | 'APROVADO' | 'CONCLUÍDO' | 'RECUSADO';
}

export interface HealthRecord {
  reclusoRnr: string;
  reclusoNome: string;
  estadoSaude: string;
  medicacaoPrescrita: string;
  historicoConsultas: Array<{
    data: string;
    especialidade: string;
    diagnostico: string;
    medico: string;
  }>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  operador: string;
  funcao: string;
  acao: string;
  reclusoId?: string;
  reclusoNome?: string;
  detalhes: string;
  territoriosVisiveis: string; // e.g., "DIREÇÃO GERAL", "PROVÍNCIA HUAMBO"
}

export interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  section: 'Problema' | 'Solução' | 'Demonstração' | 'Impacto Nacional' | 'Roadmap' | 'Institucional';
}
