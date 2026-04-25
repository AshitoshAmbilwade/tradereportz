import { Trade } from '@/app/contexts/TradeContext';

export interface AnalyticsMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakEvenTrades: number;
  winRate: number;
  totalPnL: number;
  averagePnL: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  payoffRatio: number;
  maxDrawdown: number;
  bestTrade: Trade | null;
  worstTrade: Trade | null;
  largestWin: number;
  largestLoss: number;
  maxWinStreak: number;
  maxLossStreak: number;
  currentStreak: { count: number; type: 'win' | 'loss' | 'none' };
}

export const calculateAnalytics = (trades: Trade[]): AnalyticsMetrics => {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      breakEvenTrades: 0,
      winRate: 0,
      totalPnL: 0,
      averagePnL: 0,
      averageWin: 0,
      averageLoss: 0,
      profitFactor: 0,
      payoffRatio: 0,
      maxDrawdown: 0,
      bestTrade: null,
      worstTrade: null,
      largestWin: 0,
      largestLoss: 0,
      maxWinStreak: 0,
      maxLossStreak: 0,
      currentStreak: { count: 0, type: 'none' },
    };
  }

  const sorted = [...trades].sort(
    (a, b) => new Date(a.tradeDate).getTime() - new Date(b.tradeDate).getTime()
  );

  const winning = sorted.filter((t) => t.pnl > 0);
  const losing = sorted.filter((t) => t.pnl < 0);
  const breakEven = sorted.filter((t) => t.pnl === 0);

  const totalPnL = sorted.reduce((s, t) => s + t.pnl, 0);
  const totalWins = winning.reduce((s, t) => s + t.pnl, 0);
  const totalLossAbs = Math.abs(losing.reduce((s, t) => s + t.pnl, 0));

  const profitFactor =
    totalLossAbs === 0 ? (totalWins > 0 ? Infinity : 0) : totalWins / totalLossAbs;

  const averageWin = winning.length > 0 ? totalWins / winning.length : 0;
  const averageLoss = losing.length > 0 ? totalLossAbs / losing.length : 0;
  const payoffRatio =
    averageLoss > 0 ? averageWin / averageLoss : averageWin > 0 ? Infinity : 0;

  // Max drawdown
  let maxDrawdown = 0;
  let peak = 0;
  let currentEquity = 0;
  sorted.forEach((t) => {
    currentEquity += t.pnl;
    if (currentEquity > peak) peak = currentEquity;
    const drawdown = peak - currentEquity;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  });

  // Streaks
  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let curWin = 0;
  let curLoss = 0;
  sorted.forEach((t) => {
    if (t.pnl > 0) {
      curWin++;
      curLoss = 0;
      if (curWin > maxWinStreak) maxWinStreak = curWin;
    } else if (t.pnl < 0) {
      curLoss++;
      curWin = 0;
      if (curLoss > maxLossStreak) maxLossStreak = curLoss;
    }
  });

  // Current streak from most recent trades
  let currentStreakCount = 0;
  let currentStreakType: 'win' | 'loss' | 'none' = 'none';
  const last = sorted[sorted.length - 1];
  if (last) {
    currentStreakType =
      last.pnl > 0 ? 'win' : last.pnl < 0 ? 'loss' : 'none';
    if (currentStreakType !== 'none') {
      for (let i = sorted.length - 1; i >= 0; i--) {
        const t = sorted[i];
        const type = t.pnl > 0 ? 'win' : t.pnl < 0 ? 'loss' : 'none';
        if (type === currentStreakType) currentStreakCount++;
        else break;
      }
    }
  }

  const bestTrade = sorted.reduce(
    (b, t) => (!b || t.pnl > b.pnl ? t : b),
    null as Trade | null
  );
  const worstTrade = sorted.reduce(
    (w, t) => (!w || t.pnl < w.pnl ? t : w),
    null as Trade | null
  );

  return {
    totalTrades: sorted.length,
    winningTrades: winning.length,
    losingTrades: losing.length,
    breakEvenTrades: breakEven.length,
    winRate: (winning.length / sorted.length) * 100,
    totalPnL,
    averagePnL: totalPnL / sorted.length,
    averageWin,
    averageLoss,
    profitFactor,
    payoffRatio,
    maxDrawdown,
    bestTrade,
    worstTrade,
    largestWin: bestTrade?.pnl ?? 0,
    largestLoss: worstTrade?.pnl ?? 0,
    maxWinStreak,
    maxLossStreak,
    currentStreak: { count: currentStreakCount, type: currentStreakType },
  };
};

