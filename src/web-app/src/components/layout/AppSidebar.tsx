import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Tag,
  CreditCard,
  User,
  LogOut,
  X,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { to: "/dashboards", label: "Dashboard", icon: LayoutDashboard },
  { to: "/incomes", label: "Receitas", icon: ArrowUpRight },
  { to: "/expenses", label: "Despesas", icon: ArrowDownLeft },
  { to: "/investments", label: "Investimentos", icon: TrendingUp },
  { to: "/categories", label: "Categorias", icon: Tag },
  { to: "/payment-methods", label: "Métodos Pgto.", icon: CreditCard },
  { to: "/profile", label: "Perfil", icon: User },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AppSidebar({ open, onClose }: Props) {
  const { logout } = useAuth();

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-foreground/30 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Wallet className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-bold text-sidebar-primary-foreground">ZenMoney</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-sidebar-muted hover:text-sidebar-primary-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary-foreground"
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-sidebar-border">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
