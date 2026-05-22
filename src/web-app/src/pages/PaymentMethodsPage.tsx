import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { paymentMethodApi } from "@/services/api";
import DataTable from "@/components/shared/DataTable";
import FormModal from "@/components/shared/FormModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

const mockPMs = [
  { id: "1", name: "Nubank Crédito", type: "credit" },
  { id: "2", name: "Itaú Débito", type: "debit" },
  { id: "3", name: "PIX", type: "pix" },
  { id: "4", name: "Dinheiro", type: "cash" },
];

const typeLabels: Record<string, string> = { credit: "Crédito", debit: "Débito", pix: "PIX", cash: "Dinheiro" };
const typeBadgeColors: Record<string, string> = { credit: "bg-chart-investment/10 text-chart-investment", debit: "bg-warning/10 text-warning", pix: "bg-success/10 text-success", cash: "bg-muted text-muted-foreground" };

export default function PaymentMethodsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", type: "credit" });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * PAGE_SIZE;
      const res = await paymentMethodApi.list({ skip, take: PAGE_SIZE });
      const data = res?.data ?? res;
      const total = res?.totalCount ?? (Array.isArray(data) ? data.length : 0);
      setItems(Array.isArray(data) ? data : []);
      setTotalCount(total);
    } catch {
      setItems(mockPMs);
      setTotalCount(mockPMs.length);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = items.filter((i) => !search || i.name?.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditing(null); setForm({ name: "", type: "credit" }); setModalOpen(true); };
  const openEdit = (item: any) => { setEditing(item); setForm({ name: item.name, type: item.type }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name) { toast.error("Nome é obrigatório"); return; }
    setSaving(true);
    try {
      if (editing) { await paymentMethodApi.update(editing.id, form); toast.success("Método atualizado!"); }
      else { await paymentMethodApi.create(form); toast.success("Método criado!"); }
      setModalOpen(false); fetchData();
    } catch (err: any) { toast.error(err.message || "Erro ao salvar"); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return; setSaving(true);
    try { await paymentMethodApi.delete(deleteId); toast.success("Método excluído!"); setDeleteId(null); fetchData(); }
    catch (err: any) { toast.error(err.message || "Erro ao excluir"); } finally { setSaving(false); }
  };

  const columns = [
    { header: "Nome", accessor: "name" as const },
    { header: "Tipo", accessor: (r: any) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeBadgeColors[r.type] || "bg-muted text-muted-foreground"}`}>{typeLabels[r.type] || r.type}</span> },
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
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar métodos..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <Button onClick={openAdd} className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="w-4 h-4 mr-1" /> Novo Método</Button>
      </div>
      <div className="bg-card rounded-xl border border-border">
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          keyExtractor={(r: any) => r.id}
          emptyMessage="Nenhum método de pagamento cadastrado"
          totalCount={totalCount}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSave} title={editing ? "Editar Método" : "Novo Método"} loading={saving}>
        <div className="space-y-3">
          <div><label className="block text-sm font-medium mb-1">Nome *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></div>
          <div><label className="block text-sm font-medium mb-1">Tipo</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="credit">Crédito</option><option value="debit">Débito</option><option value="pix">PIX</option><option value="cash">Dinheiro</option>
            </select>
          </div>
        </div>
      </FormModal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={saving} />
    </div>
  );
}
