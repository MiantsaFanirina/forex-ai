"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { generateMockForexData } from '@/lib/mockData';

interface MarketOverviewProps {
  selectedPair: string;
  onPairSelect: (pair: string) => void;
}

export default function MarketOverview({ selectedPair, onPairSelect }: MarketOverviewProps) {
  const [marketData, setMarketData] = useState<any[]>([]);

  useEffect(() => {
    const data = generateMockForexData();
    setMarketData(data);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      const updatedData = generateMockForexData();
      setMarketData(updatedData);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
          Market Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketData.map((pair) => (
            <div
              key={pair.symbol}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedPair === pair.symbol
                  ? 'border-blue-400 bg-blue-400/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => onPairSelect(pair.symbol)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white">{pair.symbol}</span>
                  {getTrendIcon(pair.change)}
                </div>
                <Badge 
                  variant={pair.change > 0 ? "outline" : "destructive"}
                  className={pair.change > 0 ? "border-green-400 text-green-400" : ""}
                >
                  {pair.change > 0 ? '+' : ''}{pair.change.toFixed(4)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Current</p>
                  <p className="font-mono text-white">{pair.price.toFixed(5)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Change %</p>
                  <p className={`font-mono ${getTrendColor(pair.change)}`}>
                    {pair.change > 0 ? '+' : ''}{pair.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                <div>
                  <p className="text-gray-400">High</p>
                  <p className="font-mono text-white">{pair.high.toFixed(5)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Low</p>
                  <p className="font-mono text-white">{pair.low.toFixed(5)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}