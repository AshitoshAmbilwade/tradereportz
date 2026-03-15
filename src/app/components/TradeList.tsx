import { useState } from 'react';
import { useTrades, Trade } from '../contexts/TradeContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { formatCurrency, formatDate } from '../lib/utils';
import { Edit, Trash2, Copy, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TradeListProps {
  onEdit: (tradeId: string) => void;
}

export default function TradeList({ onEdit }: TradeListProps) {
  const { trades, deleteTrade, duplicateTrade } = useTrades();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'wins' | 'losses'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'pnl'>('date');
  const [expandedTrade, setExpandedTrade] = useState<string | null>(null);

  const filteredTrades = trades
    .filter((trade) => {
      if (filter === 'wins') return trade.pnl > 0;
      if (filter === 'losses') return trade.pnl < 0;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.tradeDate).getTime() - new Date(a.tradeDate).getTime();
      }
      return b.pnl - a.pnl;
    });

  const handleDelete = (tradeId: string) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      deleteTrade(tradeId);
    }
  };

  const toggleExpand = (tradeId: string) => {
    setExpandedTrade(expandedTrade === tradeId ? null : tradeId);
  };

  if (trades.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
              <TrendingUp className="text-primary" size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-3">No trades yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start tracking your trades to see analytics and insights. Click "Add Trade" to get started.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                  className={filter === 'all' ? 'bg-gradient-to-r from-primary to-purple-600' : ''}
                >
                  All ({trades.length})
                </Button>
                <Button
                  variant={filter === 'wins' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('wins')}
                  className={filter === 'wins' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : ''}
                >
                  Wins ({trades.filter(t => t.pnl > 0).length})
                </Button>
                <Button
                  variant={filter === 'losses' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('losses')}
                  className={filter === 'losses' ? 'bg-gradient-to-r from-red-500 to-rose-600' : ''}
                >
                  Losses ({trades.filter(t => t.pnl < 0).length})
                </Button>
              </div>
              <div className="flex gap-2 ml-auto">
                <select
                  className="h-8 rounded-md border border-input bg-background px-3 text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'pnl')}
                >
                  <option value="date">📅 Sort by Date</option>
                  <option value="pnl">💰 Sort by P&L</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trade Cards */}
      <AnimatePresence>
        {filteredTrades.map((trade, index) => (
          <motion.div
            key={trade.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            layout
          >
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 grid md:grid-cols-5 gap-6">
                    {/* Column 1: Symbol & Type */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                          {trade.symbol}
                        </h3>
                        <span
                          className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                            trade.direction === 'long'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                              : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                          }`}
                        >
                          {trade.direction.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">{trade.assetType}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(trade.tradeDate)}</p>
                    </div>

                    {/* Column 2: Prices */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium">Entry / Exit</p>
                      <p className="font-bold text-base">
                        {trade.entryPrice} → {trade.exitPrice}
                      </p>
                      {trade.stopLoss && trade.takeProfit && (
                        <p className="text-xs text-muted-foreground mt-2">
                          <span className="font-medium">SL:</span> {trade.stopLoss} | <span className="font-medium">TP:</span> {trade.takeProfit}
                        </p>
                      )}
                    </div>

                    {/* Column 3: Strategy */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium">Strategy</p>
                      <p className="font-semibold">{trade.strategy}</p>
                      <p className="text-xs text-muted-foreground mt-1 px-2 py-1 bg-muted/50 rounded-md inline-block">
                        {trade.setupTag}
                      </p>
                    </div>

                    {/* Column 4: Risk */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium">Risk & Size</p>
                      <p className="font-semibold">{trade.riskPercent}% risk</p>
                      <p className="text-sm text-muted-foreground">Size: {trade.positionSize}</p>
                    </div>

                    {/* Column 5: P&L */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium">Profit & Loss</p>
                      <div className="flex items-center gap-2">
                        {trade.pnl >= 0 ? (
                          <TrendingUp className="text-green-500" size={24} />
                        ) : (
                          <TrendingDown className="text-red-500" size={24} />
                        )}
                        <p
                          className={`text-2xl font-bold ${
                            trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {formatCurrency(trade.pnl, user?.currency)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(trade.id)}
                      title="Edit"
                      className="hover:bg-blue-500/10 hover:text-blue-600"
                    >
                      <Edit size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => duplicateTrade(trade.id)}
                      title="Duplicate"
                      className="hover:bg-purple-500/10 hover:text-purple-600"
                    >
                      <Copy size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(trade.id)}
                      title="Delete"
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 size={18} />
                    </Button>
                    {(trade.notes || trade.mistakes || trade.emotionBefore || trade.emotionAfter) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleExpand(trade.id)}
                        title={expandedTrade === trade.id ? "Hide details" : "Show details"}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        {expandedTrade === trade.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Expanded Notes Section */}
                <AnimatePresence>
                  {expandedTrade === trade.id && (trade.notes || trade.mistakes || trade.emotionBefore || trade.emotionAfter) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 pt-6 border-t border-border space-y-3 bg-muted/20 -mx-6 -mb-6 p-6 rounded-b-lg">
                        {trade.emotionBefore && (
                          <div className="flex gap-2">
                            <span className="text-sm font-semibold text-muted-foreground min-w-[100px]">Before:</span>
                            <span className="text-sm px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full">
                              {trade.emotionBefore}
                            </span>
                          </div>
                        )}
                        {trade.emotionAfter && (
                          <div className="flex gap-2">
                            <span className="text-sm font-semibold text-muted-foreground min-w-[100px]">After:</span>
                            <span className="text-sm px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full">
                              {trade.emotionAfter}
                            </span>
                          </div>
                        )}
                        {trade.mistakes && (
                          <div>
                            <span className="text-sm font-semibold text-destructive">⚠️ Mistakes:</span>
                            <p className="text-sm mt-1 p-3 bg-destructive/5 border border-destructive/20 rounded-md">
                              {trade.mistakes}
                            </p>
                          </div>
                        )}
                        {trade.notes && (
                          <div>
                            <span className="text-sm font-semibold text-muted-foreground">📝 Notes:</span>
                            <p className="text-sm mt-1 p-3 bg-background border border-border rounded-md">
                              {trade.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
