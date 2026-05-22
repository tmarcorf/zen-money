import { useState, useEffect, useCallback } from "react";
import { Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import SummaryCard from "@/components/shared/SummaryCard";
import DataTable from "@/components/shared/DataTable";
import { dashboardApi } from "@/services/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { useValueVisibility } from "@/hooks/useValueVisibility";
import { toast } from "sonner";
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

// Mock data generator per month for demo
function getMockDashboard(month: number, year: number) {
  const seed = month + year * 12;
  const base = 6000 + (seed % 5) * 500;
  return {
    totalBalance: 20000 + (seed % 10) * 1000,
    totalIncome: base + 2000,
    totalExpenses: base * 0.45,
    totalInvestments: 12000 + (seed % 8) * 400,
    incomeChange: ((seed % 20) - 10) + 0.5,
    expenseChange: -((seed % 15) - 5) + 0.3,
    investmentChange: ((seed % 12) - 3) + 0.7,
    monthlyData: Array.from({ length: month + 1 }, (_, i) => ({
      month: MONTHS[i].slice(0, 3),
      income: 6500 + ((i + seed) % 6) * 400,
      expenses: 2800 + ((i + seed) % 5) * 300,
    })).slice(-4),
    expensesByCategory: [
      { category: "Alimentação", amount: 800 + (seed % 4) * 100, color: "#FF6B6B" },
      { category: "Transporte", amount: 500 + (seed % 3) * 80, color: "#4ECDC4" },
      { category: "Moradia", amount: 1200, color: "#45B7D1" },
      { category: "Lazer", amount: 400 + (seed % 5) * 50, color: "#96CEB4" },
    ],
    recentTransactions: [
      { id: "1", description: "Salário", amount: base + 2000, type: "income", category: "Trabalho", paymentMethod: "PIX", date: `${year}-${String(month + 1).padStart(2, "0")}-01` },
      { id: "2", description: "Supermercado", amount: -450, type: "expense", category: "Alimentação", paymentMethod: "Crédito", date: `${year}-${String(month + 1).padStart(2, "0")}-05` },
      { id: "3", description: "Aluguel", amount: -1200, type: "expense", category: "Moradia", paymentMethod: "Débito", date: `${year}-${String(month + 1).padStart(2, "0")}-10` },
      { id: "4", description: "Freelance", amount: 2200, type: "income", category: "Trabalho", paymentMethod: "PIX", date: `${year}-${String(month + 1).padStart(2, "0")}-15` },
      { id: "5", description: "Uber", amount: -85, type: "expense", category: "Transporte", paymentMethod: "Crédito", date: `${year}-${String(month + 1).padStart(2, "0")}-20` },
    ],
  };
}

export default function DashboardPage() {
  const { mask } = useValueVisibility();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.get();
      setData(res);
    } catch {
      setData(getMockDashboard(selectedMonth, selectedYear));
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
    else setSelectedMonth(m => m - 1);
  };
  const handleNextMonth = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
    else setSelectedMonth(m => m + 1);
  };

  const d = data || getMockDashboard(selectedMonth, selectedYear);

  const barData = {
    labels: d.monthlyData?.map((m: any) => m.month) || [],
    datasets: [
      { label: "Receitas", data: d.monthlyData?.map((m: any) => m.income) || [], backgroundColor: "#00C896", borderRadius: 6 },
      { label: "Despesas", data: d.monthlyData?.map((m: any) => m.expenses) || [], backgroundColor: "#FF6B6B", borderRadius: 6 },
    ],
  };

  const pieData = {
    labels: d.expensesByCategory?.map((c: any) => c.category) || [],
    datasets: [{
      data: d.expensesByCategory?.map((c: any) => c.amount) || [],
      backgroundColor: d.expensesByCategory?.map((c: any) => c.color) || [],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: "bottom" as const, labels: { usePointStyle: true, padding: 16, font: { family: "DM Sans", size: 12 } } } },
  };

  const transactionColumns = [
    { header: "Data", accessor: (r: any) => formatDate(r.date) },
    { header: "Descrição", accessor: "description" as const },
    { header: "Categoria", accessor: (r: any) => <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">{r.category}</span> },
    { header: "Método", accessor: "paymentMethod" as const },
    { header: "Valor", accessor: (r: any) => <span className={`font-semibold ${r.amount >= 0 ? "text-success" : "text-destructive"}`}>{mask(formatCurrency(Math.abs(r.amount)))}</span>, className: "text-right" },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Month/Year Selector */}
      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5 text-muted-foreground" />
        <button onClick={handlePrevMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><ChevronLeft className="w-4 h-4" /></button>
        <span className="text-sm font-semibold min-w-[140px] text-center">{MONTHS[selectedMonth]} {selectedYear}</span>
        <button onClick={handleNextMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><ChevronRight className="w-4 h-4" /></button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Saldo Total" value={d.totalBalance} icon={Wallet} />
        <SummaryCard title="Receitas (mês)" value={d.totalIncome} change={d.incomeChange} icon={ArrowUpRight} variant="income" />
        <SummaryCard title="Despesas (mês)" value={d.totalExpenses} change={d.expenseChange} icon={ArrowDownLeft} variant="expense" />
        <SummaryCard title="Investimentos" value={d.totalInvestments} change={d.investmentChange} icon={TrendingUp} variant="investment" />
      </div>

      {/* Charts */}
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

      {/* Recent Transactions */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-heading font-semibold mb-4">Transações Recentes</h3>
        <DataTable columns={transactionColumns} data={d.recentTransactions || []} keyExtractor={(r: any) => r.id} />
      </div>
    </div>
  );
}
