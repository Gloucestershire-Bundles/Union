"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Button } from "./button";
import { useState } from "react";
import { Input } from "./input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { ChevronDown, Filter } from "lucide-react";
import { DataTablePagination } from "./data-table-pagination";

interface FilterableColumn {
  key: string;
  label: string;
  options: string[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchableFields?: string[];
  filterableColumns?: FilterableColumn[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchableFields = [],
  filterableColumns = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: (row, columnId, filterValue) => {
      if (!searchableFields.length) return true;

      const searchValue = filterValue.toLowerCase();

      return searchableFields.some((field) => {
        const value = row.getValue(field);

        if (typeof value === "string") {
          return value.toLowerCase().includes(searchValue);
        }

        if (Array.isArray(value)) {
          return value.some(
            (item) =>
              typeof item === "string" &&
              item.toLowerCase().includes(searchValue)
          );
        }

        return false;
      });
    },
    filterFns: {
      arrayIncludes: (row, columnId, filterValue) => {
        if (!Array.isArray(filterValue) || filterValue.length === 0) {
          return true;
        }
        const cellValue = row.getValue(columnId) as string;
        return filterValue.includes(cellValue);
      },
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4 gap-2">
        {searchableFields.length > 0 && (
          <Input
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        )}
        {filterableColumns.map((filterColumn) => {
          const column = table.getColumn(filterColumn.key);
          const selectedValues = (column?.getFilterValue() as string[]) || [];

          return (
            <DropdownMenu key={filterColumn.key}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="default">
                  <Filter className="h-4 w-4" />
                  {filterColumn.label}
                  {selectedValues.length > 0 && (
                    <span className="ml-1 rounded-sm bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                      {selectedValues.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>{filterColumn.label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filterColumn.options.map((option) => {
                  const isSelected = selectedValues.includes(option);
                  return (
                    <DropdownMenuCheckboxItem
                      key={option}
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          column?.setFilterValue([...selectedValues, option]);
                        } else {
                          column?.setFilterValue(
                            selectedValues.filter((value) => value !== option)
                          );
                        }
                      }}
                    >
                      {option}
                    </DropdownMenuCheckboxItem>
                  );
                })}
                {selectedValues.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={false}
                      onCheckedChange={() => column?.setFilterValue([])}
                    >
                      Clear filters
                    </DropdownMenuCheckboxItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
