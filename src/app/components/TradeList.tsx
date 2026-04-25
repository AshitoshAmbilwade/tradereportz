import { useState } from "react";
import { useTrades, Trade } from "../contexts/TradeContext";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "./ui/dialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Copy, Edit, Eye, Trash2, TrendingUp, TrendingDown, Calendar, Clock, BarChart2, FileText, ImageIcon } from "lucide-react";

interface TradeListProps {
  onEdit: (tradeId: string) => void;
}

export default function TradeList({ onEdit }: TradeListProps) {
  const { trades, loading, deleteTrade, duplicateTrade } = useTrades();
  const { user } = useAuth();
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const handleDelete = async (tradeId: string) => {
    if (!window.confirm("Are you sure you want to delete this trade?")) return;
    await deleteTrade(tradeId);
  };

  if (loading) {
    return (
      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-6 text-center text-muted-foreground">Loading trades...</CardContent>
      </Card>
    );
  }

  if (trades.length === 0) {
    return (
      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-8 text-center text-muted-foreground">
          No trades yet. Add your first trade to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="pl-4">Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>Exit</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>P&L</TableHead>
                <TableHead>Strategy</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => (
                <TableRow key={trade.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="pl-4 font-semibold">{trade.symbol.toUpperCase()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{trade.type ?? "-"}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(trade.tradeDate)}</TableCell>
                  <TableCell>{formatCurrency(trade.entryPrice, user?.currency)}</TableCell>
                  <TableCell>
                    {trade.exitPrice != null ? formatCurrency(trade.exitPrice, user?.currency) : "-"}
                  </TableCell>
                  <TableCell>{trade.quantity}</TableCell>
                  <TableCell className={trade.pnl >= 0 ? "font-semibold text-emerald-500" : "font-semibold text-rose-500"}>
                    {formatCurrency(trade.pnl, user?.currency)}
                  </TableCell>
                  <TableCell className="max-w-45 truncate text-muted-foreground">
                    {trade.strategy || "-"}
                  </TableCell>
                  <TableCell className="pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedTrade(trade)} title="View trade">
                        <Eye size={15} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(trade.id)} title="Edit trade">
                        <Edit size={15} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => void duplicateTrade(trade.id)} title="Duplicate trade">
                        <Copy size={15} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => void handleDelete(trade.id)} title="Delete trade">
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Trade Detail View Dialog */}
      <Dialog open={!!selectedTrade} onOpenChange={(open) => !open && setSelectedTrade(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto p-0 gap-0">
          {/* visually hidden title satisfies accessibility requirement */}
          <DialogTitle className="sr-only">
            {selectedTrade ? `Trade: ${selectedTrade.symbol.toUpperCase()}` : "Trade Details"}
          </DialogTitle>
          {selectedTrade && <TradeDetailView trade={selectedTrade} currency={user?.currency} onClose={() => setSelectedTrade(null)} onEdit={(id) => { setSelectedTrade(null); onEdit(id); }} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function TradeDetailView({ trade, currency, onClose, onEdit }: { trade: Trade; currency?: string; onClose: () => void; onEdit: (id: string) => void }) {
  const isProfit = trade.pnl >= 0;

  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <div className={`px-6 pt-6 pb-5 ${isProfit ? "bg-emerald-500/8 border-b border-emerald-500/20" : "bg-rose-500/8 border-b border-rose-500/20"}`}>
        <div className="flex items-start justify-between gap-4 pr-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold tracking-wide">{trade.symbol.toUpperCase()}</h2>
              {trade.type && (
                <Badge className={trade.type === "Buy" ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" : "bg-rose-500/15 text-rose-600 border-rose-500/30"} variant="outline">
                  {trade.type}
                </Badge>
              )}
              {trade.direction && (
                <Badge variant="outline" className="capitalize">{trade.direction}</Badge>
              )}
              {trade.tradeType && (
                <Badge variant="secondary" className="capitalize">{trade.tradeType}</Badge>
              )}
              {trade.segment && (
                <Badge variant="outline" className="capitalize text-xs">{trade.segment}</Badge>
              )}
              {trade.image && (
                <Badge variant="outline" className="gap-1 text-xs">
                  <ImageIcon size={10} /> Screenshot
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                {formatDate(trade.tradeDate)}
              </span>
              {trade.session && (
                <span className="flex items-center gap-1">
                  <Clock size={13} />
                  {trade.session} session
                </span>
              )}
              {trade.broker && (
                <span className="flex items-center gap-1">
                  <BarChart2 size={13} />
                  {trade.broker}
                </span>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">P&L</p>
            <div className="flex items-center gap-1.5 justify-end">
              {isProfit ? <TrendingUp size={20} className="text-emerald-500" /> : <TrendingDown size={20} className="text-rose-500" />}
              <span className={`text-3xl font-bold ${isProfit ? "text-emerald-500" : "text-rose-500"}`}>
                {formatCurrency(trade.pnl, currency)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {trade.quantity} × ({formatCurrency(trade.entryPrice, currency)} → {trade.exitPrice != null ? formatCurrency(trade.exitPrice, currency) : "open"})
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">

        {/* Key Execution Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard label="Entry Price" value={formatCurrency(trade.entryPrice, currency)} />
          <MetricCard label="Exit Price" value={trade.exitPrice != null ? formatCurrency(trade.exitPrice, currency) : "—"} />
          <MetricCard label="Quantity" value={String(trade.quantity)} />
          <MetricCard label="Brokerage" value={formatCurrency(trade.brokerage ?? 0, currency)} />
        </div>

        {/* Dates row */}
        <div className="grid grid-cols-3 gap-3">
          <InfoBox label="Trade Date" value={formatDate(trade.tradeDate)} />
          <InfoBox label="Entry Date" value={trade.entryDate ? formatDate(trade.entryDate) : "—"} />
          <InfoBox label="Exit Date" value={trade.exitDate ? formatDate(trade.exitDate) : "—"} />
        </div>

        {/* Classification */}
        <div>
          <SectionHeading icon={<BarChart2 size={13} />} title="Classification & Execution Quality" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <InfoBox label="Entry Condition" value={trade.entryCondition ?? "—"} capitalize />
            <InfoBox label="Exit Condition" value={trade.exitCondition ?? "—"} capitalize />
            <InfoBox label="Chart Timeframe" value={trade.chartTimeframe ?? "—"} />
            <InfoBox label="Strategy" value={trade.strategy ?? "—"} />
            <InfoBox label="Source" value={trade.source ?? "—"} capitalize />
            <InfoBox label="Direction" value={trade.direction ?? "—"} capitalize />
          </div>
        </div>

        {/* Notes & Context */}
        {(trade.entryNote || trade.exitNote || trade.notes || trade.remark) && (
          <div>
            <SectionHeading icon={<FileText size={13} />} title="Notes & Context" />
            <div className="space-y-2.5">
              {trade.entryNote && <NoteBox label="Entry Note" value={trade.entryNote} accent="emerald" />}
              {trade.exitNote && <NoteBox label="Exit Note" value={trade.exitNote} accent="rose" />}
              {trade.notes && <NoteBox label="General Notes" value={trade.notes} />}
              {trade.remark && <NoteBox label="Remark" value={trade.remark} accent="amber" />}
            </div>
          </div>
        )}

        {/* Trade Screenshot */}
        {trade.image && (
          <div>
            <SectionHeading icon={<ImageIcon size={13} />} title="Trade Screenshot" />
            <a href={trade.image} target="_blank" rel="noreferrer" className="block group">
              <div className="relative overflow-hidden rounded-xl border border-border/60 shadow-md">
                <img
                  src={trade.image}
                  alt={`${trade.symbol} trade chart`}
                  className="w-full max-h-80 object-contain bg-muted/30 group-hover:scale-[1.01] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-black/70 text-white px-3 py-1.5 rounded-full">
                    Click to open full size
                  </span>
                </div>
              </div>
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-1 border-t border-border/40">
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          <Button size="sm" onClick={() => onEdit(trade.id)} className="gap-1.5">
            <Edit size={14} />
            Edit Trade
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
      {icon}
      {title}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-center">
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function InfoBox({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="rounded-md border border-border/40 bg-muted/20 px-3 py-2.5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium mt-0.5 ${capitalize ? "capitalize" : ""}`}>{value}</p>
    </div>
  );
}

function NoteBox({ label, value, accent }: { label: string; value: string; accent?: "emerald" | "rose" | "amber" }) {
  const accentClass =
    accent === "emerald" ? "border-l-emerald-500 bg-emerald-500/5" :
    accent === "rose" ? "border-l-rose-500 bg-rose-500/5" :
    accent === "amber" ? "border-l-amber-500 bg-amber-500/5" :
    "border-l-border bg-muted/20";

  return (
    <div className={`rounded-md border border-border/40 border-l-4 p-3 ${accentClass}`}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{label}</p>
      <p className="text-sm leading-relaxed">{value}</p>
    </div>
  );
}
