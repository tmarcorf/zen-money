import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Wallet, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const { login, loading, authenticated, sessionStatus } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Show a loading spinner while the initial session check is in progress
  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (authenticated) return <Navigate to="/dashboards" replace />;

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "E-mail é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "E-mail inválido";
    if (!password) e.password = "Senha é obrigatória";
    else if (password.length < 8) e.password = "Mínimo 8 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const response = await login(email, password);

      if (response.isSuccess) {
        toast.success("Login realizado com sucesso!");
        navigate("/dashboards");
      } else {
        toast.error(response.error?.message || "Falha no login");
      }
    } catch (err: any) {
      toast.error(err.message || "Falha no login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent mb-4">
            <Wallet className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-primary-foreground">ZenMoney</h1>
          <p className="text-primary-foreground/60 text-sm mt-1">Gerencie suas finanças com tranquilidade</p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-heading font-semibold text-card-foreground mb-6">Entrar na sua conta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors.email ? "border-destructive" : "border-input"
                }`}
                placeholder="seu@email.com"
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2.5 pr-10 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent ${
                    errors.password ? "border-destructive" : "border-input"
                  }`}
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
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Entrar
            </button>
            <Link
              to="/register"
              className="w-full py-2.5 rounded-lg border border-border bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
            >
              Criar Conta
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
