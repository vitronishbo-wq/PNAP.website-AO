/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Inmate, WeaponItem, VisitRecord, HealthRecord, AuditLog, SlideData } from './types';

// ============================================================================
// FONTE DE VERDADE: DPA 2024 (21 Províncias)
// ============================================================================
export const PROVINCE_CODES = {
  "Cabinda": "CAB",
  "Zaire": "ZAI",
  "Uíge": "UIG",
  "Bengo": "BGO",
  "Icolo e Bengo": "ICB",  // Nova
  "Luanda": "LUA",
  "Cuanza-Norte": "CNO",
  "Cuanza-Sul": "CSU",
  "Malanje": "MAL",
  "Lunda-Norte": "LNO",
  "Lunda-Sul": "LSU",
  "Benguela": "BGU",
  "Huambo": "HUA",
  "Bié": "BIE",
  "Moxico": "MOX",
  "Moxico Leste": "MXL",   // Nova
  "Huíla": "HUI",
  "Namibe": "NAM",
  "Cunene": "CNN",
  "Cubango": "CCU",        // Renomeada
  "Cuando": "CND"          // Nova
} as const;

export const INITIAL_INMATES: Inmate[] = [
  {
    id: 'AO-2026-000125',
    rnr: 'RNR-AO-2026-000125',
    nome: 'Mateus Calunga Katumbela',
    dataNascimento: '1988-04-12',
    filiacaoPai: 'Fernando Katumbela',
    filiacaoMae: 'Adélia Calunga Katumbela',
    biometriaStatus: 'CAPTURADA',
    crime: 'Furto Qualificado e Posse de Bens Roubados',
    estadoJuridico: 'CONDENADO',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    nivelRisco: 'MÉDIO',
    status: 'CELA',
    cela: {
      estabelecimento: 'Estabelecimento Prisional da Comarca do Huambo',
      pavilhao: 'Pavilhão Principal (B)',
      bloco: 'Bloco de Segurança Média 2',
      cela: 'Cela 104'
    },
    dataAdmissao: '2025-11-20',
    qrCodeSeguro: 'PNAP-AO-SECURE-RNR-AO-2026-000125-SIGNED',
    historicoMovimentacoes: [
      {
        data: '2025-11-20',
        origem: 'Célula de Detenção Inicial (SIC Huambo)',
        destino: 'Pavilhão Principal (B) - Cela 104',
        motivo: 'Execução de Mandado de Culpa e Prisão Secundária',
        autorizador: 'Juiz de Garantias Dr. Jacinto Kassoma'
      },
      {
        data: '2026-02-15',
        origem: 'Cela 104',
        destino: 'Hospital Provincial de Huambo',
        motivo: 'Urgência Médica - Apendicite Crítica',
        autorizador: 'Dr. Afonso Ngola (Médico Chefe)'
      },
      {
        data: '2026-02-22',
        origem: 'Hospital Provincial de Huambo',
        destino: 'Cela 104',
        motivo: 'Alta Médica e Reingresso',
        autorizador: 'Director Geral Adjunto de Saúde'
      }
    ]
  },
  {
    id: 'AO-2026-000188',
    rnr: 'RNR-AO-2026-000188',
    nome: 'Anastácio Bento Cassiano',
    dataNascimento: '1995-09-24',
    filiacaoPai: 'Bento Cassiano',
    filiacaoMae: 'Esperança Kassanga Cassiano',
    biometriaStatus: 'CAPTURADA',
    crime: 'Associação Criminosa e Contrabando',
    estadoJuridico: 'PRISÃO PREVENTIVA',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
    nivelRisco: 'ELEVADO',
    status: 'CELA',
    cela: {
      estabelecimento: 'Estabelecimento Prisional de Alta Segurança de Viana (Luanda)',
      pavilhao: 'Pavilhão de Alta Segurança Alpha (A)',
      bloco: 'Supermax Bloco 1',
      cela: 'Cela 12'
    },
    dataAdmissao: '2026-01-08',
    qrCodeSeguro: 'PNAP-AO-SECURE-RNR-AO-2026-000188-SIGNED',
    historicoMovimentacoes: [
      {
        data: '2026-01-08',
        origem: 'Direção Nacional de Investigação Penal (SIC Luanda)',
        destino: 'Pavilhão de Alta Segurança Alpha - Cela 12',
        motivo: 'Entrada sob Prisão Preventiva',
        autorizador: 'Subprocurador da República Dr. José de Castro'
      }
    ]
  },
  {
    id: 'AO-2026-000304',
    rnr: 'RNR-AO-2026-000304',
    nome: 'Manuel Domingos Ginga',
    dataNascimento: '1979-11-02',
    filiacaoPai: 'Domingos Ginga',
    filiacaoMae: 'Teresa Samba Ginga',
    biometriaStatus: 'CAPTURADA',
    crime: 'Fuga de Divisa e Especulação Recorrente',
    estadoJuridico: 'PROVISÓRIO / DETIDO',
    fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
    nivelRisco: 'BAIXO',
    status: 'LIBERTADO',
    cela: {
      estabelecimento: 'Estabelecimento Prisional Comarca de Luanda',
      pavilhao: 'Pavilhão de Regime Aberto (D)',
      bloco: 'Bloco de Transição',
      cela: 'Cela 04'
    },
    dataAdmissao: '2026-03-10',
    qrCodeSeguro: 'PNAP-AO-SECURE-RNR-AO-2026-000304-SIGNED',
    historicoMovimentacoes: [
      {
        data: '2026-03-10',
        origem: 'SME Fronteira - Detenção Inicial',
        destino: 'Pavilhão de Regime Aberto (D) - Cela 04',
        motivo: 'Detenção para averiguações cambiais',
        autorizador: 'Sub-Inspector SME Luanda'
      },
      {
        data: '2026-05-18',
        origem: 'Cela 04',
        destino: 'Liberdade Monitorizada',
        motivo: 'Sustação preventiva decretada por Habeas Corpus',
        autorizador: 'Juiz Conselheiro Tribunal da Relação'
      }
    ]
  },
  {
    id: 'AO-2026-000412',
    rnr: 'RNR-AO-2026-000412',
    nome: 'Francisco Xavier Mucaba',
    dataNascimento: '1992-06-30',
    filiacaoPai: 'Sebastião Xavier Mucaba',
    filiacaoMae: 'Maria Joana Mucaba',
    biometriaStatus: 'PENDENTE',
    crime: 'Tráfico de Estupefacientes Transfronteiriço',
    estadoJuridico: 'PRISÃO PREVENTIVA',
    fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200',
    nivelRisco: 'ELEVADO',
    status: 'EM_AUDIENCIA',
    cela: {
      estabelecimento: 'Estabelecimento Prisional do Caboxa (Bengo)',
      pavilhao: 'Pavilhão Especial (C)',
      bloco: 'Bloco Especial 1',
      cela: 'Cela A-03'
    },
    dataAdmissao: '2026-04-05',
    qrCodeSeguro: 'PNAP-AO-SECURE-RNR-AO-2026-000412-SIGNED',
    historicoMovimentacoes: [
      {
        data: '2026-04-05',
        origem: 'SIC Bengo - Posto Fronteiriço',
        destino: 'Estabelecimento Prisional Caboxa - Cela A-03',
        motivo: 'Detenção em flagrante com medidas de coacção máxima',
        autorizador: 'Procuradora Provincial Dra. Elvira Lemos'
      },
      {
        data: '2026-06-14',
        origem: 'Cela A-03',
        destino: 'Tribunal Provincial do Bengo',
        motivo: 'Audiência de Julgamento Inicial',
        autorizador: 'Chefe de Escolta Comissário Agostinho Banza'
      }
    ]
  }
];

