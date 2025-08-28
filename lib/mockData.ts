// Mock data generation utilities for forex trading app

export interface ForexPair {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  spread: number;
  bid: number;
  ask: number;
  lastUpdate: number;
}

export interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  date: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  currency: string;
  timestamp: number;
  source: string;
}

export interface TechnicalIndicator {
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  stochastic: {
    k: number;
    d: number;
  };
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  };
  ema20: number;
  ema50: number;
  sma200: number;
  support: number[];
  resistance: number[];
  pivotPoints: {
    pivot: number;
    r1: number;
    r2: number;
    r3: number;
    s1: number;
    s2: number;
    s3: number;
  };
}

export interface MarketDepth {
  bids: Array<{ price: number; volume: number }>;
  asks: Array<{ price: number; volume: number }>;
}

// Generate mock forex pair data
export const generateMockForexData = (): ForexPair[] => {
  const pairs = [
    { symbol: 'EUR/USD', base: 1.0854, volatility: 0.008 },
    { symbol: 'GBP/USD', base: 1.2743, volatility: 0.012 },
    { symbol: 'USD/JPY', base: 149.82, volatility: 0.006 },
    { symbol: 'USD/CHF', base: 0.8921, volatility: 0.007 },
    { symbol: 'AUD/USD', base: 0.6587, volatility: 0.010 },
    { symbol: 'USD/CAD', base: 1.3654, volatility: 0.009 },
    { symbol: 'NZD/USD', base: 0.6123, volatility: 0.011 },
    { symbol: 'EUR/GBP', base: 0.8512, volatility: 0.008 },
    { symbol: 'EUR/JPY', base: 162.45, volatility: 0.009 },
    { symbol: 'GBP/JPY', base: 190.87, volatility: 0.013 }
  ];

  return pairs.map(pair => {
    const changePercent = (Math.random() - 0.5) * 4; // -2% to +2%
    const change = (pair.base * changePercent) / 100;
    const price = pair.base + change;
    const spread = Math.random() * 0.0005 + 0.0001;
    
    return {
      symbol: pair.symbol,
      price: price,
      change: change,
      changePercent: changePercent,
      high: price + (Math.random() * pair.volatility * price),
      low: price - (Math.random() * pair.volatility * price),
      volume: Math.floor(Math.random() * 2000000) + 500000,
      spread: spread,
      bid: price - (spread / 2),
      ask: price + (spread / 2),
      lastUpdate: Date.now()
    };
  });
};

// Generate mock candlestick chart data with more realistic patterns
export const generateMockChartData = (pair: string, count: number = 200): CandlestickData[] => {
  const data: CandlestickData[] = [];
  const basePrice = getBasePriceForPair(pair);
  let currentPrice = basePrice;
  const now = Date.now();
  const volatility = getVolatilityForPair(pair);

  // Generate trend direction
  const trendDirection = Math.random() > 0.5 ? 1 : -1;
  const trendStrength = Math.random() * 0.0005;

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now - (i * 60 * 60 * 1000); // 1 hour intervals
    const date = new Date(timestamp).toISOString();
    
    // Add trend bias
    const trendBias = trendDirection * trendStrength * (count - i) / count;
    
    // Random walk with trend
    const randomChange = (Math.random() - 0.5) * volatility * currentPrice;
    const open = currentPrice;
    const close = open + randomChange + trendBias;
    
    // Generate realistic high/low based on open/close
    const bodySize = Math.abs(close - open);
    const wickSize = bodySize * (0.5 + Math.random() * 1.5);
    
    const high = Math.max(open, close) + (Math.random() * wickSize);
    const low = Math.min(open, close) - (Math.random() * wickSize);
    
    // Volume correlation with price movement
    const priceMovement = Math.abs(close - open) / open;
    const baseVolume = 10000 + Math.random() * 40000;
    const volume = Math.floor(baseVolume * (1 + priceMovement * 5));
    
    data.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume,
      date
    });
    
    currentPrice = close;
  }

  return data.reverse(); // Return in chronological order
};

// Generate comprehensive technical indicators
export const generateMockTechnicalIndicators = (pair: string, chartData: CandlestickData[]): TechnicalIndicator => {
  const currentPrice = getBasePriceForPair(pair);
  const high = currentPrice * 1.02;
  const low = currentPrice * 0.98;
  
  // Calculate pivot points
  const pivot = (high + low + currentPrice) / 3;
  const r1 = (2 * pivot) - low;
  const s1 = (2 * pivot) - high;
  const r2 = pivot + (high - low);
  const s2 = pivot - (high - low);
  const r3 = high + 2 * (pivot - low);
  const s3 = low - 2 * (high - pivot);

  return {
    rsi: 30 + Math.random() * 40, // 30-70 range for more realistic RSI
    macd: {
      macd: (Math.random() - 0.5) * 0.002,
      signal: (Math.random() - 0.5) * 0.002,
      histogram: (Math.random() - 0.5) * 0.001
    },
    stochastic: {
      k: Math.floor(Math.random() * 100),
      d: Math.floor(Math.random() * 100)
    },
    bollinger: {
      upper: currentPrice * 1.015,
      middle: currentPrice,
      lower: currentPrice * 0.985
    },
    ema20: currentPrice * (0.995 + Math.random() * 0.01),
    ema50: currentPrice * (0.99 + Math.random() * 0.02),
    sma200: currentPrice * (0.98 + Math.random() * 0.04),
    support: [
      currentPrice * 0.995,
      currentPrice * 0.99,
      currentPrice * 0.985
    ],
    resistance: [
      currentPrice * 1.005,
      currentPrice * 1.01,
      currentPrice * 1.015
    ],
    pivotPoints: {
      pivot,
      r1,
      r2,
      r3,
      s1,
      s2,
      s3
    }
  };
};

