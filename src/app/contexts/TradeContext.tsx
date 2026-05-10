"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";

import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthContext";

export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  type?: "Buy" | "Sell";
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  pnl: number;
  session?: "morning" | "mid" | "last";
  segment?:
    | "equity"
    | "future"
    | "forex"
    | "option"
    | "commodity"
    | "currency"
    | "crypto";
  tradeType?: "intraday" | "positional" | "investment" | "swing" | "scalping";
  chartTimeframe?: string;
  strategy?: string;
  direction?: "Long" | "Short";
  entryCondition?:
    | "revenge"
    | "last entry"
    | "good"
    | "fomo"
    | "entry without confirmation"
    | "early entry"
    | "accurate entry";
  exitCondition?:
    | "accurate"
    | "early"
    | "fear"
    | "sl hit"
    | "target hit"
    | "trailing sl hit";
  entryDate?: string;
  entryNote?: string;
  exitDate?: string;
  exitNote?: string;
  brokerage?: number;
  remark?: string;
  notes?: string;
  tradeDate: string;
  source?: "manual" | "broker" | "importCSV";
  broker?: string;
  image?: string;
  aiAnalysis?: {
    summary?: string;
    plusPoints?: string[];
    minusPoints?: string[];
  };
  customFields?: Record<string, unknown>;
  createdAt: string;
}

type TradeInput = Omit<Trade, "id" | "userId" | "pnl" | "createdAt">;

