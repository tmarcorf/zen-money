import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/queries/useCategories";
import DataTable from "@/components/shared/DataTable";
import FormModal from "@/components/shared/FormModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { CategoryModel } from "@/types/entities";
import type { SearchCategoryRequest, CreateCategoryRequest, UpdateCategoryRequest } from "@/types/requests";

const PAGE_SIZE = 10;

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<CategoryModel | null>(null);
  const [form, setForm] = useState({ name: "" });
  const [saving, setSaving] = useState(false);

  const searchParams: SearchCategoryRequest = {
    offset: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    ...(search && { name: search }),
  };

  const { data, isLoading } = useCategories(searchParams);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  const openAdd = () => { setEditing(null); setForm({ name: "" }); setModalOpen(true); };
  const openEdit = (item: CategoryModel) => { setEditing(item); setForm({ name: item.name }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name) { toast.error("Nome é obrigatório"); return; }
    setSaving(true);
    try {
      if (editing) {
        const payload: UpdateCategoryRequest = { id: editing.id, name: form.name };
        await updateMutation.mutateAsync(payload);
        toast.success("Categoria atualizada!");
      } else {
        const payload: CreateCategoryRequest = { name: form.name };
        await createMutation.mutateAsync(payload);
        toast.success("Categoria criada!");
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
    try { await deleteMutation.mutateAsync(deleteId); toast.success("Categoria excluída!"); setDeleteId(null); }
    catch { toast.error("Erro ao excluir"); } finally { setSaving(false); }
  };

  const columns = [
    { header: "Nome", accessor: "name" as const, sortKey: "name" },
    {
      header: "Ações", accessor: (r: CategoryModel) => (
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
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar categorias..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <Button onClick={openAdd} className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="w-4 h-4 mr-1" /> Nova Categoria</Button>
      </div>
      <div className="bg-card rounded-xl border border-border">
        <DataTable
          columns={columns}
          data={items}
          loading={isLoading}
          keyExtractor={(r) => r.id}
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
        </div>
      </FormModal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={saving} />
    </div>
  );
}
