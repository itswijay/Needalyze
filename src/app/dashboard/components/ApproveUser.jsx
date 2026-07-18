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
import { getPendingUsers, approveUser, rejectUser } from '@/lib/admin'

const mapProfileToRow = (profile) => ({
  user_id: profile.user_id,
  user:
    `${profile.first_name || ''} ${profile.last_name || ''}`.trim() ||
    'Unknown',
  branch: profile.branch || 'Not Provided',
  code_num: profile.code_number || 'Not Provided',
})

const ApproveUser = ({ open, onOpenChange, onChange }) => {
  const [data, setData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [processingId, setProcessingId] = React.useState(null)

  const loadPendingUsers = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const { success, profiles, error } = await getPendingUsers()

      if (success) {
        setData((profiles || []).map(mapProfileToRow))
      } else {
        toast.error(error || 'Failed to load pending users')
        setData([])
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (open) {
      loadPendingUsers()
    }
  }, [open, loadPendingUsers])

  const handleDecision = async (userId, decision) => {
    setProcessingId(userId)
    try {
      const action = decision === 'approved' ? approveUser : rejectUser
      const { success, error } = await action(userId)

      if (!success) {
        toast.error(
          error ||
            `Failed to ${decision === 'approved' ? 'approve' : 'reject'} user`
        )
        return
      }

      toast.success(
        decision === 'approved'
          ? 'User approved successfully'
          : 'User rejected successfully'
      )
      setData((prev) => prev.filter((user) => user.user_id !== userId))
      onChange?.()
    } finally {
      setProcessingId(null)
    }
  }

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'user',
        header: 'User',
        cell: ({ row }) => <div>{row.getValue('user')}</div>,
      },
      {
        accessorKey: 'branch',
        header: 'Branch',
        cell: ({ row }) => <div>{row.getValue('branch')}</div>,
      },
      {
        accessorKey: 'code_num',
        header: 'Code Number',
        cell: ({ row }) => <div>{row.getValue('code_num')}</div>,
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const isProcessing = processingId === row.original.user_id
          return (
            <div className="flex flex-col md:flex-row items-center justify-center gap-2">
              <Button
                className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs md:text-sm w-full md:w-auto"
                disabled={isProcessing}
                onClick={() => handleDecision(row.original.user_id, 'approved')}
              >
                {isProcessing ? <Spinner /> : 'Approve'}
              </Button>

              <Button
                className="bg-red-600 text-white px-3 py-1 rounded-full text-xs md:text-sm w-full md:w-auto"
                disabled={isProcessing}
                onClick={() => handleDecision(row.original.user_id, 'rejected')}
              >
                {isProcessing ? <Spinner /> : 'Reject'}
              </Button>
            </div>
          )
        },
      },
    ],
    [processingId]
  )

  const table = useReactTable({
    data,
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
                    const isProcessing = processingId === row.original.user_id
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
                              {row.original.user}
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
                              {row.original.code_num}
                            </span>
                          </div>
                          <div className="pt-3 border-t">
                            <div className="flex flex-col gap-2">
                              <Button
                                className="bg-blue-600 text-white px-3 py-2 rounded-full text-xs sm:text-sm w-full"
                                disabled={isProcessing}
                                onClick={() =>
                                  handleDecision(row.original.user_id, 'approved')
                                }
                              >
                                {isProcessing ? <Spinner /> : 'Approve'}
                              </Button>

                              <Button
                                className="bg-red-600 text-white px-3 py-2 rounded-full text-xs sm:text-sm w-full"
                                disabled={isProcessing}
                                onClick={() =>
                                  handleDecision(row.original.user_id, 'rejected')
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
