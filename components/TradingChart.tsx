"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  BarChart3, 
  LineChart, 
  TrendingUp, 
  Activity, 
  Settings,
  Maximize2,
  Minimize2,
  Grid3X3,
  Target,
  Layers,
  Clock,
  Zap,
  X
} from 'lucide-react';
import { 
  generateMockChartData, 
  generateMockTechnicalIndicators,
  generateCurrencyHeatmapData,
  CandlestickData,
  TechnicalIndicator
} from '@/lib/mockData';

interface TradingChartProps {
  pair: string;
  chartType: string;
  onChartTypeChange: (type: string) => void;
}

export default function TradingChart({ pair, chartType, onChartTypeChange }: TradingChartProps) {
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [indicators, setIndicators] = useState<TechnicalIndicator | null>(null);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState('1H');
  const [showVolume, setShowVolume] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIndicators, setShowIndicators] = useState({
    bollinger: true,
    ema: true,
    support: true,
    pivot: true
  });
  const chartRef = useRef<HTMLDivElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = generateMockChartData(pair, 100);
    const technicalData = generateMockTechnicalIndicators(pair, data);
    const heatData = generateCurrencyHeatmapData();
    
    setChartData(data);
    setIndicators(technicalData);
    setHeatmapData(heatData);
  }, [pair, timeframe]);

  const chartTypes = [
    { 
      id: 'candlestick', 
      label: 'Candlestick', 
      icon: BarChart3,
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/20'
    },
    { 
      id: 'line', 
      label: 'Line Chart', 
      icon: LineChart,
      gradient: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/20'
    },
    { 
      id: 'heatmap', 
      label: 'Heatmap', 
      icon: Grid3X3,
      gradient: 'from-purple-500 to-violet-600',
      shadow: 'shadow-purple-500/20'
    },
    { 
      id: 'depth', 
      label: 'Market Depth', 
      icon: Layers,
      gradient: 'from-orange-500 to-red-600',
      shadow: 'shadow-orange-500/20'
    }
  ];

  const timeframes = [
    { id: '1M', label: '1M', icon: Zap, gradient: 'from-red-500 to-red-600', glow: 'shadow-red-500/30' },
    { id: '5M', label: '5M', icon: Clock, gradient: 'from-orange-500 to-orange-600', glow: 'shadow-orange-500/30' },
    { id: '15M', label: '15M', icon: Clock, gradient: 'from-yellow-500 to-yellow-600', glow: 'shadow-yellow-500/30' },
    { id: '1H', label: '1H', icon: Clock, gradient: 'from-green-500 to-green-600', glow: 'shadow-green-500/30' },
    { id: '4H', label: '4H', icon: Clock, gradient: 'from-blue-500 to-blue-600', glow: 'shadow-blue-500/30' },
    { id: '1D', label: '1D', icon: Clock, gradient: 'from-purple-500 to-purple-600', glow: 'shadow-purple-500/30' },
    { id: '1W', label: '1W', icon: Clock, gradient: 'from-pink-500 to-pink-600', glow: 'shadow-pink-500/30' }
  ];

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
    }
  };

  const formatPrice = (price: number) => {
    if (pair.includes('JPY')) {
      return price.toFixed(3);
    }
    return price.toFixed(5);
  };

  const renderCandlestickChart = () => {
    if (!chartData.length || !indicators) return null;

    const width = isFullscreen ? 1400 : 900;
    const height = isFullscreen ? 800 : 500;
    const padding = { top: 30, right: 80, bottom: showVolume ? 120 : 80, left: 80 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom - (showVolume ? 80 : 0);

    // Calculate price range
    const prices = chartData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices) * 0.9985;
    const maxPrice = Math.max(...prices) * 1.0015;
    const priceRange = maxPrice - minPrice;

    // Scale functions
    const xScale = (index: number) => padding.left + (index * chartWidth) / (chartData.length - 1);
    const yScale = (price: number) => padding.top + ((maxPrice - price) / priceRange) * chartHeight;
    const volumeScale = (volume: number) => {
      const maxVolume = Math.max(...chartData.map(d => d.volume));
      return (volume / maxVolume) * 60;
    };

    return (
      <div className="relative bg-gray-950 rounded-xl border border-gray-800 overflow-hidden">
        <svg width={width} height={height} className="bg-gray-950">
          {/* Dark grid pattern */}
          <defs>
            <pattern id="darkGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1f2937" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
            <linearGradient id="volumeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width={width} height={height} fill="url(#darkGrid)" />

          {/* Bollinger Bands */}
          {showIndicators.bollinger && indicators && (
            <g>
              <path
                d={chartData.map((_, i) => 
                  `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(indicators.bollinger.upper)}`
                ).join(' ')}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="1.5"
                opacity="0.6"
                strokeDasharray="4,4"
                filter="url(#glow)"
              />
              <path
                d={chartData.map((_, i) => 
                  `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(indicators.bollinger.middle)}`
                ).join(' ')}
                fill="none"
                stroke="#6366F1"
                strokeWidth="2"
                opacity="0.8"
                filter="url(#glow)"
              />
              <path
                d={chartData.map((_, i) => 
                  `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(indicators.bollinger.lower)}`
                ).join(' ')}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="1.5"
                opacity="0.6"
                strokeDasharray="4,4"
                filter="url(#glow)"
              />
            </g>
          )}

          {/* EMA Lines */}
          {showIndicators.ema && indicators && (
            <g>
              <path
                d={chartData.map((_, i) => 
                  `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(indicators.ema20)}`
                ).join(' ')}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
                opacity="0.9"
                filter="url(#glow)"
              />
              <path
                d={chartData.map((_, i) => 
                  `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(indicators.ema50)}`
                ).join(' ')}
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.5"
                opacity="0.9"
                filter="url(#glow)"
              />
            </g>
          )}

          {/* Support/Resistance Lines */}
          {showIndicators.support && indicators && (
            <g>
              {indicators.support.map((level, i) => (
                <line
                  key={`support-${i}`}
                  x1={padding.left}
                  y1={yScale(level)}
                  x2={width - padding.right}
                  y2={yScale(level)}
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray="8,4"
                  opacity="0.7"
                  filter="url(#glow)"
                />
              ))}
              {indicators.resistance.map((level, i) => (
                <line
                  key={`resistance-${i}`}
                  x1={padding.left}
                  y1={yScale(level)}
                  x2={width - padding.right}
                  y2={yScale(level)}
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeDasharray="8,4"
                  opacity="0.7"
                  filter="url(#glow)"
                />
              ))}
            </g>
          )}

          {/* Pivot Points */}
          {showIndicators.pivot && indicators && (
            <g>
              <line
                x1={padding.left}
                y1={yScale(indicators.pivotPoints.pivot)}
                x2={width - padding.right}
                y2={yScale(indicators.pivotPoints.pivot)}
                stroke="#8B5CF6"
                strokeWidth="3"
                opacity="0.9"
                filter="url(#glow)"
              />
              {[indicators.pivotPoints.r1, indicators.pivotPoints.r2, indicators.pivotPoints.r3].map((level, i) => (
                <line
                  key={`r${i+1}`}
                  x1={padding.left}
                  y1={yScale(level)}
                  x2={width - padding.right}
                  y2={yScale(level)}
                  stroke="#F59E0B"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                  opacity="0.6"
                />
              ))}
              {[indicators.pivotPoints.s1, indicators.pivotPoints.s2, indicators.pivotPoints.s3].map((level, i) => (
                <line
                  key={`s${i+1}`}
                  x1={padding.left}
                  y1={yScale(level)}
                  x2={width - padding.right}
                  y2={yScale(level)}
                  stroke="#06B6D4"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                  opacity="0.6"
                />
              ))}
            </g>
          )}

          {/* Candlesticks */}
          {chartData.map((candle, index) => {
            const x = xScale(index);
            const isGreen = candle.close > candle.open;
            const color = isGreen ? '#10B981' : '#EF4444';
            const bodyHeight = Math.abs(yScale(candle.close) - yScale(candle.open));
            
            return (
              <g key={index}>
                {/* Wick */}
                <line
                  x1={x}
                  y1={yScale(candle.high)}
                  x2={x}
                  y2={yScale(candle.low)}
                  stroke={color}
                  strokeWidth="1.5"
                />
                {/* Body */}
                <rect
                  x={x - 4}
                  y={yScale(Math.max(candle.open, candle.close))}
                  width="8"
                  height={Math.max(bodyHeight, 1)}
                  fill={isGreen ? color : 'transparent'}
                  stroke={color}
                  strokeWidth="1.5"
                  rx="1"
                />
              </g>
            );
          })}

          {/* Price labels */}
          {Array.from({ length: 8 }, (_, i) => {
            const price = minPrice + (priceRange * i) / 7;
            const y = yScale(price);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#374151"
                  strokeWidth="0.5"
                  opacity="0.4"
                />
                <rect
                  x={width - padding.right + 5}
                  y={y - 8}
                  width="70"
                  height="16"
                  fill="#1f2937"
                  rx="4"
                  opacity="0.8"
                />
                <text
                  x={width - padding.right + 40}
                  y={y + 4}
                  fill="#E5E7EB"
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontWeight="500"
                >
                  {formatPrice(price)}
                </text>
              </g>
            );
          })}

          {/* Time labels */}
          {chartData.filter((_, i) => i % 15 === 0).map((candle, index) => {
            const x = xScale(index * 15);
            const time = new Date(candle.timestamp).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
            return (
              <g key={index}>
                <rect
                  x={x - 25}
                  y={height - padding.bottom + 10}
                  width="50"
                  height="16"
                  fill="#1f2937"
                  rx="4"
                  opacity="0.8"
                />
                <text
                  x={x}
                  y={height - padding.bottom + 22}
                  fill="#E5E7EB"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontWeight="500"
                >
                  {time}
                </text>
              </g>
            );
          })}

          {/* Volume bars */}
          {showVolume && chartData.map((candle, index) => {
            const x = xScale(index);
            const volumeHeight = volumeScale(candle.volume);
            const isGreen = candle.close > candle.open;
            
            return (
              <rect
                key={`volume-${index}`}
                x={x - 3}
                y={height - padding.bottom + 40}
                width="6"
                height={volumeHeight}
                fill={isGreen ? '#10B981' : '#EF4444'}
                opacity="0.6"
                rx="1"
              />
            );
          })}
        </svg>

        {/* Enhanced Legend */}
        <div className="absolute top-4 left-4 bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 border border-gray-700 shadow-2xl">
          <div className="grid grid-cols-2 gap-3 text-xs">
            {showIndicators.bollinger && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-blue-400 opacity-60 rounded"></div>
                <span className="text-gray-300 font-medium">Bollinger</span>
              </div>
            )}
            {showIndicators.ema && (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-yellow-400 rounded"></div>
                  <span className="text-gray-300 font-medium">EMA 20</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-red-400 rounded"></div>
                  <span className="text-gray-300 font-medium">EMA 50</span>
                </div>
              </>
            )}
            {showIndicators.pivot && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-purple-400 rounded"></div>
                <span className="text-gray-300 font-medium">Pivot</span>
              </div>
            )}
            {showIndicators.support && (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-green-400 rounded"></div>
                  <span className="text-gray-300 font-medium">Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-red-400 rounded"></div>
                  <span className="text-gray-300 font-medium">Resistance</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderLineChart = () => {
    if (!chartData.length) return null;

    const width = isFullscreen ? 1400 : 900;
    const height = isFullscreen ? 800 : 500;
    const padding = { top: 30, right: 80, bottom: 80, left: 80 };

    const prices = chartData.map(d => d.close);
    const minPrice = Math.min(...prices) * 0.999;
    const maxPrice = Math.max(...prices) * 1.001;
    const priceRange = maxPrice - minPrice;

    const xScale = (index: number) => padding.left + (index * (width - padding.left - padding.right)) / (chartData.length - 1);
    const yScale = (price: number) => padding.top + ((maxPrice - price) / priceRange) * (height - padding.top - padding.bottom);

    const pathData = chartData.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${xScale(index)} ${yScale(point.close)}`
    ).join(' ');

    return (
      <div className="relative bg-gray-950 rounded-xl border border-gray-800 overflow-hidden">
        <svg width={width} height={height} className="bg-gray-950">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
            </linearGradient>
            <pattern id="darkGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1f2937" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width={width} height={height} fill="url(#darkGrid)" />
          
          {/* Area under curve */}
          <path
            d={`${pathData} L ${xScale(chartData.length - 1)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`}
            fill="url(#lineGradient)"
          />
          
          {/* Main line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            filter="url(#glow)"
          />
          
          {/* Data points */}
          {chartData.filter((_, i) => i % 8 === 0).map((point, index) => (
            <circle
              key={index}
              cx={xScale(index * 8)}
              cy={yScale(point.close)}
              r="4"
              fill="#3B82F6"
              stroke="#1E293B"
              strokeWidth="2"
              filter="url(#glow)"
            />
          ))}

          {/* Price labels */}
          {Array.from({ length: 8 }, (_, i) => {
            const price = minPrice + (priceRange * i) / 7;
            const y = yScale(price);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#374151"
                  strokeWidth="0.5"
                  opacity="0.4"
                />
                <rect
                  x={width - padding.right + 5}
                  y={y - 8}
                  width="70"
                  height="16"
                  fill="#1f2937"
                  rx="4"
                  opacity="0.8"
                />
                <text
                  x={width - padding.right + 40}
                  y={y + 4}
                  fill="#E5E7EB"
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontWeight="500"
                >
                  {formatPrice(price)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderHeatmap = () => {
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD'];
    const cellSize = isFullscreen ? 120 : 90;
    const padding = 80;

    return (
      <div className="bg-gray-950 rounded-xl border border-gray-800 p-6 overflow-hidden">
        <svg width={currencies.length * cellSize + padding * 2} height={currencies.length * cellSize + padding * 2}>
          <defs>
            <filter id="cellGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Currency labels - horizontal */}
          {currencies.map((currency, i) => (
            <g key={`h-${currency}`}>
              <rect
                x={padding + i * cellSize + cellSize / 2 - 20}
                y={padding - 35}
                width="40"
                height="20"
                fill="#1f2937"
                rx="6"
                opacity="0.8"
              />
              <text
                x={padding + i * cellSize + cellSize / 2}
                y={padding - 22}
                fill="#E5E7EB"
                fontSize="14"
                textAnchor="middle"
                fontWeight="bold"
              >
                {currency}
              </text>
            </g>
          ))}
          
          {/* Currency labels - vertical */}
          {currencies.map((currency, i) => (
            <g key={`v-${currency}`}>
              <rect
                x={padding - 45}
                y={padding + i * cellSize + cellSize / 2 - 10}
                width="40"
                height="20"
                fill="#1f2937"
                rx="6"
                opacity="0.8"
              />
              <text
                x={padding - 25}
                y={padding + i * cellSize + cellSize / 2 + 4}
                fill="#E5E7EB"
                fontSize="14"
                textAnchor="middle"
                fontWeight="bold"
              >
                {currency}
              </text>
            </g>
          ))}

          {/* Heatmap cells */}
          {currencies.map((baseCurrency, i) =>
            currencies.map((quoteCurrency, j) => {
              if (i === j) return null;
              
              const strength = (Math.random() - 0.5) * 2;
              const intensity = Math.abs(strength);
              const color = strength > 0 ? '#10B981' : '#EF4444';
              
              return (
                <g key={`${baseCurrency}-${quoteCurrency}`}>
                  <rect
                    x={padding + j * cellSize + 4}
                    y={padding + i * cellSize + 4}
                    width={cellSize - 8}
                    height={cellSize - 8}
                    fill={color}
                    opacity={intensity * 0.8 + 0.2}
                    rx="8"
                    filter="url(#cellGlow)"
                  />
                  <text
                    x={padding + j * cellSize + cellSize / 2}
                    y={padding + i * cellSize + cellSize / 2 - 8}
                    fill="white"
                    fontSize="16"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {(strength * 100).toFixed(0)}
                  </text>
                  <text
                    x={padding + j * cellSize + cellSize / 2}
                    y={padding + i * cellSize + cellSize / 2 + 12}
                    fill="white"
                    fontSize="10"
                    textAnchor="middle"
                    opacity="0.9"
                    fontWeight="500"
                  >
                    {strength > 0 ? 'STRONG' : 'WEAK'}
                  </text>
                </g>
              );
            })
          )}
        </svg>
        
        <div className="mt-6 flex justify-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-lg shadow-lg shadow-green-500/30"></div>
            <span className="text-sm text-gray-300 font-medium">Strong Currency</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-red-500 rounded-lg shadow-lg shadow-red-500/30"></div>
            <span className="text-sm text-gray-300 font-medium">Weak Currency</span>
          </div>
        </div>
      </div>
    );
  };

  const renderMarketDepth = () => {
    const width = isFullscreen ? 1400 : 900;
    const height = isFullscreen ? 800 : 500;
    const centerX = width / 2;
    
    const bids = Array.from({ length: 25 }, (_, i) => ({
      price: 1.0850 - (i * 0.00008),
      volume: Math.random() * 1200000 + 200000
    }));
    
    const asks = Array.from({ length: 25 }, (_, i) => ({
      price: 1.0852 + (i * 0.00008),
      volume: Math.random() * 1200000 + 200000
    }));

    const maxVolume = Math.max(
      ...bids.map(b => b.volume),
      ...asks.map(a => a.volume)
    );

    return (
      <div className="bg-gray-950 rounded-xl border border-gray-800 p-6 overflow-hidden">
        <svg width={width} height={height}>
          <defs>
            <filter id="depthGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id="bidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="askGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Bids (left side) */}
          {bids.map((bid, i) => {
            const barWidth = (bid.volume / maxVolume) * (centerX - 60);
            const y = 30 + (i * (height - 60)) / bids.length;
            
            return (
              <g key={`bid-${i}`}>
                <rect
                  x={centerX - barWidth - 30}
                  y={y}
                  width={barWidth}
                  height={18}
                  fill="url(#bidGradient)"
                  rx="2"
                  filter="url(#depthGlow)"
                />
                <rect
                  x={centerX - 80}
                  y={y + 2}
                  width="75"
                  height="14"
                  fill="#1f2937"
                  rx="4"
                  opacity="0.9"
                />
                <text
                  x={centerX - 42}
                  y={y + 12}
                  fill="#10B981"
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {bid.price.toFixed(5)}
                </text>
              </g>
            );
          })}

          {/* Asks (right side) */}
          {asks.map((ask, i) => {
            const barWidth = (ask.volume / maxVolume) * (centerX - 60);
            const y = 30 + (i * (height - 60)) / asks.length;
            
            return (
              <g key={`ask-${i}`}>
                <rect
                  x={centerX + 30}
                  y={y}
                  width={barWidth}
                  height={18}
                  fill="url(#askGradient)"
                  rx="2"
                  filter="url(#depthGlow)"
                />
                <rect
                  x={centerX + 5}
                  y={y + 2}
                  width="75"
                  height="14"
                  fill="#1f2937"
                  rx="4"
                  opacity="0.9"
                />
                <text
                  x={centerX + 42}
                  y={y + 12}
                  fill="#EF4444"
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {ask.price.toFixed(5)}
                </text>
              </g>
            );
          })}

          {/* Center line */}
          <line
            x1={centerX}
            y1={30}
            x2={centerX}
            y2={height - 30}
            stroke="#6B7280"
            strokeWidth="3"
            strokeDasharray="8,4"
            opacity="0.8"
          />

          {/* Labels */}
          <rect x={centerX / 2 - 30} y={5} width="60" height="20" fill="#1f2937" rx="6" opacity="0.9"/>
          <text x={centerX / 2} y={18} fill="#10B981" fontSize="16" textAnchor="middle" fontWeight="bold">
            BIDS
          </text>
          <rect x={centerX + centerX / 2 - 30} y={5} width="60" height="20" fill="#1f2937" rx="6" opacity="0.9"/>
          <text x={centerX + centerX / 2} y={18} fill="#EF4444" fontSize="16" textAnchor="middle" fontWeight="bold">
            ASKS
          </text>
        </svg>
      </div>
    );
  };

  const renderChart = () => {
    switch (chartType) {
      case 'candlestick':
        return renderCandlestickChart();
      case 'line':
        return renderLineChart();
      case 'heatmap':
        return renderHeatmap();
      case 'depth':
        return renderMarketDepth();
      default:
        return renderCandlestickChart();
    }
  };

  const FullscreenOverlay = () => {
    if (!isFullscreen) return null;

    return (
      <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col">
        {/* Fullscreen Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white">
              {chartType === 'heatmap' ? 'Currency Strength Heatmap' : `${pair} Chart Analysis`}
            </h2>
            <Badge variant="outline" className="text-blue-400 border-blue-400 text-lg px-3 py-1">
              {timeframe}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="lg"
            onClick={toggleFullscreen}
            className="text-white hover:bg-gray-800"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Fullscreen Controls */}
        <div className="p-6 border-b border-gray-800">
          {/* Chart Type Selector */}
          <div className="flex items-center space-x-3 mb-4">
            {chartTypes.map((type) => (
              <Button
                key={type.id}
                variant={chartType === type.id ? "default" : "outline"}
                size="lg"
                onClick={() => onChartTypeChange(type.id)}
                className={`
                  relative overflow-hidden transition-all duration-300 border-0
                  ${chartType === type.id 
                    ? `bg-gradient-to-r ${type.gradient} text-white shadow-lg ${type.shadow} scale-105` 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }
                `}
              >
                <type.icon className="h-5 w-5 mr-2" />
                {type.label}
              </Button>
            ))}
          </div>

          {/* Timeframe Selector */}
          {chartType !== 'heatmap' && (
            <div className="flex items-center space-x-2">
              {timeframes.map((tf) => (
                <Button
                  key={tf.id}
                  variant={timeframe === tf.id ? "default" : "outline"}
                  size="lg"
                  onClick={() => setTimeframe(tf.id)}
                  className={`
                    relative overflow-hidden transition-all duration-300 border-0 min-w-[80px]
                    ${timeframe === tf.id 
                      ? `bg-gradient-to-r ${tf.gradient} text-white shadow-lg ${tf.glow} scale-105` 
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }
                  `}
                >
                  <tf.icon className="h-4 w-4 mr-2" />
                  {tf.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Fullscreen Chart */}
        <div className="flex-1 p-6 overflow-auto">
          {renderChart()}
        </div>
      </div>
    );
  };

  return (
    <>
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
              {chartType === 'heatmap' ? 'Currency Strength Heatmap' : `${pair} Chart Analysis`}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {timeframe}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-gray-700"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="chart" className="mt-4">
              {/* Chart Type Selector */}
              <div className="flex items-center space-x-3 mb-4">
                {chartTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={chartType === type.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => onChartTypeChange(type.id)}
                    className={`
                      relative overflow-hidden transition-all duration-300 border-0
                      ${chartType === type.id 
                        ? `bg-gradient-to-r ${type.gradient} text-white shadow-lg ${type.shadow} scale-105` 
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      }
                    `}
                  >
                    <type.icon className="h-4 w-4 mr-2" />
                    {type.label}
                  </Button>
                ))}
              </div>

              {/* Timeframe Selector */}
              {chartType !== 'heatmap' && (
                <div className="flex items-center space-x-2 mb-4">
                  {timeframes.map((tf) => (
                    <Button
                      key={tf.id}
                      variant={timeframe === tf.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTimeframe(tf.id)}
                      className={`
                        relative overflow-hidden transition-all duration-300 border-0 min-w-[60px]
                        ${timeframe === tf.id 
                          ? `bg-gradient-to-r ${tf.gradient} text-white shadow-lg ${tf.glow} scale-105` 
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                        }
                      `}
                    >
                      <tf.icon className="h-3 w-3 mr-1" />
                      {tf.label}
                    </Button>
                  ))}
                </div>
              )}

              {/* Chart */}
              <div ref={chartRef} className="w-full overflow-x-auto">
                {renderChart()}
              </div>

              {/* Chart Info */}
              {chartType !== 'heatmap' && chartData.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-400 mb-1">Current Price</p>
                    <p className="font-mono text-lg text-white font-bold">
                      {formatPrice(chartData[chartData.length - 1]?.close || 0)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-400 mb-1">24h Change</p>
                    <p className="font-mono text-lg text-green-400 font-bold">+0.00123</p>
                  </div>
                  <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-400 mb-1">24h High</p>
                    <p className="font-mono text-lg text-white font-bold">
                      {formatPrice(Math.max(...chartData.map(d => d.high)))}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-400 mb-1">24h Low</p>
                    <p className="font-mono text-lg text-white font-bold">
                      {formatPrice(Math.min(...chartData.map(d => d.low)))}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <div className="space-y-6">
                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <h4 className="text-white font-semibold mb-3">Chart Display</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="volume" className="text-gray-300">Show Volume</Label>
                      <Switch
                        id="volume"
                        checked={showVolume}
                        onCheckedChange={setShowVolume}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <h4 className="text-white font-semibold mb-3">Technical Indicators</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bollinger" className="text-gray-300">Bollinger Bands</Label>
                      <Switch
                        id="bollinger"
                        checked={showIndicators.bollinger}
                        onCheckedChange={(checked) => 
                          setShowIndicators(prev => ({ ...prev, bollinger: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ema" className="text-gray-300">EMA Lines</Label>
                      <Switch
                        id="ema"
                        checked={showIndicators.ema}
                        onCheckedChange={(checked) => 
                          setShowIndicators(prev => ({ ...prev, ema: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="support" className="text-gray-300">Support/Resistance</Label>
                      <Switch
                        id="support"
                        checked={showIndicators.support}
                        onCheckedChange={(checked) => 
                          setShowIndicators(prev => ({ ...prev, support: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pivot" className="text-gray-300">Pivot Points</Label>
                      <Switch
                        id="pivot"
                        checked={showIndicators.pivot}
                        onCheckedChange={(checked) => 
                          setShowIndicators(prev => ({ ...prev, pivot: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {indicators && (
                  <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <h4 className="text-white font-semibold mb-3">Technical Values</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                        <p className="text-gray-400 mb-1">RSI (14)</p>
                        <p className="text-white font-mono text-lg">{indicators.rsi.toFixed(1)}</p>
                      </div>
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                        <p className="text-gray-400 mb-1">MACD</p>
                        <p className="text-white font-mono text-lg">{indicators.macd.macd.toFixed(5)}</p>
                      </div>
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                        <p className="text-gray-400 mb-1">Stoch %K</p>
                        <p className="text-white font-mono text-lg">{indicators.stochastic.k}</p>
                      </div>
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                        <p className="text-gray-400 mb-1">Pivot Point</p>
                        <p className="text-white font-mono text-lg">{formatPrice(indicators.pivotPoints.pivot)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <FullscreenOverlay />
    </>
  );
}