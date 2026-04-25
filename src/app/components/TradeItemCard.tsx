"use client";

import { useState } from "react";
import { Trade } from "../contexts/TradeContext";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Copy, Edit, Trash2 } from "lucide-react";

interface TradeItemCardProps {
  trade: Trade;
  currency?: string;
  onEdit: (tradeId: string) => void;
  onDuplicate: (tradeId: string) => Promise<void>;
  onDelete: (tradeId: string) => Promise<void>;
}

export default function TradeItemCard({
  trade,
  currency,
  onEdit,
  onDuplicate,
  onDelete,
}: TradeItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPositive = trade.pnl >= 0;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-border/70 shadow-sm transition-all hover:shadow-md">
        <CardContent className="space-y-4 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-lg font-semibold tracking-wide">{trade.symbol}</p>
                <Badge value={trade.type ?? "N/A"} />
                <Badge value={trade.direction ?? "N/A"} />
                <Badge value={trade.tradeType ?? "N/A"} />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <Metric label="Date" value={formatDate(trade.tradeDate)} />
                <Metric label="Entry" value={formatCurrency(trade.entryPrice, currency)} />
                <Metric
                  label="Exit"
                  value={
                    trade.exitPrice != null
                      ? formatCurrency(trade.exitPrice, currency)
                      : "-"
                  }
                />
                <Metric label="Qty" value={String(trade.quantity)} />
                <Metric label="Brokerage" value={formatCurrency(trade.brokerage ?? 0, currency)} />
                <Metric
                  label="P&L"
                  value={formatCurrency(trade.pnl, currency)}
                  valueClassName={isPositive ? "text-emerald-600" : "text-rose-600"}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(trade.id)} title="Edit trade">
                <Edit size={16} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => void onDuplicate(trade.id)} title="Duplicate trade">
                <Copy size={16} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => void onDelete(trade.id)} title="Delete trade">
                <Trash2 size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded((prev) => !prev)}
                title={isExpanded ? "Hide details" : "Show details"}
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-border/60 pt-4"
              >
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <Metric label="Session" value={trade.session ?? "-"} />
                  <Metric label="Segment" value={trade.segment ?? "-"} />
                  <Metric label="Strategy" value={trade.strategy ?? "-"} />
                  <Metric label="Entry Condition" value={trade.entryCondition ?? "-"} />
                  <Metric label="Exit Condition" value={trade.exitCondition ?? "-"} />
                  <Metric label="Timeframe" value={trade.chartTimeframe ?? "-"} />
                  <Metric label="Entry Date" value={trade.entryDate ? formatDate(trade.entryDate) : "-"} />
                  <Metric label="Exit Date" value={trade.exitDate ? formatDate(trade.exitDate) : "-"} />
                  <Metric label="Broker" value={trade.broker ?? "-"} />
                  <Metric label="Entry Note" value={trade.entryNote ?? "-"} />
                  <Metric label="Exit Note" value={trade.exitNote ?? "-"} />
                  <Metric label="Remark" value={trade.remark ?? "-"} />
                </div>
                {trade.notes && (
                  <div className="mt-3 rounded-md border border-border/60 bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p className="mt-1 text-sm">{trade.notes}</p>
                  </div>
                )}
                {trade.image && (
                  <div className="mt-3">
                    <p className="mb-1 text-xs text-muted-foreground">Trade Screenshot</p>
                    <a href={trade.image} target="_blank" rel="noreferrer">
                      <img
                        src={trade.image}
                        alt={`${trade.symbol} trade`}
                        className="h-44 w-full max-w-md rounded-md border border-border/70 object-cover"
                      />
                    </a>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Badge({ value }: { value: string }) {
  return (
    <span className="rounded-full border border-border/70 bg-muted/40 px-2 py-0.5 text-xs font-medium capitalize">
      {value}
    </span>
  );
}

function Metric({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium wrap-break-word ${valueClassName ?? ""}`}>{value}</p>
    </div>
  );
}
