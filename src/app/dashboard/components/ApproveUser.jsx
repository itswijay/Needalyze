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

const ApproveUser = ({ open, setOpen, formData }) => {
  const [data, setData] = React.useState(() => {
    let users = Array.isArray(formData)
      ? formData.map((item) => ({
          user: item.full_name || "Unknown",
          address: item.address || "Not Provided",
          status: item.status || "On Hold",
        }))
      : [];

    if (users.length === 0) {
      users = [
        { user: "John Doe", address: "123 Main St", status: "On Hold" },
        { user: "Jane Smith", address: "456 Oak Ave", status: "Pending" },
        { user: "Alice Johnson", address: "789 Pine Rd", status: "Pending" },
      ];
    }

    return users;
  });

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => <div>{row.getValue("user")}</div>,
      },
      {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => <div>{row.getValue("address")}</div>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;

          return (
            <Button
              className="text-white px-4 py-2 rounded-full bg-blue-600 text-sm md:text-base"
              onClick={() => {
                if (status !== "Approved") {
                  setData((prevData) =>
                    prevData.map((user) =>
                      user.user === row.original.user
                        ? { ...user, status: "Approved" }
                        : user
                    )
                  );
                }
              }}
            >
              {status}
            </Button>
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
    <Dialog open={open} onOpenChange={setOpen}>
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
                  <TableCell colSpan={3} className="text-center py-4">
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
