import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { userApi } from "@/services/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { User, Lock, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(), email: user?.email || "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!form.name || !form.email) { toast.error("Preencha todos os campos"); return; }
    setSaving(true);
    try {
      await userApi.update(user?.id, form);
      toast.success("Perfil atualizado!");
    } catch (err: any) { toast.error(err.message || "Erro ao salvar"); } finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) { toast.error("Preencha os campos de senha"); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error("Senhas não conferem"); return; }
    if (pwForm.newPassword.length < 6) { toast.error("Mínimo 6 caracteres"); return; }
    setSaving(true);
    try {
      await userApi.update(user?.id, { password: pwForm.newPassword, currentPassword: pwForm.currentPassword });
      toast.success("Senha alterada!");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) { toast.error(err.message || "Erro ao alterar senha"); } finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in-up">
      {/* Profile Info */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
            <User className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold">Informações Pessoais</h3>
            <p className="text-sm text-muted-foreground">Atualize seus dados</p>
          </div>
        </div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Nome</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></div>
          <div><label className="block text-sm font-medium mb-1">E-mail</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></div>
          <Button onClick={handleSaveProfile} disabled={saving} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Salvar
          </Button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Lock className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold">Alterar Senha</h3>
            <p className="text-sm text-muted-foreground">Mantenha sua conta segura</p>
          </div>
        </div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Senha Atual</label><input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></div>
          <div><label className="block text-sm font-medium mb-1">Nova Senha</label><input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></div>
          <div><label className="block text-sm font-medium mb-1">Confirmar Nova Senha</label><input type="password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></div>
          <Button onClick={handleChangePassword} disabled={saving} variant="outline">
            {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Alterar Senha
          </Button>
        </div>
      </div>
    </div>
  );
}
