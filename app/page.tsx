"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, BarChart3, LineChart, Zap } from 'lucide-react';
import MarketOverview from '@/components/MarketOverview';
import TradingChart from '@/components/TradingChart';
import TradingStrategies from '@/components/TradingStrategies';
import TradingRecommendations from '@/components/TradingRecommendations';
import FileUpload from '@/components/FileUpload';

export default function Home() {
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const [chartType, setChartType] = useState('candlestick');
  const [activeStrategy, setActiveStrategy] = useState('trend-following');

  const marketSummary = {
    totalProfit: 2847.50,
    totalTrades: 156,
    winRate: 68.5,
    activePositions: 4
  };

  return (
    <div className="min-h-screen p-12 bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">ForexAI Miantsa (fait avec le coeur ❤️)</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-400 border-green-400">
                <TrendingUp className="h-4 w-4 mr-1" />
                Live Trading
              </Badge>
              <div className="text-sm text-gray-300">
                <span className="text-green-400 font-semibold">
                  +${marketSummary.totalProfit.toFixed(2)}
                </span>
                <span className="ml-2">Today</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Market Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-800/50 border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Profit</p>
                <p className="text-2xl font-bold text-green-400">
                  ${marketSummary.totalProfit.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Trades</p>
                <p className="text-2xl font-bold text-white">{marketSummary.totalTrades}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Win Rate</p>
                <p className="text-2xl font-bold text-white">{marketSummary.winRate}%</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-400" />
            </div>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Positions</p>
                <p className="text-2xl font-bold text-white">{marketSummary.activePositions}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-400" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Market Overview */}
          <div className="lg:col-span-1">
            <MarketOverview 
              selectedPair={selectedPair}
              onPairSelect={setSelectedPair}
            />
          </div>

          {/* Right Column - Trading Interface */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="chart" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
                <TabsTrigger value="chart">Chart Analysis</TabsTrigger>
                <TabsTrigger value="strategies">Strategies</TabsTrigger>
                <TabsTrigger value="recommendations">AI Signals</TabsTrigger>
                <TabsTrigger value="upload">Upload Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="chart" className="mt-6">
                <TradingChart
                  pair={selectedPair}
                  chartType={chartType}
                  onChartTypeChange={setChartType}
                />
              </TabsContent>

              <TabsContent value="strategies" className="mt-6">
                <TradingStrategies
                  activeStrategy={activeStrategy}
                  onStrategyChange={setActiveStrategy}
                />
              </TabsContent>

              <TabsContent value="recommendations" className="mt-6">
                <TradingRecommendations
                  pair={selectedPair}
                  strategy={activeStrategy}
                />
              </TabsContent>

              <TabsContent value="upload" className="mt-6">
                <FileUpload />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}