import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CashflowItem, } from '../types';
import { EXPENSE_CATEGORIES } from '../data';
import { Info, HelpCircle } from 'lucide-react';

interface ChartsProps {
  cashflowData: CashflowItem[];
}

export default function Charts({ cashflowData }: ChartsProps) {
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(5); // Default to June (index 5) as showcased in image 1!
  const [hoveredDoughnutIndex, setHoveredDoughnutIndex] = useState<number | null>(null);
  const [timeframe, setTimeframe] = useState('This Year');
  const [donutType, setDonutType] = useState('This Month');
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(500);

  // Measure the width of the bar chart container to be 100% responsive
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width || 500);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Bar chart mathematics
  const height = 240;
  const paddingLeft = 32;
  const paddingRight = 16;
  const paddingTop = 20;
  const paddingBottom = 25;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  // Find max value to scale heights
  const maxVal = Math.max(...cashflowData.flatMap(d => [d.income, d.expense]), 8000);
  
  const getX = (index: number) => {
    const spacing = chartWidth / cashflowData.length;
    return paddingLeft + index * spacing + spacing / 2;
  };
  
  const getY = (val: number) => {
    const ratio = val / maxVal;
    return paddingTop + chartHeight * (1 - ratio);
  };

  // Doughnut math constants
  const donutRadius = 60;
  const donutStrokeWidth = 16;
  const donutCenter = 80;
  
  // Calculate SVG circular arc segments
  let totalExpense = EXPENSE_CATEGORIES.reduce((sum, c) => sum + c.amount, 0);
  let accumulatedPercent = 0;
  
  const doughnutSegments = EXPENSE_CATEGORIES.map((category, idx) => {
    const percentage = category.percentage;
    const strokeDasharray = `${(percentage * 2 * Math.PI * donutRadius) / 100} ${2 * Math.PI * donutRadius}`;
    const strokeDashoffset = `${-((accumulatedPercent * 2 * Math.PI * donutRadius) / 100)}`;
    accumulatedPercent += percentage;
    return {
      ...category,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. CASHFLOW GROUPED BAR CHART (Left column: spanning 2 cols on lg) */}
      <div className="lg:col-span-2 rounded-3xl bg-white/20 border border-white/40 p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between" ref={containerRef}>
        <div>
          {/* Chart Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-display font-extrabold text-base text-purple-950">Cashflow</h3>
              <p className="text-[10px] text-purple-950/40 uppercase tracking-wider font-bold">Income vs Expenses tracking</p>
            </div>
            
            {/* View options dropdown */}
            <div className="flex gap-2.5 items-center">
              {/* Legend Indicator */}
              <div className="flex gap-3 text-xs font-bold text-purple-950/60 mr-2">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-purple-800" />
                  Income
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-pink-400" />
                  Expense
                </span>
              </div>
              
              <select 
                id="cashflow-timeframe-selector"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-white/40 border border-white/40 hover:bg-white/60 text-purple-950 font-sans text-xs font-bold py-1.5 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-700 cursor-pointer"
              >
                <option value="This Year">This Year</option>
                <option value="Last Year">Last Year</option>
                <option value="All Time">All Time</option>
              </select>
            </div>
          </div>

          {/* June visual tag highlighted exactly from image 1 */}
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-black text-purple-950 tracking-tight">$562,000</span>
            <span className="text-[10px] font-semibold text-purple-950/40">Total Balance accrued</span>
          </div>
        </div>

        {/* SVG Interactive Chart Drawing Area */}
        <div className="relative mt-2">
          {/* Custom June 2029 Tooltip (matches first image exactly!) */}
          <AnimatePresence>
            {hoveredBarIndex !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0, 
                  left: `${Math.min(getX(hoveredBarIndex) - 55, width - 145)}px` 
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute -top-12 bg-white/95 border border-purple-500/20 backdrop-blur-2xl rounded-2xl p-2.5 shadow-xl text-[10px] w-36 pointer-events-none z-10 font-sans"
              >
                <p className="font-extrabold text-purple-950/70 border-b border-purple-950/10 pb-1 mb-1 bg-gradient-to-r from-purple-900 to-pink-900 bg-clip-text text-transparent uppercase tracking-wider">
                  {cashflowData[hoveredBarIndex].month} 2029
                </p>
                <div className="flex justify-between items-center text-purple-950 font-semibold mb-0.5">
                  <span className="flex items-center gap-1 text-purple-900 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-800" />
                    Income:
                  </span>
                  <span className="font-mono">${cashflowData[hoveredBarIndex].income.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-purple-950 font-semibold">
                  <span className="flex items-center gap-1 text-pink-500 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                    Expense:
                  </span>
                  <span className="font-mono">${cashflowData[hoveredBarIndex].expense.toLocaleString()}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <svg width={width} height={height} className="overflow-visible">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const yVal = paddingTop + chartHeight * ratio;
              const gridLabel = Math.round(maxVal * (1 - ratio) / 1000);
              return (
                <g key={index} className="opacity-40">
                  <line 
                    x1={paddingLeft} 
                    y1={yVal} 
                    x2={width - paddingRight} 
                    y2={yVal} 
                    stroke="rgba(76, 29, 149, 0.08)" 
                    strokeDasharray="4 4" 
                  />
                  <text 
                    x={paddingLeft - 8} 
                    y={yVal + 3} 
                    textAnchor="end" 
                    className="font-mono text-[9px] fill-purple-950/40 font-bold"
                  >
                    {gridLabel}K
                  </text>
                </g>
              );
            })}

            {/* Bars Column Drawing */}
            {cashflowData.map((item, index) => {
              const xCenter = getX(index);
              const barSpacing = chartWidth / cashflowData.length;
              const barWidth = Math.min(Math.max(barSpacing * 0.25, 6), 14); // Responsive width
              
              // Income parameters
              const yIncome = getY(item.income);
              const barHeightIncome = chartHeight + paddingTop - yIncome;
              
              // Expense parameters
              const yExpense = getY(item.expense);
              const barHeightExpense = chartHeight + paddingTop - yExpense;

              return (
                <g 
                  key={index}
                  onMouseEnter={() => setHoveredBarIndex(index)}
                  className="cursor-pointer"
                >
                  {/* Invisible wide trigger block for comfortable hovering */}
                  <rect
                    x={xCenter - barSpacing / 2}
                    y={paddingTop}
                    width={barSpacing}
                    height={chartHeight}
                    fill="transparent"
                  />

                  {/* Highlight bar column hover background overlay */}
                  {hoveredBarIndex === index && (
                    <rect
                      x={xCenter - barSpacing / 2}
                      y={paddingTop - 5}
                      width={barSpacing}
                      height={chartHeight + 10}
                      fill="rgba(139, 92, 246, 0.04)"
                      rx={12}
                    />
                  )}

                  {/* Income Bar (Deep purple-violet) */}
                  <rect
                    x={xCenter - barWidth - 1}
                    y={yIncome}
                    width={barWidth}
                    height={Math.max(barHeightIncome, 2)}
                    rx={3}
                    fill={hoveredBarIndex === index ? '#4c1d95' : 'url(#incomeGrad)'}
                    className="transition-all duration-300"
                  />

                  {/* Expense Bar (Soft pastel pink/coral) */}
                  <rect
                    x={xCenter + 1}
                    y={yExpense}
                    width={barWidth}
                    height={Math.max(barHeightExpense, 2)}
                    rx={3}
                    fill={hoveredBarIndex === index ? '#f43f5e' : 'url(#expenseGrad)'}
                    className="transition-all duration-300"
                  />

                  {/* Bottom Text Label */}
                  <text
                    x={xCenter}
                    y={height - 8}
                    textAnchor="middle"
                    className={`font-semibold text-[9px] transition-colors duration-200 ${
                      hoveredBarIndex === index ? 'fill-purple-950 font-extrabold' : 'fill-purple-950/40'
                    }`}
                  >
                    {item.month}
                  </text>
                </g>
              );
            })}

            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* 2. DOUGHNUT CHART CATEGORIES (Right column) */}
      <div className="rounded-3xl bg-white/20 border border-white/40 p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-display font-extrabold text-base text-purple-950">Statistic</h3>
              <p className="text-[10px] text-purple-950/40 uppercase tracking-wider font-bold">Category Distribution</p>
            </div>

            <select 
              id="statistic-timeframe-selector"
              value={donutType}
              onChange={(e) => setDonutType(e.target.value)}
              className="bg-white/40 border border-white/40 text-purple-950 font-sans text-[10px] font-bold py-1 px-2.5 rounded-xl cursor-pointer"
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
            </select>
          </div>

          <div className="flex justify-center my-4 relative">
            {/* Center Content for Total Spending: In image 1, centered $3,500 total expense */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-purple-950/40">Total Expense</span>
              <span className="font-mono text-xl lg:text-2xl font-black text-purple-900 leading-none">
                ${(hoveredDoughnutIndex !== null ? EXPENSE_CATEGORIES[hoveredDoughnutIndex].amount : totalExpense).toLocaleString()}
              </span>
              <span className="text-[9px] font-bold text-pink-500 bg-pink-100 px-1.5 py-0.25 rounded-md mt-0.5">
                {hoveredDoughnutIndex !== null ? `${EXPENSE_CATEGORIES[hoveredDoughnutIndex].name} • ${EXPENSE_CATEGORIES[hoveredDoughnutIndex].percentage}%` : 'This Month'}
              </span>
            </div>

            {/* Donut SVG */}
            <svg 
              width={donutCenter * 2} 
              height={donutCenter * 2} 
              viewBox={`0 0 ${donutCenter * 2} ${donutCenter * 2}`}
              className="rotate-270 overflow-visible"
            >
              <circle
                cx={donutCenter}
                cy={donutCenter}
                r={donutRadius}
                fill="none"
                stroke="rgba(139, 92, 246, 0.05)"
                strokeWidth={donutStrokeWidth}
              />
              {doughnutSegments.map((segment, idx) => {
                const isHovered = hoveredDoughnutIndex === idx;
                return (
                  <circle
                    key={idx}
                    cx={donutCenter}
                    cy={donutCenter}
                    r={donutRadius}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth={isHovered ? donutStrokeWidth + 4 : donutStrokeWidth}
                    strokeDasharray={segment.strokeDasharray}
                    strokeDashoffset={segment.strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredDoughnutIndex(idx)}
                    onMouseLeave={() => setHoveredDoughnutIndex(null)}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Categories Breakdown List */}
        <div className="space-y-1.5 mt-2 max-h-[170px] overflow-y-auto pr-1">
          {EXPENSE_CATEGORIES.map((category, idx) => {
            const isHovered = hoveredDoughnutIndex === idx;
            return (
              <div 
                key={idx}
                onMouseEnter={() => setHoveredDoughnutIndex(idx)}
                onMouseLeave={() => setHoveredDoughnutIndex(null)}
                className={`flex justify-between items-center px-2.5 py-1.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isHovered 
                    ? 'bg-purple-950/10 border-purple-500/30' 
                    : 'bg-white/5 border-transparent hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" 
                    style={{ backgroundColor: category.color }} 
                  />
                  <span className={`text-[11px] font-bold transition-colors ${
                    isHovered ? 'text-purple-950' : 'text-purple-950/70'
                  }`}>
                    {category.name}
                  </span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[11px] font-bold text-purple-950 block leading-none">${category.amount}</span>
                  <span className="text-[9px] font-medium text-purple-950/40">{category.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