// Generate market depth data
export const generateMockMarketDepth = (pair: string): MarketDepth => {
  const currentPrice = getBasePriceForPair(pair);
  const spread = 0.0002;
  
  const bids = [];
  const asks = [];
  
  // Generate 10 levels of market depth
  for (let i = 0; i < 10; i++) {
    bids.push({
      price: currentPrice - spread/2 - (i * 0.0001),
      volume: Math.floor(Math.random() * 1000000) + 100000
    });
    
    asks.push({
      price: currentPrice + spread/2 + (i * 0.0001),
      volume: Math.floor(Math.random() * 1000000) + 100000
    });
  }
  
  return { bids, asks };
};

// Generate mock economic news with more variety
export const generateMockNews = (): NewsItem[] => {
  const newsTemplates = [
    {
      title: 'Federal Reserve Signals Potential Rate Hike',
      summary: 'Fed officials hint at possible interest rate increase in next meeting due to inflation concerns',
      impact: 'HIGH' as const,
      currency: 'USD',
      source: 'Reuters'
    },
    {
      title: 'ECB Maintains Dovish Stance on Monetary Policy',
      summary: 'European Central Bank keeps rates unchanged, emphasizing gradual approach to policy normalization',
      impact: 'MEDIUM' as const,
      currency: 'EUR',
      source: 'Bloomberg'
    },
    {
      title: 'UK GDP Growth Exceeds Expectations',
      summary: 'British economy shows resilience with stronger than expected quarterly growth figures',
      impact: 'MEDIUM' as const,
      currency: 'GBP',
      source: 'Financial Times'
    },
    {
      title: 'Bank of Japan Intervenes in Currency Markets',
      summary: 'BOJ takes action to prevent further yen weakness against major currencies',
      impact: 'HIGH' as const,
      currency: 'JPY',
      source: 'Nikkei'
    },
    {
      title: 'Australian Employment Data Shows Mixed Results',
      summary: 'Job growth slows but unemployment rate remains stable in latest labour market report',
      impact: 'LOW' as const,
      currency: 'AUD',
      source: 'Australian Financial Review'
    },
    {
      title: 'Swiss National Bank Maintains Negative Rates',
      summary: 'SNB keeps policy rate unchanged at -0.75% amid global economic uncertainty',
      impact: 'MEDIUM' as const,
      currency: 'CHF',
      source: 'Swiss Info'
    },
    {
      title: 'Canadian Inflation Data Beats Forecasts',
      summary: 'Consumer price index rises more than expected, supporting hawkish BoC stance',
      impact: 'HIGH' as const,
      currency: 'CAD',
      source: 'Globe and Mail'
    }
  ];

  return newsTemplates.map((template, index) => ({
    id: (index + 1).toString(),
    ...template,
    timestamp: Date.now() - (index * 3600000) // Stagger by hours
  }));
};

// Generate mock market sentiment data with more detail
export const generateMockSentiment = () => {
  const sentiments = ['BULLISH', 'BEARISH', 'NEUTRAL'];
  const volatilityLevels = ['LOW', 'MEDIUM', 'HIGH'];
  
  return {
    overall: sentiments[Math.floor(Math.random() * sentiments.length)],
    strength: Math.floor(Math.random() * 40) + 60, // 60-100
    volatility: volatilityLevels[Math.floor(Math.random() * volatilityLevels.length)],
    fearGreedIndex: Math.floor(Math.random() * 100),
    marketCap: Math.floor(Math.random() * 1000) + 5000, // 5T-6T
    bullishPercent: Math.floor(Math.random() * 40) + 30, // 30-70
    bearishPercent: Math.floor(Math.random() * 40) + 30, // 30-70
    neutralPercent: Math.floor(Math.random() * 20) + 10, // 10-30
    momentum: (Math.random() - 0.5) * 2, // -1 to 1
    trendStrength: Math.random()
  };
};

// Generate heatmap data for currency strength
export const generateCurrencyHeatmapData = () => {
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD'];
  const data = [];
  
  for (let i = 0; i < currencies.length; i++) {
    for (let j = 0; j < currencies.length; j++) {
      if (i !== j) {
        const strength = (Math.random() - 0.5) * 2; // -1 to 1
        data.push({
          base: currencies[i],
          quote: currencies[j],
          strength,
          change: (Math.random() - 0.5) * 0.02 // -1% to 1%
        });
      }
    }
  }
  
  return data;
};