export const getEquityCurve = (trades: Trade[]) => {
  const sorted = [...trades].sort(
    (a, b) => new Date(a.tradeDate).getTime() - new Date(b.tradeDate).getTime()
  );
  let equity = 0;
  let peak = 0;
  return sorted.map((t) => {
    equity += t.pnl;
    if (equity > peak) peak = equity;
    const drawdown = -(peak - equity);
    return {
      date: t.tradeDate.split('T')[0],
      equity: parseFloat(equity.toFixed(2)),
      drawdown: parseFloat(drawdown.toFixed(2)),
      pnl: t.pnl,
    };
  });
};

export const getPerformanceByPeriod = (
  trades: Trade[],
  period: 'daily' | 'weekly' | 'monthly'
) => {
  const grouped: Record<string, { pnl: number; trades: number; wins: number }> = {};

  trades.forEach((t) => {
    const date = new Date(t.tradeDate);
    let key: string;
    if (period === 'daily') {
      key = t.tradeDate.split('T')[0];
    } else if (period === 'weekly') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split('T')[0];
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    if (!grouped[key]) grouped[key] = { pnl: 0, trades: 0, wins: 0 };
    grouped[key].pnl += t.pnl;
    grouped[key].trades++;
    if (t.pnl > 0) grouped[key].wins++;
  });

  return Object.entries(grouped)
    .map(([date, d]) => ({
      date,
      pnl: parseFloat(d.pnl.toFixed(2)),
      trades: d.trades,
      winRate: d.trades > 0 ? parseFloat(((d.wins / d.trades) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const getPerformanceByStrategy = (trades: Trade[]) => {
  const data: Record<
    string,
    { wins: number; losses: number; totalPnL: number; trades: number }
  > = {};

  trades.forEach((t) => {
    const key = t.strategy?.trim() || 'No Strategy';
    if (!data[key]) data[key] = { wins: 0, losses: 0, totalPnL: 0, trades: 0 };
    if (t.pnl > 0) data[key].wins++;
    else if (t.pnl < 0) data[key].losses++;
    data[key].totalPnL += t.pnl;
    data[key].trades++;
  });

  return Object.entries(data)
    .map(([strategy, d]) => ({
      strategy,
      wins: d.wins,
      losses: d.losses,
      totalPnL: parseFloat(d.totalPnL.toFixed(2)),
      trades: d.trades,
      winRate:
        d.trades > 0
          ? parseFloat(((d.wins / d.trades) * 100).toFixed(1))
          : 0,
    }))
    .sort((a, b) => b.totalPnL - a.totalPnL);
};

export const getPerformanceBySegment = (trades: Trade[]) => {
  const data: Record<string, { pnl: number; trades: number; wins: number }> = {};

  trades.forEach((t) => {
    const key = t.segment || 'Unknown';
    if (!data[key]) data[key] = { pnl: 0, trades: 0, wins: 0 };
    data[key].pnl += t.pnl;
    data[key].trades++;
    if (t.pnl > 0) data[key].wins++;
  });

  return Object.entries(data)
    .map(([segment, d]) => ({
      segment: segment.charAt(0).toUpperCase() + segment.slice(1),
      pnl: parseFloat(d.pnl.toFixed(2)),
      trades: d.trades,
      winRate:
        d.trades > 0
          ? parseFloat(((d.wins / d.trades) * 100).toFixed(1))
          : 0,
    }))
    .sort((a, b) => b.pnl - a.pnl);
};

// Kept for backward compatibility
export const getPerformanceByAsset = (trades: Trade[]) =>
  getPerformanceBySegment(trades).map((s) => ({
    asset: s.segment,
    pnl: s.pnl,
    trades: s.trades,
    winRate: s.winRate,
  }));

export const getPerformanceBySession = (trades: Trade[]) => {
  const SESSION_LABELS: Record<string, string> = {
    morning: 'Morning',
    mid: 'Mid Day',
    last: 'Last Hour',
  };
  const data: Record<string, { pnl: number; trades: number; wins: number }> = {};

  trades.forEach((t) => {
    const key = t.session || 'Unknown';
    if (!data[key]) data[key] = { pnl: 0, trades: 0, wins: 0 };
    data[key].pnl += t.pnl;
    data[key].trades++;
    if (t.pnl > 0) data[key].wins++;
  });

  return Object.entries(data).map(([session, d]) => ({
    session: SESSION_LABELS[session] || session,
    pnl: parseFloat(d.pnl.toFixed(2)),
    trades: d.trades,
    winRate:
      d.trades > 0 ? parseFloat(((d.wins / d.trades) * 100).toFixed(1)) : 0,
  }));
};

export const getPerformanceByTradeType = (trades: Trade[]) => {
  const LABELS: Record<string, string> = {
    intraday: 'Intraday',
    positional: 'Positional',
    investment: 'Investment',
    swing: 'Swing',
    scalping: 'Scalping',
  };
  const data: Record<string, { pnl: number; trades: number; wins: number }> = {};

  trades.forEach((t) => {
    const key = t.tradeType || 'Unknown';
    if (!data[key]) data[key] = { pnl: 0, trades: 0, wins: 0 };
    data[key].pnl += t.pnl;
    data[key].trades++;
    if (t.pnl > 0) data[key].wins++;
  });

  return Object.entries(data).map(([type, d]) => ({
    type: LABELS[type] || type,
    pnl: parseFloat(d.pnl.toFixed(2)),
    trades: d.trades,
    winRate:
      d.trades > 0 ? parseFloat(((d.wins / d.trades) * 100).toFixed(1)) : 0,
  }));
};

export const getPerformanceByDirection = (trades: Trade[]) => {
  const data: Record<string, { pnl: number; trades: number; wins: number }> = {};

  trades.forEach((t) => {
    const key =
      t.direction ||
      (t.type === 'Buy' ? 'Long' : t.type === 'Sell' ? 'Short' : 'Unknown');
    if (!data[key]) data[key] = { pnl: 0, trades: 0, wins: 0 };
    data[key].pnl += t.pnl;
    data[key].trades++;
    if (t.pnl > 0) data[key].wins++;
  });

  return Object.entries(data).map(([direction, d]) => ({
    direction,
    pnl: parseFloat(d.pnl.toFixed(2)),
    trades: d.trades,
    winRate:
      d.trades > 0 ? parseFloat(((d.wins / d.trades) * 100).toFixed(1)) : 0,
  }));
};

export const getDayOfWeekPerformance = (trades: Trade[]) => {
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const data: Record<number, { pnl: number; trades: number; wins: number }> = {};

  trades.forEach((t) => {
    const day = new Date(t.tradeDate).getDay();
    if (!data[day]) data[day] = { pnl: 0, trades: 0, wins: 0 };
    data[day].pnl += t.pnl;
    data[day].trades++;
    if (t.pnl > 0) data[day].wins++;
  });

  return [0, 1, 2, 3, 4, 5, 6]
    .filter((d) => data[d])
    .map((d) => ({
      day: DAYS[d],
      pnl: parseFloat((data[d]?.pnl ?? 0).toFixed(2)),
      trades: data[d]?.trades ?? 0,
      winRate:
        (data[d]?.trades ?? 0) > 0
          ? parseFloat(
              (((data[d]?.wins ?? 0) / (data[d]?.trades ?? 1)) * 100).toFixed(1)
            )
          : 0,
    }));
};
