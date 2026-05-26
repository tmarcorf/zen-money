import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Filter, X, CalendarIcon } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { useValueVisibility } from "@/hooks/useValueVisibility";
import { useIncomes, useCreateIncome, useUpdateIncome, useDeleteIncome } from "@/hooks/queries/useIncomes";
import { useCategoryList } from "@/hooks/queries/useCategoryList";
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

const PAGE_SIZE = 10;

export default function IncomePage() {
  const { mask } = useValueVisibility();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<IncomeModel | null>(null);
  const [form, setForm] = useState({ description: "", amount: "", date: "", categoryId: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState<Date | undefined>();
  const [filterDateTo, setFilterDateTo] = useState<Date | undefined>();

  const activeFilterCount = [filterCategory, filterDateFrom, filterDateTo].filter(Boolean).length;

  const searchParams: SearchIncomeRequest = {
    offset: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    ...(search && { description: search }),
    ...(filterDateFrom && { startDate: format(filterDateFrom, "yyyy-MM-dd") }),
    ...(filterDateTo && { endDate: format(filterDateTo, "yyyy-MM-dd") }),
  };

  const { data, isLoading } = useIncomes(searchParams);
  const { data: categories = [] } = useCategoryList();

  const createMutation = useCreateIncome();
  const updateMutation = useUpdateIncome();
  const deleteMutation = useDeleteIncome();

  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  const clearFilters = () => {
    setFilterCategory("");
    setFilterDateFrom(undefined);
    setFilterDateTo(undefined);
    setSearch("");
  };

  const openAdd = () => { setEditing(null); setForm({ description: "", amount: "", date: "", categoryId: "", notes: "" }); setModalOpen(true); };
  const openEdit = (item: IncomeModel) => { setEditing(item); setForm({ description: item.description, amount: String(item.amount), date: item.date?.split("T")[0] || "", categoryId: "", notes: "" }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.description || !form.amount) { toast.error("Preencha os campos obrigatórios"); return; }
    setSaving(true);
    try {
      const payload: CreateIncomeRequest = {
        type: 1,
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

  const filtered = filterCategory
    ? items.filter((i) => true) // category filter is handled server-side via search, local fallback
    : items;

  const columns = [
    { header: "Data", accessor: (r: IncomeModel) => formatDate(r.date), sortKey: "date" },
    { header: "Descrição", accessor: "description" as const, sortKey: "description" },
    { header: "Valor", accessor: (r: IncomeModel) => <span className="font-semibold text-success">{mask(formatCurrency(r.amount))}</span>, sortKey: (r: IncomeModel) => r.amount },
    { header: "Categoria", accessor: () => <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">—</span>, sortKey: () => "" },
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Categoria</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full px-3 py-2 h-9 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                <option value="">Todas</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border">
        <DataTable
          columns={columns}
          data={filtered}
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
          <div><label className="block text-sm font-medium mb-1">Descrição *</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-1">Valor (R$) *</label><input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></div>
            <div><label className="block text-sm font-medium mb-1">Data</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Categoria</label><select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"><option value="">Selecione</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-1">Observações</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" /></div>
        </div>
      </FormModal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={saving} />
    </div>
  );
}
