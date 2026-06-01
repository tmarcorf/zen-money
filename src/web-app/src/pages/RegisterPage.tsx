import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Wallet, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const { authenticated, register, sessionStatus } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", firstName: "", lastName: "", dateOfBirth: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Show a loading spinner while the initial session check is in progress
  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (authenticated) return <Navigate to="/dashboards" replace />;

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Nome é obrigatório";
    if (!form.lastName.trim()) e.lastName = "Sobrenome é obrigatório";
    if (!form.email.trim()) e.email = "E-mail é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "E-mail inválido";
    if (!form.password) e.password = "Senha é obrigatória";
    else if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (form.password !== form.confirmPassword) e.confirmPassword = "As senhas não coincidem";
    if (!form.dateOfBirth) e.dateOfBirth = "Data de nascimento é obrigatória";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: form.dateOfBirth
      });
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent ${errors[field] ? "border-destructive" : "border-input"}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent mb-4">
            <Wallet className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-primary-foreground">ZenMoney</h1>
          <p className="text-primary-foreground/60 text-sm mt-1">Crie sua conta e comece a gerenciar suas finanças</p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-heading font-semibold text-card-foreground mb-6">Criar conta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1.5">Nome *</label>
                <input value={form.firstName} onChange={set("firstName")} className={inputClass("firstName")} placeholder="João" />
                {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1.5">Sobrenome *</label>
                <input value={form.lastName} onChange={set("lastName")} className={inputClass("lastName")} placeholder="Silva" />
                {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">E-mail *</label>
              <input type="email" value={form.email} onChange={set("email")} className={inputClass("email")} placeholder="seu@email.com" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">Data de Nascimento *</label>
              <input type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} className={inputClass("dateOfBirth")} />
              {errors.dateOfBirth && <p className="text-xs text-destructive mt-1">{errors.dateOfBirth}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">Senha *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  className={inputClass("password") + " pr-10"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">Confirmar Senha *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  className={inputClass("confirmPassword") + " pr-10"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Criar Conta
            </button>
            <Link
              to="/login"
              className="w-full py-2.5 rounded-lg border border-border bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
