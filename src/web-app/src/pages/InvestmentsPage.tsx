import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { investmentApi } from "@/services/api";
import { formatCurrency, formatPercent } from "@/lib/format";
import { useValueVisibility } from "@/hooks/useValueVisibility";
import FormModal from "@/components/shared/FormModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const mockInvestments = [
  { id: "1", name: "Tesouro Selic 2029", type: "Renda Fixa", investedAmount: 5000, currentValue: 5320, date: "2025-06-01", notes: "" },
  { id: "2", name: "IVVB11", type: "ETF", investedAmount: 8000, currentValue: 8850, date: "2025-01-15", notes: "" },
  { id: "3", name: "CDB Banco Inter", type: "Renda Fixa", investedAmount: 3000, currentValue: 3180, date: "2025-09-01", notes: "" },
];

export default function InvestmentsPage() {
  const { mask } = useValueVisibility();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", type: "", investedAmount: "", currentValue: "", date: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try { const res = await investmentApi.list(); setItems(res); } catch { setItems(mockInvestments); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => { setEditing(null); setForm({ name: "", type: "", investedAmount: "", currentValue: "", date: "", notes: "" }); setModalOpen(true); };
  const openEdit = (item: any) => { setEditing(item); setForm({ name: item.name, type: item.type, investedAmount: String(item.investedAmount), currentValue: String(item.currentValue), date: item.date?.split("T")[0] || "", notes: item.notes || "" }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name || !form.investedAmount) { toast.error("Preencha os campos obrigatórios"); return; }
    setSaving(true);
    try {
      const payload = { ...form, investedAmount: parseFloat(form.investedAmount), currentValue: parseFloat(form.currentValue) };
      if (editing) { await investmentApi.update(editing.id, payload); toast.success("Investimento atualizado!"); }
      else { await investmentApi.create(payload); toast.success("Investimento criado!"); }
      setModalOpen(false); fetchData();
    } catch (err: any) { toast.error(err.message || "Erro ao salvar"); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return; setSaving(true);
    try { await investmentApi.delete(deleteId); toast.success("Investimento excluído!"); setDeleteId(null); fetchData(); }
    catch (err: any) { toast.error(err.message || "Erro ao excluir"); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex justify-end">
        <Button onClick={openAdd} className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="w-4 h-4 mr-1" /> Novo Investimento</Button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground"><TrendingUp className="w-12 h-12 mb-3 opacity-40" /><p className="text-sm">Nenhum investimento cadastrado</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((inv) => {
            const profit = ((inv.currentValue - inv.investedAmount) / inv.investedAmount) * 100;
            const isPositive = profit >= 0;
            return (
              <div key={inv.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-heading font-semibold text-sm">{inv.name}</h4>
                    <span className="text-xs text-muted-foreground">{inv.type}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(inv)} className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteId(inv.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Investido</span><span>{mask(formatCurrency(inv.investedAmount))}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Atual</span><span className="font-semibold">{mask(formatCurrency(inv.currentValue))}</span></div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? "text-success" : "text-destructive"}`}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {formatPercent(profit)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSave} title={editing ? "Editar Investimento" : "Novo Investimento"} loading={saving}>
        <div className="space-y-3">
          <div><label className="block text-sm font-medium mb-1">Nome *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></div>
          <div><label className="block text-sm font-medium mb-1">Tipo</label><input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Ex: Renda Fixa, Ações, ETF" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-1">Valor Investido *</label><input type="number" step="0.01" value={form.investedAmount} onChange={(e) => setForm({ ...form, investedAmount: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></div>
            <div><label className="block text-sm font-medium mb-1">Valor Atual</label><input type="number" step="0.01" value={form.currentValue} onChange={(e) => setForm({ ...form, currentValue: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Data</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></div>
          <div><label className="block text-sm font-medium mb-1">Observações</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" /></div>
        </div>
      </FormModal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={saving} />
    </div>
  );
}
