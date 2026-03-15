import { Trade } from '../contexts/TradeContext';

export interface AnalyticsMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnL: number;
  averagePnL: number;
  profitFactor: number;
  averageRRR: number;
  maxDrawdown: number;
  bestTrade: Trade | null;
  worstTrade: Trade | null;
  largestWin: number;
  largestLoss: number;
}

export const calculateAnalytics = (trades: Trade[]): AnalyticsMetrics => {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      totalPnL: 0,
      averagePnL: 0,
      profitFactor: 0,
      averageRRR: 0,
      maxDrawdown: 0,
      bestTrade: null,
      worstTrade: null,
      largestWin: 0,
      largestLoss: 0,
    };
  }

  const winningTrades = trades.filter((t) => t.pnl > 0);
  const losingTrades = trades.filter((t) => t.pnl < 0);

  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const totalWins = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const totalLosses = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0));

  const profitFactor = totalLosses === 0 ? (totalWins > 0 ? Infinity : 0) : totalWins / totalLosses;

  // Calculate average RRR
  const rrrTrades = trades.filter(
    (t) => t.stopLoss && t.takeProfit && t.entryPrice
  );
  const averageRRR =
    rrrTrades.length > 0
      ? rrrTrades.reduce((sum, trade) => {
          const risk = Math.abs(trade.entryPrice - (trade.stopLoss || 0));
          const reward = Math.abs((trade.takeProfit || 0) - trade.entryPrice);
          return sum + (risk > 0 ? reward / risk : 0);
        }, 0) / rrrTrades.length
      : 0;

  // Calculate max drawdown
  let maxDrawdown = 0;
  let peak = 0;
  let currentEquity = 0;
  
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.tradeDate).getTime() - new Date(b.tradeDate).getTime()
  );

  sortedTrades.forEach((trade) => {
    currentEquity += trade.pnl;
    if (currentEquity > peak) {
      peak = currentEquity;
    }
    const drawdown = peak - currentEquity;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  const bestTrade = trades.reduce((best, trade) => 
    !best || trade.pnl > best.pnl ? trade : best
  , null as Trade | null);

  const worstTrade = trades.reduce((worst, trade) => 
    !worst || trade.pnl < worst.pnl ? trade : worst
  , null as Trade | null);

  return {
    totalTrades: trades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate: trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0,
    totalPnL,
    averagePnL: totalPnL / trades.length,
    profitFactor,
    averageRRR,
    maxDrawdown,
    bestTrade,
    worstTrade,
    largestWin: bestTrade?.pnl || 0,
    largestLoss: worstTrade?.pnl || 0,
  };
};

export const getEquityCurve = (trades: Trade[]) => {
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.tradeDate).getTime() - new Date(b.tradeDate).getTime()
  );

  let equity = 0;
  return sortedTrades.map((trade) => {
    equity += trade.pnl;
    return {
      date: trade.tradeDate,
      equity,
      pnl: trade.pnl,
    };
  });
};

export const getPerformanceByPeriod = (trades: Trade[], period: 'daily' | 'weekly' | 'monthly') => {
  const groupedData: { [key: string]: number } = {};

  trades.forEach((trade) => {
    const date = new Date(trade.tradeDate);
    let key: string;

    if (period === 'daily') {
      key = date.toISOString().split('T')[0];
    } else if (period === 'weekly') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split('T')[0];
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    groupedData[key] = (groupedData[key] || 0) + trade.pnl;
  });

  return Object.entries(groupedData)
    .map(([date, pnl]) => ({ date, pnl }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const getPerformanceByStrategy = (trades: Trade[]) => {
  const strategyData: { [key: string]: { wins: number; losses: number; totalPnL: number } } = {};

  trades.forEach((trade) => {
    if (!strategyData[trade.strategy]) {
      strategyData[trade.strategy] = { wins: 0, losses: 0, totalPnL: 0 };
    }

    if (trade.pnl > 0) {
      strategyData[trade.strategy].wins++;
    } else {
      strategyData[trade.strategy].losses++;
    }
    strategyData[trade.strategy].totalPnL += trade.pnl;
  });

  return Object.entries(strategyData).map(([strategy, data]) => ({
    strategy,
    wins: data.wins,
    losses: data.losses,
    totalPnL: data.totalPnL,
    winRate: ((data.wins / (data.wins + data.losses)) * 100).toFixed(1),
  }));
};

export const getPerformanceByAsset = (trades: Trade[]) => {
  const assetData: { [key: string]: number } = {};

  trades.forEach((trade) => {
    assetData[trade.assetType] = (assetData[trade.assetType] || 0) + trade.pnl;
  });

  return Object.entries(assetData).map(([asset, pnl]) => ({
    asset,
    pnl,
  }));
};
