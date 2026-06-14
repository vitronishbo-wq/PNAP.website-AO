/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Inmate, WeaponItem, VisitRecord, HealthRecord, AuditLog } from '../types';
import { PROVINCE_CODES } from '../data';
import { OccupancyGauge, RegionalCapacityChart, StatusIndicatorBars } from './TacticalCharts';
import { AngolaD3Map } from './AngolaD3Map';
import { 
  Shield, Server, Users, Landmark, AlertCircle, FileText, Check, X, Eye, EyeOff,
  Clock, ArrowRight, Activity, Calendar, Heart, ShieldCheck, Database, Sliders,
  UserCheck, AlertTriangle, CloudRain, Wifi, WifiOff, Globe, Sparkles, Building2, UserX
} from 'lucide-react';

interface SlideContentProps {
  slideId: number;
  inmates: Inmate[];
  weapons: WeaponItem[];
  visits: VisitRecord[];
  health: HealthRecord[];
  auditLogs: AuditLog[];
  activeInmate: Inmate | null;
  onSelectInmate: (inmate: Inmate) => void;
  userRole: 'DG' | 'DIR_HUAMBO' | 'DIR_LUANDA';
  onSetUserRole: (role: 'DG' | 'DIR_HUAMBO' | 'DIR_LUANDA') => void;
  offlineStatus: boolean;
  onToggleOffline: () => void;
  onHandoverWeapon: (weaponId: string, officerName: string) => void;
  onReturnWeapon: (weaponId: string) => void;
  onVerifyVisit: (visitId: string, approved: boolean) => void;
}

export const PROVINCES_DPA_2024 = [
  { name: "Cabinda", code: "CAB", status: "Existente" },
  { name: "Zaire", code: "ZAI", status: "Existente" },
  { name: "Uíge", code: "UIG", status: "Existente" },
  { name: "Bengo", code: "BGO", status: "Existente" },
  { name: "Icolo e Bengo", code: "ICB", status: "Nova" },
  { name: "Luanda", code: "LUA", status: "Existente" },
  { name: "Cuanza-Norte", code: "CNO", status: "Existente" },
  { name: "Cuanza-Sul", code: "CSU", status: "Existente" },
  { name: "Malanje", code: "MAL", status: "Existente" },
  { name: "Lunda-Norte", code: "LNO", status: "Existente" },
  { name: "Lunda-Sul", code: "LSU", status: "Existente" },
  { name: "Benguela", code: "BGU", status: "Existente" },
  { name: "Huambo", code: "HUA", status: "Existente" },
  { name: "Bié", code: "BIE", status: "Existente" },
  { name: "Moxico", code: "MOX", status: "Existente" },
  { name: "Moxico Leste", code: "MXL", status: "Nova" },
  { name: "Huíla", code: "HUI", status: "Existente" },
  { name: "Namibe", code: "NAM", status: "Existente" },
  { name: "Cunene", code: "CNN", status: "Existente" },
  { name: "Cubango", code: "CCU", status: "Renomeada" },
  { name: "Cuando", code: "CND", status: "Nova" }
];

