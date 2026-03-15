import { useState, useEffect } from 'react';
import { useTrades, Trade } from '../contexts/TradeContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface TradeFormProps {
  tradeId?: string | null;
  onClose: () => void;
}

export default function TradeForm({ tradeId, onClose }: TradeFormProps) {
  const { trades, addTrade, updateTrade } = useTrades();
  const editingTrade = tradeId ? trades.find((t) => t.id === tradeId) : null;

  const [formData, setFormData] = useState({
    symbol: '',
    assetType: 'stocks' as Trade['assetType'],
    direction: 'long' as Trade['direction'],
    entryPrice: '',
    exitPrice: '',
    stopLoss: '',
    takeProfit: '',
    positionSize: '',
    riskPercent: '1',
    strategy: '',
    setupTag: '',
    timeframe: '1H',
    session: 'mixed' as Trade['session'],
    emotionBefore: '',
    emotionAfter: '',
    mistakes: '',
    notes: '',
    tradeDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editingTrade) {
      setFormData({
        symbol: editingTrade.symbol,
        assetType: editingTrade.assetType,
        direction: editingTrade.direction,
        entryPrice: editingTrade.entryPrice.toString(),
        exitPrice: editingTrade.exitPrice.toString(),
        stopLoss: editingTrade.stopLoss?.toString() || '',
        takeProfit: editingTrade.takeProfit?.toString() || '',
        positionSize: editingTrade.positionSize.toString(),
        riskPercent: editingTrade.riskPercent.toString(),
        strategy: editingTrade.strategy,
        setupTag: editingTrade.setupTag,
        timeframe: editingTrade.timeframe,
        session: editingTrade.session,
        emotionBefore: editingTrade.emotionBefore || '',
        emotionAfter: editingTrade.emotionAfter || '',
        mistakes: editingTrade.mistakes || '',
        notes: editingTrade.notes || '',
        tradeDate: editingTrade.tradeDate,
      });
    }
  }, [editingTrade]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tradeData = {
      symbol: formData.symbol,
      assetType: formData.assetType,
      direction: formData.direction,
      entryPrice: parseFloat(formData.entryPrice),
      exitPrice: parseFloat(formData.exitPrice),
      stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : undefined,
      takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : undefined,
      positionSize: parseFloat(formData.positionSize),
      riskPercent: parseFloat(formData.riskPercent),
      strategy: formData.strategy,
      setupTag: formData.setupTag,
      timeframe: formData.timeframe,
      session: formData.session,
      emotionBefore: formData.emotionBefore || undefined,
      emotionAfter: formData.emotionAfter || undefined,
      mistakes: formData.mistakes || undefined,
      notes: formData.notes || undefined,
      tradeDate: formData.tradeDate,
    };

    if (tradeId) {
      updateTrade(tradeId, tradeData);
    } else {
      addTrade(tradeData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Symbol */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Symbol *</label>
          <Input
            placeholder="AAPL, EURUSD, BTC, etc."
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
            required
          />
        </div>

        {/* Asset Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Asset Type *</label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            value={formData.assetType}
            onChange={(e) => setFormData({ ...formData, assetType: e.target.value as Trade['assetType'] })}
            required
          >
            <option value="stocks">Stocks</option>
            <option value="forex">Forex</option>
            <option value="crypto">Crypto</option>
            <option value="futures">Futures</option>
            <option value="options">Options</option>
          </select>
        </div>

        {/* Direction */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Direction *</label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            value={formData.direction}
            onChange={(e) => setFormData({ ...formData, direction: e.target.value as Trade['direction'] })}
            required
          >
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </div>

        {/* Trade Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Trade Date *</label>
          <Input
            type="date"
            value={formData.tradeDate}
            onChange={(e) => setFormData({ ...formData, tradeDate: e.target.value })}
            required
          />
        </div>

        {/* Entry Price */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Entry Price *</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.entryPrice}
            onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
            required
          />
        </div>

        {/* Exit Price */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Exit Price *</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.exitPrice}
            onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
            required
          />
        </div>

        {/* Stop Loss */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Stop Loss</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.stopLoss}
            onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
          />
        </div>

        {/* Take Profit */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Take Profit</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.takeProfit}
            onChange={(e) => setFormData({ ...formData, takeProfit: e.target.value })}
          />
        </div>

        {/* Position Size */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Position Size *</label>
          <Input
            type="number"
            step="0.01"
            placeholder="100"
            value={formData.positionSize}
            onChange={(e) => setFormData({ ...formData, positionSize: e.target.value })}
            required
          />
        </div>

        {/* Risk Percent */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Risk % *</label>
          <Input
            type="number"
            step="0.1"
            placeholder="1.0"
            value={formData.riskPercent}
            onChange={(e) => setFormData({ ...formData, riskPercent: e.target.value })}
            required
          />
        </div>

        {/* Strategy */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Strategy *</label>
          <Input
            placeholder="Breakout, Pullback, etc."
            value={formData.strategy}
            onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
            required
          />
        </div>

        {/* Setup Tag */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Setup Tag *</label>
          <Input
            placeholder="Support/Resistance, EMA Cross, etc."
            value={formData.setupTag}
            onChange={(e) => setFormData({ ...formData, setupTag: e.target.value })}
            required
          />
        </div>

        {/* Timeframe */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Timeframe *</label>
          <Input
            placeholder="5M, 15M, 1H, 4H, 1D"
            value={formData.timeframe}
            onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
            required
          />
        </div>

        {/* Session */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Session *</label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            value={formData.session}
            onChange={(e) => setFormData({ ...formData, session: e.target.value as Trade['session'] })}
            required
          >
            <option value="asian">Asian</option>
            <option value="london">London</option>
            <option value="newyork">New York</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      {/* Emotions and Notes */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Emotion Before Trade</label>
          <Input
            placeholder="Confident, Anxious, Calm..."
            value={formData.emotionBefore}
            onChange={(e) => setFormData({ ...formData, emotionBefore: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Emotion After Trade</label>
          <Input
            placeholder="Satisfied, Regretful, Neutral..."
            value={formData.emotionAfter}
            onChange={(e) => setFormData({ ...formData, emotionAfter: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Mistakes Made</label>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Did you break any rules? What went wrong?"
            value={formData.mistakes}
            onChange={(e) => setFormData({ ...formData, mistakes: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Additional thoughts, market conditions, etc."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{tradeId ? 'Update Trade' : 'Add Trade'}</Button>
      </div>
    </form>
  );
}
