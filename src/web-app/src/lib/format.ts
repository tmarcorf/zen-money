export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function formatDate(date: string | Date): string {
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    date = date + "T00:00:00";
  }
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
}

export function toDateInputValue(date: string): string {
  if (!date) return "";
  return date.split("T")[0];
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}
