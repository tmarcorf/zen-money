import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { categoryApi } from "@/services/api";
import DataTable from "@/components/shared/DataTable";
import FormModal from "@/components/shared/FormModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

const mockCategories = [
  { id: "1", name: "Alimentação", type: "expense", color: "#FF6B6B" },
  { id: "2", name: "Moradia", type: "expense", color: "#45B7D1" },
  { id: "3", name: "Transporte", type: "expense", color: "#4ECDC4" },
  { id: "4", name: "Trabalho", type: "income", color: "#00C896" },
  { id: "5", name: "Investimentos", type: "investment", color: "#6366F1" },
];

const typeLabels: Record<string, string> = { expense: "Despesa", income: "Receita", investment: "Investimento" };

export default function CategoriesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", type: "expense", color: "#00C896" });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * PAGE_SIZE;
      const res = await categoryApi.list({ skip, take: PAGE_SIZE });
      const data = res && typeof res === 'object' && 'data' in res ? res.data : res;
      const total = res?.totalCount ?? (Array.isArray(data) ? data.length : 0);
      setItems(Array.isArray(data) ? data : []);
      setTotalCount(total);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setItems(mockCategories);
      setTotalCount(mockCategories.length);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = Array.isArray(items)
    ? items.filter((i) => i && typeof i === 'object' && i.name && i.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  const openAdd = () => { setEditing(null); setForm({ name: "", type: "expense", color: "#00C896" }); setModalOpen(true); };
  const openEdit = (item: any) => { setEditing(item); setForm({ name: item.name, type: item.type, color: item.color || "#00C896" }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name) { toast.error("Nome é obrigatório"); return; }
    setSaving(true);
    try {
      if (editing) { await categoryApi.update(editing.id, form); toast.success("Categoria atualizada!"); }
      else { await categoryApi.create(form); toast.success("Categoria criada!"); }
      setModalOpen(false); fetchData();
    } catch (err: any) { toast.error(err.message || "Erro ao salvar"); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSaving(true);
    try { await categoryApi.delete(deleteId); toast.success("Categoria excluída!"); setDeleteId(null); fetchData(); }
    catch (err: any) { toast.error(err.message || "Erro ao excluir"); } finally { setSaving(false); }
  };

  const columns = [
    { header: "Cor", accessor: (r: any) => <div className="w-5 h-5 rounded-full" style={{ backgroundColor: r.color }} />, className: "w-16" },
    { header: "Nome", accessor: "name" as const },
    { header: "Tipo", accessor: (r: any) => <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">{typeLabels[r.type] || r.type}</span> },
    {
      header: "Ações", accessor: (r: any) => (
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
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar categorias..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <Button onClick={openAdd} className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="w-4 h-4 mr-1" /> Nova Categoria</Button>
      </div>
      <div className="bg-card rounded-xl border border-border">
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          keyExtractor={(r: any) => r.id}
          emptyMessage="Nenhuma categoria cadastrada"
          totalCount={totalCount}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSave} title={editing ? "Editar Categoria" : "Nova Categoria"} loading={saving}>
        <div className="space-y-3">
          <div><label className="block text-sm font-medium mb-1">Nome *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></div>
          <div><label className="block text-sm font-medium mb-1">Tipo</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="expense">Despesa</option><option value="income">Receita</option><option value="investment">Investimento</option>
            </select>
          </div>
          <div><label className="block text-sm font-medium mb-1">Cor</label><input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-12 h-10 rounded border border-input cursor-pointer" /></div>
        </div>
      </FormModal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={saving} />
    </div>
  );
}
