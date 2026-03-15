import { Trade } from '../contexts/TradeContext';

export const exportToCSV = (trades: Trade[]) => {
  // Define CSV headers
  const headers = [
    'Date',
    'Symbol',
    'Asset Type',
    'Direction',
    'Entry Price',
    'Exit Price',
    'Stop Loss',
    'Take Profit',
    'Position Size',
    'Risk %',
    'Strategy',
    'Setup Tag',
    'Timeframe',
    'Session',
    'P&L',
    'Emotion Before',
    'Emotion After',
    'Mistakes',
    'Notes',
  ];

  // Convert trades to CSV rows
  const rows = trades.map(trade => [
    trade.tradeDate,
    trade.symbol,
    trade.assetType,
    trade.direction,
    trade.entryPrice,
    trade.exitPrice,
    trade.stopLoss || '',
    trade.takeProfit || '',
    trade.positionSize,
    trade.riskPercent,
    trade.strategy,
    trade.setupTag,
    trade.timeframe,
    trade.session,
    trade.pnl,
    trade.emotionBefore || '',
    trade.emotionAfter || '',
    trade.mistakes || '',
    trade.notes || '',
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(field => {
      // Escape fields containing commas or quotes
      const stringField = String(field);
      if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`;
      }
      return stringField;
    }).join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `trades_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (trades: Trade[]) => {
  const jsonContent = JSON.stringify(trades, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `trades_export_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
