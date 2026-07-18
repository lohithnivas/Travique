import React, { useEffect, useRef } from 'react';
import { BudgetBreakdown } from '../types.js';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { DollarSign, Shield, Zap, TrendingUp, Sparkles } from 'lucide-react';
import * as d3 from 'd3';

interface BudgetChartsProps {
  budget: BudgetBreakdown;
  darkMode: boolean;
}

export default function BudgetCharts({ budget, darkMode }: BudgetChartsProps) {
  const d3ContainerRef = useRef<SVGSVGElement | null>(null);

  // Categorized data for Recharts
  const chartData = [
    { name: 'Lodging', value: budget.accommodation, color: '#7C3AED' }, // Secondary Purple
    { name: 'Transport', value: budget.transportation, color: '#2563EB' }, // Primary Blue
    { name: 'Dining', value: budget.food, color: '#06B6D4' }, // Accent Cyan
    { name: 'Activities', value: budget.activities, color: '#10B981' }, // Success Emerald
    { name: 'Shopping', value: budget.shopping, color: '#F59E0B' }, // Warning Orange
    { name: 'Emergency', value: budget.emergency, color: '#EF4444' }, // Error Red
    { name: 'Misc', value: budget.miscellaneous, color: '#64748B' }, // Slate
  ].filter(item => item.value > 0);

  // D3 rendering for the custom dynamic distribution line
  useEffect(() => {
    if (!d3ContainerRef.current) return;

    // Clear previous D3 renders
    d3.select(d3ContainerRef.current).selectAll('*').remove();

    const svg = d3.select(d3ContainerRef.current);
    const width = 380;
    const height = 40;

    svg.attr('width', width).attr('height', height);

    const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);
    
    // Create cumulative start/end values for segments
    let cumulative = 0;
    const d3Data = chartData.map(d => {
      const start = cumulative;
      cumulative += d.value;
      return {
        ...d,
        startPct: start / totalValue,
        endPct: cumulative / totalValue
      };
    });

    // Create segments
    svg.selectAll('rect')
      .data(d3Data)
      .enter()
      .append('rect')
      .attr('x', d => d.startPct * width)
      .attr('y', 10)
      .attr('width', d => (d.endPct - d.startPct) * width)
      .attr('height', 16)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', d => d.color)
      .style('opacity', 0.85)
      .append('title')
      .text(d => `${d.name}: $${d.value.toLocaleString()} (${Math.round((d.value / totalValue) * 100)}%)`);

    // Add small dividers
    svg.selectAll('line')
      .data(d3Data.slice(0, -1))
      .enter()
      .append('line')
      .attr('x1', d => d.endPct * width)
      .attr('y1', 8)
      .attr('x2', d => d.endPct * width)
      .attr('y2', 28)
      .attr('stroke', darkMode ? '#0F172A' : '#FFFFFF')
      .attr('stroke-width', 2);

  }, [budget, darkMode, chartData]);

  return (
    <div className="space-y-6">
      {/* Overview stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total card */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Investment</span>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              ${budget.total.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">USD</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>Optimal budget efficiency</span>
          </span>
        </div>

        {/* Lodging card */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lodging & Comfort</span>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
              ${budget.accommodation.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2">
            {Math.round((budget.accommodation / budget.total) * 100)}% of total budget
          </span>
        </div>

        {/* Transportation Card */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Transportation</span>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-xl font-bold text-blue-500">
              ${budget.transportation.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2">
            {Math.round((budget.transportation / budget.total) * 100)}% of total budget
          </span>
        </div>

        {/* Emergency/Reserve Card */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reserve & Emergency</span>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-xl font-bold text-rose-500">
              ${budget.emergency.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-rose-400 mt-2 flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>Emergency secured</span>
          </span>
        </div>
      </div>

      {/* Charts Display panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recharts PieChart */}
        <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center min-h-[300px] ${
          darkMode ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-150'
        }`}>
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Category Allocations (Proportional)
          </span>
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Budget']}
                  contentStyle={darkMode ? { backgroundColor: '#0F172A', borderColor: '#334155', color: '#FFF' } : {}}
                />
                <Legend 
                  layout="horizontal" 
                  align="center" 
                  verticalAlign="bottom"
                  iconSize={8}
                  iconType="circle"
                  formatter={(value) => <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Breakdown Card with custom D3 scale */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          darkMode ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-150'
        }`}>
          <div className="flex items-center justify-between">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              D3 Budget Density Gauge
            </span>
            <span className="text-[10px] text-blue-500 font-bold flex items-center space-x-0.5">
              <Sparkles className="w-3 h-3" />
              <span>D3 scales enabled</span>
            </span>
          </div>

          {/* D3 SVG element target */}
          <div className="flex justify-center pt-2">
            <svg ref={d3ContainerRef} className="overflow-visible" />
          </div>

          {/* Progress list bar indicators */}
          <div className="space-y-3">
            {chartData.map((item, i) => {
              const pct = Math.round((item.value / budget.total) * 100);
              return (
                <div key={i} className="text-xs">
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      ${item.value.toLocaleString()} <span className="text-slate-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ backgroundColor: item.color, width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
