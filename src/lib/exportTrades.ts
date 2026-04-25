import { Trade } from '@/app/contexts/TradeContext';

export const exportToCSV = (trades: Trade[]) => {
  const headers = [
    'Date',
    'Symbol',
    'Type',
    'Direction',
    'Session',
    'Segment',
    'Trade Type',
    'Strategy',
    'Entry Price',
    'Exit Price',
    'Quantity',
    'Brokerage',
    'Broker',
    'P&L',
    'Entry Condition',
    'Exit Condition',
    'Entry Date',
    'Exit Date',
    'Entry Note',
    'Exit Note',
    'Remark',
    'Notes',
  ];

  const rows = trades.map(trade => [
    trade.tradeDate,
    trade.symbol,
    trade.type || '',
    trade.direction,
    trade.session || '',
    trade.segment || '',
    trade.tradeType || '',
    trade.strategy || '',
    trade.entryPrice,
    trade.exitPrice,
    trade.quantity,
    trade.brokerage || 0,
    trade.broker || '',
    trade.pnl,
    trade.entryCondition || '',
    trade.exitCondition || '',
    trade.entryDate || '',
    trade.exitDate || '',
    trade.entryNote || '',
    trade.exitNote || '',
    trade.remark || '',
    trade.notes || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(field => {
      const stringField = String(field);
      if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`;
      }
      return stringField;
    }).join(','))
  ].join('\n');

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
