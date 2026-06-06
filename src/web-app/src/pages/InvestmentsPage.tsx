import { useState } from "react";
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown, Loader2, Search } from "lucide-react";
import { formatCurrency, formatPercent, toDateInputValue } from "@/lib/format";
import CurrencyInput from "@/components/shared/CurrencyInput";
import { useValueVisibility } from "@/hooks/useValueVisibility";
import { useInvestments, useCreateInvestment, useUpdateInvestment, useDeleteInvestment } from "@/hooks/queries/useInvestments";
import FormModal from "@/components/shared/FormModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { InvestmentModel } from "@/types/entities";
import type { CreateInvestmentRequest, UpdateInvestmentRequest, SearchInvestmentRequest } from "@/types/requests";

const PAGE_SIZE = 12;

export default function InvestmentsPage() {
  const { mask } = useValueVisibility();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<InvestmentModel | null>(null);
  const [form, setForm] = useState({ name: "", type: "", investedAmount: "", currentValue: "", date: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const searchParams: SearchInvestmentRequest = {
    offset: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    ...(search && { name: search }),
  };

  const { data, isLoading } = useInvestments(searchParams);
  const createMutation = useCreateInvestment();
  const updateMutation = useUpdateInvestment();
  const deleteMutation = useDeleteInvestment();

  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", type: "", investedAmount: "", currentValue: "", date: "", notes: "" });
    setModalOpen(true);
  };

  const openEdit = (item: InvestmentModel) => {
    setEditing(item);
    setForm({
      name: item.name,
      type: item.type,
      investedAmount: String(item.investedAmount),
      currentValue: String(item.currentValue),
      date: toDateInputValue(item.date),
      notes: item.notes || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.investedAmount) { toast.error("Preencha os campos obrigatórios"); return; }
    setSaving(true);
    try {
      const payload: CreateInvestmentRequest = {
        name: form.name,
        type: form.type,
        investedAmount: parseFloat(form.investedAmount),
        currentValue: parseFloat(form.currentValue) || 0,
        date: form.date,
        notes: form.notes,
      };
      if (editing) {
        const updatePayload: UpdateInvestmentRequest = { ...payload, id: editing.id };
        await updateMutation.mutateAsync(updatePayload);
        toast.success("Investimento atualizado!");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Investimento criado!");
      }
      setModalOpen(false);
    } catch {
      toast.error("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSaving(true);
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Investimento excluído!");
      setDeleteId(null);
      // Se deletou o último item da página atual, volta uma página
      if (items.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch {
      toast.error("Erro ao excluir");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar investimentos..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <Button onClick={openAdd} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-1" /> Novo Investimento
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <TrendingUp className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-sm">Nenhum investimento cadastrado</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((inv) => {
              const profit = inv.investedAmount > 0
                ? ((inv.currentValue - inv.investedAmount) / inv.investedAmount) * 100
                : 0;
              const isPositive = profit >= 0;
              return (
                <div key={inv.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-heading font-semibold text-sm">{inv.name}</h4>
                      <span className="text-xs text-muted-foreground">{inv.type}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(inv)} className="p-1.5 rounded hover:bg-muted text-muted-foreground">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(inv.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Investido</span>
                      <span>{mask(formatCurrency(inv.investedAmount))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Atual</span>
                      <span className="font-semibold">{mask(formatCurrency(inv.currentValue))}</span>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? "text-success" : "text-destructive"}`}>
                      {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {formatPercent(profit)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        title={editing ? "Editar Investimento" : "Novo Investimento"}
        loading={saving}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Nome *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <input
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              placeholder="Ex: Renda Fixa, Ações, ETF"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Valor Investido *</label>
              <CurrencyInput
                value={form.investedAmount}
                onChange={(investedAmount) => setForm({ ...form, investedAmount })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valor Atual</label>
              <CurrencyInput
                value={form.currentValue}
                onChange={(currentValue) => setForm({ ...form, currentValue })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Observações</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={saving}
      />
    </div>
  );
}
