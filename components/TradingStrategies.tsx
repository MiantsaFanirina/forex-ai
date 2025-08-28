"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, Target, BarChart3 } from 'lucide-react';

interface TradingStrategiesProps {
  activeStrategy: string;
  onStrategyChange: (strategy: string) => void;
}

export default function TradingStrategies({ activeStrategy, onStrategyChange }: TradingStrategiesProps) {
  const strategies = [
    {
      id: 'scalping',
      name: 'Scalping',
      icon: Zap,
      description: 'Quick trades targeting small price movements',
      timeframe: '1M - 5M',
      riskLevel: 'High',
      winRate: '72%',
      features: [
        'Rapid entry/exit signals',
        'High frequency trading',
        'Small profit targets',
        'Tight stop losses'
      ]
    },
    {
      id: 'swing-trading',
      name: 'Swing Trading',
      icon: TrendingUp,
      description: 'Medium-term trades capturing price swings',
      timeframe: '1H - 1D',
      riskLevel: 'Medium',
      winRate: '65%',
      features: [
        'Trend-based signals',
        'Support/resistance levels',
        'Moderate risk-reward',
        'Position holding 1-7 days'
      ]
    },
    {
      id: 'trend-following',
      name: 'Trend Following',
      icon: Target,
      description: 'Long-term positions following major trends',
      timeframe: '4H - 1W',
      riskLevel: 'Low',
      winRate: '58%',
      features: [
        'Moving average crossovers',
        'Momentum indicators',
        'Large profit targets',
        'Risk management focus'
      ]
    },
    {
      id: 'breakout',
      name: 'Breakout Trading',
      icon: BarChart3,
      description: 'Capitalize on price breakouts from key levels',
      timeframe: '15M - 4H',
      riskLevel: 'Medium',
      winRate: '61%',
      features: [
        'Volume confirmation',
        'Key level identification',
        'False breakout filtering',
        'Quick momentum capture'
      ]
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-400 border-red-400';
      case 'Medium': return 'text-yellow-400 border-yellow-400';
      case 'Low': return 'text-green-400 border-green-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-400" />
          Trading Strategies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                activeStrategy === strategy.id
                  ? 'border-blue-400 bg-blue-400/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => onStrategyChange(strategy.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <strategy.icon className="h-5 w-5 text-blue-400" />
                  <h3 className="font-semibold text-white">{strategy.name}</h3>
                </div>
                {activeStrategy === strategy.id && (
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    Active
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-300 mb-3">{strategy.description}</p>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <p className="text-xs text-gray-400">Timeframe</p>
                  <p className="text-sm text-white">{strategy.timeframe}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Win Rate</p>
                  <p className="text-sm text-green-400">{strategy.winRate}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <Badge variant="outline" className={getRiskColor(strategy.riskLevel)}>
                  {strategy.riskLevel} Risk
                </Badge>
              </div>
              
              <div className="space-y-1">
                {strategy.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Strategy Performance</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-400">Total Trades</p>
              <p className="text-xl font-bold text-white">1,247</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Average Win</p>
              <p className="text-xl font-bold text-green-400">+$42.50</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Max Drawdown</p>
              <p className="text-xl font-bold text-red-400">-$156.20</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}