interface TradeContextType {
  trades: Trade[];
  loading: boolean;
  addTrade: (trade: TradeInput) => Promise<void>;
  updateTrade: (id: string, trade: Partial<TradeInput>) => Promise<void>;
  deleteTrade: (id: string) => Promise<void>;
  duplicateTrade: (id: string) => Promise<void>;
  importTrades: (trades: Partial<Trade>[]) => Promise<void>;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

function mapRowToTrade(row: Record<string, unknown>): Trade {
  const screenshots = ((row.screenshots as string[] | null) ?? []).filter(Boolean);
  const legacyDirection = row.direction as string | undefined;
  const fallbackDirection = legacyDirection === "short" ? "Short" : "Long";

  return {
    id: row.id as string,
    userId: row.user_id as string,
    symbol: (row.symbol as string) ?? "",
    type: ((row.type as Trade["type"] | null) ?? undefined),
    quantity: Number(row.quantity ?? row.position_size ?? 0),
    entryPrice: Number(row.entry_price ?? row.entryPrice ?? 0),
    exitPrice:
      row.exit_price != null
        ? Number(row.exit_price)
        : row.exitPrice != null
        ? Number(row.exitPrice)
        : undefined,
    pnl: Number(row.pnl ?? 0),
    session: (row.session as Trade["session"] | null) ?? undefined,
    segment: (row.segment as Trade["segment"] | null) ?? undefined,
    tradeType: (row.trade_type as Trade["tradeType"] | null) ?? undefined,
    chartTimeframe: (row.chart_timeframe as string | null) ?? undefined,
    strategy: (row.strategy as string | null) ?? undefined,
    direction:
      (row.direction_v2 as Trade["direction"] | null) ??
      (legacyDirection ? fallbackDirection : undefined),
    entryCondition: (row.entry_condition as Trade["entryCondition"] | null) ?? undefined,
    exitCondition: (row.exit_condition as Trade["exitCondition"] | null) ?? undefined,
    entryDate: (row.entry_date as string | null) ?? undefined,
    entryNote: (row.entry_note as string | null) ?? undefined,
    exitDate: (row.exit_date as string | null) ?? undefined,
    exitNote: (row.exit_note as string | null) ?? undefined,
    brokerage: row.brokerage != null ? Number(row.brokerage) : 0,
    remark: (row.remark as string | null) ?? undefined,
    notes: (row.notes as string | null) ?? undefined,
    tradeDate:
      (row.trade_date as string) ??
      (row.tradeDate as string) ??
      new Date().toISOString().split("T")[0],
    source: ((row.source as Trade["source"] | null) ?? "manual"),
    broker: (row.broker as string | null) ?? undefined,
    image: ((row.image_url as string | null) ?? (row.image as string | null) ?? screenshots[0] ?? ""),
    aiAnalysis:
      (row.ai_analysis as Trade["aiAnalysis"] | null) ?? {
        summary: "",
        plusPoints: [],
        minusPoints: [],
      },
    customFields: (row.custom_fields as Record<string, unknown> | null) ?? {},
    createdAt:
      (row.created_at as string) ??
      (row.createdAt as string) ??
      new Date().toISOString(),
  };
}

export const TradeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);

  const stripUnknownColumn = (
    payload: Record<string, unknown>,
    message: string | undefined
  ) => {
    if (!message) return payload;
    const match = message.match(/Could not find the '([^']+)' column/i);
    if (!match?.[1]) return payload;
    const badColumn = match[1];
    const next = { ...payload };
    delete next[badColumn];
    return next;
  };

  const stripConstraintColumn = (
    payload: Record<string, unknown>,
    message: string | undefined
  ) => {
    if (!message) return payload;
    const next = { ...payload };
    const text = message.toLowerCase();

    if (text.includes("trades_trade_type_check")) delete next.trade_type;
    if (text.includes("trades_session_check")) delete next.session;
    if (text.includes("trades_segment_check")) delete next.segment;
    if (text.includes("trades_type_check")) delete next.type;
    if (text.includes("trades_direction_v2_check")) delete next.direction_v2;
    if (text.includes("trades_entry_condition_check")) delete next.entry_condition;
    if (text.includes("trades_exit_condition_check")) delete next.exit_condition;
    if (text.includes("trades_source_check")) delete next.source;

    return next;
  };

  const insertTradeWithFallback = async (payload: Record<string, unknown>) => {
    let current = { ...payload };
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const result = await supabase.from("trades").insert(current).select("*").single();
      if (!result.error) return result;
      let next = stripUnknownColumn(current, result.error.message);
      next = stripConstraintColumn(next, result.error.message);
      if (Object.keys(next).length === Object.keys(current).length) return result;
      current = next;
    }
    return await supabase.from("trades").insert(current).select("*").single();
  };

  const updateTradeWithFallback = async (
    id: string,
    payload: Record<string, unknown>
  ) => {
    let current = { ...payload };
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const result = await supabase
        .from("trades")
        .update(current)
        .eq("id", id)
        .select("*")
        .single();
      if (!result.error) return result;
      let next = stripUnknownColumn(current, result.error.message);
      next = stripConstraintColumn(next, result.error.message);
      if (Object.keys(next).length === Object.keys(current).length) return result;
      current = next;
    }
    return await supabase
      .from("trades")
      .update(current)
      .eq("id", id)
      .select("*")
      .single();
  };

  const calculatePnL = (trade: {
    type?: Trade["type"];
    direction?: Trade["direction"];
    entryPrice: number;
    exitPrice?: number;
    quantity: number;
    brokerage?: number;
  }) => {
    const isSell = trade.type === "Sell" || trade.direction === "Short";
    const exitPrice = trade.exitPrice ?? 0;
    const gross = isSell
      ? (trade.entryPrice - exitPrice) * trade.quantity
      : (exitPrice - trade.entryPrice) * trade.quantity;
    return gross - (trade.brokerage ?? 0);
  };

  const mapToDb = (trade: TradeInput) => ({
    type: trade.type ?? null,
    quantity: trade.quantity,
    session: trade.session ?? null,
    segment: trade.segment ?? null,
    trade_type: trade.tradeType ?? null,
    chart_timeframe: trade.chartTimeframe ?? null,
    strategy: trade.strategy ?? null,
    direction_v2: trade.direction ?? null,
    entry_condition: trade.entryCondition ?? null,
    exit_condition: trade.exitCondition ?? null,
    entry_date: trade.entryDate ?? null,
    entry_note: trade.entryNote ?? null,
    exit_date: trade.exitDate ?? null,
    exit_note: trade.exitNote ?? null,
    brokerage: trade.brokerage ?? 0,
    remark: trade.remark ?? null,
    notes: trade.notes ?? null,
    source: trade.source ?? "manual",
    broker: trade.broker ?? null,
    image_url: trade.image ?? "",
    symbol: trade.symbol,
    entry_price: trade.entryPrice,
    exit_price: trade.exitPrice ?? null,
    pnl: calculatePnL({
      type: trade.type,
      direction: trade.direction,
      entryPrice: trade.entryPrice,
      exitPrice: trade.exitPrice,
      quantity: trade.quantity,
      brokerage: trade.brokerage,
    }),
    trade_date: trade.tradeDate,
  });

  useEffect(() => {
    const loadTrades = async () => {
      if (!user) {
        setTrades([]);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("user_id", user.id)
        .order("trade_date", { ascending: false });

      if (error) {
        console.error("Failed to load trades", { message: error.message, details: error.details });
        setLoading(false);
        return;
      }

      setTrades((data ?? []).map((row) => mapRowToTrade(row)));
      setLoading(false);
    };

    void loadTrades();
  }, [user, supabase]);

  const addTrade = async (trade: TradeInput) => {
    if (!user) return;

    const { data, error } = await insertTradeWithFallback({
      user_id: user.id,
      ...mapToDb(trade),
    });

    if (error) {
      console.error("Failed to add trade", { message: error.message, details: error.details });
      throw new Error(error.message || "Unable to add trade");
    }

    setTrades((prev) => [mapRowToTrade(data), ...prev]);
  };

  const updateTrade = async (id: string, updatedFields: Partial<TradeInput>) => {
    const existing = trades.find((trade) => trade.id === id);
    if (!existing) return;

    const merged: TradeInput = {
      symbol: updatedFields.symbol ?? existing.symbol,
      type: updatedFields.type ?? existing.type,
      quantity: updatedFields.quantity ?? existing.quantity,
      entryPrice: updatedFields.entryPrice ?? existing.entryPrice,
      exitPrice: updatedFields.exitPrice ?? existing.exitPrice,
      session: updatedFields.session ?? existing.session,
      segment: updatedFields.segment ?? existing.segment,
      tradeType: updatedFields.tradeType ?? existing.tradeType,
      chartTimeframe: updatedFields.chartTimeframe ?? existing.chartTimeframe,
      strategy: updatedFields.strategy ?? existing.strategy,
      direction: updatedFields.direction ?? existing.direction,
      entryCondition: updatedFields.entryCondition ?? existing.entryCondition,
      exitCondition: updatedFields.exitCondition ?? existing.exitCondition,
      entryDate: updatedFields.entryDate ?? existing.entryDate,
      entryNote: updatedFields.entryNote ?? existing.entryNote,
      exitDate: updatedFields.exitDate ?? existing.exitDate,
      exitNote: updatedFields.exitNote ?? existing.exitNote,
      brokerage: updatedFields.brokerage ?? existing.brokerage,
      remark: updatedFields.remark ?? existing.remark,
      notes: updatedFields.notes ?? existing.notes,
      tradeDate: updatedFields.tradeDate ?? existing.tradeDate,
      source: updatedFields.source ?? existing.source,
      broker: updatedFields.broker ?? existing.broker,
      image: updatedFields.image ?? existing.image,
      aiAnalysis: updatedFields.aiAnalysis ?? existing.aiAnalysis,
      customFields: updatedFields.customFields ?? existing.customFields,
    };

    const { data, error } = await updateTradeWithFallback(id, mapToDb(merged));

    if (error) {
      console.error("Failed to update trade", { message: error.message, details: error.details });
      throw new Error(error.message || "Unable to update trade");
    }

    setTrades((prev) => prev.map((trade) => (trade.id === id ? mapRowToTrade(data) : trade)));
  };

  const deleteTrade = async (id: string) => {
    const { error } = await supabase.from("trades").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete trade", { message: error.message, details: error.details });
      throw new Error(error.message || "Unable to delete trade");
    }
    setTrades((prev) => prev.filter((trade) => trade.id !== id));
  };

  const duplicateTrade = async (id: string) => {
    const trade = trades.find((t) => t.id === id);
    if (!trade) return;
    const { id: _id, userId: _u, pnl: _p, createdAt: _c, ...tradeData } = trade;
    await addTrade(tradeData);
  };

  const importTrades = async (importedTrades: Partial<Trade>[]) => {
    if (!user) return;

    const prepared = importedTrades.map((trade) => ({
      user_id: user.id,
      ...mapToDb({
        symbol: trade.symbol || "",
        type: trade.type || "Buy",
        quantity: trade.quantity || 1,
        entryPrice: trade.entryPrice || 0,
        exitPrice: trade.exitPrice,
        session: trade.session || "morning",
        segment: trade.segment || "equity",
        tradeType: trade.tradeType || "intraday",
        chartTimeframe: trade.chartTimeframe || "5m",
        strategy: trade.strategy || "",
        direction: trade.direction || "Long",
        entryCondition: trade.entryCondition || "good",
        exitCondition: trade.exitCondition || "accurate",
        entryDate: trade.entryDate,
        entryNote: trade.entryNote,
        exitDate: trade.exitDate,
        exitNote: trade.exitNote,
        brokerage: trade.brokerage || 0,
        remark: trade.remark,
        notes: trade.notes || "",
        tradeDate: trade.tradeDate || new Date().toISOString().split("T")[0],
        source: trade.source || "importCSV",
        broker: trade.broker,
        image: trade.image || "",
        aiAnalysis: trade.aiAnalysis,
        customFields: trade.customFields,
      }),
    }));

    const { data, error } = await supabase.from("trades").insert(prepared).select("*");

    if (error) {
      console.error("Failed to import trades", { message: error.message, details: error.details });
      throw new Error(error.message || "Unable to import trades");
    }

    setTrades((prev) => [...(data ?? []).map((row) => mapRowToTrade(row)), ...prev]);
  };

  return (
    <TradeContext.Provider
      value={{ trades, loading, addTrade, updateTrade, deleteTrade, duplicateTrade, importTrades }}
    >
      {children}
    </TradeContext.Provider>
  );
};

export const useTrades = () => {
  const context = useContext(TradeContext);
  if (context === undefined) {
    throw new Error("useTrades must be used within a TradeProvider");
  }
  return context;
};
