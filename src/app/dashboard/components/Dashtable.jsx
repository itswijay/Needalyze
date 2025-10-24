"use client";

import * as React from "react";
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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Customer = [
  {
    id: 1,
    user: "John Doe",
    need: "Health",
    actualHumanLifeValue: 25000,
    address: "123 Main St, Cityville",
    date: "2023-10-01",
    status: "In Progress",
  },
  {
    id: 2,
    user: "Jane Smith",
    need: "Education",
    actualHumanLifeValue: 30000,
    address: "456 Elm St, Townsville",
    date: "2023-09-15",
    status: "Pending",
  },
  {
    id: 3,
    user: "Alex Brown",
    need: "Pension Fund",
    actualHumanLifeValue: 45000,
    address: "789 Oak Ave, Villageton",
    date: "2023-08-20",
    status: "Completed",
  },
  {
    id: 4,
    user: "Maria Garcia",
    need: "Dependents Cost of Living",
    actualHumanLifeValue: 20000,
    address: "12 Pine Rd, Hamlet",
    date: "2023-11-05",
    status: "In Progress",
  },
  {
    id: 5,
    user: "Liam Nguyen",
    need: "Long Term Savings",
    actualHumanLifeValue: 60000,
    address: "34 Cedar Ln, Metro City",
    date: "2023-07-30",
    status: "On Hold",
  },
  {
    id: 6,
    user: "Emily Johnson",
    need: "Short Term Savings",
    actualHumanLifeValue: 15000,
    address: "56 Birch Blvd, Uptown",
    date: "2023-10-10",
    status: "Pending",
  },
  {
    id: 7,
    user: "Noah Patel",
    need: "Health",
    actualHumanLifeValue: 32000,
    address: "78 Walnut St, Lakeside",
    date: "2023-06-18",
    status: "Completed",
  },
  {
    id: 8,
    user: "Olivia Martinez",
    need: "Education",
    actualHumanLifeValue: 28000,
    address: "90 Spruce Dr, Greenfield",
    date: "2023-12-02",
    status: "In Progress",
  },
  {
    id: 9,
    user: "Ethan Wilson",
    need: "Pension Fund",
    actualHumanLifeValue: 52000,
    address: "11 Maple Ct, Riverbend",
    date: "2023-05-22",
    status: "On Hold",
  },
  {
    id: 10,
    user: "Ava Kim",
    need: "Dependents Cost of Living",
    actualHumanLifeValue: 27000,
    address: "202 Chestnut Ave, Harborview",
    date: "2023-09-03",
    status: "Pending",
  },
  {
    id: 11,
    user: "Michael Lee",
    need: "Long Term Savings",
    actualHumanLifeValue: 75000,
    address: "305 Poplar Rd, Springvale",
    date: "2023-04-12",
    status: "Completed",
  },
  {
    id: 12,
    user: "Sophia Turner",
    need: "Short Term Savings",
    actualHumanLifeValue: 18000,
    address: "47 Aspen Loop, Hillcrest",
    date: "2023-11-20",
    status: "Reviewed",
  },
];

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => <div className="capitalize">{row.getValue("user")}</div>,
  },
  {
    accessorKey: "need",
    header: "Need",
    cell: ({ row }) => <div className="capitalize">{row.getValue("need")}</div>,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("address")}</div>
    ),
  },

  {
    id: "date",
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const raw = row.getValue("date");
      if (!raw) return <div className="date" />;
      const parsed = new Date(raw);

      if (isNaN(parsed.getTime())) return <div className="date">{raw}</div>;

      const formatted = parsed.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return <div className="date">{formatted}</div>;
    },
  },

  {
    accessorKey: "actualHumanLifeValue",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Actual Human Life Value
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const value = Number(row.getValue("actualHumanLifeValue")) || 0;
      return <div className="ml-3">Rs.{value}</div>;
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const Customer = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>View Analysis Form</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function DataTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: Customer,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className=" w-full  p-4 mx-auto max-w-7xl">
      <div className="flex items-center py-4 gap-3">
        <Input
          placeholder="Filter need..."
          value={table.getColumn("need")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("need")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
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
      <div className="overflow-hidden bg-blue-50/50 rounded-md border">
        <Table>
          <TableHeader className="bg-blue-100/50">
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
