import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu, Bell, CheckCheck, Trash2, Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useValueVisibility } from "@/hooks/useValueVisibility";
import { useTheme } from "@/hooks/useTheme";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: "1", title: "Despesa registrada", message: "Supermercado — R$ 342,50", time: "Há 5 min", read: false },
  { id: "2", title: "Meta atingida!", message: "Você atingiu 80% da meta de economia", time: "Há 1 hora", read: false },
  { id: "3", title: "Investimento atualizado", message: "Tesouro Selic rendeu +0,12%", time: "Há 3 horas", read: false },
  { id: "4", title: "Receita recebida", message: "Salário — R$ 5.200,00", time: "Ontem", read: true },
];

const routeTitles: Record<string, string> = {
  "/dashboards": "Dashboard",
  "/incomes": "Receitas",
  "/expenses": "Despesas",
  "/investments": "Investimentos",
  "/categories": "Categorias",
  "/payment-methods": "Métodos de Pagamento",
  "/profile": "Perfil",
};

interface Props {
  onMenuClick: () => void;
  title?: string;
  breadcrumb?: string[];
}

export default function TopNavbar({ onMenuClick, title, breadcrumb }: Props) {
  const { user } = useAuth();
  const { visible, toggle } = useValueVisibility();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const pageTitle = title || routeTitles[location.pathname] || "";
  const today = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const removeNotification = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div>
            {breadcrumb && breadcrumb.length > 0 && (
              <div className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                {breadcrumb.map((b, i) => (
                  <span key={i}>
                    {i > 0 && <span className="mx-1">/</span>}
                    {b}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-lg font-heading font-semibold">{pageTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:block text-sm text-muted-foreground capitalize">{today}</span>

          {/* Value visibility toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
            title={visible ? "Ocultar valores" : "Mostrar valores"}
          >
            {visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>

          {/* Theme toggle - Moon/Sun icon */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            title={theme === "dark" ? "Modo claro" : "Modo escuro"}
            aria-label={`Alternar para ${theme === "dark" ? "modo claro" : "modo escuro"}`}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notification bell */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border bg-popover shadow-xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <h3 className="text-sm font-semibold">Notificações</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <CheckCheck className="w-3.5 h-3.5" /> Marcar todas como lidas
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-8">Nenhuma notificação</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 transition-colors ${!n.read ? "bg-accent/40" : ""}`}
                      >
                        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!n.read ? "bg-primary" : "bg-transparent"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{n.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{n.time}</p>
                        </div>
                        <button
                          onClick={() => removeNotification(n.id)}
                          className="p-1 rounded hover:bg-muted text-muted-foreground shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
              {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="hidden sm:block text-sm font-medium">
              Olá, {user?.firstName || "Usuário"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
