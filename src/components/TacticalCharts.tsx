/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface OccupancyGaugeProps {
  value: number; // e.g. 84
  capacity: number;
  total: number;
  label?: string;
  className?: string;
}

export function OccupancyGauge({ value, capacity, total, label = "Taxa de Ocupação", className = "" }: OccupancyGaugeProps) {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center text-center p-4 bg-[#111111] border border-white/10 rounded-sm ${className}`}>
      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest leading-none mb-3 block">{label}</span>
      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            stroke="rgba(255,255,255,0.05)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke={value > 90 ? "#ef4444" : value > 75 ? "#F59E0B" : "#10b981"}
            fill="transparent"
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeWidth={stroke}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-[20px] font-display font-light text-white tracking-tighter leading-none">{value}%</span>
          <span className="text-[8px] font-mono text-gray-500 block leading-none pt-0.5">CRÍTICO</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-3 w-full border-t border-white/5 pt-3 text-center">
        <div>
          <span className="text-[9px] font-mono text-gray-500 uppercase block">Ativos</span>
          <span className="text-white font-mono font-bold text-xs">{total}</span>
        </div>
        <div>
          <span className="text-[9px] font-mono text-gray-500 uppercase block">Cap. Máxima</span>
          <span className="text-white font-mono font-bold text-xs">{capacity}</span>
        </div>
      </div>
    </div>
  );
}

interface RegionalCapacityChartProps {
  data: Array<{ province: string; inmates: number; limit: number }>;
}

export function RegionalCapacityChart({ data }: RegionalCapacityChartProps) {
  return (
    <div className="space-y-3 bg-[#111111] border border-white/10 p-4 rounded-sm">
      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">Capacidade Regional Activa (Saneada)</span>
      <div className="space-y-3 pt-1">
        {data.map((item) => {
          const ratio = Math.min(100, Math.floor((item.inmates / item.limit) * 100));
          return (
            <div key={item.province} className="space-y-1">
              <div className="flex justify-between items-end text-[10px] font-mono">
                <span className="text-white font-semibold flex items-center gap-1.5 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  {item.province}
                </span>
                <span className="text-gray-400">
                  <strong className="text-slate-200">{item.inmates}</strong> / <span className="text-gray-500">{item.limit}</span> ({ratio}%)
                </span>
              </div>
              <div className="h-2 w-full bg-black rounded overflow-hidden flex border border-white/5">
                <div
                  style={{ width: `${ratio}%` }}
                  className={`h-full transition-all duration-1000 ease-out ${
                    ratio > 90 ? 'bg-red-500' : ratio > 75 ? 'bg-[#F59E0B]' : 'bg-emerald-500'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface StatusIndicatorBarsProps {
  data: Array<{ status: string; count: number; color: string }>;
}

export function StatusIndicatorBars({ data }: StatusIndicatorBarsProps) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="space-y-3 bg-[#111111] border border-white/10 p-4 rounded-sm">
      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-2">Estrutura de Risco e Estado Jurídico</span>
      <div className="grid grid-cols-3 gap-2">
        {data.map((item) => {
          const percent = Math.floor((item.count / max) * 100);
          return (
            <div key={item.status} className="bg-black/40 p-2.5 rounded-sm border border-white/10 flex flex-col justify-between items-center text-center">
              <span className="text-[9px] font-mono text-gray-400 uppercase leading-none block h-6 flex items-center">{item.status}</span>
              <div className="w-full flex justify-center items-end h-12 pt-2 pb-1 relative">
                <div 
                  style={{ height: `${percent}%` }}
                  className={`w-4 ${item.color} rounded-t transition-all duration-1000 ease-out`}
                />
              </div>
              <span className="text-[14px] font-mono font-bold text-white leading-none pt-1">{item.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
