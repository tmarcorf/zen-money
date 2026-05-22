import { LucideIcon } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/format";
import { useValueVisibility } from "@/hooks/useValueVisibility";

interface Props {
  title: string;
  value: number;
  change?: number;
  icon: LucideIcon;
  variant?: "default" | "income" | "expense" | "investment";
}

const variantStyles = {
  default: "bg-card border border-border",
  income: "bg-card border border-success/20",
  expense: "bg-card border border-destructive/20",
  investment: "bg-card border border-chart-investment/20",
};

const iconStyles = {
  default: "bg-muted text-muted-foreground",
  income: "bg-success/10 text-success",
  expense: "bg-destructive/10 text-destructive",
  investment: "bg-chart-investment/10 text-chart-investment",
};

export default function SummaryCard({ title, value, change, icon: Icon, variant = "default" }: Props) {
  const { mask } = useValueVisibility();
  return (
    <div className={`rounded-xl p-5 ${variantStyles[variant]} animate-fade-in-up`} style={{ animationDelay: "0.05s", animationFillMode: "both" }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconStyles[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-heading font-bold">{mask(formatCurrency(value))}</div>
      {change !== undefined && (
        <span className={`text-xs font-medium mt-1 inline-block ${change >= 0 ? "text-success" : "text-destructive"}`}>
          {formatPercent(change)} vs mês anterior
        </span>
      )}
    </div>
  );
}
