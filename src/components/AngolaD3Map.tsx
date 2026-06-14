import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Sparkles, Map, Database, Layers, CheckCircle } from 'lucide-react';

interface ProvinceData {
  code: string;
  name: string;
  inmatesCount: number;
  capacity: number;
  ratio: number;
  type: string; // 'Existente' | 'Nova' | 'Renomeada'
  prisonName: string;
}

interface AngolaD3MapProps {
  data: ProvinceData[];
  selectedCode: string;
  onSelectCode: (code: string) => void;
}

// Strategic layout mapping grid coordinates (row, col) to mimic Angola's geographical layout
// CAB is north-most. LUA, BGO, ICB are near the coast. Moxico is in the east. Cunene is in the south.
const GRID_COORDINATES: Record<string, { col: number; row: number }> = {
  CAB: { col: 2, row: 0 }, // Cabinda
  ZAI: { col: 2, row: 1 }, // Zaire
  UIG: { col: 3, row: 1 }, // Uíge
  LUA: { col: 1, row: 2 }, // Luanda
  BGO: { col: 2, row: 2 }, // Bengo
  CNO: { col: 3, row: 2 }, // Cuanza-Norte
  MAL: { col: 4, row: 2 }, // Malanje
  LNO: { col: 5, row: 1 }, // Lunda-Norte
  LSU: { col: 5, row: 2 }, // Lunda-Sul
  ICB: { col: 1, row: 3 }, // Icolo e Bengo (Nova)
  CSU: { col: 2, row: 3 }, // Cuanza-Sul
  BIE: { col: 3, row: 3 }, // Bié
  MOX: { col: 4, row: 3 }, // Moxico
  MXL: { col: 5, row: 3 }, // Moxico Leste (Nova)
  BGU: { col: 1, row: 4 }, // Benguela
  HUA: { col: 2, row: 4 }, // Huambo
  NAM: { col: 1, row: 5 }, // Namibe
  HUI: { col: 2, row: 5 }, // Huíla
  CCU: { col: 3, row: 5 }, // Cubango (Renomeada)
  CND: { col: 4, row: 5 }, // Cuando (Nova)
  CNN: { col: 2, row: 6 }  // Cunene
};

