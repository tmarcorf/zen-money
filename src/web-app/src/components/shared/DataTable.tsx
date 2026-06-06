import { ReactNode, useState, useMemo } from "react";
import { Loader2, Inbox, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
  sortKey?: string | ((row: T) => string | number);
}

type SortDir = "asc" | "desc";

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor: (row: T) => string;
  // Server-side pagination
  totalCount?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

export default function DataTable<T>({
  columns,
  data: inputData = [],
  loading,
  emptyMessage = "Nenhum registro encontrado",
  keyExtractor,
  totalCount,
  page = 1,
  pageSize = 10,
  onPageChange,
}: Props<T>) {
  const data = Array.isArray(inputData) ? inputData : [];
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (index: number) => {
    if (sortCol === index) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(index);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    if (sortCol === null) return data;
    const col = columns[sortCol];
    if (!col?.sortKey) return data;

    const getSortValue = (row: T): string | number => {
      if (typeof col.sortKey === "function") return col.sortKey(row);
      return (row as any)[col.sortKey] ?? "";
    };

    return [...data].sort((a, b) => {
      const va = getSortValue(a);
      const vb = getSortValue(b);
      const cmp = typeof va === "number" && typeof vb === "number"
        ? va - vb
        : String(va).localeCompare(String(vb), "pt-BR");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortCol, sortDir]);

  // Pagination logic
  const isPaginated = onPageChange !== undefined;
  const total = totalCount ?? data.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("ellipsis");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Inbox className="w-12 h-12 mb-3 opacity-40" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col, i) => {
                const sortable = !!col.sortKey;
                const active = sortCol === i;
                return (
                  <th
                    key={i}
                    onClick={sortable ? () => handleSort(i) : undefined}
                    className={`text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${sortable ? "cursor-pointer select-none hover:text-foreground transition-colors" : ""} ${col.className || ""}`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {sortable && (
                        active
                          ? sortDir === "asc"
                            ? <ArrowUp className="w-3.5 h-3.5" />
                            : <ArrowDown className="w-3.5 h-3.5" />
                          : <ArrowUpDown className="w-3.5 h-3.5 opacity-30" />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={keyExtractor(row)} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                {columns.map((col, i) => (
                  <td key={i} className={`py-3 px-4 ${col.className || ""}`}>
                    {typeof col.accessor === "function" ? col.accessor(row) : (row[col.accessor] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {isPaginated && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Página {page} de {totalPages} ({total} registros)
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page <= 1}
              onClick={() => onPageChange!(page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {getPageNumbers().map((p, i) =>
              p === "ellipsis" ? (
                <span key={`e-${i}`} className="px-1 text-muted-foreground text-sm">…</span>
              ) : (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => onPageChange!(p)}
                >
                  {p}
                </Button>
              )
            )}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page >= totalPages}
              onClick={() => onPageChange!(page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
