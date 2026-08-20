'use client'

import React from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
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
import { useMotion } from '@/lib/motion'

const ApproveUser = ({ open, onOpenChange, onChange }) => {
  const { users, isLoading, processingId, load, approve, reject } =
    usePendingUsers()
  const m = useMotion()

  React.useEffect(() => {
    if (!open) return

    // Initial load: show spinner only if we don't already have user data loaded
    load({ silent: users.length > 0 }).then((result) => {
      if (!result?.success && result?.error) {
        toast.error(result.error || 'Failed to load pending users')
      }
    })

    // Silent background poll while modal stays open
    const timer = setInterval(() => {
      load({ silent: true })
    }, 10000)

    return () => clearInterval(timer)
  }, [open, load, users.length])

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
            <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
              <Button
                variant="accent"
                size="sm"
                className="w-full md:w-auto"
                disabled={isProcessing}
                onClick={() => handleDecision(row.original.userId, 'approved')}
              >
                {isProcessing ? <Spinner /> : <Check className="size-3.5" />}
                Approve
              </Button>

              <Button
                variant="destructive"
                size="sm"
                className="w-full md:w-auto"
                disabled={isProcessing}
                onClick={() => handleDecision(row.original.userId, 'rejected')}
              >
                {isProcessing ? <Spinner /> : <X className="size-3.5" />}
                Reject
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
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
              <div className="hidden overflow-x-auto rounded-2xl border border-border md:block">
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
                        <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                          No pending users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="space-y-4 md:hidden">
                <AnimatePresence initial={false}>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => {
                    const isProcessing = processingId === row.original.userId
                    return (
                      <motion.div
                        key={row.id}
                        layout={!m.reduce}
                        initial={{ opacity: 0, y: m.reduce ? 0 : 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: m.reduce ? 1 : 0.96 }}
                        transition={{ duration: m.duration(0.22) }}
                        className="rounded-2xl border border-border bg-surface-raised p-4 shadow-sm"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                              User
                            </span>
                            <span className="text-xs font-medium sm:text-sm">
                              {row.original.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                              Branch
                            </span>
                            <span className="text-xs font-medium sm:text-sm">
                              {row.original.branch}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                              Code Number
                            </span>
                            <span className="text-xs font-medium sm:text-sm">
                              {row.original.codeNumber}
                            </span>
                          </div>
                          <div className="border-t border-border pt-3">
                            <div className="flex flex-col gap-2">
                              <Button
                                variant="accent"
                                className="w-full"
                                disabled={isProcessing}
                                onClick={() =>
                                  handleDecision(row.original.userId, 'approved')
                                }
                              >
                                {isProcessing ? <Spinner /> : <Check className="size-4" />}
                                Approve
                              </Button>

                              <Button
                                variant="destructive"
                                className="w-full"
                                disabled={isProcessing}
                                onClick={() =>
                                  handleDecision(row.original.userId, 'rejected')
                                }
                              >
                                {isProcessing ? <Spinner /> : <X className="size-4" />}
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No pending users found.
                  </div>
                )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ApproveUser
