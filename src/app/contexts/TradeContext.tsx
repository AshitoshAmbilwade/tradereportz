"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  assetType: 'stocks' | 'forex' | 'crypto' | 'futures' | 'options';
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  positionSize: number;
  riskPercent: number;
  strategy: string;
  setupTag: string;
  timeframe: string;
  session: 'asian' | 'london' | 'newyork' | 'mixed';
  emotionBefore?: string;
  emotionAfter?: string;
  mistakes?: string;
  notes?: string;
  pnl: number;
  tradeDate: string;
  createdAt: string;
  screenshots?: string[];
}

interface TradeContextType {
  trades: Trade[];
  addTrade: (trade: Omit<Trade, 'id' | 'userId' | 'pnl' | 'createdAt'>) => void;
  updateTrade: (id: string, trade: Partial<Trade>) => void;
  deleteTrade: (id: string) => void;
  duplicateTrade: (id: string) => void;
  importTrades: (trades: Partial<Trade>[]) => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export const TradeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    if (user) {
      const storedTrades = localStorage.getItem(`tradereportz_trades_${user.id}`);
      if (storedTrades) {
        setTrades(JSON.parse(storedTrades));
      }
    } else {
      setTrades([]);
    }
  }, [user]);

  useEffect(() => {
    if (user && trades.length > 0) {
      localStorage.setItem(`tradereportz_trades_${user.id}`, JSON.stringify(trades));
    }
  }, [trades, user]);

  const calculatePnL = (trade: Omit<Trade, 'id' | 'userId' | 'pnl' | 'createdAt'>) => {
    const { direction, entryPrice, exitPrice, positionSize } = trade;
    if (direction === 'long') {
      return (exitPrice - entryPrice) * positionSize;
    } else {
      return (entryPrice - exitPrice) * positionSize;
    }
  };

  const addTrade = (trade: Omit<Trade, 'id' | 'userId' | 'pnl' | 'createdAt'>) => {
    if (!user) return;

    const newTrade: Trade = {
      ...trade,
      id: crypto.randomUUID(),
      userId: user.id,
      pnl: calculatePnL(trade),
      createdAt: new Date().toISOString(),
    };

    setTrades((prev) => [...prev, newTrade]);
  };

  const updateTrade = (id: string, updatedFields: Partial<Trade>) => {
    setTrades((prev) =>
      prev.map((trade) => {
        if (trade.id === id) {
          const updated = { ...trade, ...updatedFields };
          if (updatedFields.entryPrice !== undefined || updatedFields.exitPrice !== undefined || 
              updatedFields.positionSize !== undefined || updatedFields.direction !== undefined) {
            updated.pnl = calculatePnL(updated);
          }
          return updated;
        }
        return trade;
      })
    );
  };

  const deleteTrade = (id: string) => {
    setTrades((prev) => prev.filter((trade) => trade.id !== id));
  };

  const duplicateTrade = (id: string) => {
    const trade = trades.find((t) => t.id === id);
    if (trade && user) {
      const { id: _, userId: __, createdAt: ___, ...tradeData } = trade;
      addTrade(tradeData);
    }
  };

  const importTrades = (importedTrades: Partial<Trade>[]) => {
    if (!user) return;

    const newTrades = importedTrades.map((trade) => {
      const completeTrade = {
        symbol: trade.symbol || '',
        assetType: trade.assetType || 'stocks',
        direction: trade.direction || 'long',
        entryPrice: trade.entryPrice || 0,
        exitPrice: trade.exitPrice || 0,
        positionSize: trade.positionSize || 0,
        riskPercent: trade.riskPercent || 1,
        strategy: trade.strategy || '',
        setupTag: trade.setupTag || '',
        timeframe: trade.timeframe || '1H',
        session: trade.session || 'mixed',
        tradeDate: trade.tradeDate || new Date().toISOString().split('T')[0],
        ...trade,
      } as Omit<Trade, 'id' | 'userId' | 'pnl' | 'createdAt'>;

      return {
        ...completeTrade,
        id: crypto.randomUUID(),
        userId: user.id,
        pnl: calculatePnL(completeTrade),
        createdAt: new Date().toISOString(),
      } as Trade;
    });

    setTrades((prev) => [...prev, ...newTrades]);
  };

  return (
    <TradeContext.Provider
      value={{
        trades,
        addTrade,
        updateTrade,
        deleteTrade,
        duplicateTrade,
        importTrades,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
};

export const useTrades = () => {
  const context = useContext(TradeContext);
  if (context === undefined) {
    throw new Error('useTrades must be used within a TradeProvider');
  }
  return context;
};