// Helper function to get base price for different pairs
const getBasePriceForPair = (pair: string): number => {
  const basePrices: { [key: string]: number } = {
    'EUR/USD': 1.0854,
    'GBP/USD': 1.2743,
    'USD/JPY': 149.82,
    'USD/CHF': 0.8921,
    'AUD/USD': 0.6587,
    'USD/CAD': 1.3654,
    'NZD/USD': 0.6123,
    'EUR/GBP': 0.8512,
    'EUR/JPY': 162.45,
    'GBP/JPY': 190.87
  };
  
  return basePrices[pair] || 1.0000;
};

// Helper function to get volatility for different pairs
const getVolatilityForPair = (pair: string): number => {
  const volatilities: { [key: string]: number } = {
    'EUR/USD': 0.008,
    'GBP/USD': 0.012,
    'USD/JPY': 0.006,
    'USD/CHF': 0.007,
    'AUD/USD': 0.010,
    'USD/CAD': 0.009,
    'NZD/USD': 0.011,
    'EUR/GBP': 0.008,
    'EUR/JPY': 0.009,
    'GBP/JPY': 0.013
  };
  
  return volatilities[pair] || 0.008;
};

// Generate mock trading signals with enhanced logic
export const generateMockSignals = (pair: string, strategy: string) => {
  const signals = ['BUY', 'SELL', 'HOLD'];
  const timeframes = ['5M', '15M', '1H', '4H', '1D'];
  const basePrice = getBasePriceForPair(pair);
  
  const signal = signals[Math.floor(Math.random() * signals.length)];
  const confidence = Math.floor(Math.random() * 30) + 70; // 70-100
  
  let stopLoss, takeProfit;
  if (signal === 'BUY') {
    stopLoss = basePrice * (0.995 - Math.random() * 0.005);
    takeProfit = basePrice * (1.005 + Math.random() * 0.015);
  } else if (signal === 'SELL') {
    stopLoss = basePrice * (1.005 + Math.random() * 0.005);
    takeProfit = basePrice * (0.995 - Math.random() * 0.015);
  } else {
    stopLoss = basePrice * 0.99;
    takeProfit = basePrice * 1.01;
  }
  
  const riskReward = Math.abs(takeProfit - basePrice) / Math.abs(basePrice - stopLoss);
  
  return {
    signal,
    confidence,
    timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
    entryPrice: basePrice,
    stopLoss,
    takeProfit,
    riskReward: riskReward.toFixed(1),
    reasoning: generateSignalReasoning(strategy),
    volume: Math.floor(Math.random() * 100000) + 10000,
    expectedDuration: `${Math.floor(Math.random() * 48) + 1}h`,
    probability: confidence + Math.floor(Math.random() * 10) - 5
  };
};

const generateSignalReasoning = (strategy: string): string => {
  const reasons = {
    'scalping': [
      'Short-term momentum favors quick entry with tight spreads',
      'High volume spike confirms immediate price movement',
      'Level 2 data shows strong order flow imbalance',
      'Micro-trend breakout with volume confirmation'
    ],
    'swing-trading': [
      'Price approaching key Fibonacci retracement level',
      'RSI showing bullish divergence with price action',
      'Moving average crossover signal confirmed',
      'Support/resistance level holding with volume'
    ],
    'trend-following': [
      'Strong directional momentum across multiple timeframes',
      'Trend strength indicator above 70% threshold',
      'Moving averages aligned in trending formation',
      'Breakout from consolidation with volume expansion'
    ],
    'breakout': [
      'Price breaking above key resistance with high volume',
      'Triangle pattern completion with momentum',
      'Volatility expansion after consolidation period',
      'Multiple timeframe breakout confirmation'
    ]
  };
  
  const strategyReasons = reasons[strategy as keyof typeof reasons] || reasons['trend-following'];
  return strategyReasons[Math.floor(Math.random() * strategyReasons.length)];
};

// Generate order book data
export const generateOrderBookData = (pair: string) => {
  const currentPrice = getBasePriceForPair(pair);
  const spread = 0.0002;
  
  const orderBook = {
    bids: [] as Array<{ price: number; volume: number; orders: number }>,
    asks: [] as Array<{ price: number; volume: number; orders: number }>
  };
  
  // Generate 20 levels each side
  for (let i = 0; i < 20; i++) {
    const bidPrice = currentPrice - spread/2 - (i * 0.00005);
    const askPrice = currentPrice + spread/2 + (i * 0.00005);
    
    orderBook.bids.push({
      price: bidPrice,
      volume: Math.floor(Math.random() * 500000) + 50000,
      orders: Math.floor(Math.random() * 50) + 5
    });
    
    orderBook.asks.push({
      price: askPrice,
      volume: Math.floor(Math.random() * 500000) + 50000,
      orders: Math.floor(Math.random() * 50) + 5
    });
  }
  
  return orderBook;
};