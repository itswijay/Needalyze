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
import { ArrowUpDown, ChevronDown, Eye, MoreHorizontal } from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

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
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const userName = row.getValue("user");
      const displayName =
        userName.length > 15 ? `${userName.substring(0, 15)}...` : userName;
      return (
        <div className="capitalize" title={userName}>
          {displayName}
        </div>
      );
    },
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
          className="hover:bg-inherit cursor-pointer group"
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
        className="hover:bg-inherit cursor-pointer group"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="inline sm:hidden">AHL. Val</span>
        <span className="hidden sm:inline ">Actual Human Life Value</span>
        <ArrowUpDown className="" />
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
      const customer = row.original;

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">View Form</span>
              <Eye />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-4">
                Customer Details
              </DialogTitle>
            </DialogHeader>

            {/* Receipt Content */}
            <div className="bg-white p-6 rounded-lg border">
              {/* Header */}
              <div className="text-center border-b-2 border-gray-100 pb-4 mb-6">
                <div className="flex justify-center">
                  <Image
                    src="/images/logos/secondary-t.png"
                    width="100"
                    height="100"
                    alt="Needalyze-Logo"
                    priority
                  />
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50/40 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-3 border-b border-gray-300 pb-1">
                      Personal Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium text-gray-800">
                          {customer.user}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium text-right  text-gray-800">
                          {customer.address}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium  text-gray-800">
                          {new Date(customer.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50/40 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-3 border-b border-gray-300 pb-1">
                      Financial Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Need Type:</span>
                        <span className="font-medium  text-gray-800">
                          {customer.need}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Actual Human Life Value:
                        </span>
                        <span className="font-bold text-green-600 ">
                          Rs.{customer.actualHumanLifeValue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`font-medium px-2 py-1 rounded-full text-xs  text-gray-800 ${
                            customer.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : customer.status === "In Progress"
                              ? "bg-blue-100 text-blue-700"
                              : customer.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : customer.status === "On Hold"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-semibold text-blue-800 mb-2">Summary</h3>
                  <p className="text-sm text-blue-700">
                    Customer <strong>{customer.user}</strong> has a{" "}
                    <strong>{customer.need}</strong> need with an actual human
                    life value of{" "}
                    <strong>
                      Rs.{customer.actualHumanLifeValue.toLocaleString()}
                    </strong>
                    . Current status: <strong>{customer.status}</strong>
                  </p>
                </div>

                {/* Footer */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Generated on{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    This is a digitally generated receipt.
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
      <div className="flex items-center justify-between py-4 gap-3">
        <Input
          placeholder="Filter name..."
          value={table.getColumn("user")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("user")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="lg:flex hidden">
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
      </div>
      <div className="overflow-hidden  bg-blue-50/50  rounded-md border">
        <Table>
          <TableHeader className="bg-blue-100/30  ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const hiddenOnMobile =
                    index === 1 || index === 2 || index === 3
                      ? "hidden sm:table-cell"
                      : "";

                  return (
                    <TableHead key={header.id} className={hiddenOnMobile}>
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
                  {row.getVisibleCells().map((cell, index) => {
                    const hiddenOnMobile =
                      index === 1 || index === 2 || index === 3
                        ? "hidden sm:table-cell"
                        : "";

                    return (
                      <TableCell key={cell.id} className={hiddenOnMobile}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
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
