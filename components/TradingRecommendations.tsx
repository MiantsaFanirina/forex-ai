"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Clock,
  DollarSign,
  BarChart3
} from 'lucide-react';

interface TradingRecommendationsProps {
  pair: string;
  strategy: string;
}

interface Recommendation {
  id: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  timeframe: string;
  reason: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  expectedReturn: number;
  volume: number;
}

export default function TradingRecommendations({ pair, strategy }: TradingRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [marketSentiment, setMarketSentiment] = useState({
    overall: 'BULLISH',
    strength: 72,
    volatility: 'MEDIUM'
  });

  useEffect(() => {
    generateRecommendations();
  }, [pair, strategy]);

  const generateRecommendations = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockRecommendations: Recommendation[] = [
      {
        id: '1',
        action: 'BUY',
        confidence: 85,
        entryPrice: 1.0854,
        targetPrice: 1.0892,
        stopLoss: 1.0831,
        timeframe: '4H',
        reason: 'Strong bullish momentum with RSI oversold bounce and moving average convergence',
        riskLevel: 'MEDIUM',
        expectedReturn: 3.5,
        volume: 50000
      },
      {
        id: '2',
        action: 'SELL',
        confidence: 78,
        entryPrice: 1.0845,
        targetPrice: 1.0809,
        stopLoss: 1.0862,
        timeframe: '1H',
        reason: 'Resistance level rejection with bearish divergence on MACD',
        riskLevel: 'HIGH',
        expectedReturn: 3.3,
        volume: 30000
      },
      {
        id: '3',
        action: 'HOLD',
        confidence: 65,
        entryPrice: 1.0850,
        targetPrice: 1.0850,
        stopLoss: 1.0835,
        timeframe: '1D',
        reason: 'Consolidation phase with mixed signals, wait for clearer direction',
        riskLevel: 'LOW',
        expectedReturn: 0,
        volume: 0
      }
    ];
    
    setRecommendations(mockRecommendations);
    setLoading(false);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'text-green-400 border-green-400';
      case 'SELL': return 'text-red-400 border-red-400';
      case 'HOLD': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'BUY': return <TrendingUp className="h-4 w-4" />;
      case 'SELL': return <TrendingDown className="h-4 w-4" />;
      case 'HOLD': return <Target className="h-4 w-4" />;
      default: return null;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH': return 'text-red-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Brain className="h-5 w-5 mr-2 text-blue-400" />
          AI Trading Signals - {pair}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Market Sentiment */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <h4 className="font-semibold text-white mb-3 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Market Sentiment Analysis
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400">Overall Sentiment</p>
              <Badge variant="outline" className="text-green-400 border-green-400">
                {marketSentiment.overall}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-400">Strength</p>
              <div className="flex items-center space-x-2">
                <Progress value={marketSentiment.strength} className="flex-1" />
                <span className="text-sm text-white">{marketSentiment.strength}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400">Volatility</p>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                {marketSentiment.volatility}
              </Badge>
            </div>
          </div>
        </div>

        {/* Generate New Recommendations */}
        <div className="mb-6">
          <Button
            onClick={generateRecommendations}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Analyzing Market...' : 'Generate New Recommendations'}
          </Button>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 border border-gray-700 rounded-lg bg-gray-900/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getActionIcon(rec.action)}
                  <Badge variant="outline" className={getActionColor(rec.action)}>
                    {rec.action}
                  </Badge>
                  <span className="text-sm text-gray-400">{rec.timeframe}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Confidence:</span>
                  <span className="text-sm font-semibold text-white">{rec.confidence}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-400">Entry Price</p>
                  <p className="font-mono text-sm text-white">{rec.entryPrice.toFixed(5)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Target Price</p>
                  <p className="font-mono text-sm text-green-400">{rec.targetPrice.toFixed(5)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Stop Loss</p>
                  <p className="font-mono text-sm text-red-400">{rec.stopLoss.toFixed(5)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Expected Return</p>
                  <p className="font-mono text-sm text-blue-400">{rec.expectedReturn.toFixed(1)}%</p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1">Risk Level</p>
                <Badge variant="outline" className={getRiskColor(rec.riskLevel)}>
                  {rec.riskLevel}
                </Badge>
              </div>

              <Alert className="bg-gray-800/50 border-gray-600">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-gray-300">
                  <strong>Analysis:</strong> {rec.reason}
                </AlertDescription>
              </Alert>

              {rec.action !== 'HOLD' && (
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      Suggested Volume: {rec.volume.toLocaleString()} units
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="text-black border-gray-600">
                    Execute Trade
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Strategy Performance */}
        <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
          <h4 className="font-semibold text-white mb-3 flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Strategy Performance ({strategy})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-400">Win Rate</p>
              <p className="text-xl font-bold text-green-400">68.5%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Avg. Return</p>
              <p className="text-xl font-bold text-blue-400">3.2%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Max Drawdown</p>
              <p className="text-xl font-bold text-red-400">-5.8%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Sharpe Ratio</p>
              <p className="text-xl font-bold text-white">1.42</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}