export const INITIAL_WEAPONS: WeaponItem[] = [
  {
    id: 'W-001',
    registroSigae: 'SIGAE-AO-AKM-2026-0549',
    tipo: 'FUSIL_AKM',
    marca: 'Kalashnikov',
    modelo: 'AKM-74 II (Modernizado)',
    numeroSerie: 'AK-4782049-AO',
    estado: 'DISPONÍVEL',
    municoesCalibre: '7.62x39mm',
    municoesQuantidade: 120
  },
  {
    id: 'W-002',
    registroSigae: 'SIGAE-AO-AKM-2026-0550',
    tipo: 'FUSIL_AKM',
    marca: 'Kalashnikov',
    modelo: 'AKM-74 II (Modernizado)',
    numeroSerie: 'AK-4782050-AO',
    estado: 'EM_SERVIÇO',
    agenteAtribuido: 'Sub-Inspector Mateus Banza',
    dataAtribuicao: '2026-06-14 06:15:00',
    municoesCalibre: '7.62x39mm',
    municoesQuantidade: 120
  },
  {
    id: 'W-003',
    registroSigae: 'SIGAE-AO-MAK-2026-1102',
    tipo: 'PISTOLA_MAKAROV',
    marca: 'Makarov',
    modelo: 'PM-9mm Tactical',
    numeroSerie: 'MK-99120-AO',
    estado: 'EM_SERVIÇO',
    agenteAtribuido: 'Comissário Penitenciário João Ndala',
    dataAtribuicao: '2026-06-14 07:45:00',
    municoesCalibre: '9x18mm PM',
    municoesQuantidade: 24
  },
  {
    id: 'W-004',
    registroSigae: 'SIGAE-AO-MAK-2026-1103',
    tipo: 'PISTOLA_MAKAROV',
    marca: 'Makarov',
    modelo: 'PM-9mm Standard',
    numeroSerie: 'MK-99125-AO',
    estado: 'DISPONÍVEL',
    municoesCalibre: '9x18mm PM',
    municoesQuantidade: 16
  },
  {
    id: 'W-005',
    registroSigae: 'SIGAE-AO-COL-2026-0014',
    tipo: 'COLETE_TACTICO',
    marca: 'ArmorTech Angola',
    modelo: 'Tactical V - Nível III-A',
    numeroSerie: 'COL-III-889',
    estado: 'EM_SERVIÇO',
    agenteAtribuido: 'Sub-Inspector Mateus Banza',
    dataAtribuicao: '2026-06-14 06:15:00'
  }
];

