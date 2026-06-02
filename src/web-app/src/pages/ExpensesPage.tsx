import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Filter, X, CalendarIcon } from "lucide-react";
import { formatCurrency, formatDate, toDateInputValue } from "@/lib/format";
import CurrencyInput from "@/components/shared/CurrencyInput";
import { useValueVisibility } from "@/hooks/useValueVisibility";
import { useExpenses, useCreateExpense, useUpdateExpense, useDeleteExpense } from "@/hooks/queries/useExpenses";
import { useCategoryList, usePaymentMethodList } from "@/hooks/queries/useCategoryList";
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
import type { ExpenseModel } from "@/types/entities";
import type { SearchExpenseRequest, CreateExpenseRequest, UpdateExpenseRequest } from "@/types/requests";

const PAGE_SIZE = 10;

export default function ExpensesPage() {
  const { mask } = useValueVisibility();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<ExpenseModel | null>(null);
  const [form, setForm] = useState({ description: "", amount: "", date: "", categoryId: "", paymentMethodId: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState<Date | undefined>();
  const [filterDateTo, setFilterDateTo] = useState<Date | undefined>();

  const activeFilterCount = [filterCategory, filterPayment, filterDateFrom, filterDateTo].filter(Boolean).length;

  const searchParams: SearchExpenseRequest = {
    offset: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    ...(search && { description: search }),
    ...(filterCategory && { categoryId: filterCategory }),
    ...(filterPayment && { paymentMethodId: filterPayment }),
    ...(filterDateFrom && { startDate: format(filterDateFrom, "yyyy-MM-dd") }),
    ...(filterDateTo && { endDate: format(filterDateTo, "yyyy-MM-dd") }),
  };

  const { data, isLoading } = useExpenses(searchParams);
  const { data: categories = [] } = useCategoryList();
  const { data: paymentMethods = [] } = usePaymentMethodList();

  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();
  const deleteMutation = useDeleteExpense();

  const expenses = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  const clearFilters = () => {
    setFilterCategory("");
    setFilterPayment("");
    setFilterDateFrom(undefined);
    setFilterDateTo(undefined);
    setSearch("");
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ description: "", amount: "", date: "", categoryId: "", paymentMethodId: "", notes: "" });
    setModalOpen(true);
  };

  const openEdit = (item: ExpenseModel) => {
    setEditing(item);
    setForm({
      description: item.description,
      amount: String(item.amount),
      date: toDateInputValue(item.date),
      categoryId: item.categoryId || "",
      paymentMethodId: item.paymentMethodId || "",
      notes: "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.description || !form.amount) { toast.error("Preencha os campos obrigatórios"); return; }
    setSaving(true);
    try {
      const payload = {
        type: 1, // Fixed expense type (default)
        date: form.date,
        description: form.description,
        amount: parseFloat(form.amount),
        isPaid: true,
        categoryId: form.categoryId,
        paymentMethodId: form.paymentMethodId,
      };

      if (editing) {
        const updatePayload: UpdateExpenseRequest = { ...payload, id: editing.id };
        await updateMutation.mutateAsync(updatePayload);
        toast.success("Despesa atualizada!");
      } else {
        await createMutation.mutateAsync(payload as CreateExpenseRequest);
        toast.success("Despesa criada!");
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
      toast.success("Despesa excluída!");
      setDeleteId(null);
    } catch {
      toast.error("Erro ao excluir");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { header: "Data", accessor: (r: ExpenseModel) => formatDate(r.date), sortKey: "date" },
    { header: "Descrição", accessor: "description" as const, sortKey: "description" },
    { header: "Valor", accessor: (r: ExpenseModel) => <span className="font-semibold text-destructive">{mask(formatCurrency(r.amount))}</span>, sortKey: (r: ExpenseModel) => r.amount },
    { header: "Categoria", accessor: (r: ExpenseModel) => <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">{r.category?.name || "—"}</span>, sortKey: (r: ExpenseModel) => r.category?.name || "" },
    { header: "Pagamento", accessor: (r: ExpenseModel) => r.paymentMethod?.description || "—", sortKey: (r: ExpenseModel) => r.paymentMethod?.description || "" },
    {
      header: "Ações",
      accessor: (r: ExpenseModel) => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(r)} className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Pencil className="w-4 h-4" /></button>
          <button onClick={() => setDeleteId(r.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
      className: "w-24",
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar despesas..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
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
          <Button onClick={openAdd} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="w-4 h-4 mr-1" /> Nova Despesa
          </Button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Método de pagamento</label>
              <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)} className="w-full px-3 py-2 h-9 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                <option value="">Todos</option>
                {paymentMethods.map((p) => <option key={p.id} value={p.id}>{p.description}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border">
        <DataTable
          columns={columns}
          data={expenses}
          loading={isLoading}
          keyExtractor={(r) => r.id}
          emptyMessage="Nenhuma despesa registrada"
          totalCount={totalCount}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSave} title={editing ? "Editar Despesa" : "Nova Despesa"} loading={saving}>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Categoria</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                <option value="">Selecione</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pagamento</label>
              <select value={form.paymentMethodId} onChange={(e) => setForm({ ...form, paymentMethodId: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                <option value="">Selecione</option>
                {paymentMethods.map((p) => <option key={p.id} value={p.id}>{p.description}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Observações</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
          </div>
        </div>
      </FormModal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={saving} />
    </div>
  );
}
