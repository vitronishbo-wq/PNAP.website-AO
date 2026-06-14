/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Inmate, WeaponItem, VisitRecord, HealthRecord, AuditLog } from './types';
import { 
  INITIAL_INMATES, 
  INITIAL_WEAPONS, 
  INITIAL_VISITS, 
  INITIAL_HEALTH, 
  INITIAL_AUDIT_LOGS, 
  SLIDES_LIST 
} from './data';
import AdmissionDemo from './components/AdmissionDemo';
import SlideContent from './components/SlideContent';
import { 
  Shield, Play, Pause, ChevronLeft, ChevronRight, RefreshCw, Zap,
  UserCheck, Database, Sliders, CheckSquare, Layers, Lock, PhoneCall, HelpCircle, Eye, Power
} from 'lucide-react';

export default function App() {
  // Shared state systems for real-time demo updates
  const [inmates, setInmates] = useState<Inmate[]>(INITIAL_INMATES);
  const [weapons, setWeapons] = useState<WeaponItem[]>(INITIAL_WEAPONS);
  const [visits, setVisits] = useState<VisitRecord[]>(INITIAL_VISITS);
  const [health, setHealth] = useState<HealthRecord[]>(INITIAL_HEALTH);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  
  // Presentation slide controllers
  const [currentSlideId, setCurrentSlideId] = useState<number>(1);
  const [activeInmate, setActiveInmate] = useState<Inmate | null>(INITIAL_INMATES[0]);
  const [userRole, setUserRole] = useState<'DG' | 'DIR_HUAMBO' | 'DIR_LUANDA'>('DG');
  const [offlineStatus, setOfflineStatus] = useState<boolean>(false);
  
  // Navigation auto plays
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [playIntervalId, setPlayIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Floating admission drawer controller
  const [isDemoDrawerOpen, setIsDemoDrawerOpen] = useState<boolean>(false);

  // Time state to showcase real-time active military command clock
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('2026-06-14T12:17:38-07:00');

  // Sync clock every second with user metadata context representing Angola TZ
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Emulate UTC+1 (Angola Local Time Zone)
      const angolaTime = new Date(now.getTime() + (1 * 60 * 60 * 1000));
      setCurrentTimeStr(angolaTime.toISOString().replace('Z', '+01:00').substring(11, 19));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Slide autoplay loop handler
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlideId((prev) => {
          if (prev >= 17) {
            setIsAutoPlaying(false);
            return 1;
          }
          return prev + 1;
        });
      }, 7000); // 7 seconds per informative page
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  // Handle slide select
  const selectSlide = (id: number) => {
    setCurrentSlideId(id);
    setIsAutoPlaying(false);
  };

  const handleNextSlide = () => {
    setCurrentSlideId((prev) => (prev < 17 ? prev + 1 : 1));
    setIsAutoPlaying(false);
  };

  const handlePrevSlide = () => {
    setCurrentSlideId((prev) => (prev > 1 ? prev - 1 : 17));
    setIsAutoPlaying(false);
  };

  // State mutators for 60-second Demo Integration
  const handleAddNewInmate = (newInmate: Inmate) => {
    setInmates((prev) => [newInmate, ...prev]);
    setActiveInmate(newInmate);
    
    // Auto sync health dossier
    const newHealth: HealthRecord = {
      reclusoRnr: newInmate.rnr,
      reclusoNome: newInmate.nome,
      estadoSaude: newInmate.nivelRisco === 'ELEVADO' ? 'MONITORIZAÇÃO CRÍTICA' : 'ESTÁVEL',
      medicacaoPrescrita: 'Nenhuma - Avaliação Inicial Concluída',
      historicoConsultas: [
        {
          data: new Date().toISOString().replace('T', ' ').substring(0, 16),
          especialidade: 'Clínica Geral (Triagem Admissão)',
          diagnostico: 'Aprovado sob critérios de custódia civil',
          medico: 'Dr. Afonso Ngola'
        }
      ]
    };
    setHealth((prev) => [newHealth, ...prev]);
  };

  const handleAddAuditLog = (action: string, reclusoId: string, reclusoNome: string, detalhes: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      operador: 'Mateus Banza Banza',
      funcao: 'Operador de Escolta / Custódia',
      acao: action,
      reclusoId,
      reclusoNome,
      detalhes,
      territoriosVisiveis: 'HUAMBO • COMARCA PRINCIPAL'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleHandoverWeapon = (weaponId: string, officerName: string) => {
    setWeapons((prev) => prev.map(w => {
      if (w.id === weaponId) {
        return {
          ...w,
          estado: 'EM_SERVIÇO',
          agenteAtribuido: officerName,
          dataAtribuicao: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
      }
      return w;
    }));

    const weapon = weapons.find(w => w.id === weaponId);
    handleAddAuditLog(
      'ATRIBUIÇÃO DE ARMAMENTO SIGAE',
      '',
      '',
      `Arma ${weapon?.marca} S/N: ${weapon?.numeroSerie} entregue ao Agente: ${officerName} para trânsito especial.`
    );
  };

  const handleReturnWeapon = (weaponId: string) => {
    const weapon = weapons.find(w => w.id === weaponId);
    const officer = weapon?.agenteAtribuido;

    setWeapons((prev) => prev.map(w => {
      if (w.id === weaponId) {
        return {
          ...w,
          estado: 'DISPONÍVEL',
          agenteAtribuido: undefined,
          dataAtribuicao: undefined
        };
      }
      return w;
    }));

    if (officer) {
      handleAddAuditLog(
        'ENTREGA DE ARMAMENTO SIGAE',
        '',
        '',
        `Arma ${weapon?.marca} S/N: ${weapon?.numeroSerie} devolvida em segurança pelo Agente: ${officer} à armaria nacional.`
      );
    }
  };

  const handleVerifyVisit = (visitId: string, approved: boolean) => {
    setVisits((prev) => prev.map(v => {
      if (v.id === visitId) {
        return {
          ...v,
          status: approved ? 'APROVADO' : 'RECUSADO'
        };
      }
      return v;
    }));

    const visit = visits.find(v => v.id === visitId);
    handleAddAuditLog(
      'CONTRÔLO DE VISITA',
      visit?.reclusoRnr?.replace('RNR-', '') || '',
      '',
      `Visita solicitada por ${visit?.visitanteNome} (${visit?.parentesco}) foi ${approved ? 'APROVADA' : 'RECUSADA'} por auditor de triagem local.`
    );
  };

  const handleToggleOfflineSync = () => {
    setOfflineStatus((prev) => {
      const next = !prev;
      handleAddAuditLog(
        next ? 'CATASTROFE DE REDE' : 'RESTAURAÇÃO DE CONEXÃO',
        '',
        '',
        next 
          ? 'Link primário de fibra óptica rompido. Sistema operando em barramento cache SQLite local.' 
          : 'Ligação redundante restabelecida. Sincronizadas todas as guias locais pendentes com a Direção Geral (100% integridade).'
      );
      return next;
    });
  };

  const currentSlide = SLIDES_LIST.find((s) => s.id === currentSlideId)!;

  return (
    <div id="app-root" className="min-h-screen bg-[#050505] text-[#ffffff] flex flex-col items-stretch overflow-x-hidden font-sans select-none selection:bg-amber-500 selection:text-slate-950">
      
      {"/* TACTICAL COMMAND TOP BAR */"}
      <header className="h-[64px] bg-[#111111] border-b border-white/10 px-6 flex items-center justify-between text-xs font-mono relative z-10 select-none">
        <div className="flex items-center gap-4">
          {/* Simulated Soveriegn Nation Crest graphic */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] relative">
              <Shield className="h-5 w-5" />
              <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div>
              <span className="text-[14px] font-display font-extrabold tracking-wider text-white block leading-none">PNAP-AO</span>
              <span className="text-[8.5px] font-mono text-[#F59E0B] block uppercase tracking-tight pt-1 leading-none">Min. do Interior • Angola</span>
            </div>
          </div>
          
          <div className="hidden lg:flex h-4 w-[1px] bg-white/10" />

          <div className="hidden lg:flex items-center gap-2 text-gray-500">
            <Layers className="h-3.5 w-3.5 text-[#F59E0B]/70" />
            <span>Módulo Saneamento de Custódia: <strong className="text-zinc-300">ACTIVO</strong></span>
          </div>
        </div>

        {/* Tactical Indicators */}
        <div className="flex items-center gap-4">
          {/* Active User Level Badge */}
          <div className="hidden md:flex flex-col text-right">
            <span className="text-gray-500 text-[8px] uppercase block leading-none">Perfil Autenticado</span>
            <span className="text-white font-bold uppercase pt-0.5 leading-none tracking-wide text-[11px]">
              {userRole === 'DG' ? '👑 Director Geral (Nacional)' : userRole === 'DIR_HUAMBO' ? '📍 Dir. Huambo (Local)' : '📍 Dir. Luanda (Local)'}
            </span>
          </div>

          <div className="hidden md:block h-6 w-[1px] bg-white/10" />

          {/* Clock representing telemetry of military command */}
          <div className="text-right">
            <span className="text-[8px] text-gray-500 block leading-none uppercase">Hora Local Luanda</span>
            <span className="text-[#F59E0B] font-bold block pt-1 font-mono tracking-widest leading-none text-xs">
              {currentTimeStr}
            </span>
          </div>

          <div className="h-6 w-[1px] bg-white/10" />

          {/* Master 60s Demo Activation Switcher */}
          <button
            type="button"
            onClick={() => setIsDemoDrawerOpen(!isDemoDrawerOpen)}
            className={`cursor-pointer px-4 py-2 rounded text-xs uppercase font-mono font-bold flex items-center gap-2 border transition-all ${
              isDemoDrawerOpen
                ? 'bg-[#F59E0B] border-[#d97706] text-black font-extrabold'
                : 'bg-[#F59E0B]/10 border-[#F59E0B]/35 text-[#F59E0B] hover:bg-[#F59E0B]/20'
            }`}
          >
            <Zap className={`h-3.5 w-3.5 ${isDemoDrawerOpen ? 'animate-bounce text-black' : 'text-[#F59E0B]'}`} />
            {isDemoDrawerOpen ? 'Fechar Demo' : 'Demo 60-Segundos'}
          </button>
        </div>
      </header>

      {"/* PRIMARY PRESENTATION WORKSPACE STAGE */"}
      <main className="flex-1 flex flex-col md:flex-row items-stretch select-none">
        
        {/* LEFT COLUMN: 17 Page Tactical Index List */}
        <aside className="w-full md:w-[260px] bg-[#111111] border-r border-white/10 flex flex-col justify-between select-none">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Dossiê de Demonstração</span>
            <span className="text-[10px] font-mono text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/30 px-1.5 py-0.5 rounded leading-none font-bold">17 PÁGINAS</span>
          </div>

          {/* Slides lists */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[calc(100vh-214px)]">
            {SLIDES_LIST.map((slide) => {
              const isActive = currentSlideId === slide.id;
              return (
                <button
                  key={slide.id}
                  onClick={() => selectSlide(slide.id)}
                  className={`w-full text-left p-2 rounded transition-all transition-duration-150 relative ${
                    isActive 
                      ? 'bg-black/40 border-l-2 border-[#F59E0B] text-white font-bold' 
                      : 'hover:bg-white/5 text-gray-400 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[11px] font-mono leading-none">
                    <span className={`w-4 h-4 rounded-sm flex items-center justify-center text-[9px] font-bold ${
                      isActive ? 'bg-[#F59E0B] text-black' : 'bg-white/10 text-gray-400'
                    }`}>
                      {slide.id}
                    </span>
                    <span className={`text-[10.5px] uppercase font-sans tracking-wide truncate ${
                      isActive ? 'text-[#F59E0B]' : 'text-gray-300'
                    }`}>
                      {slide.title}
                    </span>
                  </div>
                  <span className="text-[9px] text-gray-500 block truncate pl-6 pt-1 font-serif">
                    {slide.subtitle}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Presenter control tools at bottom of slide rail */}
          <div className="p-4 border-t border-white/10 bg-black/40 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-center text-[9px] font-mono uppercase">
              <div className="bg-[#111111] border border-white/10 py-1.5 rounded">
                <span className="text-gray-500 block">Sincronia</span>
                <span className="text-emerald-400 font-bold">ACTIVA</span>
              </div>
              <div className="bg-[#111111] border border-white/10 py-1.5 rounded">
                <span className="text-gray-500 block">Base de Dados</span>
                <span className="text-[#F59E0B] font-bold">LOCAL</span>
              </div>
            </div>
            <div className="text-[9.5px] text-gray-400 font-sans leading-tight text-center">
              Construído de forma soberana para a tutela ministerial.
            </div>
          </div>
        </aside>

        {/* CENTRE STAGE: HIGH FIDELITY INTERACTIVE SCREEN */}
        <section className="flex-1 bg-[#050505] p-4 md:p-6 flex flex-col justify-between relative overflow-y-auto max-h-[calc(100vh-64px)] select-none">
          
          {/* Active drawer or active slide render */}
          <div className="space-y-4">
            
            {/* Slide title block */}
            <div className="border-b border-white/10 pb-3 mb-4 flex justify-between items-end flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#F59E0B] uppercase tracking-widest font-bold">
                  <span>Secção Territorial: {currentSlide.section}</span>
                  <span>&bull;</span>
                  <span>Página {currentSlideId} de 17</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-white tracking-tight uppercase mt-1 leading-none">{currentSlide.title}</h2>
                <h3 className="text-xs text-gray-400 font-serif italic pt-1">{currentSlide.subtitle}</h3>
              </div>

              {/* Status lights mimicking telemetry */}
              <div className="flex gap-1.5 select-none text-[9.5px] font-mono font-semibold">
                <span className="px-2 py-0.5 bg-emerald-950/50 text-emerald-400 border border-emerald-500/20 rounded leading-none uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> SOBERANO
                </span>
                <span className="px-2 py-0.5 bg-amber-950/50 text-[#F59E0B] border border-[#F59E0B]/20 rounded leading-none uppercase">
                  v1.1
                </span>
              </div>
            </div>

            {/* IF Demo Drawer takes over, we put a highly visible banner warning, OR display BOTH */}
            {isDemoDrawerOpen ? (
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
                <div className="xl:col-span-3 space-y-4">
                  <div className="bg-[#F59E0B]/5 border border-[#F59E0B]/40 p-3 rounded text-[11px] font-sans text-gray-300 flex items-center justify-between">
                    <div>
                      <strong className="text-white block uppercase text-[12px] font-display font-semibold mb-1">MÉDUA DETIDA: Demonstração ao Vivo Activa</strong>
                      Utilize o formulário técnico lateral para cadastrar dados fictícios. Os resultados do teste serão injetados de forma síncrona na visualização ativa do dashboard ou auditoria ao lado!
                    </div>
                  </div>
                  
                  {/* Embedded presentation slide block to see immediate updates */}
                  <div className="bg-[#111111] border border-white/10 rounded p-5">
                    <SlideContent
                      slideId={currentSlideId}
                      inmates={inmates}
                      weapons={weapons}
                      visits={visits}
                      health={health}
                      auditLogs={auditLogs}
                      activeInmate={activeInmate}
                      onSelectInmate={setActiveInmate}
                      userRole={userRole}
                      onSetUserRole={setUserRole}
                      offlineStatus={offlineStatus}
                      onToggleOffline={handleToggleOfflineSync}
                      onHandoverWeapon={handleHandoverWeapon}
                      onReturnWeapon={handleReturnWeapon}
                      onVerifyVisit={handleVerifyVisit}
                    />
                  </div>
                </div>

                <div className="xl:col-span-2">
                  <AdmissionDemo
                    onAddInmate={handleAddNewInmate}
                    onAddAuditLog={handleAddAuditLog}
                    activeProvince={userRole === 'DIR_HUAMBO' ? 'HUAMBO' : userRole === 'DIR_LUANDA' ? 'LUANDA' : 'LUANDA'}
                  />
                </div>
              </div>
            ) : (
              /* Normal fullscreen high-fidelity slide viewer */
              <div className="bg-[#111111] border border-white/10 rounded-sm p-5 min-h-[420px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
                {/* Decorative border tags representing defense layout */}
                <div className="absolute top-0 left-0 h-1.5 w-1.5 border-t border-l border-[#F59E0B]" />
                <div className="absolute top-0 right-0 h-1.5 w-1.5 border-t border-r border-[#F59E0B]" />
                <div className="absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l border-[#F59E0B]" />
                <div className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-[#F59E0B]" />

                <SlideContent
                  slideId={currentSlideId}
                  inmates={inmates}
                  weapons={weapons}
                  visits={visits}
                  health={health}
                  auditLogs={auditLogs}
                  activeInmate={activeInmate}
                  onSelectInmate={setActiveInmate}
                  userRole={userRole}
                  onSetUserRole={setUserRole}
                  offlineStatus={offlineStatus}
                  onToggleOffline={handleToggleOfflineSync}
                  onHandoverWeapon={handleHandoverWeapon}
                  onReturnWeapon={handleReturnWeapon}
                  onVerifyVisit={handleVerifyVisit}
                />
              </div>
            )}
          </div>

          {/* BOTTOM PRESENTATION DECK CONTROL CONTROLLER */}
          <div className="mt-8 border-t border-white/10 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 font-mono select-none">
            
            {/* Autoplay toggler indicator */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`cursor-pointer px-3 py-1.5 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 border transition-all ${
                  isAutoPlaying 
                    ? 'bg-[#F59E0B]/15 border-[#F59E0B] text-[#F59E0B] font-bold' 
                    : 'bg-[#111111] border border-white/10 text-gray-400 hover:border-[#F59E0B]/50'
                }`}
              >
                {isAutoPlaying ? <Pause className="h-3 w-3 text-[#F59E0B]" /> : <Play className="h-3 w-3 text-gray-500" />}
                {isAutoPlaying ? 'PAUSAR REPRODUÇÃO AUTO' : 'APRESENTAÇÃO AUTOMÁTICA'}
              </button>
              {isAutoPlaying && (
                <span className="text-[9px] text-[#F59E0B]/80 animate-pulse uppercase">Modulando 7s por Página</span>
              )}
            </div>

            {/* Absolute page step indicator timeline */}
            <div className="hidden lg:flex items-center gap-1.5 text-[10px]">
              {SLIDES_LIST.map((slide) => (
                <button
                  key={slide.id}
                  onClick={() => selectSlide(slide.id)}
                  className={`w-5 h-5 rounded-sm flex items-center justify-center font-bold text-[9px] transition-all cursor-pointer ${
                    currentSlideId === slide.id
                      ? 'bg-[#F59E0B] text-black scale-110 font-black'
                      : 'bg-[#111111] border border-white/10 hover:border-[#F59E0B]/50 text-gray-400'
                  }`}
                  title={slide.title}
                >
                  {slide.id}
                </button>
              ))}
            </div>

            {/* Previous and Next big tactical button handlers */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevSlide}
                className="bg-[#111111] hover:bg-white/5 active:bg-black border border-white/10 text-gray-300 px-4 py-2 rounded text-xs leading-none flex items-center gap-1 transition-all cursor-pointer font-bold"
              >
                <ChevronLeft className="h-4 w-4" /> Anterior
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                className="bg-[#F59E0B] hover:bg-[#d97706] active:bg-[#b45309] text-black px-4 py-2 rounded text-xs leading-none flex items-center gap-1 transition-all cursor-pointer font-bold font-mono tracking-wide uppercase"
              >
                Seguinte <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