export const INITIAL_VISITS: VisitRecord[] = [
  {
    id: 'VIS-001',
    visitanteNome: 'Hélia Gaspar Katumbela',
    visitanteDocumento: 'BI08892410LA045',
    reclusoRnr: 'RNR-AO-2026-000125',
    parentesco: 'Esposa',
    dataAgendada: '2026-06-15 10:00',
    biometriaStatus: 'VERIFICADO',
    status: 'APROVADO'
  },
  {
    id: 'VIS-002',
    visitanteNome: 'Sebastião Cassiano Bento',
    visitanteDocumento: 'BI01124490HU019',
    reclusoRnr: 'RNR-AO-2026-000188',
    parentesco: 'Irmão',
    dataAgendada: '2026-06-14 14:30',
    biometriaStatus: 'VERIFICADO',
    status: 'CONCLUÍDO'
  },
  {
    id: 'VIS-003',
    visitanteNome: 'Manuel Ginga Júnior',
    visitanteDocumento: 'BI09419200LA001',
    reclusoRnr: 'RNR-AO-2026-000304',
    parentesco: 'Filho',
    dataAgendada: '2026-06-18 09:00',
    biometriaStatus: 'AGUARDANDO',
    status: 'SOLICITADO'
  }
];

export const INITIAL_HEALTH: HealthRecord[] = [
  {
    reclusoRnr: 'RNR-AO-2026-000125',
    reclusoNome: 'Mateus Calunga Katumbela',
    estadoSaude: 'ESTÁVEL (Recuperado de Apendicectomia)',
    medicacaoPrescrita: 'Amoxicilina 500mg (Interrompida), Paracetamol 500mg SOS',
    historicoConsultas: [
      {
        data: '2026-02-15 03:00',
        especialidade: 'Clínica Geral (Emergência)',
        diagnostico: 'Grave abdómen agudo (Apendicite aguda obstrutiva)',
        medico: 'Dr. Afonso Ngola'
      },
      {
        data: '2026-03-01 11:00',
        especialidade: 'Cirurgia Geral - Avaliação pós-operatória',
        diagnostico: 'Cicatrização óptima, suturas retiradas sem infecção',
        medico: 'Dra. Isabel Kalandula'
      }
    ]
  },
  {
    reclusoRnr: 'RNR-AO-2026-000188',
    reclusoNome: 'Anastácio Bento Cassiano',
    estadoSaude: 'HIPERTENSO (Em Monitorização Activa)',
    medicacaoPrescrita: 'Enalapril 20mg (diário de manhã)',
    historicoConsultas: [
      {
        data: '2026-01-10 09:00',
        especialidade: 'Medicina Interna - Admissão',
        diagnostico: 'Registado com Hipertensão de Grau II. Tratado farmacologicamente',
        medico: 'Dr. Manuel Mandume'
      },
      {
        data: '2026-05-12 14:00',
        especialidade: 'Psicologia Penitenciária',
        diagnostico: 'Níveis elevados de stress e isolamento inicial. Recomendada psicoterapia continuada',
        medico: 'Dra. Elsa Cassinda'
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-06-14 08:12:05',
    operador: 'Mateus Banza Banza',
    funcao: 'Operador Geral de Custódia',
    acao: 'TRANSFERÊNCIA INTERNA',
    reclusoId: 'AO-2026-000125',
    reclusoNome: 'Mateus Calunga Katumbela',
    detalhes: 'Transferido temporariamente do Pavilhão B (Cela 104) para a Unidade de Psicologia para consulta técnica de rotina.',
    territoriosVisiveis: 'HUAMBO • COMARCA PRINCIPAL'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-06-14 07:45:12',
    operador: 'Comissário João Ndala',
    funcao: 'Director Provincial do Huambo',
    acao: 'AUDITORIA DE CADASTRO',
    reclusoId: 'AO-2026-000188',
    reclusoNome: 'Anastácio Bento Cassiano',
    detalhes: 'Consulta autorizada de prontuário sob segredo de justiça proveniente do SIC Nacional.',
    territoriosVisiveis: 'HUAMBO • COMARCA PRINCIPAL'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-06-14 06:15:00',
    operador: 'Superintendente Adjunto José Samba',
    funcao: 'Responsável Técnico de Armaria DGSP',
    acao: 'ATRIBUIÇÃO DE ARMAMENTO SIGAE',
    detalhes: 'Atribuição de 1 AKM série AK-4782050-AO e 1 Colete Táctico COL-III-889 para escolta especial de alta segurança.',
    territoriosVisiveis: 'DGSP • DIREÇÃO GERAL'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-06-14 05:30:18',
    operador: 'Dra. Elsa Cassinda',
    funcao: 'Psicóloga Especializada de Viana',
    acao: 'REGISTO AVALIAÇÃO SAÚDE MENTAL',
    reclusoId: 'AO-2026-000188',
    reclusoNome: 'Anastácio Bento Cassiano',
    detalhes: 'Sessão concluída. Paciente apresenta reacções estáveis ao isolamento defensivo regulamentar.',
    territoriosVisiveis: 'LUANDA • VIANA ALTA SEGURANÇA'
  }
];

export const SLIDES_LIST: SlideData[] = [
  { id: 1, title: 'PNAP-AO', subtitle: 'Página Inicial', section: 'Institucional' },
  { id: 2, title: 'O Desafio Nacional', subtitle: 'Registos em Papel e Falta de Rastreabilidade', section: 'Problema' },
  { id: 3, title: 'Visão Estratégica', subtitle: 'A Centralização Tecnológica do MININT', section: 'Solução' },
  { id: 4, title: 'Arquitetura Territorial de Resoluções', subtitle: 'Níveis de Relações de Saneamento Escalonado', section: 'Solução' },
  { id: 5, title: 'Recluso Digital Unificado', subtitle: 'A Ficha Eletrónica com RNR e QR Seguro', section: 'Demonstração' },
  { id: 6, title: 'Segurança e Controlo Territorial', subtitle: 'A Proteção e Isolamento Cruzado de Dados', section: 'Solução' },
  { id: 7, title: 'Motor Geral de Movimentação', subtitle: 'A Rastreabilidade Total Sem Margem para Erro', section: 'Demonstração' },
  { id: 8, title: 'Gestão Inteligente de Visitas', subtitle: 'Autenticação Biométrica e Enquadramento', section: 'Demonstração' },
  { id: 9, title: 'Saúde Penitenciária Integrada', subtitle: 'Registos Clínicos e Intervenção Rápida', section: 'Demonstração' },
  { id: 10, title: 'Gestão de Armaria Integrada', subtitle: 'Conexão Nativa SIGAE-AO', section: 'Demonstração' },
  { id: 11, title: 'Dashboard de Comando Nacional', subtitle: 'Visualização Analítica do Sistema Prisional', section: 'Demonstração' },
  { id: 12, title: 'Auditoria em Tempo Real', subtitle: 'Logs de Evento Inadulteráveis', section: 'Demonstração' },
  { id: 13, title: 'Operação Crítica Offline', subtitle: 'Resiliência contra Falhas de Conectividade', section: 'Impacto Nacional' },
  { id: 14, title: 'Interconexões Institucionais', subtitle: 'Ecossistema Digital de Defesa e Justiça', section: 'Impacto Nacional' },
  { id: 15, title: 'Resultados e Comparação Directa', subtitle: 'Antes vs Depois no MININT', section: 'Impacto Nacional' },
  { id: 16, title: 'Plano de Implementação (Roadmap)', subtitle: 'Faseamento de Acção Imediata', section: 'Roadmap' },
  { id: 17, title: 'Apresentação Comercial & Soberania', subtitle: 'Fase de Testes e Implementação Nacional', section: 'Institucional' }
];