export default function SlideContent({
  slideId,
  inmates,
  weapons,
  visits,
  health,
  auditLogs,
  activeInmate,
  onSelectInmate,
  userRole,
  onSetUserRole,
  offlineStatus,
  onToggleOffline,
  onHandoverWeapon,
  onReturnWeapon,
  onVerifyVisit
}: SlideContentProps) {
  // Local state for some interactivity
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState<number>(0);
  const [drilldownLevel, setDrilldownLevel] = useState<'dg' | 'provincia' | 'estabelecimento' | 'pavilhao' | 'bloco' | 'cela'>('dg');
  const [officerNameInput, setOfficerNameInput] = useState('');
  const [selectedWeaponId, setSelectedWeaponId] = useState<string>('');
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [showPdfView, setShowPdfView] = useState(false);
  const [provinceSearch, setProvinceSearch] = useState('');
  const [selectedDashboardProvince, setSelectedDashboardProvince] = useState<string>('LUA');
  const [dashboardSubMode, setDashboardSubMode] = useState<'map' | 'grid'>('map');
  const [dashboardScope, setDashboardScope] = useState<'nacional' | 'selected'>('nacional');

  // Render slides dynamically
  switch (slideId) {
    case 1: // LANDING INSTITUCIONAL
      return (
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-4 relative">
          {/* Symmetrical grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1d22_1px,transparent_1px),linear-gradient(to_bottom,#1c1d22_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 select-none pointer-events-none" />

          <div className="z-10 max-w-2xl space-y-6 pt-10">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-amber-500/30 bg-[#16171d]/60 text-amber-500 font-mono text-xs uppercase tracking-widest font-semibold tactical-glow">
              <Shield className="h-4 w-4 animate-pulse text-amber-500" />
              SISTEMA SOBERANO NACIONAL • REPÚBLICA DE ANGOLA
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl font-display font-extrabold tracking-tight text-white m-0 leading-tight">
                PNAP-AO
              </h1>
              <h2 className="text-2xl font-display font-semibold tracking-wide text-amber-500 max-w-xl mx-auto uppercase">
                Plataforma Nacional de Administração Penitenciária de Angola
              </h2>
              <div className="h-[1px] w-24 bg-amber-500 mx-auto my-4" />
              <p className="text-gray-400 font-sans tracking-wide max-w-lg mx-auto text-sm leading-relaxed">
                Transformação Digital da Gestão Penitenciária Nacional
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto pt-4 text-center font-mono uppercase">
              <div className="bg-[#111215]/80 border border-[#2e3039] p-3 rounded">
                <span className="text-xs text-amber-500 font-bold block">SEGURANÇA</span>
                <span className="text-[9px] text-gray-500">Mil-Grade</span>
              </div>
              <div className="bg-[#111215]/80 border border-[#2e3039] p-3 rounded">
                <span className="text-xs text-amber-500 font-bold block">RASTREABILIDADE</span>
                <span className="text-[9px] text-gray-500">Em Tempo Real</span>
              </div>
              <div className="bg-[#111215]/80 border border-[#2e3039] p-3 rounded">
                <span className="text-xs text-amber-500 font-bold block">GOVERNANÇA</span>
                <span className="text-[9px] text-gray-500">Centralizada</span>
              </div>
              <div className="bg-[#111215]/80 border border-[#2e3039] p-3 rounded">
                <span className="text-xs text-amber-500 font-bold block">SOBERANIA</span>
                <span className="text-[9px] text-gray-500">DGSP / MININT</span>
              </div>
            </div>

            <div className="pt-6 text-xs text-gray-500 font-mono">
              Empresa de Tecnologia Proponente: <strong className="text-amber-500">Vitronis - Robótica e Controle, Lda</strong>
            </div>
          </div>
        </div>
      );

    case 2: // O DESAFIO NACIONAL
      const challenges = [
        {
          id: 1,
          title: "Registos Dispersos",
          pre: "Fichas isoladas em cada estabelecimento, sem intercomunicação.",
          post: "PNAP-AO centraliza e unifica de ponta a ponta.",
          metricLabel: "Tempo de Procura de Registo",
          metricOld: "48 Horas",
          metricNew: "0.4 Segundos"
        },
        {
          id: 2,
          title: "Dependência Absoluta de Papel",
          pre: "Guias, ordens e relatórios médicos manuais, vulneráveis a perda/fraude.",
          post: "Assinaturas criptográficas e formulários eletrónicos certificados.",
          metricLabel: "Perda/Extravio Documental",
          metricOld: "12% ao ano",
          metricNew: "0.0% (Blockchain Log)"
        },
        {
          id: 3,
          title: "Dificuldade de Rastreabilidade",
          pre: "Dificuldade em localizar onde exatamente o recluso foi alojado.",
          post: "Rastreio e atribuição celular automatizada com identificador RNR.",
          metricLabel: "Tempo de Trânsito Interno",
          metricOld: "Incertidão de dias",
          metricNew: "Atualização Automática"
        },
        {
          id: 4,
          title: "Limitações Estatísticas",
          pre: "Cálculos de ocupação feitos por telefone/fax, dados sempre desatualizados.",
          post: "Geração de inteligência estatística no painel central em 1 segundo.",
          metricLabel: "Atualização de Ocupação",
          metricOld: "Quinzenal",
          metricNew: "Instantâneo (Ao vivo)"
        },
        {
          id: 5,
          title: "Gestão Manual de Movimentações",
          pre: "Falta de controlo coordenado de escolta para tribunais/hospitais.",
          post: "Agenda de escoltas sincronizada com o motor de movimentações.",
          metricLabel: "Escolas Bloqueadas/Atrasos",
          metricOld: "Recorrente",
          metricNew: "Otimizado - Alerta Ativo"
        },
        {
          id: 6,
          title: "Falta de Integração Institucional",
          pre: "Tribunais, Ministério Público, SIC e SME operam sem diálogo digital.",
          post: "Barramento unificado de dados em protocolo seguro sob controlo MININT.",
          metricLabel: "Integração SIS-JUSTiça",
          metricOld: "Nula",
          metricNew: "Nativa Completa"
        }
      ];

      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-display font-medium text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              O Desafio Nacional do Sistema Prisional
            </h3>
            <p className="text-xs text-gray-400">Clique em cada desafio operacional para ver a métrica do impacto antes vs. depois da plataforma.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              {challenges.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChallenge(c.id)}
                  className={`w-full text-left p-3.5 rounded border transition-all flex justify-between items-center ${
                    selectedChallenge === c.id
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-[#111215]/80 border-[#2e3039] hover:border-zinc-500 text-gray-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-amber-500 block">DESAFIO #0{c.id}</span>
                    <span className="text-xs font-semibold uppercase">{c.title}</span>
                  </div>
                  <ArrowRight className={`h-4 w-4 text-amber-500 transition-transform ${
                    selectedChallenge === c.id ? 'translate-x-1' : ''
                  }`} />
                </button>
              ))}
            </div>

            <div className="bg-zinc-950/60 border border-[#2e3039] rounded p-5 flex flex-col justify-between min-h-[290px] relative">
              {selectedChallenge !== null ? (
                (() => {
                  const active = challenges.find(c => c.id === selectedChallenge)!;
                  return (
                    <div className="space-y-4 font-mono text-xs">
                      <div>
                        <span className="text-amber-500 uppercase font-bold text-[10px] tracking-widest block mb-1">Cenário Antes do PNAP-AO</span>
                        <p className="text-gray-400 leading-normal font-sans text-sm">{active.pre}</p>
                      </div>

                      <div className="h-[1px] bg-zinc-800" />

                      <div>
                        <span className="text-emerald-500 uppercase font-bold text-[10px] tracking-widest block mb-1">Cenário Depois da Plataforma</span>
                        <p className="text-gray-300 leading-normal font-sans text-sm">{active.post}</p>
                      </div>

                      <div className="bg-zinc-900 border border-zinc-800 p-3 rounded text-center grid grid-cols-2 gap-3 mt-4">
                        <div className="border-r border-zinc-800 pr-2">
                          <span className="text-[9px] text-gray-550 block uppercase font-sans">Sem Plataforma</span>
                          <span className="text-sm font-bold text-red-500 block pt-1">{active.metricOld}</span>
                        </div>
                        <div className="pl-2">
                          <span className="text-[9px] text-gray-550 block uppercase font-sans">Com PNAP-AO</span>
                          <span className="text-sm font-bold text-emerald-500 block pt-1">{active.metricNew}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <span className="text-[34px] text-zinc-800 block select-none mb-2">💡</span>
                  <span className="text-gray-400 font-semibold block text-base font-display">Métricas Institucionais</span>
                  <p className="text-xs text-gray-500 max-w-[280px] mt-1.5 leading-normal">
                    Selecione um dos desafios à esquerda para analisar a mudança radical em termos de eficiência operacional e conformidade estatal.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 3: // VISÃO ESTRATÉGICA (Convergence on unified platform)
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-display font-medium text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-amber-500" />
              Visão Estratégica: Convergência Informativa MININT
            </h3>
            <p className="text-xs text-gray-400">Um ecossistema fechado que estabelece sincronia permanente de dados operacionais.</p>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 rounded p-6 flex flex-col items-center relative overflow-hidden">
            {"/* Simplified Tactical Topology Diagram Representing MININT Core Hub */"}
            <div className="relative z-10 w-full flex flex-col items-center gap-8 py-4">
              
              {/* MININT / DGSP Hub */}
              <div className="bg-slate-900 border-2 border-amber-500 px-6 py-3 rounded text-center shadow-lg tactical-glow min-w-[200px]">
                <span className="text-[9px] font-mono text-amber-500 block leading-none select-none uppercase tracking-widest font-bold">Órgão Centralizador</span>
                <span className="text-sm font-display font-bold text-white block uppercase pt-1">DGSP / MININT</span>
                <span className="text-[9px] font-mono text-emerald-500 block leading-none select-none pt-1">● CORE SERVER AMBIENTE</span>
              </div>

              {/* Connecting lines SVG backing behind elements */}
              <div className="absolute inset-x-0 top-[20%] bottom-[20%] pointer-events-none select-none z-0">
                <svg className="w-full h-full stroke-amber-500/30 font-bold" strokeWidth="2" fill="none">
                  {/* Center lines top-down and splits */}
                  <line x1="50%" y1="12%" x2="50%" y2="52%" />
                  <line x1="15%" y1="52%" x2="85%" y2="52%" />
                  {/* Vertical lines connecting to blocks below */}
                  <line x1="15%" y1="52%" x2="15%" y2="84%" />
                  <line x1="50%" y1="52%" x2="50%" y2="84%" />
                  <line x1="85%" y1="52%" x2="85%" y2="84%" />
                </svg>
              </div>

              {/* Level 1: Province Management Core */}
              <div className="bg-[#111215] border border-amber-500/50 px-5 py-2.5 rounded text-center max-w-sm z-10">
                <span className="text-[11px] font-display font-semibold text-white uppercase flex items-center justify-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-amber-500" />
                  Direções Provinciais
                </span>
                <span className="text-[9px] font-mono text-amber-500/80 block mt-1 uppercase">Saneamento territorializado e relatórios provinciais</span>
              </div>

              {/* Level 2: Connections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full z-10 pt-4">
                <div className="bg-[#111215] border border-[#2e3039] p-3.5 rounded text-center hover:border-amber-500/40 transition-colors">
                  <span className="text-xs font-semibold text-white uppercase block leading-none">Estabelecimentos</span>
                  <span className="text-[9px] font-mono text-gray-500 block uppercase mt-1">Comarca do Huambo • Viana • Caboxa</span>
                  <p className="text-[10px] text-gray-400 mt-2 font-sans/90 leading-tight">Mapeamento celular, controlo operacional, admissão local, triagem médica.</p>
                </div>

                <div className="bg-[#111215] border border-[#2e3039] p-3.5 rounded text-center hover:border-amber-500/40 transition-colors">
                  <span className="text-xs font-semibold text-white uppercase block leading-none">Tribunais e MP</span>
                  <span className="text-[9px] font-mono text-gray-500 block uppercase mt-1">Interconexão Judicial</span>
                  <p className="text-[10px] text-gray-400 mt-2 font-sans/90 leading-tight">Comunicação célere de mandados de soltura, preventivas e audiências.</p>
                </div>

                <div className="bg-[#111215] border border-[#2e3039] p-3.5 rounded text-center hover:border-amber-500/40 transition-colors">
                  <span className="text-xs font-semibold text-white uppercase block leading-none">SIC & SME</span>
                  <span className="text-[9px] font-mono text-gray-500 block uppercase mt-1">Investigação e Fronteiras</span>
                  <p className="text-[10px] text-gray-400 mt-2 font-sans/90 leading-tight">Entradas guiadas do SIC, verificação e identificação biométrica na fronteira.</p>
                </div>
              </div>
            </div>
            
            <div className="w-full mt-4 p-3 bg-zinc-900 border border-zinc-800 rounded font-sans text-xs text-gray-400 leading-normal">
              <strong className="text-amber-500">Resultado Prático:</strong> Todos os intervenientes trabalham sincronizados num sistema soberano único hospedado nas dependências seguras do MININT. Não há duplicação de dados, não há perda de informações e todas as guias de trânsito contêm assinaturas digitais verificáveis.
            </div>
          </div>
        </div>
      );

    case 4: // ARQUITETURA NACIONAL (DG -> Provinces -> Estabelecimentos -> Pavilhões -> Blocos -> Celas)
      const drilldowns = {
        dg: { title: "Nível 1 - Direção Geral dos Serviços Penitenciários (DGSP)", desc: "Supervisão estatística, relatórios nacionais, auditoria soberana e gestão unificada de chaves biométricas.", next: "provincia" },
        provincia: { title: "Nível 2 - Direções Provinciais (21 Áreas Territoriais • DPA 2024)", desc: "Administração divisional sintonizada com a nova Lei da Divisão Político-Administrativa (DPA 2024). O Director Provincial só visualiza a sua província (Controlo Geográfico Estrito).", next: "estabelecimento" },
        estabelecimento: { title: "Nível 3 - Estabelecimentos Prisionais", desc: "Comarcas, centros de detenção preventiva, colónias agrícolas. Mapeamento de capacidade máxima de vagas.", next: "pavilhao" },
        pavilhao: { title: "Nível 4 - Pavilhões de Custódia", desc: "Divisão lógica de infraestruturas (ex: Pavilhão B Comum, Pavilhão A Segurança Máxima / Isolamento).", next: "bloco" },
        bloco: { title: "Nível 5 - Blocos de Controlo", desc: "Sub-sectores funcionais estruturados para rondas, segurança ativa e mapeamento tático imediato.", next: "cela" },
        cela: { title: "Nível 6 - Celas Finais", desc: "Mapeamento anatómico em tempo real. Identifica instantaneamente quem habita cada cela física no país.", next: "dg" }
      };

      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-display font-medium text-white flex items-center gap-2">
              <Sliders className="h-5 w-5 text-amber-500" />
              Arquitetura Territorial Escalonada
            </h3>
            <p className="text-xs text-gray-400">Clique na hierarquia abaixo para ver o nível de controlo que o PNAP-AO estabelece de cima para baixo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Hierarchy vertical steps */}
            <div className="md:col-span-1 space-y-2 font-mono text-xs">
              {Object.keys(drilldowns).map((key) => {
                const isActive = drilldownLevel === key;
                return (
                  <button
                    key={key}
                    onClick={() => setDrilldownLevel(key as any)}
                    className={`w-full text-left px-3 py-2.5 rounded border transition-all uppercase text-[10px] tracking-wide flex items-center justify-between ${
                      isActive 
                        ? 'bg-amber-500/15 border-amber-500 text-amber-500 font-bold' 
                        : 'bg-[#111215] border-zinc-800 text-gray-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-amber-500 animate-pulse' : 'bg-zinc-700'}`} />
                      {key}
                    </span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                );
              })}
            </div>

            {/* Drilldown description view */}
            <div className="md:col-span-2 bg-[#0c0d10] border border-zinc-800 rounded p-5 flex flex-col justify-between min-h-[360px]">
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-mono text-amber-500 uppercase block mb-1">Âmbito de Investigação Territorial</span>
                  <h4 className="text-sm font-display font-bold text-white uppercase">{drilldowns[drilldownLevel].title}</h4>
                </div>

                <p className="text-zinc-300 font-sans text-sm leading-relaxed">
                  {drilldowns[drilldownLevel].desc}
                </p>

                {drilldownLevel === 'provincia' && (
                  <div className="border border-zinc-800 rounded bg-[#121317]/80 p-3 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <span className="text-[#F59E0B] uppercase font-bold text-[9px] block leading-none">DPA 2024: FONTE OFICIAL DE VERDADE</span>
                        <span className="text-gray-500 text-[8.5px] font-mono uppercase">21 Províncias e Códigos de Sistema</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Pesquisar..."
                        value={provinceSearch}
                        onChange={(e) => setProvinceSearch(e.target.value)}
                        className="bg-black/60 border border-zinc-800 text-white font-mono text-[10px] px-2 py-1 rounded focus:outline-none focus:border-amber-500 w-full sm:w-40"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                      {PROVINCES_DPA_2024.filter(p => 
                        p.name.toLowerCase().includes(provinceSearch.toLowerCase()) || 
                        p.code.toLowerCase().includes(provinceSearch.toLowerCase())
                      ).map((p) => (
                        <div key={p.code} className="bg-[#111215] border border-zinc-850 p-1.5 rounded flex items-center justify-between text-[10px] leading-none">
                          <div className="truncate pr-1">
                            <span className="text-white font-sans font-medium block truncate text-[10px]">{p.name}</span>
                            <span className={`text-[7.5px] font-mono font-bold uppercase block mt-0.5 ${p.status === 'Nova' ? 'text-cyan-400' : p.status === 'Renomeada' ? 'text-amber-400' : 'text-gray-500'}`}>{p.status}</span>
                          </div>
                          <span className="text-amber-500 font-mono font-bold bg-amber-500/5 px-1 py-0.5 rounded text-[8.5px] border border-amber-500/10">{p.code}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border border-zinc-800 bg-[#121317]/80 rounded p-3 text-[11px] font-mono space-y-2">
                  <span className="text-amber-500 uppercase font-bold text-[9px] block">Exemplo Operacional</span>
                  <div className="space-y-1 text-gray-450 leading-tight">
                    {drilldownLevel === 'dg' && "» Diretor Geral visualiza a taxa de ocupação de Huambo, Luanda e Cabinda num só ecrã centralizada."}
                    {drilldownLevel === 'provincia' && "» Diretor Provincial de Benguela não tem acessibilidade técnica de rede para ver reclusos do Huambo de forma autónoma."}
                    {drilldownLevel === 'estabelecimento' && "» Comarca de Calomanda (Huambo) exorta alerta automático ao ultrapassar 110% da capacidade permitida."}
                    {drilldownLevel === 'pavilhao' && "» Rondas do turno da manhã confirmam 142 registados no Pavilhão B na chamada biométrica diária."}
                    {drilldownLevel === 'bloco' && "» Atribuição táctica de escolta penitenciária sincroniza armamento SIGAE-AO especificamente ao bloco focado."}
                    {drilldownLevel === 'cela' && "» Clicar no mapa da Cela 14B revela a listagem de fotografias, RNRs, estado de saúde e data do próximo julgamento de cada ocupante."}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-zinc-800/40 mt-3">
                <button
                  onClick={() => setDrilldownLevel(drilldowns[drilldownLevel].next as any)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  Seguinte Nível <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      );

    case 5: // RECLUSO DIGITAL UNIFICADO (RNR, photo, QR code, PDF generation etc)
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="text-xl font-display font-medium text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-amber-500" />
                Recluso Digital: Ficha Unificada Biométrica
              </h3>
              <p className="text-xs text-gray-400">Filtre e selecione um dos reclusos cadastrados na base de dados para inspecionar seu dossiê integral ou gerar ficha oficial.</p>
            </div>
            
            {/* User role warning context */}
            <div className="bg-[#111215] border border-zinc-800 rounded px-2.5 py-1.5 text-[10px] font-mono text-gray-400 flex items-center gap-1.5 select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              CONTEÚDO: MODO TESTE (HUAMBO ACTIVO)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Inmate index selection */}
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {inmates.map((inm) => {
                const isActive = activeInmate?.id === inm.id;
                return (
                  <button
                    key={inm.id}
                    onClick={() => {
                      onSelectInmate(inm);
                      setShowPdfView(false);
                    }}
                    className={`w-full text-left p-2.5 rounded border transition-all flex items-center gap-2.5 ${
                      isActive 
                        ? 'bg-amber-500/10 border-amber-500 text-white' 
                        : 'bg-[#111215] border-[#2e3039] hover:border-zinc-700 text-gray-300'
                    }`}
                  >
                    <img
                      src={inm.fotoUrl}
                      alt={inm.nome}
                      className="w-10 h-10 object-cover rounded bg-[#0d0e10] border border-zinc-800"
                    />
                    <div className="min-w-0 flex-1 font-sans">
                      <span className="text-[10px] font-mono text-amber-400/85 block">{inm.rnr}</span>
                      <span className="text-[11px] font-semibold text-white block uppercase truncate leading-snug">{inm.nome.split(' ').slice(0, 2).join(' ')}</span>
                      <span className={`text-[9px] font-mono px-1 py-0.2 ml-0 font-bold block w-fit mt-0.5 rounded ${
                        inm.nivelRisco === 'ELEVADO' ? 'bg-red-950/40 text-red-400' : 'bg-amber-950/40 text-amber-400'
                      }`}>RISCO {inm.nivelRisco}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Profile interactive detail stage */}
            <div className="md:col-span-2">
              {activeInmate ? (
                showPdfView ? (
                  /* High Fidelity Document Render */
                  <div className="bg-white text-[#1c1d22] border-2 border-zinc-300 rounded p-5 font-serif text-xs space-y-4 shadow-xl select-text animate-fade-in max-h-[350px] overflow-y-auto">
                    <div className="text-center space-y-1 pb-3 border-b border-zinc-300">
                      <span className="text-[10px] font-sans font-bold block uppercase tracking-wide">República de Angola</span>
                      <span className="text-[9px] font-sans font-bold block text-gray-600 uppercase">Ministério do Interior • MININT</span>
                      <span className="text-[8px] font-sans font-bold block text-gray-400 uppercase leading-none">Direção Geral dos Serviços Penitenciários</span>
                      <span className="text-sm font-sans font-extrabold block text-amber-800 uppercase tracking-widest pt-2">Ficha de Identificação Individual</span>
                      <span className="text-[9px] font-mono font-bold block text-zinc-650 pt-0.5 select-all">CÓDIGO DE CONTROLO COORDENADO: {activeInmate.rnr}</span>
                    </div>

                    <div className="flex gap-4">
                      <img
                        src={activeInmate.fotoUrl}
                        alt="Recluso Digital"
                        className="w-20 h-20 object-cover border border-zinc-400 rounded bg-zinc-100"
                      />
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 flex-1 font-sans text-[10px] leading-tight">
                        <div><strong className="text-gray-500 uppercase text-[9px] block">RNR DE ASSINATURA:</strong> <span className="font-mono font-bold text-black">{activeInmate.rnr}</span></div>
                        <div><strong className="text-gray-500 uppercase text-[9px] block">NOME FORMATAL:</strong> <span className="font-bold text-black uppercase">{activeInmate.nome}</span></div>
                        <div><strong className="text-gray-500 uppercase text-[9px] block">ESTADO JURÍDICO:</strong> <span className="text-amber-800 font-bold">{activeInmate.estadoJuridico}</span></div>
                        <div><strong className="text-gray-500 uppercase text-[9px] block">CRIME ENQUADRADO:</strong> <span className="text-black uppercase">{activeInmate.crime}</span></div>
                        <div><strong className="text-gray-500 uppercase text-[9px] block">NASCIMENTO:</strong> <span className="text-black">{activeInmate.dataNascimento}</span></div>
                        <div><strong className="text-gray-500 uppercase text-[9px] block">ADMISSÃO SATE:</strong> <span className="text-black">{activeInmate.dataAdmissao}</span></div>
                      </div>
                    </div>

                    <div className="border bg-zinc-50 p-3 rounded font-sans text-[10px] leading-relaxed">
                      <span className="font-bold text-gray-800 uppercase tracking-wide text-[9px] block border-b pb-1 mb-1">Mapeamento Geográfico Interno</span>
                      <strong>ESTABELECIMENTO:</strong> {activeInmate.cela.estabelecimento}<br />
                      <strong>SECÇÃO:</strong> {activeInmate.cela.pavilhao} &bull; <strong>BLOCO:</strong> {activeInmate.cela.bloco}<br />
                      <strong>CELA DESTINATÁRIA AUTOMÁTICA:</strong> <span className="text-red-700 font-bold text-[11px]">{activeInmate.cela.cela}</span>
                    </div>

                    <div className="font-sans text-[9px] text-zinc-500 pt-1 border-t text-center flex justify-between uppercase">
                      <span>Plataforma Sincronizada PNAP-AO v1.1</span>
                      <button 
                        onClick={() => setShowPdfView(false)}
                        className="text-[9px] font-bold text-amber-700 hover:underline cursor-pointer tracking-wider font-sans font-bold"
                      >
                        [ VOLTAR PARA PERFIL OPERACIONAL ]
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0c0d10] border border-zinc-800 rounded p-4 font-mono text-xs space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <img
                          src={activeInmate.fotoUrl}
                          alt={activeInmate.nome}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 object-cover border border-zinc-700 rounded bg-[#111215]"
                        />
                        <div className="space-y-1 font-sans">
                          <span className="text-[10px] font-mono text-amber-500 font-bold block">{activeInmate.rnr}</span>
                          <span className="text-sm font-display font-bold text-white block uppercase">{activeInmate.nome}</span>
                          <span className="text-xs text-gray-400 block pb-0.5">Crime: <strong className="text-zinc-200">{activeInmate.crime}</strong></span>
                          <div className="flex flex-wrap gap-2 pt-0.5">
                            <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 text-gray-300 px-1.5 py-0.5 rounded leading-none">
                              {activeInmate.estadoJuridico}
                            </span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded leading-none ${
                              activeInmate.nivelRisco === 'ELEVADO' 
                                ? 'bg-red-950/50 border border-red-500/30 text-red-500' 
                                : 'bg-amber-950/50 border border-amber-500/30 text-amber-500'
                            }`}>
                              RISCO {activeInmate.nivelRisco}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="bg-white p-1 border border-zinc-800 rounded hover:opacity-90 cursor-pointer">
                          <Check className="h-2 w-2 text-transparent" /> {"/* Layout alignment spacing */"}
                          <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=80&h=80"
                            alt="QR Barcode"
                            className="w-12 h-12 grayscale"
                          />
                        </div>
                        <span className="text-[7px] font-semibold text-gray-500 uppercase font-sans mt-1">NÚMERO QR SANEADO</span>
                      </div>
                    </div>

                    <div className="h-[1px] bg-zinc-800" />

                    <div className="space-y-2">
                      <span className="text-amber-500 text-[10px] uppercase font-bold block tracking-wider flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> Histórico Criptográfico de Trânsitos
                      </span>
                      <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                        {activeInmate.historicoMovimentacoes.map((m, i) => (
                          <div key={i} className="bg-zinc-900/60 p-2 border border-zinc-800 rounded text-[11px] leading-relaxed relative">
                            <span className="absolute top-1.5 right-2 text-[9px] text-zinc-500 font-mono">{m.data}</span>
                            <div className="space-y-0.5">
                              <div className="text-white font-sans flex items-center gap-1">
                                <span className="font-serif italic text-gray-500">{m.origem}</span>
                                <ArrowRight className="h-3 w-3 text-amber-500" />
                                <span className="text-amber-400 font-semibold">{m.destino}</span>
                              </div>
                              <div className="text-gray-400 text-[10px] pt-1">
                                <strong>MOTIVO:</strong> {m.motivo} &bull; <strong>DESPACHO:</strong> {m.autorizador}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-[#111215] border border-zinc-800 p-2.5 rounded text-[11px] font-sans">
                      <span className="text-gray-400 font-mono">Guia de Internamento Certificada</span>
                      <button
                        onClick={() => {
                          setPdfGenerating(true);
                          setTimeout(() => {
                            setPdfGenerating(false);
                            setShowPdfView(true);
                          }, 1000);
                        }}
                        disabled={pdfGenerating}
                        className="bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-gray-500 text-slate-950 font-mono font-bold px-3 py-1.5 rounded text-[10px] flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        {pdfGenerating ? 'GERANDO DOCUMENTO...' : 'GERAR GUIA PDF OFICIAL'}
                        <FileText className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="bg-[#0c0d10] border border-zinc-800 rounded p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                  <Users className="h-8 w-8 text-zinc-700 mb-2" />
                  <span className="text-white font-display font-medium text-sm">Selecione um Recluso</span>
                  <p className="text-xs text-gray-500 max-w-sm mt-1 leading-normal">
                    Selecione quem você deseja auditar à esquerda ou utilize o "Simulador de Admissão" no canto superior direito para injetar voluntários inéditos instantaneamente no sistema.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 6: // SEGURANÇA E CONTROLO (Territorial isolation demonstration)
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-display font-medium text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-500" />
              Segurança e Controlo: Escopo Territorial Strict
            </h3>
            <p className="text-xs text-gray-400">Restrições geográficas nativas e intransponíveis baseadas em chaves de criptografia e perfis estatais.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Control Panel / Switchers */}
            <div className="bg-[#111215]/80 border border-[#2e3039] p-4 rounded space-y-4 font-mono text-xs">
              <span className="text-amber-500 uppercase font-bold text-[9px] tracking-widest block leading-none select-none">Mudar Perfil Verificador</span>
              
              <div className="space-y-2">
                <button
                  onClick={() => onSetUserRole('DG')}
                  className={`w-full text-left p-3 rounded border text-[11px] uppercase tracking-wide transition-all ${
                    userRole === 'DG'
                      ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                      : 'bg-zinc-950/60 border-zinc-850 text-gray-400 hover:border-zinc-700'
                  }`}
                >
                  👑 Director Geral (Soberania)
                  <span className="block text-[8px] text-gray-500 italic mt-0.5 uppercase normal-case font-sans">Acesso completo: Vê Huambo, Luanda e Cabinda</span>
                </button>

                <button
                  onClick={() => onSetUserRole('DIR_HUAMBO')}
                  className={`w-full text-left p-3 rounded border text-[11px] uppercase tracking-wide transition-all ${
                    userRole === 'DIR_HUAMBO'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-500 font-bold'
                      : 'bg-zinc-950/60 border-zinc-850 text-gray-400 hover:border-zinc-700'
                  }`}
                >
                  📍 Diretor Provincial Huambo
                  <span className="block text-[8px] text-gray-500 italic mt-0.5 font-sans">Acesso restrito: Vê Huambo. Bloqueado Luanda/Bengo</span>
                </button>

                <button
                  onClick={() => onSetUserRole('DIR_LUANDA')}
                  className={`w-full text-left p-3 rounded border text-[11px] uppercase tracking-wide transition-all ${
                    userRole === 'DIR_LUANDA'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-500 font-bold'
                      : 'bg-zinc-950/60 border-zinc-850 text-gray-400 hover:border-zinc-700'
                  }`}
                >
                  📍 Diretor Provincial Luanda
                  <span className="block text-[8px] text-gray-500 italic mt-0.5 font-sans">Acesso restrito: Vê Luanda/Viana. Bloqueado Huambo</span>
                </button>
              </div>

              <div className="h-[1px] bg-zinc-800" />

              <div className="text-[10px] leading-relaxed text-gray-400 font-sans">
                <span className="font-bold text-amber-500 block uppercase font-mono pb-1 text-[9px]">Garantias do Fornecedor</span>
                O sistema utiliza criptografia em trânsito e em repouso. O Director de Huambo nem sequer descarrega os pacotes de chapa de imagem e dados de presos de outras províncias no seu navegador, mitigando o risco de ciber-espionagem regional.
              </div>
            </div>

            {/* Simulated filtered output of inmates based on role */}
            <div className="md:col-span-2 bg-zinc-950/60 border border-[#2e3039] rounded p-5 relative overflow-hidden font-mono text-xs">
              <span className="text-gray-500 block mb-3 uppercase tracking-wider text-[10px]">Lista de Custódia Encarcerados Saneada</span>

              <div className="space-y-2 max-h-[170px] overflow-y-auto">
                {inmates.map((inm) => {
                  const isVisible = 
                    userRole === 'DG' || 
                    (userRole === 'DIR_HUAMBO' && inm.cela.estabelecimento.includes('Huambo')) ||
                    (userRole === 'DIR_LUANDA' && inm.cela.estabelecimento.includes('Viana') || userRole === 'DIR_LUANDA' && inm.cela.estabelecimento.includes('Luanda'));

                  if (isVisible) {
                    return (
                      <div key={inm.id} className="bg-zinc-900/60 p-2.5 rounded border border-zinc-800 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-3">
                          <img
                            src={inm.fotoUrl}
                            alt={inm.nome}
                            className="w-8 h-8 object-cover rounded bg-black"
                          />
                          <div>
                            <span className="text-gray-250 font-sans font-bold block uppercase leading-snug">{inm.nome}</span>
                            <span className="text-[9px] text-gray-500 font-serif">{inm.cela.estabelecimento}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-500 px-2 py-0.5 bg-emerald-550/10 rounded border border-emerald-500/20">
                          ✓ PERMITIDO
                        </span>
                      </div>
                    );
                  } else {
                    return (
                      <div key={inm.id} className="bg-red-950/5 p-2.5 rounded border border-red-950/40 flex items-center justify-between opacity-50 text-[11px] select-none">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-zinc-900 rounded flex items-center justify-center text-red-500">
                            <EyeOff className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-gray-500 font-sans font-bold block uppercase leading-snug">RECLUSO CONSERVADO</span>
                            <span className="text-[9px] text-gray-600 font-serif">Estabelecimento em outra Província</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-red-500 px-2 py-0.5 bg-red-950/50 rounded border border-red-500/30">
                          ✗ BLOQUEADO
                        </span>
                      </div>
                    );
                  }
                })}
              </div>

              {/* Graphical representation of filter action */}
              <div className="mt-4 p-3 bg-zinc-900 border border-zinc-800 rounded font-sans text-xs text-gray-400 space-y-1">
                <span className="text-amber-500 uppercase font-mono font-bold text-[9px] block">Regra Activa no Sistema:</span>
                <p>
                  {userRole === 'DG' && "» ÓRGÃO SOBERANO NACIONAL: Você está visualizando reclusos em todas as comarcas sem discriminação territorial."}
                  {userRole === 'DIR_HUAMBO' && "» DIRETOR HUAMBO ACTIVO: Huambo auditado com sucesso. Dados de Luanda estão sob criptografia invisível na infraestrutura central e o acesso foi denegado pela directiva."}
                  {userRole === 'DIR_LUANDA' && "» DIRETOR LUANDA ACTIVO: Luanda sob observação. Reclusos de Comarcas de Huambo ou Bengo permanecem bloqueados de forma intransponível."}
                </p>
              </div>
            </div>
          </div>
        </div>
      );

    case 7: // MOTOR DE MOVIMENTAÇÃO (Lifecycle timeline)
      const timelineWalk = [
        { title: "1. Internamento inicial", desc: "Registo do mandado judicial, captura facial biométrica e atribuição automática do RNR.", status: "CONCLUÍDO" },
        { title: "2. Distribuição de cela", desc: "Alocação inteligente considerando grau de perigo, crime e lotação da cela.", status: "CONCLUÍDO" },
        { title: "3. Monitorização interna", desc: "Registo de conduta diária, consultas médicas, visitas controladas.", status: "CONVÉM" },
        { title: "4. Escoltas e deslocações", desc: "Autorização para tribunais ou hospitais, rastreadas com guias digitais de segurança.", status: "CRÍTICO" },
        { title: "5. Albergue / Regimes Especiais", desc: "Transição progressiva para regimes de regime livre monitorizado.", status: "AUTORIZADO" },
        { title: "6. Liberdade definitiva", desc: "Ordem certificada de soltura judiciária emitida com QR provando integridade legal.", status: "PREVISTO" }
      ];

      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-display font-medium text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-500" />
              Motor de Movimentação e Ciclo de Vida do Recluso
            </h3>
            <p className="text-xs text-gray-400">Linha temporal tática unificada representando todas as transições legais de um cidadão nos estabelecimentos do Ministério do Interior.</p>
          </div>

          <div className="bg-[#0c0d10] border border-zinc-800 rounded p-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              {timelineWalk.map((stepItem, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedWorkflowStep(idx)}
                  className={`text-left p-3 rounded border transition-all relative font-mono text-xs ${
                    selectedWorkflowStep === idx
                      ? 'bg-amber-500/15 border-amber-500 text-white'
                      : 'bg-zinc-900/60 border-zinc-850 text-gray-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="absolute top-1 right-2 text-[9px] text-[#ffffff50]">#{idx + 1}</div>
                  <span className="text-amber-500 text-[10px] block font-bold mb-1">{stepItem.status}</span>
                  <span className="font-display font-bold block uppercase tracking-tight text-[11px] leading-tight mb-2 h-8">{stepItem.title.replace(`${idx + 1}. `, '')}</span>
                  <span className="text-[10px] block select-none text-right font-sans font-medium text-gray-500 hover:text-white">Ver detalhes &rarr;</span>
                </button>
              ))}
            </div>

            <div className="mt-5 p-4 bg-[#111215] border border-zinc-850 rounded text-xs leading-relaxed space-y-2">
              <span className="text-amber-500 uppercase font-mono font-bold text-[10px] tracking-wide block">Especificações Técnicas de Governança:</span>
              <p className="text-gray-350 font-sans text-sm">
                <strong>Fase seleccionada: {timelineWalk[selectedWorkflowStep].title}</strong> &bull; {timelineWalk[selectedWorkflowStep].desc}
              </p>
              <div className="h-[1px] bg-zinc-800 my-2" />
              <div className="text-[11px] text-gray-520 font-mono">
                Cada estágio do fluxo obriga a validação criptográfica (QR seguro do escoteiro, despacho autenticado do juiz competente e o log imediato do operador activo). O recluso não é movido um único milímetro na comarca sem que a plataforma notifique a Direção Geral em Luanda em tempo real.
              </div>
            </div>
          </div>
        </div>
      );

    case 8: // GESTÃO DE VISITAS
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-display font-medium text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-500" />
              Portal do Visitante e Agendamento Inteligente
            </h3>
            <p className="text-xs text-gray-400">Saneamento prévio de condutas, limitação de visitas por cela em simultâneo e validação biométrica na recepção do estabelecimento.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* List of active schedules */}
            <div className="bg-zinc-950/60 border border-zinc-800 rounded p-4 font-mono text-xs space-y-3">
              <span className="text-gray-500 block uppercase text-[10px]">Agendamentos Críticos Registados no Posto</span>

              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {visits.map((vis) => (
                  <div key={vis.id} className="bg-zinc-900/60 p-3 rounded border border-zinc-850 flex flex-col justify-between gap-1">
                    <div className="flex justify-between items-start text-[11px] leading-tight">
                      <div>
                        <span className="text-white block font-sans font-bold uppercase leading-snug">{vis.visitanteNome}</span>
                        <span className="text-[9px] text-gray-450 block font-semibold pt-1">Parentesco: <strong className="text-amber-400">{vis.parentesco}</strong> | BI: {vis.visitanteDocumento}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        vis.status === 'APROVADO' 
                          ? 'bg-amber-950/50 border border-amber-500/30 text-amber-500' 
                          : vis.status === 'CONCLUÍDO'
                          ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-500'
                          : 'bg-zinc-900 text-gray-400'
                      }`}>
                        {vis.status}
                      </span>
                    </div>

                    <div className="h-[1px] bg-zinc-800 my-1" />

                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-500">Recluso ID: <span className="text-zinc-300 font-bold">{vis.reclusoRnr}</span></span>
                      <span className="text-gray-500 font-bold text-right flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> BIOMETRIA {vis.biometriaStatus}
                      </span>
                    </div>

                    {vis.status === 'SOLICITADO' && (
                      <div className="flex gap-2 justify-end pt-2">
                        <button
                          onClick={() => onVerifyVisit(vis.id, false)}
                          className="px-2 py-0.8 bg-red-950 hover:bg-red-900 text-red-400 rounded text-[9px] cursor-pointer"
                        >
                          Recusar
                        </button>
                        <button
                          onClick={() => onVerifyVisit(vis.id, true)}
                          className="px-2 py-0.8 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 rounded text-[9px] cursor-pointer"
                        >
                          Autorizar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Portal visitor registration flow explanations */}
            <div className="bg-[#0c0d10] border border-zinc-800 rounded p-4 font-sans text-xs space-y-4">
              <span className="text-amber-500 uppercase font-mono font-bold text-[9px] block">Mapeamento de Segurança para Visitas:</span>
              
              <div className="space-y-3 pt-1">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded bg-[#111215] border border-zinc-800 flex items-center justify-center font-mono font-bold text-amber-500 text-xs">
                    01
                  </div>
                  <div className="flex-1">
                    <strong className="text-white block text-sm leading-none">Agendamento Remoto Pré-Aprovado</strong>
                    <p className="text-gray-405 leading-snug mt-1 text-[11px]">O familiar solicita visita através do portal nacional informando biometria e filiação. O sistema realiza triagem com os registos de antecedentes criminais do SIC automaticamente.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded bg-[#111215] border border-zinc-800 flex items-center justify-center font-mono font-bold text-amber-500 text-xs">
                    02
                  </div>
                  <div className="flex-1">
                    <strong className="text-white block text-sm leading-none">Validação de Quota Celular</strong>
                    <p className="text-gray-405 leading-snug mt-1 text-[11px]">A plataforma impede que uma cela comum exceda visitas simultâneas, planificando os horários em lotes otimizados para evitar algazarras em pavilhões fechados.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded bg-[#111215] border border-zinc-800 flex items-center justify-center font-mono font-bold text-amber-500 text-xs">
                    03
                  </div>
                  <div className="flex-1">
                    <strong className="text-white block text-sm leading-none font-sans">Check-in de Entrada com Impressão Digital</strong>
                    <p className="text-gray-405 leading-snug mt-1 text-[11px]">No balcão físico do estabelecimento, a impressão digital do visitante é capturada e validada. O sistema imprime um QR-Badge descartável acoplado no livro de presença.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 9: // SAÚDE PENITENCIÁRIA INTEGRADA
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-display font-medium text-white flex items-center gap-2">
              <Heart className="h-5 w-5 text-amber-500" />
              Saúde Penitenciária e Prontuários Médicos
            </h3>
            <p className="text-xs text-gray-400">Monitorização de tratamento medicamentoso, relatórios psicológicos obrigatórios e histórico de internamentos críticos para mitigar óbitos em custódia.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Health dossiers dashboard */}
            <div className="space-y-3 bg-zinc-950/60 border border-zinc-800 rounded p-4 font-mono text-xs">
              <span className="text-gray-500 block uppercase text-[10px] mb-2 font-mono">Dossiês de Saúde Activos</span>
              
              <div className="space-y-2">
                {health.map((h, idx) => (
                  <div key={idx} className="bg-[#111215] p-3 rounded border border-zinc-850 leading-relaxed font-sans text-[11px]">
                    <div className="flex justify-between items-start border-b border-zinc-800 pb-1.5 mb-1.5">
                      <div>
                        <span className="text-amber-500 font-mono text-[9px] block leading-none">{h.reclusoRnr}</span>
                        <span className="text-white block font-bold uppercase pt-0.5">{h.reclusoNome}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-red-500 bg-red-950/30 px-1.5 py-0.5 rounded leading-none border border-red-500/20">{h.estadoSaude}</span>
                    </div>

                    <div className="text-[11.5px] text-gray-350 space-y-1">
                      <div><strong>Medicação Prescrita:</strong> <span className="text-[#a1a1aa]">{h.medicacaoPrescrita}</span></div>
                      
                      <div className="pt-1.5">
                        <strong className="text-[9px] font-mono text-gray-550 block uppercase mb-1">Historial Diagnóstico Clínico</strong>
                        <div className="space-y-1">
                          {h.historicoConsultas.map((c, ci) => (
                            <div key={ci} className="bg-zinc-950/80 p-2 rounded border border-zinc-900 text-[10px] font-mono leading-tight">
                              <span className="text-[8px] text-gray-500 font-bold block">{c.data} &bull; Médico: {c.medico}</span>
                              <span className="text-white font-sans font-medium block pt-0.5">{c.especialidade}: {c.diagnostico}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health impact and sovereignty guarantees */}
            <div className="bg-[#0c0d10] border border-zinc-800 rounded p-5 font-sans justify-between flex flex-col min-h-[300px]">
              <div className="space-y-4">
                <div>
                  <span className="text-amber-500 uppercase font-mono font-bold text-[9px] block select-none">Módulo Técnico SAÚDE-101</span>
                  <h4 className="text-sm font-display font-bold text-white uppercase pt-0.5">Gestão de Internamentos Clínicos</h4>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed">
                  A plataforma do recluso unifica históricos hospitalares. Se um preso possui uma condição crónica como Hipertensão ou Tuberculose, o sistema automatiza lembretes para o médico local prescrever a dose correcta.
                </p>

                <div className="border border-zinc-800 bg-[#121317]/80 rounded p-3 text-[11.5px] space-y-2">
                  <span className="text-amber-500 font-mono font-bold text-[9px] block uppercase">Garantias no Tribunal de Menores</span>
                  Se o Ministério Público ou Tribunais convocarem o recluso para audiência, a plataforma exibe um alerta automático se o médico do estabelecimento declarou "Incapacidade Transitória para Audiências" devido a internamento, reduzindo imprevistos de tráfego.
                </div>
              </div>

              <div className="h-2 w-full bg-zinc-900 rounded overflow-hidden mt-3 relative">
                <div className="absolute inset-0 bg-emerald-500/40 w-[92%] h-full" />
                <span className="absolute right-2 top-0.5 text-[8px] font-mono text-white leading-none">92% SANEAMENTO CLÍNICO NACIONAL</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 10: // GESTÃO DE ARMAS (SIGAE-AO Integration)
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="text-xl font-display font-medium text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-500" />
                SIGAE-AO: Gestão Integrada de Armas e Munições
              </h3>
              <p className="text-xs text-gray-400">Mapeamento tático do estoque militar institucional para escoltas e vigilância nas muralhas, sincronizado nativamente com regras de arrolamento.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Simulated weapons table */}
            <div className="bg-zinc-950/60 border border-zinc-800 rounded p-4 font-mono text-xs space-y-3">
              <span className="text-gray-500 block uppercase text-[10px]">Inventário Armaria - Bloco Huambo</span>

              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {weapons.map((w) => (
                  <div key={w.id} className="bg-zinc-900/60 p-2.5 rounded border border-zinc-850 flex justify-between items-center text-[11px] leading-tight flex-wrap gap-2">
                    <div>
                      <span className="text-gray-500 text-[9px] block">{w.registroSigae}</span>
                      <strong className="text-white block uppercase pt-0.5 font-sans">{w.marca} {w.modelo}</strong>
                      <span className="text-[10px] text-amber-400/85">S/N: {w.numeroSerie}</span>
                    </div>

                    <div className="text-right space-y-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded block ${
                        w.estado === 'DISPONÍVEL' 
                          ? 'bg-emerald-950/50 border border-emerald-500/20 text-emerald-500' 
                          : w.estado === 'EM_SERVIÇO'
                          ? 'bg-amber-950/50 border border-amber-500/20 text-amber-500'
                          : 'bg-red-955/30 text-red-400 border border-red-500/20'
                      }`}>
                        {w.estado}
                      </span>
                      {w.agenteAtribuido && (
                        <span className="text-[9px] text-gray-400 font-sans block pt-0.5 max-w-[120px] truncate uppercase">Atribuído: {w.agenteAtribuido.split(' ').slice(-1)[0]}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Armory Checkout Handover Return interface */}
            <div className="bg-[#0c0d10] border border-zinc-800 rounded p-4 font-mono text-xs flex flex-col justify-between min-h-[280px]">
              <div className="space-y-3">
                <span className="text-amber-500 uppercase font-bold text-[9px] block">Mecanismo de Escolta Armado</span>
                <h4 className="text-[14px] font-display font-bold text-white uppercase">Checkout de Arma SIGAE-AO</h4>
                
                <div className="bg-[#111215] border border-zinc-850 p-3 rounded space-y-3 mt-1 text-[11px]">
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Selecione o Armamento Activo</label>
                    <select
                      value={selectedWeaponId}
                      onChange={(e) => setSelectedWeaponId(e.target.value)}
                      className="w-full bg-[#18191d] border border-zinc-800 focus:border-amber-500 text-white text-xs px-2.5 py-1.5 rounded focus:outline-none"
                    >
                      <option value="">-- Seleccionar Arma --</option>
                      {weapons.filter(w => w.estado === 'DISPONÍVEL').map(w => (
                        <option key={w.id} value={w.id}>{w.marca} {w.modelo} ({w.numeroSerie})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Nome Completo do Agente de Escolta</label>
                    <input
                      type="text"
                      value={officerNameInput}
                      onChange={(e) => setOfficerNameInput(e.target.value)}
                      placeholder="Ex: Sub-Inspector Mateus Banza"
                      className="w-full bg-[#18191d] border border-zinc-800 focus:border-amber-500 text-white text-xs px-2.5 py-1.5 rounded focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => {
                    const assignedOfficer = weapons.find(w => w.estado === 'EM_SERVIÇO')?.agenteAtribuido;
                    const assignedId = weapons.find(w => w.estado === 'EM_SERVIÇO')?.id;
                    if (assignedId && assignedOfficer) {
                      onReturnWeapon(assignedId);
                      alert(`Armamento devolvido com sucesso pelo Agente: ${assignedOfficer}.`);
                    } else {
                      alert("Nenhuma arma está sob posse de escolta no momento para devolução.");
                    }
                  }}
                  className="border border-zinc-700 hover:border-zinc-500 text-gray-300 font-bold px-3 py-1.5 rounded text-[11px] cursor-pointer"
                >
                  Simular Devolução
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedWeaponId || !officerNameInput.trim()) {
                      alert("Por favor selecione uma arma disponível e introduza o nome do agente.");
                      return;
                    }
                    onHandoverWeapon(selectedWeaponId, officerNameInput);
                    alert(`Armamento atribuído com sucesso. Código SIGAE-AO registado com audit imediato.`);
                    setOfficerNameInput('');
                    setSelectedWeaponId('');
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-1.5 rounded text-[11px] cursor-pointer"
                >
                  Confirmar Entrega
                </button>
              </div>
            </div>
          </div>
        </div>
      );

    case 11: // DASHBOARD NACIONALCORES INTELIGENTES
      {
        // Dynamic province converter/allocator sintonizado com DPA 2024
        const getInmateProvinceCode = (inm: Inmate): string => {
          const estab = inm.cela.estabelecimento.toUpperCase();
          if (estab.includes('HUAMBO')) return 'HUA';
          if (estab.includes('VIANA') || estab.includes('LUANDA')) return 'LUA';
          if (estab.includes('CABOXA') || estab.includes('BENGO')) return 'BGO';
          if (estab.includes('CABINDA')) return 'CAB';
          if (estab.includes('ZAIRE') || estab.includes('KONGO')) return 'ZAI';
          if (estab.includes('UÍGE') || estab.includes('UIGE')) return 'UIG';
          if (estab.includes('ICOLO')) return 'ICB';
          if (estab.includes('CUANZA-NORTE') || estab.includes('NDALATANDO')) return 'CNO';
          if (estab.includes('CUANZA-SUL') || estab.includes('SUMBE')) return 'CSU';
          if (estab.includes('MALANJE')) return 'MAL';
          if (estab.includes('LUNDA-NORTE') || estab.includes('CACANDA')) return 'LNO';
          if (estab.includes('LUNDA-SUL') || estab.includes('SAURIMO')) return 'LSU';
          if (estab.includes('BENGUELA')) return 'BGU';
          if (estab.includes('BIÉ') || estab.includes('BIE')) return 'BIE';
          if (estab.includes('MOXICO LESTE')) return 'MXL';
          if (estab.includes('MOXICO')) return 'MOX';
          if (estab.includes('HUÍLA') || estab.includes('HUILA') || estab.includes('LUBANGO')) return 'HUI';
          if (estab.includes('NAMIBE')) return 'NAM';
          if (estab.includes('CUNENE') || estab.includes('ONDJIVA')) return 'CNN';
          if (estab.includes('CUBANGO')) return 'CCU';
          if (estab.includes('CUANDO')) return 'CND';
          return 'LUA'; // default fallback
        };

        const PROVINCES_DPA_DATA = [
          { code: 'CAB', name: 'Cabinda', baseInmates: 310, capacity: 400, prisonName: 'Estabelecimento Prisional de Cabinda', type: 'Existente' },
          { code: 'ZAI', name: 'Zaire', baseInmates: 180, capacity: 250, prisonName: 'Estabelecimento Prisional do Mbanza Kongo', type: 'Existente' },
          { code: 'UIG', name: 'Uíge', baseInmates: 420, capacity: 550, prisonName: 'Estabelecimento Prisional do Congo (Uíge)', type: 'Existente' },
          { code: 'BGO', name: 'Bengo', baseInmates: 421, capacity: 1000, prisonName: 'Estabelecimento Prisional de Caboxa (Bengo)', type: 'Existente' },
          { code: 'ICB', name: 'Icolo e Bengo', baseInmates: 95, capacity: 150, prisonName: 'Centro de Detenção de Icolo e Bengo', type: 'Nova' },
          { code: 'LUA', name: 'Luanda', baseInmates: 1850, capacity: 2000, prisonName: 'Estabelecimento Prisional de Viana (Luanda)', type: 'Existente' },
          { code: 'CNO', name: 'Cuanza-Norte', baseInmates: 152, capacity: 220, prisonName: 'Estabelecimento Prisional de Ndalatando', type: 'Existente' },
          { code: 'CSU', name: 'Cuanza-Sul', baseInmates: 380, capacity: 500, prisonName: 'Estabelecimento Prisional do Sumbe', type: 'Existente' },
          { code: 'MAL', name: 'Malanje', baseInmates: 290, capacity: 400, prisonName: 'Estabelecimento Prisional de Malanje', type: 'Existente' },
          { code: 'LNO', name: 'Lunda-Norte', baseInmates: 340, capacity: 450, prisonName: 'Estabelecimento Prisional de Cacanda', type: 'Existente' },
          { code: 'LSU', name: 'Lunda-Sul', baseInmates: 210, capacity: 300, prisonName: 'Estabelecimento Prisional de Saurimo', type: 'Existente' },
          { code: 'BGU', name: 'Benguela', baseInmates: 890, capacity: 1100, prisonName: 'Estabelecimento Prisional de Benguela', type: 'Existente' },
          { code: 'HUA', name: 'Huambo', baseInmates: 659, capacity: 800, prisonName: 'Estabelecimento Prisional da Comarca do Huambo', type: 'Existente' },
          { code: 'BIE', name: 'Bié', baseInmates: 420, capacity: 600, prisonName: 'Estabelecimento Prisional do Bié', type: 'Existente' },
          { code: 'MOX', name: 'Moxico', baseInmates: 235, capacity: 350, prisonName: 'Estabelecimento Prisional de Luena', type: 'Existente' },
          { code: 'MXL', name: 'Moxico Leste', baseInmates: 85, capacity: 150, prisonName: 'Unidade Prisional Fronteiriça Moxico Leste', type: 'Nova' },
          { code: 'HUI', name: 'Huíla', baseInmates: 710, capacity: 900, prisonName: 'Estabelecimento Prisional de Lubango', type: 'Existente' },
          { code: 'NAM', name: 'Namibe', baseInmates: 140, capacity: 200, prisonName: 'Estabelecimento Prisional de Moçâmedes', type: 'Existente' },
          { code: 'CNN', name: 'Cunene', baseInmates: 195, capacity: 300, prisonName: 'Estabelecimento Prisional de Ondjiva', type: 'Existente' },
          { code: 'CCU', name: 'Cubango', baseInmates: 110, capacity: 180, prisonName: 'Centro Penitenciário Regional do Cubango', type: 'Renomeada' },
          { code: 'CND', name: 'Cuando', baseInmates: 75, capacity: 120, prisonName: 'Estabelecimento Prisional Militarizado de Cuando', type: 'Nova' }
        ];

        // Map dynamic totals
        const computedProvinces = PROVINCES_DPA_DATA.map(p => {
          const dynamicInmates = inmates.filter(inm => getInmateProvinceCode(inm) === p.code && inm.status !== 'LIBERTADO');
          const finalInmatesCount = p.baseInmates + dynamicInmates.length;
          const ratio = Math.min(100, Math.floor((finalInmatesCount / p.capacity) * 100));

          // Dynamic integration of HealthRecords matching inmates in this province
          const provinceInmatesSet = new Set(inmates.filter(inm => getInmateProvinceCode(inm) === p.code).map(inm => inm.rnr));
          const provHealthRecords = health.filter(h => provinceInmatesSet.has(h.reclusoRnr));
          
          const activeCases = Math.round(finalInmatesCount * 0.08) + provHealthRecords.length;
          const totalConsultations = Math.round(finalInmatesCount * 0.15) + provHealthRecords.reduce((sum, h) => sum + h.historicoConsultas.length, 0);
          const activePrescriptions = Math.round(finalInmatesCount * 0.05) + provHealthRecords.filter(h => h.medicacaoPrescrita && h.medicacaoPrescrita.trim().toLowerCase() !== 'nenhuma').length;

          // Dynamic integration of Movement & Citation records matching inmates in this province
          const provinceInmates = inmates.filter(inm => getInmateProvinceCode(inm) === p.code);
          const provVisitations = visits.filter(v => provinceInmatesSet.has(v.reclusoRnr));
          const escortsInCourtCount = provinceInmates.filter(inm => inm.status === 'EM_AUDIENCIA').length;
          const escortsHospitalizedCount = provinceInmates.filter(inm => inm.status === 'HOSPITALIZADO' || inm.status === 'INTERNADO').length;

          const totalVisitsCount = Math.round(finalInmatesCount * 0.32) + provVisitations.length;
          const totalTransfersCount = Math.round(finalInmatesCount * 0.11) + provinceInmates.reduce((sum, inm) => sum + (inm.historicoMovimentacoes?.length || 0), 0);

          return {
            ...p,
            dynamicInmates,
            inmatesCount: finalInmatesCount,
            ratio,
            healthStats: {
              activeCases,
              consultations: totalConsultations,
              prescriptions: activePrescriptions
            },
            movementStats: {
              visits: totalVisitsCount,
              transfers: totalTransfersCount,
              inCourt: escortsInCourtCount,
              hospitalized: escortsHospitalizedCount
            }
          };
        });

        const nationalTotalActive = computedProvinces.reduce((sum, p) => sum + p.inmatesCount, 0);
        const nationalTotalCapacity = computedProvinces.reduce((sum, p) => sum + p.capacity, 0);
        const nationalOccupancyPercent = Math.round((nationalTotalActive / nationalTotalCapacity) * 100);
        const totalRiscoElevado = computedProvinces.reduce((sum, p) => sum + Math.round(p.inmatesCount * 0.20), 0);

        const totalMedicalCases = computedProvinces.reduce((sum, p) => sum + p.healthStats.activeCases, 0);
        const totalPrescriptions = computedProvinces.reduce((sum, p) => sum + p.healthStats.prescriptions, 0);
        const totalConsultations = computedProvinces.reduce((sum, p) => sum + p.healthStats.consultations, 0);

        const totalVisitsCount = computedProvinces.reduce((sum, p) => sum + p.movementStats.visits, 0);
        const totalTransfers = computedProvinces.reduce((sum, p) => sum + p.movementStats.transfers, 0);
        const totalInCourt = computedProvinces.reduce((sum, p) => sum + p.movementStats.inCourt, 0);
        const totalTransfersAndAud = totalTransfers + totalInCourt;

        // Core Top Regions dynamically computed based on the highest inmatesCount from all 21 provinces
        const regionStats = [...computedProvinces]
          .sort((a, b) => b.inmatesCount - a.inmatesCount)
          .slice(0, 3)
          .map(p => ({
            province: `${p.name} (${p.code})`,
            inmates: p.inmatesCount,
            limit: p.capacity
          }));

        // Recalculated states
        const statusStats = [
          { status: "Preventiva", count: inmates.filter(inm => inm.estadoJuridico === 'PRISÃO PREVENTIVA' && inm.status !== 'LIBERTADO').length + 800, color: "bg-red-500" },
          { status: "Condenados", count: inmates.filter(inm => inm.estadoJuridico === 'CONDENADO' && inm.status !== 'LIBERTADO').length + 1520, color: "bg-amber-500" },
          { status: "Detetados SIC", count: inmates.filter(inm => inm.estadoJuridico === 'PROVISÓRIO / DETIDO' && inm.status !== 'LIBERTADO').length + 110, color: "bg-teal-500" }
        ];

        // Handle Active Selection
        const selectedProvData = computedProvinces.find(p => p.code === selectedDashboardProvince) || computedProvinces[5]; // defaults to Luanda (LUA)

        const displayTotalActive = dashboardScope === 'selected' ? selectedProvData.inmatesCount : nationalTotalActive;
        const displayTotalCapacity = dashboardScope === 'selected' ? selectedProvData.capacity : nationalTotalCapacity;
        const displayOccupancyPercent = dashboardScope === 'selected' ? selectedProvData.ratio : nationalOccupancyPercent;
        const displayGaugeLabel = dashboardScope === 'selected' ? `Ocupação Saneada - ${selectedProvData.name.toUpperCase()}` : "Ocupação Saneada Nacional (DPA)";

        // Support dynamic display for regional capacity stats
        const displayRegionStats = dashboardScope === 'selected'
          ? [
              { province: `${selectedProvData.name} (${selectedProvData.code})`, inmates: selectedProvData.inmatesCount, limit: selectedProvData.capacity },
              ...[...computedProvinces]
                .filter(p => p.code !== selectedProvData.code)
                .sort((a, b) => b.inmatesCount - a.inmatesCount)
                .slice(0, 2)
                .map(p => ({
                  province: `${p.name} (${p.code})`,
                  inmates: p.inmatesCount,
                  limit: p.capacity
                }))
            ]
          : regionStats;

        // Support dynamic display for status/legal segments
        const displayStatusStats = dashboardScope === 'selected'
          ? [
              { status: "Preventiva", count: Math.round(selectedProvData.inmatesCount * 0.35), color: "bg-red-500" },
              { status: "Condenados", count: Math.round(selectedProvData.inmatesCount * 0.60), color: "bg-amber-500" },
              { status: "Detetados SIC", count: Math.round(selectedProvData.inmatesCount * 0.05), color: "bg-teal-500" }
            ]
          : statusStats;

        // Filter search list
        const filteredGrid = computedProvinces.filter(p => 
          p.name.toLowerCase().includes(provinceSearch.toLowerCase()) || 
          p.code.toLowerCase().includes(provinceSearch.toLowerCase())
        );

        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-display font-medium text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-amber-500" />
                  Centro de Comando e Controlos Operacionais do PNAP-AO
                </h3>
                <p className="text-xs text-gray-400">
                  Divisões territoriais integradas sob a <strong className="text-white">Lei da Divisão Político-Administrativa (DPA 2024)</strong>. Selecione e audite qualquer uma das 21 províncias de Angola.
                </p>
              </div>

              {/* SCOPE & PROVINCE SELECTOR TRIGGER */}
              <div className="flex flex-wrap items-center gap-3 bg-[#0c0d10] p-1.5 rounded border border-zinc-850 text-xs font-mono self-start md:self-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-500 uppercase px-1 font-bold">Escopo:</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setDashboardScope('nacional')}
                      className={`px-3 py-1 rounded transition-all cursor-pointer font-bold uppercase text-[9.5px] ${
                        dashboardScope === 'nacional' ? 'bg-amber-500 text-slate-950 font-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Nacional (21 Províncias)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDashboardScope('selected')}
                      className={`px-3 py-1 rounded transition-all cursor-pointer font-bold uppercase text-[9.5px] ${
                        dashboardScope === 'selected' ? 'bg-amber-500 text-slate-950 font-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Província Ativa
                    </button>
                  </div>
                </div>

                <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-500 uppercase px-1 font-bold">Província:</span>
                  <select
                    value={dashboardScope === 'nacional' ? 'nacional' : selectedDashboardProvince}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'nacional') {
                        setDashboardScope('nacional');
                      } else {
                        setSelectedDashboardProvince(val);
                        setDashboardScope('selected');
                      }
                    }}
                    className="bg-[#18191d] border border-zinc-800 focus:border-amber-500 text-white text-[11px] px-2 py-1 rounded focus:outline-none font-bold cursor-pointer"
                  >
                    <option value="nacional">Todas as Províncias (Nacional)</option>
                    {computedProvinces.map(p => (
                      <option key={p.code} value={p.code}>
                        {p.name} ({p.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              {/* Dynamic Circular Occupancy Gauge of Angola */}
              <OccupancyGauge 
                value={displayOccupancyPercent} 
                capacity={displayTotalCapacity} 
                total={displayTotalActive} 
                label={displayGaugeLabel}
              />

              {/* Dynamic Regional capacity graph bars */}
              <RegionalCapacityChart data={displayRegionStats} />

              {/* Status counts bar charts segments */}
              <StatusIndicatorBars data={displayStatusStats} />
            </div>

            {/* INTERACTIVE 21-PROVINCES MATRIX & DETAIL VIEW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 border-t border-zinc-900 pt-6">
              
              {/* Grid Column 1 & 2: Interactive 21-Provinces Grid or D3 Map */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex bg-[#0c0d10] p-1 rounded border border-zinc-800 text-[11px] font-mono justify-between items-center px-2 py-1.5">
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDashboardSubMode('map')}
                      className={`px-3 py-1 rounded transition-all cursor-pointer font-bold ${
                        dashboardSubMode === 'map' ? 'bg-amber-500/10 border border-amber-500/40 text-[#F59E0B]' : 'text-gray-400 hover:text-white border border-transparent'
                      }`}
                    >
                      🗺️ MAPA CARTOGRÁFICO INTERACTIVO D3.JS
                    </button>
                    <button
                      type="button"
                      onClick={() => setDashboardSubMode('grid')}
                      className={`px-3 py-1 rounded transition-all cursor-pointer font-bold ${
                        dashboardSubMode === 'grid' ? 'bg-amber-500/10 border border-amber-500/40 text-[#F59E0B]' : 'text-gray-400 hover:text-white border border-transparent'
                      }`}
                    >
                      ⊞ TECLADO GERAL (21 PROVÍNCIAS)
                    </button>
                  </div>
                  <span className="text-[9px] text-gray-500 uppercase select-none hidden md:block pr-2 font-mono">SINTONIZADOR DPA-2024</span>
                </div>

                {dashboardSubMode === 'map' ? (
                  <div className="animate-fadeIn duration-200">
                    <AngolaD3Map 
                      data={computedProvinces} 
                      selectedCode={selectedDashboardProvince} 
                      onSelectCode={(code) => setSelectedDashboardProvince(code)}
                    />
                  </div>
                ) : (
                  <div className="space-y-4 animate-fadeIn duration-205">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-[#0c0d10] p-3 rounded border border-zinc-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[11px] font-mono text-white font-bold uppercase tracking-wider">TECLADO TÁCTICO TERRENO (21 PROVÍNCIAS)</span>
                      </div>
                      <input
                        type="text"
                        value={provinceSearch}
                        onChange={(e) => setProvinceSearch(e.target.value)}
                        placeholder="Filtrar por nome ou código..."
                        className="bg-[#18191d] border border-zinc-800 text-xs px-2.5 py-1 rounded placeholder-gray-650 focus:outline-none focus:border-amber-500 w-full sm:w-auto"
                      />
                    </div>

                    {/* 21-Provinces Matrix Display */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 max-h-[310px] overflow-y-auto pr-1">
                      {filteredGrid.map((p) => {
                        const isSelected = p.code === selectedDashboardProvince;
                        const occupancyColor = p.ratio > 90 ? 'bg-red-500' : p.ratio > 75 ? 'bg-amber-500' : 'bg-emerald-500';
                        const textColor = p.ratio > 90 ? 'text-red-400' : p.ratio > 75 ? 'text-amber-400' : 'text-emerald-400';
                        
                        return (
                          <button
                            key={p.code}
                            type="button"
                            onClick={() => setSelectedDashboardProvince(p.code)}
                            className={`p-2.5 rounded border text-left font-mono transition-all relative flex flex-col justify-between h-[68px] cursor-pointer ${
                              isSelected
                                ? 'bg-amber-600/10 border-amber-500 text-white tactical-glow-strong'
                                : 'bg-[#111215]/60 hover:bg-[#111215] border-zinc-850 hover:border-zinc-700 text-gray-400'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className={`text-[10px] px-1 py-0.2 rounded font-bold leading-none ${
                                isSelected ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-300'
                              }`}>
                                {p.code}
                              </span>
                              <span className={`w-1.5 h-1.5 rounded-full ${occupancyColor}`} />
                            </div>
                            
                            <div className="pt-2">
                              <span className={`text-[10.5px] font-sans font-bold uppercase tracking-tight block truncate ${
                                isSelected ? 'text-[#F59E0B]' : 'text-zinc-200'
                              }`}>
                                {p.name}
                              </span>
                              <span className="text-[8.5px] text-gray-500 flex justify-between items-center leading-none mt-0.5">
                                <span>{p.inmatesCount} reclusos</span>
                                <span className={`font-bold ${textColor}`}>{p.ratio}%</span>
                              </span>
                            </div>
                          </button>
                        );
                      })}
                      
                      {filteredGrid.length === 0 && (
                        <div className="col-span-full py-8 text-center text-xs text-gray-500 font-mono">
                          Nenhuma província sintonizada corresponde à sua pesquisa.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Grid Column 3: Chosen Province Details Panel */}
              <div className="bg-[#0c0d10] border border-zinc-800 rounded p-4 flex flex-col justify-between font-mono text-xs min-h-[370px]">
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-850">
                    <span className="text-[10px] text-amber-500 uppercase font-bold">Inspecção Territorial</span>
                    <span className={`text-[8.5px] px-1.5 py-0.5 rounded uppercase font-bold font-sans ${
                      selectedProvData.type === 'Nova' 
                        ? 'bg-blue-950/50 border border-blue-550/30 text-blue-400' 
                        : selectedProvData.type === 'Renomeada'
                        ? 'bg-purple-950/50 border border-purple-550/30 text-purple-400'
                        : 'bg-zinc-900 border border-zinc-800 text-gray-400'
                    }`}>
                      {selectedProvData.type} DPA 2024
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-display font-black text-white uppercase leading-tight tracking-wide">{selectedProvData.name}</h4>
                    <span className="text-[9.5px] text-slate-500 block font-normal pt-1">{selectedProvData.prisonName}</span>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Ocupação Activa</span>
                      <span className="text-white font-bold">{selectedProvData.inmatesCount} / {selectedProvData.capacity}</span>
                    </div>
                    <div className="h-1.5 w-full bg-black rounded overflow-hidden flex">
                      <div
                        style={{ width: `${selectedProvData.ratio}%` }}
                        className={`h-full ${
                          selectedProvData.ratio > 90 ? 'bg-red-500' : selectedProvData.ratio > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                    </div>
                    <span className="text-[8.5px] text-gray-500 text-right block">{selectedProvData.ratio}% sob capacidade de isolamento</span>
                  </div>

                  {/* Distribution of Perigosidade */}
                  <div className="bg-[#111215] border border-zinc-850 p-2.5 rounded text-[10.5px] font-sans text-gray-300 space-y-1.5">
                    <span className="text-[9px] font-mono font-bold text-[#F59E0B] uppercase block">Distribuição do Grau de Perigosidade:</span>
                    <div className="grid grid-cols-3 gap-1 text-center font-mono text-[9px] font-semibold">
                      <div className="bg-zinc-950 p-1.5 rounded border border-zinc-850/80">
                        <span className="text-gray-500 block leading-none pb-1">BAIXO</span>
                        <strong className="text-green-500">{Math.round(selectedProvData.inmatesCount * 0.25)}</strong>
                      </div>
                      <div className="bg-zinc-950 p-1.5 rounded border border-zinc-850/80">
                        <span className="text-gray-500 block leading-none pb-1">MÉDIO</span>
                        <strong className="text-amber-500">{Math.round(selectedProvData.inmatesCount * 0.55)}</strong>
                      </div>
                      <div className="bg-zinc-950 p-1.5 rounded border border-zinc-850/80">
                        <span className="text-gray-500 block leading-none pb-1">GRAVE</span>
                        <strong className="text-red-500">{Math.round(selectedProvData.inmatesCount * 0.20)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Separate Health & Movement Indicators for DPA 2024 */}
                  <div className="bg-[#111215] border border-zinc-850 p-2.5 rounded text-[10.5px] font-sans text-gray-300 space-y-2">
                    <span className="text-[9px] font-mono font-bold text-[#F59E0B] uppercase block">Controles Clínicos e de Tráfego DPA:</span>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {/* Health block */}
                      <div className="bg-zinc-950 p-1.5 rounded border border-zinc-900 space-y-1">
                        <div className="flex items-center gap-1 text-[8.5px] font-mono font-bold text-red-400">
                          <Heart className="h-2.5 w-2.5 shrink-0 text-red-500" /> SAÚDE CLÍNICA
                        </div>
                        <div className="text-[9.5px] font-mono space-y-0.5 text-zinc-400">
                          <div className="flex justify-between">
                            <span>Casos Ativos:</span>
                            <strong className="text-white">{selectedProvData.healthStats.activeCases}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Prescrições:</span>
                            <strong className="text-white">{selectedProvData.healthStats.prescriptions}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Consultas:</span>
                            <strong className="text-white">{selectedProvData.healthStats.consultations}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Movement block */}
                      <div className="bg-zinc-950 p-1.5 rounded border border-zinc-900 space-y-1">
                        <div className="flex items-center gap-1 text-[8.5px] font-mono font-bold text-teal-400">
                          <Activity className="h-2.5 w-2.5 shrink-0 text-teal-500" /> MOVIMENTAÇÕES
                        </div>
                        <div className="text-[9.5px] font-mono space-y-0.5 text-zinc-400">
                          <div className="flex justify-between">
                            <span>Escoltas:</span>
                            <strong className="text-white">{selectedProvData.movementStats.transfers}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Audiências:</span>
                            <strong className="text-white">{selectedProvData.movementStats.inCourt}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Visitas PNAP:</span>
                            <strong className="text-white">{selectedProvData.movementStats.visits}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* List of active state-managed inmates inside the chosen province */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9.5px] text-[#ffffff50] uppercase font-bold block">Reclusos Ativos Adicionais:</span>
                    <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-0.5 animate-duration-150">
                      {selectedProvData.dynamicInmates.map((inm) => (
                        <div key={inm.id} className="bg-zinc-900/60 p-1.5 rounded border border-zinc-850/60 flex items-center gap-2 text-[10px]">
                          <img
                            src={inm.fotoUrl}
                            alt={inm.nome}
                            className="w-5 h-5 rounded-sm object-cover"
                          />
                          <div className="flex-1 truncate">
                            <span className="text-zinc-200 font-bold block truncate uppercase font-sans leading-tight">{inm.nome.split(' ').slice(0, 2).join(' ')}</span>
                            <span className="text-[8px] text-amber-500 font-semibold uppercase">{inm.crime} ({inm.rnr.replace('RNR-AO-2026-', '')})</span>
                          </div>
                        </div>
                      ))}
                      {selectedProvData.dynamicInmates.length === 0 && (
                        <div className="text-[10px] text-gray-500 pl-1.5 font-sans leading-relaxed">
                          Nenhum voluntário adicionado de forma síncrona ainda. Utilize o formulário tático para cadastrar reclusos em <strong className="text-zinc-300 font-mono">{selectedProvData.name}</strong> para ver o log imediato!
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-850 pt-2.5 mt-2 flex items-center justify-between text-[8px] text-gray-500 uppercase tracking-widest font-mono select-none">
                  <span>SIGAE-AO SYNC: CONNECTED</span>
                  <span className="text-emerald-500">ACTIVE ✔</span>
                </div>
              </div>

            </div>

            <div className="bg-zinc-950/60 border border-zinc-800 p-4 rounded text-xs font-mono grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-[#111215] p-3 rounded border border-zinc-850 flex flex-col justify-between">
                <div>
                  <span className="text-gray-550 text-[9.5px] uppercase block mb-1 font-bold">
                    {dashboardScope === 'selected' ? `Risco Elevado (${selectedProvData.code})` : 'Risco Elevado (Nacional)'}
                  </span>
                  <span className="text-2xl font-bold text-red-500">
                    {dashboardScope === 'selected' ? Math.round(selectedProvData.inmatesCount * 0.20) : totalRiscoElevado}
                  </span>
                </div>
                <div className="border-t border-zinc-900 mt-2 pt-1.5 text-[8.5px] text-zinc-500 space-y-0.5 leading-none uppercase">
                  <div>Baixo: <strong className="text-green-500">{dashboardScope === 'selected' ? Math.round(selectedProvData.inmatesCount * 0.25) : computedProvinces.reduce((sum, p) => sum + Math.round(p.inmatesCount * 0.25), 0)}</strong></div>
                  <div>Médio: <strong className="text-amber-500">{dashboardScope === 'selected' ? Math.round(selectedProvData.inmatesCount * 0.55) : computedProvinces.reduce((sum, p) => sum + Math.round(p.inmatesCount * 0.55), 0)}</strong></div>
                </div>
              </div>

              <div className="bg-[#111215] p-3 rounded border border-zinc-850 flex flex-col justify-between">
                <div>
                  <span className="text-gray-550 text-[9.5px] uppercase block mb-1 font-bold">
                    {dashboardScope === 'selected' ? `Casos de Saúde (${selectedProvData.code})` : 'Casos de Saúde (Nacional)'}
                  </span>
                  <span className="text-2xl font-bold text-amber-500">
                    {dashboardScope === 'selected' ? selectedProvData.healthStats.activeCases : totalMedicalCases}
                  </span>
                </div>
                <div className="border-t border-zinc-900 mt-2 pt-1.5 text-[8.5px] text-zinc-500 space-y-0.5 leading-none uppercase">
                  <div>Prescrições: <strong className="text-zinc-350">{dashboardScope === 'selected' ? selectedProvData.healthStats.prescriptions : totalPrescriptions}</strong></div>
                  <div>Consultas: <strong className="text-zinc-350">{dashboardScope === 'selected' ? selectedProvData.healthStats.consultations : totalConsultations}</strong></div>
                </div>
              </div>

              <div className="bg-[#111215] p-3 rounded border border-zinc-850 flex flex-col justify-between">
                <div>
                  <span className="text-gray-550 text-[9.5px] uppercase block mb-1 font-bold">
                    {dashboardScope === 'selected' ? `Escoltas & Trânsito (${selectedProvData.code})` : 'Escoltas & Trânsito (Nacional)'}
                  </span>
                  <span className="text-2xl font-bold text-teal-400">
                    {dashboardScope === 'selected' ? (selectedProvData.movementStats.transfers + selectedProvData.movementStats.inCourt) : totalTransfersAndAud}
                  </span>
                </div>
                <div className="border-t border-zinc-900 mt-2 pt-1.5 text-[8.5px] text-zinc-500 space-y-0.5 leading-none uppercase">
                  <div>Escoltas: <strong className="text-zinc-350">{dashboardScope === 'selected' ? selectedProvData.movementStats.transfers : totalTransfers}</strong></div>
                  <div>Audiências: <strong className="text-zinc-350">{dashboardScope === 'selected' ? selectedProvData.movementStats.inCourt : totalInCourt}</strong></div>
                </div>
              </div>

              <div className="bg-[#111215] p-3 rounded border border-zinc-850 flex flex-col justify-between">
                <div>
                  <span className="text-gray-550 text-[9.5px] uppercase block mb-1 font-bold">
                    {dashboardScope === 'selected' ? `Visitas Ativas (${selectedProvData.code})` : 'Visitas Ativas (Nacional)'}
                  </span>
                  <span className="text-2xl font-bold text-white">
                    {dashboardScope === 'selected' ? selectedProvData.movementStats.visits : totalVisitsCount}
                  </span>
                </div>
                <div className="border-t border-zinc-900 mt-2 pt-1.5 text-[8.5px] text-zinc-500 space-y-0.5 leading-none uppercase">
                  {dashboardScope === 'selected' ? (
                    <div>REGIONAL COV: <strong className="text-zinc-350">{selectedProvData.ratio}% CAP</strong></div>
                  ) : (
                    <div>MÉDIA NACIONAL: <strong className="text-zinc-350">{Math.round(totalVisitsCount / 21)} / PROV</strong></div>
                  )}
                  <div>MÉD. DIA: <strong className="text-zinc-350">{dashboardScope === 'selected' ? Math.round(selectedProvData.movementStats.visits * 0.8) : Math.round(totalVisitsCount * 0.8)}</strong></div>
                </div>
              </div>
            </div>
          </div>
        );
      }

    case 12: // AUDITORIA EM TEMPO REAL
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-display font-medium text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Auditoria Soberana Incorruptível
            </h3>
            <p className="text-xs text-gray-400">Todos os cliques, admissões e despachos assinados pelos directores deixam uma pegada digital auditável que não pode ser apagada por nenhum operador.</p>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800 rounded p-4 font-mono text-xs space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold text-[#ffffff40] border-b border-zinc-800 pb-1.5 uppercase">
              <span>Carimbo e Operador</span>
              <span>Ação Técnica de Custódia</span>
              <span className="hidden md:block">Escopo Visível</span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div key={log.id} className="bg-zinc-900/40 p-3 rounded border border-zinc-850 hover:border-amber-500/30 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-[11px] leading-tight">
                  <div className="space-y-1">
                    <span className="text-gray-500 text-[10px] block leading-none">{log.timestamp}</span>
                    <span className="text-white font-sans font-bold block uppercase">{log.operador}</span>
                    <span className="text-[10px] text-gray-400 font-sans block italic font-semibold">{log.funcao}</span>
                  </div>

                  <div className="flex-1 md:px-10 text-gray-300">
                    <span className="text-amber-500 text-[10px] font-mono block font-bold leading-none select-none uppercase tracking-wide">{log.acao}</span>
                    <p className="font-sans text-[11.5px] leading-snug mt-1.5">{log.detalhes}</p>
                    {log.reclusoId && (
                      <span className="text-[9.5px] text-gray-500 block pt-1 uppercase">Recluso Envolvido: <strong className="text-zinc-200 font-sans">{log.reclusoNome} ({log.reclusoId})</strong></span>
                    )}
                  </div>

                  <span className="text-[9.5px] text-gray-500 font-mono font-bold uppercase leading-none bg-[#111215] px-2 py-1 rounded border border-zinc-850 self-end md:self-center">
                    {log.territoriosVisiveis}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 13: // OPERAÇÃO CRÍTICA OFFLINE
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-display font-medium text-white flex items-center gap-2">
              <Wifi className="h-5 w-5 text-amber-500" />
              Operação Crítica Offline e Sincronização Local
            </h3>
            <p className="text-xs text-gray-400">Angola possui desafios de conectividade de rede nas províncias do interior. PNAP-AO foi desenhado desde o rascunho com arquitetura de resiliência total offline.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Interactive Offline toggle card */}
            <div className="bg-zinc-950/60 border border-zinc-800 rounded p-6 flex flex-col justify-between items-center text-center font-mono text-xs">
              <div>
                <span className="text-gray-500 block uppercase text-[10px] tracking-wide mb-1">Simulado Estado Conexão Estabelecidas</span>
                <span className="text-[11px] font-sans text-gray-400">Clique para simular um corte de fibra ótica global na província</span>
              </div>

              <div className="py-6 flex flex-col items-center">
                <div className={`w-20 h-20 rounded-full border flex items-center justify-center transition-all ${
                  offlineStatus 
                    ? 'bg-red-950/20 border-red-500 text-red-500 tactical-glow-strong animate-pulse' 
                    : 'bg-emerald-950/15 border-emerald-500 text-emerald-500'
                }`}>
                  {offlineStatus ? <WifiOff className="h-8 w-8" /> : <Wifi className="h-8 w-8" />}
                </div>

                <span className={`text-md uppercase block font-bold mt-4 tracking-widest ${
                  offlineStatus ? 'text-red-500' : 'text-emerald-500'
                }`}>
                  {offlineStatus ? 'MODO LOCAL (OFFLINE) ACTIVADO' : 'REDES INTERLIGADAS CENTRAL (ONLINE)'}
                </span>

                <span className="text-[10px] text-gray-500 block mt-1.5 h-6">
                  {offlineStatus ? 'Gravando eventos em mem_cache robusto localmente' : 'Canal dedicado de fibra óptica com encriptação SSH de pé'}
                </span>
              </div>

              <button
                type="button"
                onClick={onToggleOffline}
                className={`px-5 py-2 rounded text-xs font-bold uppercase cursor-pointer tracking-wider transition-colors font-mono ${
                  offlineStatus 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950' 
                    : 'bg-red-500 hover:bg-red-650 text-white'
                }`}
              >
                {offlineStatus ? 'Simular Ligação Restaurada' : 'Simular Queda de Internet'}
              </button>
            </div>

            {/* Offline execution algorithm roadmap explanatory */}
            <div className="bg-[#0c0d10] border border-zinc-800 rounded p-5 font-sans text-xs space-y-4">
              <span className="text-amber-500 uppercase font-mono font-bold text-[9px] block">Arquitetura de Recuperação Crítica de Conexão</span>

              <div className="space-y-3.5 pt-1">
                <div className="flex gap-2 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <div>
                    <strong className="text-white block text-sm font-display leading-none">Sem Queda de Produtividade</strong>
                    <p className="text-gray-455 text-[11px] leading-snug mt-1 pt-0.5">Mesmo em blackout absoluto de internet, os guardas admitem reclusos, registam ordens de prisão e procedem a chamadas biológicas com biometria guardada em cache local.</p>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <div>
                    <strong className="text-white block text-sm font-display leading-none">Criptografia Local Segura</strong>
                    <p className="text-gray-455 text-[11px] leading-snug mt-1 pt-0.5">Os dados capturados localmente não ficam visíveis ou expostos sem palavra-passe militar. O motor encripta o SQLite local com chave derivada do login.</p>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <div>
                    <strong className="text-white block text-sm font-display leading-none">Sincronização Integrada Resiliente</strong>
                    <p className="text-gray-455 text-[11px] leading-snug mt-1 pt-0.5">Assim que o sinal de rede restabelece (seja 3G, rádio micro-ondas ou satélite Starlink), a plataforma faz upload sequencial e reordenação dos blocos de Logs de forma autónoma.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 14: // INTEGRAÇÕES FUTURAS
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-display font-medium text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-amber-500" />
              Integrações Futuras: Ecossistema de Defesa e Justiça
            </h3>
            <p className="text-xs text-gray-400">Interligação de dados para agilizar despachos legais de julgamentos e mitigar detidos provisórios que ultrapassam excessos de prazo.</p>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800 rounded p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center font-mono text-xs">
              <div className="bg-[#111215] border border-zinc-850 p-4 rounded hover:border-amber-500/40 transition-colors flex flex-col justify-between h-[150px]">
                <span className="text-amber-500 font-bold block text-[10px] leading-tight">SIS-JUSTIÇA</span>
                <span className="text-white font-sans font-bold block uppercase leading-tight pt-2">TRIBUNAIS</span>
                <p className="text-[10px] font-sans text-gray-500 leading-tight pt-1">Notificação imediata de mandados de culpas, datas de julgamento e certidões criminais.</p>
                <div className="text-[9px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">FASE 2 IMPLEMENTAÇÃO</div>
              </div>

              <div className="bg-[#111215] border border-zinc-850 p-4 rounded hover:border-amber-500/40 transition-colors flex flex-col justify-between h-[150px]">
                <span className="text-amber-500 font-bold block text-[10px] leading-tight">CUSTÓDIA LEGAL</span>
                <span className="text-white font-sans font-bold block uppercase leading-tight pt-2">MINISTÉRIO PÚBLICO</span>
                <p className="text-[10px] font-sans text-gray-500 leading-tight pt-1">Controlo coordenado e vistorias gerais electrónicas mensais obrigatórias de legalidade.</p>
                <div className="text-[9px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">FASE 2 IMPLEMENTAÇÃO</div>
              </div>

              <div className="bg-[#111215] border border-zinc-850 p-4 rounded hover:border-amber-500/40 transition-colors flex flex-col justify-between h-[150px]">
                <span className="text-amber-500 font-bold block text-[10px] leading-tight">INVESTIGAÇÃO CRIMINAL</span>
                <span className="text-white font-sans font-bold block uppercase leading-tight pt-2">SIC</span>
                <p className="text-[10px] font-sans text-gray-500 leading-tight pt-1 font-sans">Triagem fotográfica instantânea e partilha de antecedentes no acto de flagrante de suspeitos.</p>
                <div className="text-[9px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">FASE 1 - NATIVO</div>
              </div>

              <div className="bg-[#111215] border border-zinc-850 p-4 rounded hover:border-amber-500/40 transition-colors flex flex-col justify-between h-[150px]">
                <span className="text-amber-500 font-bold block text-[10px] leading-tight">FRONTEIRA E VISTO</span>
                <span className="text-white font-sans font-bold block uppercase leading-tight pt-2">SME</span>
                <p className="text-[10px] font-sans text-gray-500 leading-tight pt-1">Cruzamento imediato em aeroportos e postos aduaneiros de evadidos ou mandados vigentes.</p>
                <div className="text-[9px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">FASE 2 - INTERLIGADO</div>
              </div>

              <div className="bg-[#111215] border border-zinc-850 p-4 rounded hover:border-amber-500/40 transition-colors flex flex-col justify-between h-[150px]">
                <span className="text-amber-500 font-bold block text-[10px] leading-tight">DIRECÇÃO SOBERANA</span>
                <span className="text-white font-sans font-bold block uppercase leading-tight pt-2">BI NACIONAL</span>
                <p className="text-[10px] font-sans text-gray-500 leading-tight pt-1">Identificação unificada por impressão digital civil directamente na base centralizada.</p>
                <div className="text-[9px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">FASE 1 - NATIVO</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 15: // BENEFÍCIOS INSTITUCIONAIS (Antes vs Depois Table)
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-display font-medium text-white flex items-center gap-2">
              <Landmark className="h-5 w-5 text-amber-500" />
              Retorno Estratégico Estatal: Comparativo de Governança
            </h3>
            <p className="text-xs text-gray-400">Visão global dos saltos administrativos introduzidos pela implementação imediata da Plataforma Nacional de Administração Penitenciária.</p>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800 rounded p-4 font-sans text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800 text-[10px] font-mono text-gray-500 uppercase tracking-widest bg-[#111215]/80">
                    <th className="py-2.5 px-4 font-semibold text-amber-500 h-8">PARÂMETRO OPERACIONAL</th>
                    <th className="py-2.5 px-4 font-semibold text-red-500 h-8">SITUÇÃO ANTES (SEM PLATAFORMA)</th>
                    <th className="py-2.5 px-4 font-semibold text-emerald-500 h-8">SITUÇÃO DEPOIS (COM PNAP-AO)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  <tr className="hover:bg-zinc-900/30">
                    <td className="py-3 px-4 font-mono font-bold uppercase text-[10.5pt] text-white">Suporte Físico</td>
                    <td className="py-3 px-4 text-gray-400 font-medium">Papel, livros de presença vulneráveis e caneta esferográfica comum.</td>
                    <td className="py-3 px-4 text-zinc-200 font-medium bg-emerald-950/10">Computadores com interface local cifrada e tablets de ronda militar.</td>
                  </tr>
                  <tr className="hover:bg-zinc-900/30">
                    <td className="py-3 px-4 font-mono font-bold uppercase text-[10.5pt] text-white">Consolidação Operacional</td>
                    <td className="py-3 px-4 text-gray-400 font-medium">Registo disperso de comarca sem intersecção remota de rede.</td>
                    <td className="py-3 px-4 text-zinc-200 font-medium bg-emerald-950/10">Base centralizada nacional subordinada ao controlo e servidores do MININT.</td>
                  </tr>
                  <tr className="hover:bg-zinc-900/30">
                    <td className="py-3 px-4 font-mono font-bold uppercase text-[10.5pt] text-white">Auditoria de Abusos</td>
                    <td className="py-3 px-4 text-gray-400 font-medium">Investigação interna manual retrospectiva muito lenta e pouco confiável.</td>
                    <td className="py-3 px-4 text-zinc-200 font-medium bg-emerald-950/10">Logs de auditoria instantâneos e insolúveis baseados em chaves de operador.</td>
                  </tr>
                  <tr className="hover:bg-zinc-900/30">
                    <td className="py-3 px-4 font-mono font-bold uppercase text-[10.5pt] text-white">Tempo de Ocupação</td>
                    <td className="py-3 px-4 text-gray-450 font-medium flex items-center">Quinzenal, com dados estimados por telefone passíveis de erro táctico.</td>
                    <td className="py-3 px-4 text-zinc-200 font-medium bg-emerald-950/10">Tempo real recalculado a cada nova admissão em menos de 1 segundo.</td>
                  </tr>
                  <tr className="hover:bg-zinc-900/30">
                    <td className="py-3 px-4 font-mono font-bold uppercase text-[10.5pt] text-white">Armamento e Logística</td>
                    <td className="py-3 px-4 text-gray-400 font-medium">Cadernos de armaria manuais, sem enquadramento rápido em caso de extravio.</td>
                    <td className="py-3 px-4 text-zinc-200 font-medium bg-emerald-950/10">Nativo SIGAE-AO com registo de número de série e alerta imediato de posse.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

    case 16: // ROADMAP NACIONAL
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-display font-medium text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Cronograma de Acção e Roadmap Nacional
            </h3>
            <p className="text-xs text-gray-400">Implementação rápida com impacto administrativo imediato desde o Primeiro Dia.</p>
          </div>

          <div className="bg-zinc-950/65 border border-zinc-800 p-5 rounded font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Vertical timeline connectors inside grid */}
              <div className="absolute top-[30%] bottom-[30%] inset-x-0 border-t border-dashed border-amber-500/20 select-none pointer-events-none hidden md:block" />

              <div className="bg-[#111215] border border-amber-500/30 p-4 rounded relative tactical-glow">
                <span className="absolute top-2 right-2 bg-amber-500/10 text-amber-500 text-[9px] px-2 py-0.5 rounded border border-amber-500/20 font-bold">FOCADO IMEDIATO</span>
                <span className="text-[10px] text-amber-500 block uppercase font-bold mb-1">Fase 1 • Meses 1 a 3</span>
                <strong className="text-white block text-sm font-display uppercase pb-2">IMPLANTAÇÃO PILOTO</strong>
                <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                  Configuração dos servidores dedicados soberanos e capacitação imediata de técnicos na <strong>Escola Nacional de Técnica Penitenciária</strong>. Entrada em produção no Huambo e Direção Geral de Luanda.
                </p>
                <div className="mt-3 text-[10px] font-mono text-gray-500 flex items-center gap-1.5 pt-2 border-t border-zinc-800 uppercase font-bold">
                  <Check className="h-3 w-3 text-amber-500" /> Triagem Facial e RNR
                </div>
              </div>

              <div className="bg-[#111215] border border-[#2e3039] p-4 rounded relative hover:border-amber-500/30 transition-all">
                <span className="text-[10px] text-amber-500 block uppercase font-bold mb-1">Fase 2 • Meses 4 a 6</span>
                <strong className="text-white block text-sm font-display uppercase pb-2">EXPANSÃO INTEGRADA</strong>
                <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                  Extensão operacional para <strong className="text-white">5 Províncias Críticas</strong> (Luanda Viana/Caboxa, Benguela, Bengo, Cuanza Sul e Cabinda). Integração do barramento nativo SIGAE-AO e biometria SME.
                </p>
                <div className="mt-3 text-[10px] font-mono text-gray-500 flex items-center gap-1.5 pt-2 border-t border-zinc-800 uppercase font-bold">
                  <Check className="h-3 w-3 text-amber-500" /> Sincronização SIGAE-AO
                </div>
              </div>

              <div className="bg-[#111215] border border-[#2e3039] p-4 rounded relative hover:border-amber-500/30 transition-all">
                <span className="text-[10px] text-amber-500 block uppercase font-bold mb-1">Fase 3 • Meses 7 a 12</span>
                <strong className="text-white block text-sm font-display uppercase pb-2">SOBERANIA NACIONAL</strong>
                <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                  Cobertura integral nas <strong className="text-white">21 Províncias de Angola (DPA 2024)</strong>. Ativação do módulo integrado com o Ministério da Justiça (Tribunais e Procuradoria Geral da República).
                </p>
                <div className="mt-3 text-[10px] font-mono text-gray-500 flex items-center gap-1.5 pt-2 border-t border-zinc-800 uppercase font-bold text-amber-500/80">
                  <Sparkles className="h-3 w-3 text-amber-s500" /> 100% Saneamento Estatal
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3.5 bg-[#0c0d10] border border-zinc-850 rounded text-gray-450 leading-relaxed font-sans text-xs">
              <strong className="text-amber-500">Garantia Técnica:</strong> A expansão baseia-se numa rede redundante satélite. Caso uma comarca perca conectividade de rede nas províncias do interior, a plataforma executa de forma autónoma através do motor offline desenvolvido pela <strong className="text-white">Vitronis</strong>, eliminando o risco de colapso de gestão.
            </div>
          </div>
        </div>
      );

    case 17: // PÁGINA FINAL (Commercial proposal, trial, Vitronis branding, souveranity)
      return (
        <div className="flex flex-col justify-between min-h-[460px] relative px-4 text-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1d22_1px,transparent_1px),linear-gradient(to_bottom,#1c1d22_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-10 select-nonepointer-events-none" />

          <div className="z-10 space-y-4 pt-4">
            <h3 className="text-5xl font-display font-black tracking-tight text-white m-0">
              PNAP-AO
            </h3>
            <h4 className="text-lg font-display font-bold text-amber-500 uppercase tracking-widest block">
              Plataforma Nacional de Administração Penitenciária de Angola
            </h4>
            <div className="h-[1px] w-20 bg-amber-500 mx-auto" />
            <p className="text-gray-400 text-sm max-w-lg mx-auto font-sans tracking-wide leading-relaxed">
              Uma infraestrutura digital de segurança soberana concebida para modernizar, unificar e fortalecer o sistema penitenciário da República de Angola.
            </p>
          </div>

          {"/* Elegant Structured grid detailing payment trials and enterprise info */"}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center font-mono uppercase text-[9.5px] max-w-4xl mx-auto w-full z-10 pt-4 pb-4">
            <div className="bg-[#111215]/80 border border-zinc-800/80 p-3 rounded">
              <span className="text-amber-500 font-bold block">SOBERANIA LOCAL</span>
              <span className="text-white pt-1 block normal-case font-sans">Servidores Dedicados Internos MININT</span>
            </div>
            <div className="bg-[#111215]/80 border border-[#2e3039] p-3 rounded">
              <span className="text-amber-500 font-bold block">PILOTO IMEDIATO</span>
              <span className="text-white pt-1 block normal-case font-sans">Disponível de Imediato para Huambo</span>
            </div>
            <div className="bg-[#111215]/80 border border-zinc-800/80 p-3 rounded">
              <span className="text-amber-500 font-bold block">FORMAÇÃO INTEGRADA</span>
              <span className="text-white pt-1 block normal-case font-sans">Capacitação de Especialistas Provinciais</span>
            </div>
            <div className="bg-[#111215]/80 border border-[#2e3039] p-3 rounded">
              <span className="text-amber-500 font-bold block">CONDIÇÃO COMERCIAL</span>
              <span className="text-white pt-1 block normal-case font-sans">A Discussão Conforme Escala e Fases</span>
            </div>
          </div>

          <div className="z-10 bg-[#0d0e12]/80 border border-[#2e3039] p-4 rounded max-w-md mx-auto w-full text-center font-sans space-y-2 mb-4">
            <span className="text-amber-500 uppercase font-mono font-bold text-[10px] tracking-widest block leading-none select-none">Vitronis - Robótica e Controle, Lda.</span>
            <div className="text-xs text-zinc-300">
              Email Corporativo: <strong className="text-white select-all">inf@vitronis.co.ao</strong><br />
              Portal Técnico: <a href="https://www.vitronis.co.ao" target="_blank" rel="noopener noreferrer" className="text-amber-400 font-bold hover:underline">www.vitronis.co.ao</a><br />
              Luanda, República de Angola
            </div>
            <div className="text-[10px] text-gray-550 pt-1 font-mono uppercase">
              Consorciando Desenvolvimento Soberano com Comando Tático Estatal
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center min-h-[300px]">
          <span className="text-gray-400">Pág. {slideId} em desenvolvimento.</span>
        </div>
      );
  }
}
