import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Filter, X, CalendarIcon } from "lucide-react";
import { formatCurrency, formatDate, toDateInputValue } from "@/lib/format";
import CurrencyInput from "@/components/shared/CurrencyInput";
import { useValueVisibility } from "@/hooks/useValueVisibility";
import { useIncomes, useCreateIncome, useUpdateIncome, useDeleteIncome } from "@/hooks/queries/useIncomes";
import DataTable from "@/components/shared/DataTable";
import FormModal from "@/components/shared/FormModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { IncomeModel } from "@/types/entities";
import type { SearchIncomeRequest, CreateIncomeRequest, UpdateIncomeRequest } from "@/types/requests";
import { IncomeType } from "@/types/enums";

const PAGE_SIZE = 10;

const INCOME_TYPE_LABEL: Record<number, string> = {
  [IncomeType.Fixed]: "Fixa",
  [IncomeType.Variable]: "Variável",
};

export default function IncomePage() {
  const { mask } = useValueVisibility();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<IncomeModel | null>(null);
  const [form, setForm] = useState({ description: "", amount: "", date: "", type: String(IncomeType.Fixed) });
  const [saving, setSaving] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [filterDateFrom, setFilterDateFrom] = useState<Date | undefined>();
  const [filterDateTo, setFilterDateTo] = useState<Date | undefined>();

  const activeFilterCount = [filterDateFrom, filterDateTo].filter(Boolean).length;

  const searchParams: SearchIncomeRequest = {
    offset: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    ...(search && { description: search }),
    ...(filterDateFrom && { startDate: format(filterDateFrom, "yyyy-MM-dd") }),
    ...(filterDateTo && { endDate: format(filterDateTo, "yyyy-MM-dd") }),
  };

  const { data, isLoading } = useIncomes(searchParams);

  const createMutation = useCreateIncome();
  const updateMutation = useUpdateIncome();
  const deleteMutation = useDeleteIncome();

  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  const clearFilters = () => {
    setFilterDateFrom(undefined);
    setFilterDateTo(undefined);
    setSearch("");
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ description: "", amount: "", date: "", type: String(IncomeType.Fixed) });
    setModalOpen(true);
  };

  const openEdit = (item: IncomeModel) => {
    setEditing(item);
    setForm({
      description: item.description,
      amount: String(item.amount),
      date: toDateInputValue(item.date),
      type: String(item.type),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.description || !form.amount) { toast.error("Preencha os campos obrigatórios"); return; }
    setSaving(true);
    try {
      const payload: CreateIncomeRequest = {
        type: Number(form.type) as IncomeModel["type"],
        date: form.date,
        description: form.description,
        amount: parseFloat(form.amount),
      };
      if (editing) {
        const updatePayload: UpdateIncomeRequest = { ...payload, id: editing.id };
        await updateMutation.mutateAsync(updatePayload);
        toast.success("Receita atualizada!");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Receita criada!");
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
    try { await deleteMutation.mutateAsync(deleteId); toast.success("Receita excluída!"); setDeleteId(null); }
    catch { toast.error("Erro ao excluir"); } finally { setSaving(false); }
  };

  const columns = [
    { header: "Data", accessor: (r: IncomeModel) => formatDate(r.date), sortKey: "date" },
    { header: "Descrição", accessor: "description" as const, sortKey: "description" },
    { header: "Valor", accessor: (r: IncomeModel) => <span className="font-semibold text-success">{mask(formatCurrency(r.amount))}</span>, sortKey: (r: IncomeModel) => r.amount },
    { header: "Tipo", accessor: (r: IncomeModel) => <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">{INCOME_TYPE_LABEL[r.type] || "—"}</span>, sortKey: (r: IncomeModel) => r.type },
    {
      header: "Ações", accessor: (r: IncomeModel) => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(r)} className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-4 h-4" /></button>
          <button onClick={() => setDeleteId(r.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
        </div>
      ), className: "w-24",
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar receitas..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowFilters((v) => !v)} className="relative">
            <Filter className="w-4 h-4 mr-1" /> Filtros
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
          <Button onClick={openAdd} className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="w-4 h-4 mr-1" /> Nova Receita</Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-card rounded-xl border border-border p-4 animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Filtros</h3>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-primary hover:underline flex items-center gap-1">
                <X className="w-3 h-3" /> Limpar filtros
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Data inicial</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-9 text-sm", !filterDateFrom && "text-muted-foreground")}>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {filterDateFrom ? format(filterDateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={filterDateFrom} onSelect={setFilterDateFrom} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Data final</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-9 text-sm", !filterDateTo && "text-muted-foreground")}>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {filterDateTo ? format(filterDateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={filterDateTo} onSelect={setFilterDateTo} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border">
        <DataTable
          columns={columns}
          data={items}
          loading={isLoading}
          keyExtractor={(r) => r.id}
          emptyMessage="Nenhuma receita registrada"
          totalCount={totalCount}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSave} title={editing ? "Editar Receita" : "Nova Receita"} loading={saving}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Descrição *</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Valor (R$) *</label>
              <CurrencyInput value={form.amount} onChange={(amount) => setForm({ ...form, amount })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value={String(IncomeType.Fixed)}>Fixa</option>
              <option value={String(IncomeType.Variable)}>Variável</option>
            </select>
          </div>
        </div>
      </FormModal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={saving} />
    </div>
  );
}