export function AngolaD3Map({ data, selectedCode, onSelectCode }: AngolaD3MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'heatmap' | 'dpa2024'>('heatmap');
  const [hoveredProv, setHoveredProv] = useState<ProvinceData | null>(null);

  // Width and Height of the SVG coordinate viewport
  const baseWidth = 620;
  const baseHeight = 440;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Full clear before redraw

    // Define Grid specs based on container dimensioning
    const colWidth = 85;
    const rowHeight = 58;
    const offsetX = 50;
    const offsetY = 35;

    // Draw background grid lines (Tactical tech radar feel)
    const backgroundGroup = svg.append('g').attr('class', 'radar-grid');
    
    // Draw horizontal grid lines
    for (let r = 0; r <= 6; r++) {
      backgroundGroup.append('line')
        .attr('x1', offsetX - 20)
        .attr('y1', offsetY + r * rowHeight)
        .attr('x2', offsetX + 6 * colWidth)
        .attr('y2', offsetY + r * rowHeight)
        .attr('stroke', '#1e293b')
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '2, 4');
    }

    // Draw vertical grid lines
    for (let c = 0; c <= 6; c++) {
      backgroundGroup.append('line')
        .attr('x1', offsetX + c * colWidth)
        .attr('y1', offsetY - 10)
        .attr('x2', offsetX + c * colWidth)
        .attr('y2', offsetY + 6.5 * rowHeight)
        .attr('stroke', '#1e293b')
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '2, 4');
    }

    // Draw tactical data flow link-lines representing administrative bridges
    const links = [
      { from: 'CAB', to: 'ZAI' },
      { from: 'ZAI', to: 'UIG' },
      { from: 'ZAI', to: 'LUA' },
      { from: 'UIG', to: 'CNO' },
      { from: 'LUA', to: 'ICB' },
      { from: 'ICB', to: 'BGO' },
      { from: 'BGO', to: 'CNO' },
      { from: 'CNO', to: 'MAL' },
      { from: 'MAL', to: 'LNO' },
      { from: 'LNO', to: 'LSU' },
      { from: 'LSU', to: 'MOX' },
      { from: 'MOX', to: 'MXL' },
      { from: 'BGO', to: 'CSU' },
      { from: 'CSU', to: 'BIE' },
      { from: 'BIE', to: 'HUA' },
      { from: 'HUA', to: 'BGU' },
      { from: 'BGU', to: 'NAM' },
      { from: 'NAM', to: 'HUI' },
      { from: 'HUI', to: 'CCU' },
      { from: 'CCU', to: 'CND' },
      { from: 'CCU', to: 'CNN' }
    ];

    links.forEach(l => {
      const fromCoord = GRID_COORDINATES[l.from];
      const toCoord = GRID_COORDINATES[l.to];
      if (fromCoord && toCoord) {
        const x1 = offsetX + fromCoord.col * colWidth + colWidth / 2;
        const y1 = offsetY + fromCoord.row * rowHeight + rowHeight / 2;
        const x2 = offsetX + toCoord.col * colWidth + colWidth / 2;
        const y2 = offsetY + toCoord.row * rowHeight + rowHeight / 2;

        backgroundGroup.append('line')
          .attr('x1', x1)
          .attr('y1', y1)
          .attr('x2', x2)
          .attr('y2', y2)
          .attr('stroke', '#f59e0b')
          .attr('stroke-opacity', 0.12)
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '3, 4');
      }
    });

    // Create tactical groups for the province cards
    const gProvinces = svg.append('g').attr('class', 'provinces-group');

    data.forEach(p => {
      const coord = GRID_COORDINATES[p.code];
      if (!coord) return;

      const px = offsetX + coord.col * colWidth;
      const py = offsetY + coord.row * rowHeight;
      const isSelected = p.code === selectedCode;

      // Color scheme interpolation using D3 logic
      let fillBg = '#0f172a';
      let strokeColor = '#334155';
      let accentColor = '#64748b';

      if (viewMode === 'heatmap') {
        if (p.ratio > 90) {
          fillBg = isSelected ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.08)';
          strokeColor = p.ratio > 95 ? '#ef4444' : '#f87171';
          accentColor = '#ef4444';
        } else if (p.ratio > 75) {
          fillBg = isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.08)';
          strokeColor = '#f59e0b';
          accentColor = '#eab308';
        } else {
          fillBg = isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.05)';
          strokeColor = '#10b981';
          accentColor = '#10b981';
        }
      } else {
        // DPA 2024 categorization view
        if (p.type === 'Nova') {
          fillBg = isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.08)';
          strokeColor = '#3b82f6';
          accentColor = '#60a5fa';
        } else if (p.type === 'Renomeada') {
          fillBg = isSelected ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.08)';
          strokeColor = '#a855f7';
          accentColor = '#c084fc';
        } else {
          // Existing
          fillBg = isSelected ? 'rgba(148, 163, 184, 0.15)' : 'rgba(30, 41, 59, 0.4)';
          strokeColor = isSelected ? '#ffffff' : '#475569';
          accentColor = '#94a6b8';
        }
      }

      // Individual province card node container
      const cardNode = gProvinces.append('g')
        .attr('class', `prov-node-${p.code} cursor-pointer`)
        .style('transition', 'transform 0.2s ease-out')
        .on('click', () => {
          onSelectCode(p.code);
        })
        .on('mouseenter', function() {
          d3.select(this)
            .attr('transform', 'scale(1.04)')
            .raise(); // Pull to front on hover
          setHoveredProv(p);
        })
        .on('mouseleave', function() {
          d3.select(this)
            .attr('transform', 'scale(1.0)');
          setHoveredProv(null);
        });

      // Animated Entry Transition (scale nodes in sequentially)
      cardNode.attr('transform', 'scale(0.85)')
        .transition()
        .duration(400)
        .delay(coord.row * 50 + coord.col * 25)
        .attr('transform', 'scale(1.0)');

      // Draw the main card rectangle
      cardNode.append('rect')
        .attr('x', px + 2)
        .attr('y', py + 2)
        .attr('width', colWidth - 4)
        .attr('height', rowHeight - 4)
        .attr('rx', 5)
        .attr('fill', fillBg)
        .attr('stroke', isSelected ? '#f59e0b' : strokeColor)
        .attr('stroke-width', isSelected ? 2 : 1)
        .style('filter', isSelected ? 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.4))' : 'none');

      // Add a status pill indicator on selected items
      if (isSelected) {
        cardNode.append('circle')
          .attr('cx', px + colWidth - 10)
          .attr('cy', py + 11)
          .attr('r', 3)
          .attr('fill', '#f59e0b')
          .attr('class', 'animate-pulse');
      } else {
        // Simple subtle small status dot
        cardNode.append('circle')
          .attr('cx', px + colWidth - 10)
          .attr('cy', py + 11)
          .attr('r', 2)
          .attr('fill', accentColor)
          .attr('opacity', 0.7);
      }

      // Draw short ISO Code text
      cardNode.append('text')
        .attr('x', px + 8)
        .attr('y', py + 18)
        .attr('fill', isSelected ? '#ffffff' : '#e2e8f0')
        .attr('font-size', '10px')
        .attr('font-family', 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace')
        .attr('font-weight', 'bold')
        .text(p.code);

      // Draw full name
      cardNode.append('text')
        .attr('x', px + 8)
        .attr('y', py + 31)
        .attr('fill', isSelected ? '#f59e0b' : '#94a3b8')
        .attr('font-size', '9.5px')
        .attr('font-family', 'sans-serif')
        .attr('font-weight', 'bold')
        .text(p.name.length > 12 ? p.name.substring(0, 11) + '..' : p.name);

      // Draw sub text (occupancy count or category info)
      const detailsText = viewMode === 'heatmap' 
        ? `${p.ratio}%` 
        : p.type === 'Nova' ? 'NOVA' : p.type === 'Renomeada' ? 'REN' : 'EXIST';

      cardNode.append('text')
        .attr('x', px + 8)
        .attr('y', py + 44)
        .attr('fill', accentColor)
        .attr('font-size', '8px')
        .attr('font-family', 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace')
        .attr('font-weight', '600')
        .text(detailsText);
    });

  }, [data, selectedCode, viewMode]);

  return (
    <div ref={containerRef} className="bg-[#090b0d]/70 border border-zinc-800 p-4 rounded-lg space-y-4 relative overflow-hidden flex flex-col justify-between h-full min-h-[460px]">
      
      {/* Header Selection controls inside of D3 map card */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-zinc-900 pb-3 z-10">
        <div>
          <span className="text-[10px] text-amber-500 uppercase font-bold tracking-widest flex items-center gap-1">
            <Map className="h-3.5 w-3.5" /> Cartograma de Integração Territorial
          </span>
          <h4 className="text-sm font-display font-medium text-white leading-none pt-1">Visualizador de Rede D3.js</h4>
        </div>

        {/* View Selection Toggle */}
        <div className="flex bg-black/45 p-0.5 rounded border border-zinc-850 self-start text-[10px] font-mono">
          <button
            type="button"
            onClick={() => setViewMode('heatmap')}
            className={`px-3 py-1 rounded transition-all cursor-pointer font-bold uppercase flex items-center gap-1 ${
              viewMode === 'heatmap' ? 'bg-[#F29C11] text-slate-950 font-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-2.5 w-2.5" /> Mapa de Calor
          </button>
          <button
            type="button"
            onClick={() => setViewMode('dpa2024')}
            className={`px-3 py-1 rounded transition-all cursor-pointer font-bold uppercase flex items-center gap-1 ${
              viewMode === 'dpa2024' ? 'bg-[#F29C11] text-slate-950 font-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="h-2.5 w-2.5" /> Divisão DPA
          </button>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="flex-1 flex items-center justify-center min-h-[340px] relative select-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${baseWidth} ${baseHeight}`}
          className="w-full h-auto max-h-[380px] drop-shadow-2xl"
        />

        {/* Floating precise live D3 tooltip */}
        {hoveredProv && (
          <div 
            className="absolute bg-zinc-950 border border-amber-600/50 p-2 text-[10.5px] font-mono text-zinc-100 rounded shadow-xl pointer-events-none transition-all duration-75 z-20"
            style={{
              bottom: '15px',
              left: '15px',
              maxWidth: '220px'
            }}
          >
            <div className="flex justify-between items-center pb-1 mb-1 border-b border-zinc-850">
              <strong className="text-white uppercase font-sans text-[11px] block">{hoveredProv.name}</strong>
              <span className="text-[9px] text-[#F59E0B] font-bold">{hoveredProv.code}</span>
            </div>
            <p className="text-gray-400 leading-normal text-[9.5px] mb-1 font-sans font-medium">{hoveredProv.prisonName}</p>
            <div className="flex justify-between">
              <span>Capacidade:</span>
              <strong className="text-white">{hoveredProv.inmatesCount} / {hoveredProv.capacity}</strong>
            </div>
            <div className="flex justify-between">
              <span>Saneamento:</span>
              <strong className={hoveredProv.ratio > 90 ? 'text-red-500' : hoveredProv.ratio > 75 ? 'text-amber-500' : 'text-emerald-500'}>
                {hoveredProv.ratio}%
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Footer legend */}
      <div className="text-[9px] font-mono border-t border-zinc-900 pt-3 flex flex-wrap items-center justify-between gap-3 text-gray-500 select-none">
        {viewMode === 'heatmap' ? (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> &lt;75% Normal</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 75%-90% Alerta</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> &gt;90% Crítico</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-500" /> Original</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Nova Província</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Renomeada</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-slate-500 font-bold uppercase">
          <Database className="h-3 w-3 text-amber-500/80 animate-pulse" /> Sincronismo DPA 2024
        </div>
      </div>

    </div>
  );
}
