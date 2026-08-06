'use client'

import React from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import toast from 'react-hot-toast'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { usePendingUsers } from '@/hooks/usePendingUsers'

const ApproveUser = ({ open, onOpenChange, onChange }) => {
  const { users, isLoading, processingId, load, approve, reject } =
    usePendingUsers()

  React.useEffect(() => {
    if (!open) return

    load().then((result) => {
      if (!result.success) {
        toast.error(result.error || 'Failed to load pending users')
      }
    })
  }, [open, load])

  const handleDecision = React.useCallback(
    async (userId, decision) => {
      const isApproval = decision === 'approved'
      const result = await (isApproval ? approve(userId) : reject(userId))

      if (!result.success) {
        toast.error(
          result.error || `Failed to ${isApproval ? 'approve' : 'reject'} user`
        )
        return
      }

      toast.success(
        isApproval
          ? 'User approved successfully'
          : 'User rejected successfully'
      )
      onChange?.()
    },
    [approve, reject, onChange]
  )

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'User',
        cell: ({ row }) => <div>{row.getValue('name')}</div>,
      },
      {
        accessorKey: 'branch',
        header: 'Branch',
        cell: ({ row }) => <div>{row.getValue('branch')}</div>,
      },
      {
        accessorKey: 'codeNumber',
        header: 'Code Number',
        cell: ({ row }) => <div>{row.getValue('codeNumber')}</div>,
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const isProcessing = processingId === row.original.userId
          return (
            <div className="flex flex-col md:flex-row items-center justify-center gap-2">
              <Button
                className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs md:text-sm w-full md:w-auto"
                disabled={isProcessing}
                onClick={() => handleDecision(row.original.userId, 'approved')}
              >
                {isProcessing ? <Spinner /> : 'Approve'}
              </Button>

              <Button
                className="bg-red-600 text-white px-3 py-1 rounded-full text-xs md:text-sm w-full md:w-auto"
                disabled={isProcessing}
                onClick={() => handleDecision(row.original.userId, 'rejected')}
              >
                {isProcessing ? <Spinner /> : 'Reject'}
              </Button>
            </div>
          )
        },
      },
    ],
    [processingId, handleDecision]
  )

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md md:max-w-lg lg:max-w-4xl mx-auto p-4 sm:p-6 gap-3 sm:gap-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Approve User
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="size-6" />
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block border rounded-lg overflow-x-auto">
                <Table className="min-w-full text-sm md:text-base">
                  <TableHeader>
                    {table.getHeaderGroups().map((hg) => (
                      <TableRow key={hg.id}>
                        {hg.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className="px-4 py-2 text-center"
                          >
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
                            <TableCell
                              key={cell.id}
                              className="px-4 py-2 text-center"
                            >
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
                          No pending users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => {
                    const isProcessing = processingId === row.original.userId
                    return (
                      <div
                        key={row.id}
                        className="border rounded-lg p-4 bg-white shadow-sm"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-600 text-xs sm:text-sm">
                              User
                            </span>
                            <span className="font-medium text-xs sm:text-sm">
                              {row.original.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-600 text-xs sm:text-sm">
                              Branch
                            </span>
                            <span className="font-medium text-xs sm:text-sm">
                              {row.original.branch}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-600 text-xs sm:text-sm">
                              Code Number
                            </span>
                            <span className="font-medium text-xs sm:text-sm">
                              {row.original.codeNumber}
                            </span>
                          </div>
                          <div className="pt-3 border-t">
                            <div className="flex flex-col gap-2">
                              <Button
                                className="bg-blue-600 text-white px-3 py-2 rounded-full text-xs sm:text-sm w-full"
                                disabled={isProcessing}
                                onClick={() =>
                                  handleDecision(row.original.userId, 'approved')
                                }
                              >
                                {isProcessing ? <Spinner /> : 'Approve'}
                              </Button>

                              <Button
                                className="bg-red-600 text-white px-3 py-2 rounded-full text-xs sm:text-sm w-full"
                                disabled={isProcessing}
                                onClick={() =>
                                  handleDecision(row.original.userId, 'rejected')
                                }
                              >
                                {isProcessing ? <Spinner /> : 'Reject'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No pending users found.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ApproveUser
