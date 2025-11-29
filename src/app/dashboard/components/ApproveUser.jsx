"use client";

import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ApproveUser = ({ open, onOpenChange, formData }) => {
  const [data, setData] = React.useState(() => {
    // Example fallback users
    const exampleUsers = [
      {
        full_name: "John Doe",
        branch: "New York",
        code_num: "A123",
        status: "Pending",
      },
      {
        full_name: "Sarah Smith",
        branch: "California",
        code_num: "B456",
        status: "Pending",
      },
      {
        full_name: "Mike Anderson",
        branch: "Texas",
        code_num: "C789",
        status: "Pending",
      },
      {
        full_name: "Emily Johnson",
        branch: "Florida",
        code_num: "D321",
        status: "Pending",
      },
    ];

    let users = Array.isArray(formData) && formData.length > 0
      ? formData
      : exampleUsers;

    return users.map((item) => ({
      user: item.full_name || "Unknown",
      branch: item.branch || "Not Provided",
      code_num: item.code_num || "Not Provided",
      status: item.status || "Pending",
    }));
  });

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => <div>{row.getValue("user")}</div>,
      },
      {
        accessorKey: "branch",
        header: "Branch",
        cell: ({ row }) => <div>{row.getValue("branch")}</div>,
      },
      {
        accessorKey: "code_num",
        header: "Code Number",
        cell: ({ row }) => <div>{row.getValue("code_num")}</div>,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <Button
                className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs md:text-sm"
                onClick={() => {
                  setData((prev) =>
                    prev.map((user) =>
                      user.user === row.original.user
                        ? { ...user, status: "Approved" }
                        : user
                    )
                  );
                }}
              >
                Approve
              </Button>

              <Button
                className="bg-red-600 text-white px-3 py-1 rounded-md text-xs md:text-sm"
                onClick={() => {
                  setData((prev) =>
                    prev.map((user) =>
                      user.user === row.original.user
                        ? { ...user, status: "Rejected" }
                        : user
                    )
                  );
                }}
              >
                Reject
              </Button>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;

          return (
            <span
              className={`font-medium ${
                status === "Approved"
                  ? "text-green-600"
                  : status === "Rejected"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {status}
            </span>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md md:max-w-lg lg:max-w-4xl mx-auto p-4 sm:p-6 gap-3 sm:gap-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Approve User
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 border rounded-lg overflow-x-auto">
          <Table className="min-w-full text-sm md:text-base">
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id} className="px-4 py-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-2">
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
                  <TableCell colSpan={4} className="text-center py-4">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveUser;
