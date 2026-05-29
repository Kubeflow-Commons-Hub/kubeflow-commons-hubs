"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableToolbar, DataTablePagination } from "@/components/admin/data-table";
import { DataTableColumnHeader } from "@/components/admin/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";

interface SurveyRow {
  id: string;
  title: string;
  status: string;
  opensAt: Date | null;
  closesAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  responseCount: number | null;
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "secondary" | "default"> = {
  draft: "secondary",
  active: "success",
  closed: "destructive",
};

const columns: ColumnDef<SurveyRow, unknown>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <Link
        href={`/admin/surveys/${row.original.id}`}
        className="font-medium text-text-primary hover:text-[var(--kf-blue)] transition-colors"
      >
        {row.original.title}
        {row.original.deletedAt && (
          <Badge variant="destructive" className="ml-2">Deleted</Badge>
        )}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={STATUS_VARIANT[row.original.status] || "secondary"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "responseCount",
    header: "Responses",
    cell: ({ row }) => (
      <Link
        href={`/admin/surveys/${row.original.id}/responses`}
        className="text-text-muted hover:text-[var(--kf-blue)] transition-colors"
      >
        {row.original.responseCount ?? 0}
      </Link>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <span className="text-text-muted whitespace-nowrap">
        {new Date(row.original.createdAt).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
];

const STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Closed", value: "closed" },
  { label: "Deleted", value: "deleted" },
];

interface SurveysClientProps {
  rows: SurveyRow[];
  totalCount: number;
  page: number;
  pageSize: number;
  search: string;
  status: string;
}

export function SurveysClient({
  rows,
  totalCount,
  page,
  pageSize,
  search,
  status,
}: SurveysClientProps) {
  const router = useRouter();

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(window.location.search);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      if (updates.q !== undefined || updates.status !== undefined) {
        params.delete("page");
      }
      router.push(`/admin/surveys?${params.toString()}`);
    },
    [router]
  );

  return (
    <>
      <DataTableToolbar
        searchValue={search}
        onSearchChange={(q) => updateParams({ q })}
        searchPlaceholder="Search surveys..."
        filters={[
          {
            key: "status",
            label: "Status",
            options: STATUS_OPTIONS,
            value: status,
            onChange: (v) => updateParams({ status: v }),
          },
        ]}
      />
      <DataTable columns={columns} data={rows} emptyMessage="No surveys found." />
      <DataTablePagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={(p) => updateParams({ page: String(p) })}
        onPageSizeChange={(s) =>
          updateParams({ pageSize: String(s), page: "1" })
        }
      />
    </>
  );
}
