/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Inmate, InmateStatus, RiskLevel } from '../types';
import { PROVINCE_CODES } from '../data';
import { Shield, Camera, QrCode, FileText, CheckCircle2, UserPlus, AlertTriangle, Database, Zap, RefreshCw, Printer } from 'lucide-react';

interface AdmissionDemoProps {
  onAddInmate: (inmate: Inmate) => void;
  onAddAuditLog: (action: string, reclusoId: string, reclusoNome: string, detalhes: string) => void;
  activeProvince: string;
}

export default function AdmissionDemo({ onAddInmate, onAddAuditLog, activeProvince }: AdmissionDemoProps) {
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('1994-08-15');
  const [filiacaoPai, setFiliacaoPai] = useState('');
  const [filiacaoMae, setFiliacaoMae] = useState('');
  const [crime, setCrime] = useState('Roubo Qualificado');
  const [estadoJuridico, setEstadoJuridico] = useState<'PROVISÓRIO / DETIDO' | 'CONDENADO' | 'PRISÃO PREVENTIVA'>('PRISÃO PREVENTIVA');
  const [nivelRisco, setNivelRisco] = useState<RiskLevel>('MÉDIO');
  const [selectedProvince, setSelectedProvince] = useState(activeProvince);

  useEffect(() => {
    setSelectedProvince(activeProvince || 'LUANDA');
  }, [activeProvince]);
  
  // Custom camera captures
  const [photoBlobUrl, setPhotoBlobUrl] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Auto assignment results
  const [assignedCell, setAssignedCell] = useState({
    estabelecimento: '',
    pavilhao: '',
    bloco: '',
    cela: ''
  });
  const [generatedRnr, setGeneratedRnr] = useState('');
  const [generatedInmate, setGeneratedInmate] = useState<Inmate | null>(null);

  // Stop camera when component unmounts or step changes
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setIsCameraActive(true);
    setCameraError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 300, height: 300, facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.log("Play interrupted", e));
      }
    } catch (err) {
      console.warn("Could not access camera, using advanced simulation scanning", err);
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    setIsCapturing(true);
    setTimeout(() => {
      if (!cameraError && videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, 300, 300);
          const dataUrl = canvas.toDataURL('image/jpeg');
          setPhotoBlobUrl(dataUrl);
        }
      } else {
        // Mock capture with beautiful preset placeholders
        const presetPhotos = [
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'
        ];
        const randomPhoto = presetPhotos[Math.floor(Math.random() * presetPhotos.length)];
        setPhotoBlobUrl(randomPhoto);
      }
      setIsCapturing(false);
      stopCamera();
      // Move to cell allocation formulation
      allocateCellAndRnr();
      setStep(3);
    }, 1500); // 1.5 seconds high-fidelity scanning animation
  };

  const allocateCellAndRnr = () => {
    // Auto formulation based on input
    const randomRnrSuffix = Math.floor(100000 + Math.random() * 900000);
    const rnrCode = `RNR-AO-2026-${randomRnrSuffix}`;
    setGeneratedRnr(rnrCode);

    const provUpper = selectedProvince.toUpperCase();
    const establishment = provUpper === 'LUANDA' || provUpper === 'LUA'
      ? 'Estabelecimento Prisional de Alta Segurança de Viana (Luanda)'
      : provUpper === 'HUAMBO' || provUpper === 'HUA'
      ? 'Estabelecimento Prisional da Comarca do Huambo'
      : provUpper === 'BENGO' || provUpper === 'BGO'
      ? 'Estabelecimento Prisional de Caboxa (Bengo)'
      : `Estabelecimento Prisional de ${selectedProvince}`;

    const pavilion = nivelRisco === 'ELEVADO' ? 'Pavilhão de Segurança Máxima (A)' : 'Pavilhão Comum (B)';
    const block = nivelRisco === 'ELEVADO' ? 'Supermax Bloco Especial 1' : 'Bloco Normal 3';
    const cellNo = `Cela ${Math.floor(10 + Math.random() * 80)}`;

    setAssignedCell({
      estabelecimento: establishment,
      pavilhao: pavilion,
      bloco: block,
      cela: cellNo
    });
  };

  const finalizeAdmissionSubmit = () => {
    const finalName = nome.trim() || 'Cândido Jacinto Barbosa';
    const finalPai = filiacaoPai.trim() || 'Avelino Barbosa';
    const finalMae = filiacaoMae.trim() || 'Juliana de Castro Barbosa';

    const newInmate: Inmate = {
      id: generatedRnr.replace('RNR-', ''),
      rnr: generatedRnr,
      nome: finalName,
      dataNascimento,
      filiacaoPai: finalPai,
      filiacaoMae: finalMae,
      biometriaStatus: 'CAPTURADA',
      crime,
      estadoJuridico,
      fotoUrl: photoBlobUrl || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200',
      nivelRisco,
      status: 'CELA',
      cela: assignedCell,
      dataAdmissao: new Date().toISOString().split('T')[0],
      qrCodeSeguro: `PNAP-AO-SECURE-${generatedRnr}-VERIFIED`,
      historicoMovimentacoes: [
        {
          data: new Date().toISOString().split('T')[0],
          origem: 'Célula de Detenção de Comando SIC',
          destino: `${assignedCell.pavilhao} - ${assignedCell.cela}`,
          motivo: 'Admissão e Distribuição Celular Automatizada',
          autorizador: 'Director Técnico de Turno Mateus Banza'
        }
      ]
    };

    setGeneratedInmate(newInmate);
    onAddInmate(newInmate);
    
    // Add real-time log entry
    onAddAuditLog(
      'ADMISSÃO & INTERNAMENTO',
      newInmate.id,
      newInmate.nome,
      `Recluso admitido no sistema nacional. RNR atribuído: ${newInmate.rnr}. Cela atribuída: ${assignedCell.cela} no ${establishmentAbbrev(assignedCell.estabelecimento)}.`
    );

    setStep(4);
  };

  const establishmentAbbrev = (fullname: string) => {
    if (fullname.includes('Viana')) return 'E.P. Viana';
    if (fullname.includes('Huambo')) return 'E.P. Huambo';
    return fullname;
  };

  const resetForm = () => {
    setNome('');
    setFiliacaoPai('');
    setFiliacaoMae('');
    setPhotoBlobUrl('');
    setStep(1);
  };

  return (
    <div className="w-full bg-[#111111] border border-white/10 rounded-sm p-5 tactical-glow font-sans relative overflow-hidden">
      {"/* Decorative Grid/Border Accents to communicate Military Defense Grade Setup */"}
      <div className="absolute top-0 right-0 p-1 border-b border-l border-white/10 text-[9px] font-mono text-[#F59E0B]/50 bg-black/40">
        PNAP MÓDULO ADM-101
      </div>

      <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-5">
        <div className="p-2 bg-[#F59E0B]/10 rounded border border-[#F59E0B]/20">
          <UserPlus className="h-5 w-5 text-[#F59E0B]" />
        </div>
        <div>
          <h3 className="text-md font-display font-bold text-white tracking-wide uppercase flex items-center gap-2">
            Simulador de Admissão em Tempo Real
            <span className="text-[10px] text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded border border-[#F59E0B]/20 font-mono animate-pulse">
              60s DEMO
            </span>
          </h3>
          <p className="text-xs text-gray-400">Rastreabilidade, biometria e controlo instantâneo de reclusos no sistema nacional</p>
        </div>
      </div>

      {"/* Indicator Steps Bar */"}
      <div className="grid grid-cols-4 gap-2 mb-6 text-xs text-center font-mono select-none">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex flex-col gap-1 items-stretch">
            <div className={`h-1.5 rounded-sm transition-all duration-300 ${
              step >= s ? 'bg-[#F59E0B]' : 'bg-white/10'
            }`} />
            <span className={`text-[10px] uppercase font-semibold ${
              step === s ? 'text-[#F59E0B]' : step > s ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {s === 1 ? '1. Dados Básicos' : s === 2 ? '2. Biometria' : s === 3 ? '3. Alocação' : '4. Guia & QR'}
            </span>
          </div>
        ))}
      </div>

      {"/* STEP 1: Basic Inmate Form */"}
      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#F59E0B]/80 uppercase mb-1">Nome Completo do Cidadão</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Mateus Calunga Katumbela"
                className="w-full bg-black/40 border border-white/10 focus:border-[#F59E0B] text-white text-sm px-3 py-2 rounded focus:outline-none placeholder-gray-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#F59E0B]/80 uppercase mb-1">Data de Nascimento</label>
              <input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                className="w-full bg-black/40 border border-white/10 focus:border-[#F59E0B] text-white text-sm px-3 py-2 rounded focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#F59E0B]/80 uppercase mb-1">Nome do Pai</label>
              <input
                type="text"
                value={filiacaoPai}
                onChange={(e) => setFiliacaoPai(e.target.value)}
                placeholder="Filição Paterna"
                className="w-full bg-black/40 border border-white/10 focus:border-[#F59E0B] text-white text-sm px-3 py-2 rounded focus:outline-none placeholder-gray-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#F59E0B]/80 uppercase mb-1">Nome da Mãe</label>
              <input
                type="text"
                value={filiacaoMae}
                onChange={(e) => setFiliacaoMae(e.target.value)}
                placeholder="Filiação Materna"
                className="w-full bg-black/40 border border-white/10 focus:border-[#F59E0B] text-white text-sm px-3 py-2 rounded focus:outline-none placeholder-gray-600 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#F59E0B]/80 uppercase mb-1">Crime Principal Enquadrado</label>
              <select
                value={crime}
                onChange={(e) => setCrime(e.target.value)}
                className="w-full bg-black/40 border border-white/10 focus:border-[#F59E0B] text-white text-sm px-3 py-2 rounded focus:outline-none transition-colors select-none"
              >
                <option value="Roubo Qualificado">Roubo Qualificado</option>
                <option value="Associação Criminosa">Associação Criminosa</option>
                <option value="Homicídio Involuntário">Homicídio Involuntário</option>
                <option value="Falsificação de Documento">Falsificação de Documento</option>
                <option value="Especulação de Câmbio">Especulação de Câmbio</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-[#F59E0B]/80 uppercase mb-1">Regime / Coação Jurídica</label>
              <select
                value={estadoJuridico}
                onChange={(e) => setEstadoJuridico(e.target.value as any)}
                className="w-full bg-black/40 border border-white/10 focus:border-[#F59E0B] text-white text-sm px-3 py-2 rounded focus:outline-none transition-colors select-none"
              >
                <option value="PRISÃO PREVENTIVA">Prisão Preventiva</option>
                <option value="PROVISÓRIO / DETIDO">Detido Provisoriamente</option>
                <option value="CONDENADO">Condenado (Em Sentença)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-[#F59E0B]/80 uppercase mb-1">Província de Destino (DPA 2024)</label>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full bg-black/40 border border-white/10 focus:border-[#F59E0B] text-white text-sm px-3 py-2 rounded focus:outline-none transition-colors select-none font-sans"
              >
                {Object.entries(PROVINCE_CODES).map(([provName, provCode]) => (
                  <option key={provCode} value={provName}>{provName} ({provCode})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#F59E0B]/80 uppercase mb-1">Grau de Risco Detectado</label>
              <div className="flex gap-2">
                {(['BAIXO', 'MÉDIO', 'ELEVADO'] as RiskLevel[]).map((risk) => (
                  <button
                    key={risk}
                    type="button"
                    onClick={() => setNivelRisco(risk)}
                    className={`flex-1 text-[11px] font-mono py-2 px-1 rounded text-center border font-semibold transition-all cursor-pointer select-none ${
                      nivelRisco === risk
                        ? risk === 'ELEVADO'
                          ? 'bg-red-950/40 border-red-500 text-red-500 font-bold'
                          : risk === 'MÉDIO'
                          ? 'bg-amber-950/40 border-amber-500 text-[#F59E0B] font-bold'
                          : 'bg-green-950/40 border-green-500 text-green-500 font-bold'
                        : 'bg-black/30 border-white/10 text-gray-500 hover:border-white/20'
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-start text-[11px] font-mono text-gray-500 pt-5 leading-normal">
              🌐 Saneamento integrado à malha territorial do Ministério do Interior (MININT).
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                setStep(2);
                startCamera();
              }}
              className="bg-[#F59E0B] hover:bg-[#d97706] active:bg-[#b45309] text-black px-4 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              Prosseguir para Captura Facial
              <Zap className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {"/* STEP 2: Facial Biometric Capture */"}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center p-3 border border-white/10 rounded-sm bg-black/40">
            <span className="text-[10px] text-[#F59E0B] font-mono mb-2 flex items-center gap-1">
              <Camera className="h-3 w-3 animate-pulse" /> SENSOR BIOMÉTRICO ACTIVO (ORDEM DETECÇÃO FACIAL ANGOLA)
            </span>

            <div className="relative w-[280px] h-[210px] bg-[#050505] rounded overflow-hidden flex items-center justify-center border border-[#F59E0B]/30">
              {isCameraActive && !cameraError ? (
                <>
                  <video
                     ref={videoRef}
                     className="w-full h-full object-cover scale-x-[-1]"
                     playsInline
                     muted
                  />
                  {/* Tactical scanning overlays */}
                  <div className="absolute inset-0 border border-[#F59E0B]/30 touch-none pointer-events-none">
                    <div className="absolute top-4 left-4 h-5 w-5 border-t-2 border-l-2 border-[#F59E0B]" />
                    <div className="absolute top-4 right-4 h-5 w-5 border-t-2 border-r-2 border-[#F59E0B]" />
                    <div className="absolute bottom-4 left-4 h-5 w-5 border-b-2 border-l-2 border-[#F59E0B]" />
                    <div className="absolute bottom-4 right-4 h-5 w-5 border-b-2 border-r-2 border-[#F59E0B]" />
                    <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#F59E0B]/40 animate-bounce" />
                    <div className="absolute top-2 left-2 text-[8px] font-mono text-[#F59E0B] bg-black/70 px-1 py-0.5 rounded">
                      RESOLUÇÃO: HD • FOCADO
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-16 h-16 rounded-full border border-dashed border-[#F59E0B]/40 border-t-[#F59E0B] animate-spin flex items-center justify-center mb-3">
                    <Shield className="h-6 w-6 text-[#F59E0B]/60" />
                  </div>
                  
                  {cameraError ? (
                    <div className="space-y-1">
                      <p className="text-xs text-[#F59E0B] font-mono font-medium">CÂMERA EMULADA DE ALTA FIDELIDADE</p>
                      <p className="text-[10px] text-gray-500 max-w-[220px]">
                        Webcam bloqueada ou ausente no iFrame. Ativando simulador de imagem corporativa militar de alta precisão.
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 font-mono">Iniciando interface biométrica...</p>
                  )}
                </div>
              )}

              {/* Laser sweep animation on capture */}
              {isCapturing && (
                <div className="absolute inset-0 bg-[#F59E0B]/10 flex items-center justify-center animate-pulse">
                  <span className="bg-[#050505] border border-[#F59E0B] text-[#F59E0B] font-mono text-xs px-3 py-1.5 rounded uppercase tracking-widest font-bold">
                    CAPTURANDO BIOMETRIA...
                  </span>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex justify-between items-center bg-black/40 p-2 rounded border border-white/10">
            <span className="text-[11px] font-mono text-gray-450 flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3 text-[#F59E0B]" /> 
              A biometria facial e impressões digitais serão sincronizadas com o BI Nacional (SME).
            </span>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                setStep(1);
              }}
              className="border border-white/10 hover:border-white/30 text-gray-300 px-4 py-2 rounded-sm text-xs font-mono transition-colors"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={capturePhoto}
              className="bg-[#F59E0B] hover:bg-[#d97706] text-black px-5 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Camera className="h-4 w-4" /> Capturar Biometria Facial
            </button>
          </div>
        </div>
      )}

      {"/* STEP 3: Auto Assignment & Security Check */"}
      {step === 3 && (
        <div className="space-y-4">
          <div className="bg-black/40 border border-white/10 rounded-sm p-4 text-xs font-mono space-y-3">
            <h4 className="text-[#F59E0B] font-display font-bold text-sm leading-none flex items-center gap-2 uppercase tracking-wider">
              <Database className="h-4 w-4" /> Algoritmo PNAP-AO: Alocação Crítica
            </h4>
            <p className="text-gray-400">Verificando vagas nacionais e estabelecendo mapeamento de segurança...</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px]">
              <div className="space-y-1.5 bg-[#111111]/60 p-2.5 rounded border border-white/10">
                <span className="text-gray-500 block uppercase text-[10px]">Cidadão Admitido</span>
                <span className="text-white font-semibold block text-xs">{nome || 'Cândido Jacinto Barbosa'}</span>
                <span className="text-gray-400 block pt-1">Risco Atribuído: <span className={`${
                  nivelRisco === 'ELEVADO' ? 'text-red-500' : 'text-[#F59E0B]'
                } font-bold`}>{nivelRisco}</span></span>
              </div>

              <div className="space-y-1.5 bg-[#111111]/60 p-2.5 rounded border border-white/10">
                <span className="text-gray-500 block uppercase text-[10px]">RNR Nacional Gerado</span>
                <span className="text-[#F59E0B] font-bold font-mono tracking-widest text-xs">{generatedRnr}</span>
                <span className="text-gray-400 block pt-1">Tipo Crime: <span className="text-white">{crime}</span></span>
              </div>
            </div>

            <div className="bg-[#F59E0B]/5 border border-[#F59E0B]/20 p-3 rounded space-y-1">
              <span className="text-[#F59E0B] text-[10px] uppercase font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#F59E0B]" /> ALOCAÇÃO EM CELA AUTOMÁTICA SUGERIDA:
              </span>
              <p className="text-slate-300 font-sans font-medium text-[11px] pt-1">
                {assignedCell.estabelecimento}
              </p>
              <div className="grid grid-cols-3 gap-1 pt-1.5 text-[10px]">
                <div className="bg-[#111111] px-2 py-1 rounded text-center border border-white/10">
                  <span className="text-gray-500 block">PAVILHÃO</span>
                  <span className="text-white font-bold">{assignedCell.pavilhao.replace('Pavilhão ', '')}</span>
                </div>
                <div className="bg-[#111111] px-2 py-1 rounded text-center border border-white/10">
                  <span className="text-gray-500 block">BLOCO</span>
                  <span className="text-white font-bold">{assignedCell.bloco.replace('Supermax ', '').replace('Bloco ', '')}</span>
                </div>
                <div className="bg-[#111111] px-2 py-1 rounded text-center border border-white/10">
                  <span className="text-[#F59E0B] block">CELA</span>
                  <span className="text-[#F59E0B] font-bold">{assignedCell.cela.replace('Cela ', '')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="border border-white/10 hover:border-white/30 text-gray-300 px-4 py-2 rounded-sm text-xs font-mono transition-colors"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={finalizeAdmissionSubmit}
              className="bg-[#F59E0B] hover:bg-[#d97706] text-black px-5 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              Configurar Internamento & Emitir Ficha
            </button>
          </div>
        </div>
      )}

      {"/* STEP 4: Beautiful Ficha de Internamento and PDF Preview */"}
      {step === 4 && generatedInmate && (
        <div className="space-y-4">
          <div className="bg-black/40 border border-green-500/30 rounded p-4 relative text-xs font-mono space-y-3">
            <div className="absolute top-2 right-2 bg-green-500/10 text-green-500 text-[10px] border border-green-500/20 px-2 py-0.5 rounded uppercase font-bold animate-pulse flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> ADMITIDO COM SUCESSO
            </div>

            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Shield className="h-4 w-4 text-green-500 font-bold" />
              <span className="text-gray-300 text-[11px] font-bold">PNAP-AO • GUIA DE INTERNAMENTO DIGITIZADO</span>
            </div>

            {"/* Fake Printable/Elegent A4 document view */"}
            <div className="bg-white text-[#18181b] p-4 rounded shadow-lg overflow-y-auto max-h-[220px] font-serif space-y-3 border border-zinc-350">
              <div className="text-center space-y-1 border-b pb-2">
                <span className="text-[10px] font-bold block uppercase tracking-wide">República de Angola</span>
                <span className="text-[9px] font-bold block uppercase text-gray-600 leading-none">Ministério do Interior • MININT</span>
                <span className="text-[8px] font-bold block uppercase text-gray-500 leading-none">Direção Geral dos Serviços Penitenciários</span>
                <span className="text-[11px] font-sans font-bold block text-amber-700 uppercase tracking-widest pt-1.5 font-display">Guia de Internamento Penitenciário</span>
              </div>

              <div className="flex gap-3 text-[10px] items-start">
                <img
                  src={generatedInmate.fotoUrl}
                  alt={generatedInmate.nome}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover border border-zinc-400 bg-gray-200 rounded"
                />
                <div className="space-y-1 font-sans flex-1 text-[9px] leading-tight">
                  <div><strong className="font-semibold text-gray-600 block sm:inline">RNR NACIONAL:</strong> <span className="font-mono text-[10px] font-bold text-black">{generatedInmate.rnr}</span></div>
                  <div><strong className="font-semibold text-gray-600 font-sans block sm:inline">NOME COMPLETO:</strong> <span className="text-black uppercase font-medium">{generatedInmate.nome}</span></div>
                  <div><strong className="font-semibold text-gray-600 font-sans block sm:inline">FILIAÇÃO:</strong> <span className="text-black">{generatedInmate.filiacaoPai} e {generatedInmate.filiacaoMae}</span></div>
                  <div><strong className="font-semibold text-gray-600 font-sans block sm:inline">CRIME:</strong> <span className="text-black uppercase">{generatedInmate.crime}</span></div>
                  <div><strong className="font-semibold text-gray-600 font-sans block sm:inline">MEDIDA DE COAÇÃO:</strong> <span className="text-black font-semibold text-[8px] bg-zinc-200 px-1 py-0.5 rounded">{generatedInmate.estadoJuridico}</span></div>
                </div>
                <div className="flex flex-col items-center">
                  {/* CSS barcode or QR representation */}
                  <div className="bg-white p-1 border border-zinc-400 rounded">
                    <QrCode className="h-10 w-10 text-black" />
                  </div>
                  <span className="text-[7px] font-sans font-bold pt-1 text-gray-500">QR SEGURO CLC</span>
                </div>
              </div>

              <div className="border bg-zinc-50 p-2 rounded text-[9px] font-sans text-gray-700 leading-normal">
                <span className="font-bold text-gray-900 block border-b pb-0.5 mb-1 text-[8px] uppercase">Alocação de Comando</span>
                <strong>UNIDADE ALVO:</strong> {allocatedCellNameShort(generatedInmate.cela.estabelecimento)}<br />
                <strong>PAVILHÃO:</strong> {generatedInmate.cela.pavilhao} &bull; <strong>BLOCO:</strong> {generatedInmate.cela.bloco}<br />
                <strong>CELA AUTOMÁTICA:</strong> <span className="text-red-700 font-bold">{generatedInmate.cela.cela}</span>
              </div>

              <div className="flex justify-between items-end pt-2 text-[8px] font-sans italic text-gray-500 border-t">
                <div>Data: {generatedInmate.dataAdmissao} 08:34</div>
                <div className="text-right flex flex-col items-center">
                  <div className="h-6 w-24 border-b border-dashed border-gray-400" />
                  <span className="text-[7px] font-bold pt-0.5 uppercase tracking-wide">Assinatura do Operador Autenticado</span>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-gray-400 mt-2 font-sans">
              * O recluso foi adicionado na base local e as estatísticas nacionais de ocupação foram recalculadas instantaneamente.
            </p>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                alert("Simulando envio para a impressora militar do MININT... Guia impressa com sucesso!");
              }}
              className="border border-white/10 hover:border-[#F59E0B]/50 text-gray-300 px-4 py-2 rounded-sm text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-[#F59E0B]" /> Imprimir Guia Oficial
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-[#F59E0B] hover:bg-[#d97706] text-black px-5 py-2 rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Admitir Outro Recluso
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function allocatedCellNameShort(fullName: string) {
  if (fullName.includes('Viana')) return 'Estabelecimento Prisional de Viana';
  if (fullName.includes('Huambo')) return 'Estabelecimento Prisional Huambo';
  return fullName;
}
