import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { usePaymentMethods, useCreatePaymentMethod, useUpdatePaymentMethod, useDeletePaymentMethod } from "@/hooks/queries/usePaymentMethods";
import DataTable from "@/components/shared/DataTable";
import FormModal from "@/components/shared/FormModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { PaymentMethodModel } from "@/types/entities";
import type { SearchPaymentMethodRequest, CreatePaymentMethodRequest, UpdatePaymentMethodRequest } from "@/types/requests";

const PAGE_SIZE = 10;

export default function PaymentMethodsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<PaymentMethodModel | null>(null);
  const [form, setForm] = useState({ description: "" });
  const [saving, setSaving] = useState(false);

  const searchParams: SearchPaymentMethodRequest = {
    offset: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    ...(search && { description: search }),
  };

  const { data, isLoading } = usePaymentMethods(searchParams);
  const createMutation = useCreatePaymentMethod();
  const updateMutation = useUpdatePaymentMethod();
  const deleteMutation = useDeletePaymentMethod();

  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  const openAdd = () => { setEditing(null); setForm({ description: "" }); setModalOpen(true); };
  const openEdit = (item: PaymentMethodModel) => { setEditing(item); setForm({ description: item.description }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.description) { toast.error("Descrição é obrigatória"); return; }
    setSaving(true);
    try {
      if (editing) {
        const payload: UpdatePaymentMethodRequest = { id: editing.id, description: form.description };
        await updateMutation.mutateAsync(payload);
        toast.success("Método atualizado!");
      } else {
        const payload: CreatePaymentMethodRequest = { description: form.description };
        await createMutation.mutateAsync(payload);
        toast.success("Método criado!");
      }
      setModalOpen(false);
    } catch {
      toast.error("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return; setSaving(true);
    try { await deleteMutation.mutateAsync(deleteId); toast.success("Método excluído!"); setDeleteId(null); }
    catch { toast.error("Erro ao excluir"); } finally { setSaving(false); }
  };

  const columns = [
    { header: "Descrição", accessor: "description" as const },
    {
      header: "Ações", accessor: (r: PaymentMethodModel) => (
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
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar métodos..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <Button onClick={openAdd} className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="w-4 h-4 mr-1" /> Novo Método</Button>
      </div>
      <div className="bg-card rounded-xl border border-border">
        <DataTable
          columns={columns}
          data={items}
          loading={isLoading}
          keyExtractor={(r) => r.id}
          emptyMessage="Nenhum método de pagamento cadastrado"
          totalCount={totalCount}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSave} title={editing ? "Editar Método" : "Novo Método"} loading={saving}>
        <div className="space-y-3">
          <div><label className="block text-sm font-medium mb-1">Descrição *</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></div>
        </div>
      </FormModal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={saving} />
    </div>
  );
}
