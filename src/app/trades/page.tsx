"use client";

import { useState } from "react";

import Layout from "@/app/components/Layout";
import { useTrades } from "@/app/contexts/TradeContext";
import { useAuth } from "@/app/contexts/AuthContext";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

import TradeForm from "@/app/components/TradeForm";
import TradeList from "@/app/components/TradeList";

import { Plus, Upload, Download, FileJson } from "lucide-react";
import { exportToCSV, exportToJSON } from "@/lib/exportTrades";
import { motion } from "framer-motion";

export default function Trades() {
  const { trades } = useTrades();
  const { user } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [editingTradeId, setEditingTradeId] = useState<string | null>(null);

  const canAddTrade = user?.subscriptionPlan === "pro" || trades.length < 200;

  const handleAddClick = () => {
    if (!canAddTrade) {
      alert("Free plan limit reached (200 trades). Please upgrade to Pro.");
      return;
    }
    setEditingTradeId(null);
    setShowForm(true);
  };

  const handleEdit = (tradeId: string) => {
    setEditingTradeId(tradeId);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTradeId(null);
  };

  const handleExportCSV = () => {
    if (trades.length === 0) { alert("No trades to export"); return; }
    exportToCSV(trades);
  };

  const handleExportJSON = () => {
    if (trades.length === 0) { alert("No trades to export"); return; }
    exportToJSON(trades);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">Trade Journal</h2>
            <p className="text-muted-foreground">{trades.length} trades recorded</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" disabled className="gap-2">
              <Upload size={18} />
              Import CSV
            </Button>
            <Button variant="outline" onClick={handleExportJSON} disabled={trades.length === 0} className="gap-2">
              <FileJson size={18} />
              Export JSON
            </Button>
            <Button variant="outline" onClick={handleExportCSV} disabled={trades.length === 0} className="gap-2">
              <Download size={18} />
              Export CSV
            </Button>
            <Button onClick={handleAddClick} disabled={!canAddTrade} className="gap-2">
              <Plus size={18} />
              Add Trade
            </Button>
          </div>
        </motion.div>

        {/* Add / Edit Trade Modal */}
        <Dialog open={showForm} onOpenChange={(open) => !open && handleFormClose()}>
          <DialogContent className="sm:max-w-4xl max-h-[92vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {editingTradeId ? "Edit Trade" : "Add New Trade"}
              </DialogTitle>
            </DialogHeader>
            {/* key forces a clean remount on every open/switch, preventing stale form state */}
            <TradeForm
              key={editingTradeId ?? "new"}
              tradeId={editingTradeId}
              onClose={handleFormClose}
            />
          </DialogContent>
        </Dialog>

        <TradeList onEdit={handleEdit} />
      </div>
    </Layout>
  );
}
