import { useState } from "react";
import { Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import SummaryCard from "@/components/shared/SummaryCard";
import DataTable from "@/components/shared/DataTable";
import { useDashboardIncomesExpenses, useDashboardExpensesByCategory, useDashboardExpensesByPaymentMethod } from "@/hooks/queries/useDashboard";
import { formatCurrency, formatDate } from "@/lib/format";
import { useValueVisibility } from "@/hooks/useValueVisibility";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export default function DashboardPage() {
  const { mask } = useValueVisibility();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const monthParam = selectedMonth + 1;

  const { data: incomesExpenses, isLoading } = useDashboardIncomesExpenses(monthParam, selectedYear);
  const { data: expensesByCategory = [] } = useDashboardExpensesByCategory(monthParam, selectedYear);
  const { data: expensesByPaymentMethod = [] } = useDashboardExpensesByPaymentMethod(monthParam, selectedYear);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
    else setSelectedMonth(m => m - 1);
  };
  const handleNextMonth = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
    else setSelectedMonth(m => m + 1);
  };

  const totalIncome = incomesExpenses?.currentAmountIncomes ?? 0;
  const totalExpenses = incomesExpenses?.currentAmountExpenses ?? 0;
  const totalBalance = totalIncome - totalExpenses;

  const barData = {
    labels: ["Receitas", "Despesas"],
    datasets: [
      {
        label: `${MONTHS[selectedMonth]} ${selectedYear}`,
        data: [totalIncome, totalExpenses],
        backgroundColor: ["#00C896", "#FF6B6B"],
        borderRadius: 6,
      },
    ],
  };

  const categoryColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"];
  const pieData = {
    labels: expensesByCategory.map((c) => c.category?.name ?? "—"),
    datasets: [{
      data: expensesByCategory.map((c) => c.totalAmount),
      backgroundColor: expensesByCategory.map((_, i) => categoryColors[i % categoryColors.length]),
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: "bottom" as const, labels: { usePointStyle: true, padding: 16, font: { family: "DM Sans", size: 12 } } } },
  };

  const recentTransactions = [
    ...expensesByPaymentMethod.map((e) => ({
      id: `pm-${e.paymentMethod?.id}`,
      description: e.paymentMethod?.description ?? "—",
      amount: -e.totalAmount,
      type: "expense" as const,
      category: "—",
      paymentMethod: e.paymentMethod?.description ?? "—",
      date: `${selectedYear}-${String(monthParam).padStart(2, "0")}-01`,
    })),
  ];

  const transactionColumns = [
    { header: "Data", accessor: (r: typeof recentTransactions[number]) => formatDate(r.date) },
    { header: "Descrição", accessor: "description" as const },
    { header: "Categoria", accessor: (r: typeof recentTransactions[number]) => <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">{r.category}</span> },
    { header: "Método", accessor: "paymentMethod" as const },
    { header: "Valor", accessor: (r: typeof recentTransactions[number]) => <span className={`font-semibold ${r.amount >= 0 ? "text-success" : "text-destructive"}`}>{mask(formatCurrency(Math.abs(r.amount)))}</span>, className: "text-right" },
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <button onClick={handlePrevMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><ChevronLeft className="w-4 h-4" /></button>

        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-sm font-semibold">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              {MONTHS[selectedMonth]} {selectedYear}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarPicker
              mode="single"
              month={new Date(selectedYear, selectedMonth)}
              onMonthChange={(date: Date) => {
                setSelectedMonth(date.getMonth());
                setSelectedYear(date.getFullYear());
              }}
              onSelect={(date: Date | undefined) => {
                if (date) {
                  setSelectedMonth(date.getMonth());
                  setSelectedYear(date.getFullYear());
                  setCalendarOpen(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>

        <button onClick={handleNextMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Saldo atual" value={totalBalance} icon={Wallet} />
        <SummaryCard title="Receitas (mês)" value={totalIncome} icon={ArrowUpRight} variant="income" />
        <SummaryCard title="Despesas (mês)" value={totalExpenses} icon={ArrowDownLeft} variant="expense" />
        <SummaryCard title="Investimentos" value={0} icon={TrendingUp} variant="investment" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <h3 className="font-heading font-semibold mb-4">Receitas vs Despesas</h3>
          <div className="h-72"><Bar data={barData} options={chartOptions} /></div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-heading font-semibold mb-4">Despesas por Categoria</h3>
          <div className="h-72"><Pie data={pieData} options={chartOptions} /></div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-heading font-semibold mb-4">Despesas por Método de Pagamento</h3>
        <DataTable columns={transactionColumns} data={recentTransactions} keyExtractor={(r) => r.id} />
      </div>
    </div>
  );
}
