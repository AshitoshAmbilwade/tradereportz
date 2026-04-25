import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTrades, Trade } from "../contexts/TradeContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "@/lib/utils";

interface TradeFormProps {
  tradeId?: string | null;
  onClose: () => void;
}

const defaultDate = () => new Date().toISOString().split("T")[0];

export default function TradeForm({ tradeId, onClose }: TradeFormProps) {
  const { trades, addTrade, updateTrade } = useTrades();
  const editingTrade = tradeId ? trades.find((t) => t.id === tradeId) : null;
  const supabase = createClient();

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const [formData, setFormData] = useState({
    symbol: "",
    quantity: "1",
    entryPrice: "0",
    exitPrice: "0",
    brokerage: "0",
    broker: "",
    tradeDate: defaultDate(),
    entryDate: defaultDate(),
    exitDate: defaultDate(),
    strategy: "",
    type: "Buy" as "Buy" | "Sell",
    session: "morning" as NonNullable<Trade["session"]>,
    segment: "equity" as NonNullable<Trade["segment"]>,
    tradeType: "intraday" as NonNullable<Trade["tradeType"]>,
    direction: "Long" as NonNullable<Trade["direction"]>,
    entryCondition: "good" as NonNullable<Trade["entryCondition"]>,
    exitCondition: "accurate" as NonNullable<Trade["exitCondition"]>,
    chartTimeframe: "",
    entryNote: "",
    exitNote: "",
    notes: "",
    remark: "",
    source: "manual" as NonNullable<Trade["source"]>,
  });

  useEffect(() => {
    if (!editingTrade) return;

    setFormData({
      symbol: editingTrade.symbol,
      quantity: String(editingTrade.quantity),
      entryPrice: String(editingTrade.entryPrice),
      exitPrice: String(editingTrade.exitPrice ?? 0),
      brokerage: String(editingTrade.brokerage ?? 0),
      broker: editingTrade.broker ?? "",
      tradeDate: editingTrade.tradeDate ?? defaultDate(),
      entryDate: editingTrade.entryDate ?? defaultDate(),
      exitDate: editingTrade.exitDate ?? defaultDate(),
      strategy: editingTrade.strategy ?? "",
      type: editingTrade.type ?? "Buy",
      session: editingTrade.session ?? "morning",
      segment: editingTrade.segment ?? "equity",
      tradeType: editingTrade.tradeType ?? "intraday",
      direction: editingTrade.direction ?? "Long",
      entryCondition: editingTrade.entryCondition ?? "good",
      exitCondition: editingTrade.exitCondition ?? "accurate",
      chartTimeframe: editingTrade.chartTimeframe ?? "",
      entryNote: editingTrade.entryNote ?? "",
      exitNote: editingTrade.exitNote ?? "",
      notes: editingTrade.notes ?? "",
      remark: editingTrade.remark ?? "",
      source: editingTrade.source ?? "manual",
    });
    setImageUrl(editingTrade.image ?? "");
  }, [editingTrade]);

  const calculatedPnl = useMemo(() => {
    const qty = Number(formData.quantity) || 0;
    const entry = Number(formData.entryPrice) || 0;
    const exit = Number(formData.exitPrice) || 0;
    const brokerage = Number(formData.brokerage) || 0;
    const isSell = formData.type === "Sell" || formData.direction === "Short";
    const gross = isSell ? (entry - exit) * qty : (exit - entry) * qty;
    return gross - brokerage;
  }, [formData.quantity, formData.entryPrice, formData.exitPrice, formData.brokerage, formData.type, formData.direction]);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
  
    setUploading(true);
    setUploadError(null);
  
    const file = files[0];
    const ext = file.name.split(".").pop() || "png";
    const path = `trade-images/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  
    const bucket = "trade_screenshots"; // ✅ USE ONLY ONE
  
    // 🔍 CHECK AUTH
    const { data: { user } } = await supabase.auth.getUser();
    console.log("User:", user);
  
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: false,
        contentType: file.type || "image/png",
      });
  
    if (error) {
      console.error("Upload failed:", error.message);
      setUploadError(error.message); // ✅ REAL ERROR
      setUploading(false);
      return;
    }
  
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  
    setImageUrl(data.publicUrl);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      symbol: formData.symbol.trim(),
      type: formData.type,
      quantity: Number(formData.quantity),
      entryPrice: Number(formData.entryPrice),
      exitPrice: Number(formData.exitPrice),
      session: formData.session,
      segment: formData.segment,
      tradeType: formData.tradeType,
      chartTimeframe: formData.chartTimeframe || undefined,
      strategy: formData.strategy || undefined,
      direction: formData.direction,
      entryCondition: formData.entryCondition,
      exitCondition: formData.exitCondition,
      entryDate: formData.entryDate,
      entryNote: formData.entryNote || undefined,
      exitDate: formData.exitDate,
      exitNote: formData.exitNote || undefined,
      brokerage: Number(formData.brokerage) || 0,
      remark: formData.remark || undefined,
      notes: formData.notes || undefined,
      tradeDate: formData.tradeDate,
      source: formData.source,
      broker: formData.broker || undefined,
      image: imageUrl || undefined,
      aiAnalysis: { summary: "", plusPoints: [], minusPoints: [] },
      customFields: {},
    };

    try {
      if (tradeId) {
        await updateTrade(tradeId, payload);
      } else {
        await addTrade(payload);
      }
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save trade";
      console.error("Failed to save trade", { message, error });
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Card className="border-border/70">
        <CardContent className="space-y-4 p-4">
          <SectionTitle
            title="Core Trade Setup"
            subtitle="Capture execution values and key dates accurately."
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Field label="Symbol *">
              <Input value={formData.symbol} onChange={(e) => setFormData({ ...formData, symbol: e.target.value })} required />
            </Field>
            <Field label="Quantity *">
              <Input type="number" min={1} value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required />
            </Field>
            <Field label="Entry Price *">
              <Input type="number" step="0.01" value={formData.entryPrice} onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })} required />
            </Field>
            <Field label="Exit Price">
              <Input type="number" step="0.01" value={formData.exitPrice} onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })} />
            </Field>
            <Field label="Brokerage">
              <Input type="number" step="0.01" value={formData.brokerage} onChange={(e) => setFormData({ ...formData, brokerage: e.target.value })} />
            </Field>
            <Field label="Broker">
              <Input value={formData.broker} onChange={(e) => setFormData({ ...formData, broker: e.target.value })} />
            </Field>
            <Field label="Trade Date">
              <Input type="date" value={formData.tradeDate} onChange={(e) => setFormData({ ...formData, tradeDate: e.target.value })} />
            </Field>
            <Field label="Entry Date">
              <Input type="date" value={formData.entryDate} onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })} />
            </Field>
            <Field label="Exit Date">
              <Input type="date" value={formData.exitDate} onChange={(e) => setFormData({ ...formData, exitDate: e.target.value })} />
            </Field>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border border-border/70 bg-linear-to-r from-emerald-500/10 via-background to-rose-500/10 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Calculated P&L</p>
        <p className={`text-2xl font-semibold ${calculatedPnl >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
          {formatCurrency(calculatedPnl)}
        </p>
        <p className="text-xs text-muted-foreground">Buy: (Exit - Entry) x Qty - Brokerage | Sell: (Entry - Exit) x Qty - Brokerage</p>
      </div>

      <Card className="border-border/70">
        <CardContent className="space-y-4 p-4">
          <SectionTitle
            title="Classification & Execution Quality"
            subtitle="Tag this trade for cleaner analytics and better review quality."
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SelectField label="Type" value={formData.type ?? "Buy"} onChange={(v) => setFormData({ ...formData, type: v as NonNullable<Trade["type"]> })} options={["Buy", "Sell"]} />
            <SelectField label="Session" value={formData.session ?? "morning"} onChange={(v) => setFormData({ ...formData, session: v as NonNullable<Trade["session"]> })} options={["morning", "mid", "last"]} />
            <SelectField label="Segment" value={formData.segment ?? "equity"} onChange={(v) => setFormData({ ...formData, segment: v as NonNullable<Trade["segment"]> })} options={["equity", "future", "forex", "option", "commodity", "currency", "crypto"]} />
            <SelectField label="Trade Type" value={formData.tradeType ?? "intraday"} onChange={(v) => setFormData({ ...formData, tradeType: v as NonNullable<Trade["tradeType"]> })} options={["intraday", "positional", "investment", "swing", "scalping"]} />
            <SelectField label="Direction" value={formData.direction ?? "Long"} onChange={(v) => setFormData({ ...formData, direction: v as NonNullable<Trade["direction"]> })} options={["Long", "Short"]} />
            <SelectField label="Entry Condition" value={formData.entryCondition ?? "good"} onChange={(v) => setFormData({ ...formData, entryCondition: v as NonNullable<Trade["entryCondition"]> })} options={["revenge", "last entry", "good", "fomo", "entry without confirmation", "early entry", "accurate entry"]} />
            <SelectField label="Exit Condition" value={formData.exitCondition ?? "accurate"} onChange={(v) => setFormData({ ...formData, exitCondition: v as NonNullable<Trade["exitCondition"]> })} options={["accurate", "early", "fear", "sl hit", "target hit", "trailing sl hit"]} />
            <Field label="Chart Timeframe">
              <Input value={formData.chartTimeframe} onChange={(e) => setFormData({ ...formData, chartTimeframe: e.target.value })} placeholder="5m, 15m, 1h" />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardContent className="space-y-4 p-4">
          <SectionTitle
            title="Notes & Context"
            subtitle="Log decision context for post-trade review and discipline tracking."
          />
          <Field label="Strategy">
            <Input value={formData.strategy} onChange={(e) => setFormData({ ...formData, strategy: e.target.value })} />
          </Field>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Entry Note">
              <Input value={formData.entryNote} onChange={(e) => setFormData({ ...formData, entryNote: e.target.value })} />
            </Field>
            <Field label="Exit Note">
              <Input value={formData.exitNote} onChange={(e) => setFormData({ ...formData, exitNote: e.target.value })} />
            </Field>
          </div>
          <Field label="General Notes">
            <textarea
              className="min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </Field>
          <Field label="Additional Remark">
            <Input value={formData.remark} onChange={(e) => setFormData({ ...formData, remark: e.target.value })} />
          </Field>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardContent className="space-y-3 p-4">
          <SectionTitle
            title="Trade Screenshot"
            subtitle="Attach chart or execution proof for each trade."
          />
          <Input type="file" accept="image/*" onChange={(e) => void handleImageUpload(e.target.files)} disabled={uploading || submitting} />
          {uploading && <p className="text-xs text-muted-foreground">Uploading image...</p>}
          {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
          {imageUrl && <img src={imageUrl} alt="Trade" className="h-44 w-full max-w-sm rounded-md border border-border/70 object-cover" />}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting || uploading}>
          {submitting ? "Saving..." : tradeId ? "Update Trade" : "Add Trade"}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <select
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm capitalize"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}
