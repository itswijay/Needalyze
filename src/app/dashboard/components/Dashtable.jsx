'use client'

import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpDown, ChevronDown, Eye, Search } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { formatCurrency } from '@/domain/services/money'
import { statusVariant } from '@/application/view-models/formStatusView'
import { useMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/** Columns hidden on small screens, by index. */
const MOBILE_HIDDEN_COLUMNS = new Set([1, 2, 3])

const mobileHiddenClass = (index) =>
  MOBILE_HIDDEN_COLUMNS.has(index) ? 'hidden sm:table-cell' : ''

const SortableHeader = ({ column, children }) => (
  <Button
    variant="ghost"
    size="sm"
    className="-ml-2 h-8 cursor-pointer gap-1.5 px-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase hover:bg-transparent hover:text-foreground"
    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  >
    {children}
    <ArrowUpDown className="size-3.5" />
  </Button>
)

export const columns = [
  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => {
      const userName = row.getValue('user')
      const displayName =
        userName.length > 15 ? `${userName.substring(0, 15)}...` : userName
      return (
        <div className="font-medium capitalize" title={userName}>
          {displayName}
        </div>
      )
    },
  },
  {
    accessorKey: 'need',
    header: 'Need',
    cell: ({ row }) => {
      const need = row.getValue('need')
      const displayNeed = need.length > 30 ? `${need.substring(0, 30)}...` : need
      return (
        <div className="capitalize text-muted-foreground" title={need}>
          {displayNeed}
        </div>
      )
    },
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => (
      <div className="capitalize text-muted-foreground">
        {row.getValue('address')}
      </div>
    ),
  },

  {
    id: 'date',
    accessorKey: 'date',
    header: ({ column }) => <SortableHeader column={column}>Date</SortableHeader>,
    cell: ({ row }) => {
      const raw = row.getValue('date')
      if (!raw) return <div className="date" />
      const parsed = new Date(raw)

      if (isNaN(parsed.getTime())) return <div className="date">{raw}</div>

      const formatted = parsed.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
      return <div className="text-muted-foreground">{formatted}</div>
    },
  },

  {
    accessorKey: 'actualHumanLifeValue',
    header: ({ column }) => (
      <SortableHeader column={column}>
        <span className="inline sm:hidden">AHL. Val</span>
        <span className="hidden sm:inline">Actual Human Life Value</span>
      </SortableHeader>
    ),
    cell: ({ row }) => {
      // formatCurrency rather than a bare `Rs.{value}`: the detail dialog
      // already grouped its digits, so the same figure was shown two ways.
      const value = Number(row.getValue('actualHumanLifeValue')) || 0
      return <div className="tabular-figures font-medium">{formatCurrency(value)}</div>
    },
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status')
      return (
        <Badge variant={statusVariant(status)} className="capitalize">
          {status}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <CustomerDetailDialog customer={row.original} />,
  },
]

/** The receipt-style detail view behind the eye icon on each row. */
function CustomerDetailDialog({ customer }) {
  const rows = [
    ['Name', customer.user],
    ['Address', customer.address],
    [
      'Date',
      new Date(customer.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    ],
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="View form">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Customer Details
          </DialogTitle>
          <DialogDescription className="sr-only">
            Detailed view of customer need analysis submission.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex justify-center border-b border-border pb-5">
            <Image
              src="/images/logos/secondary-t.png"
              width={100}
              height={100}
              alt="Needalyze"
              className="h-auto w-24 dark:brightness-0 dark:invert"
              priority
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-2xl bg-surface-sunken p-4">
              <h3 className="mb-3 border-b border-border pb-2 text-sm font-semibold">
                Personal Details
              </h3>
              <dl className="space-y-2 text-sm">
                {rows.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-right font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-2xl bg-surface-sunken p-4">
              <h3 className="mb-3 border-b border-border pb-2 text-sm font-semibold">
                Financial Details
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Need Type</dt>
                  <dd className="text-right font-medium">{customer.need}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">
                    Actual Human Life Value
                  </dt>
                  <dd className="text-right font-bold text-success-foreground">
                    {formatCurrency(customer.actualHumanLifeValue)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>
                    <Badge
                      variant={statusVariant(customer.status)}
                      className="capitalize"
                    >
                      {customer.status}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          <div className="rounded-2xl border-l-4 border-primary-200 bg-accent/40 p-4">
            <h3 className="mb-1.5 font-semibold text-accent-foreground">Summary</h3>
            <p className="text-sm leading-relaxed text-accent-foreground/80">
              Customer <strong>{customer.user}</strong> has a{' '}
              <strong>{customer.need}</strong> need with an actual human life
              value of{' '}
              <strong>{formatCurrency(customer.actualHumanLifeValue)}</strong>.
              Current status: <strong>{customer.status}</strong>
            </p>
          </div>

          <div className="border-t border-border pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Generated on{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              This is a digitally generated receipt.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * @param {{ formData: import('@/application/view-models/needAnalysisRow').toRow[] }} props
 *   rows arrive already shaped by the application layer; this component no
 *   longer knows any database column names.
 */
export function DataTable({ formData }) {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const m = useMotion()

  const Customer = React.useMemo(
    () => (Array.isArray(formData) ? formData : []),
    [formData]
  )

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
  })

  const rows = table.getRowModel().rows

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 py-4">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter name..."
            value={table.getColumn('user')?.getFilterValue() ?? ''}
            onChange={(event) =>
              table.getColumn('user')?.setFilterValue(event.target.value)
            }
            className="pl-10"
          />
        </div>
        <div className="hidden lg:flex">
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
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header, index) => (
                  <TableHead key={header.id} className={mobileHiddenClass(index)}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {/* popLayout so rows filtered out animate away while the survivors
                slide up to close the gap, instead of the list snapping. */}
            <AnimatePresence initial={false} mode="popLayout">
              {rows.length ? (
                rows.map((row, rowIndex) => (
                  <motion.tr
                    key={row.id}
                    layout={!m.reduce}
                    data-state={row.getIsSelected() && 'selected'}
                    initial={{ opacity: 0, y: m.reduce ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: m.reduce ? 0 : -8 }}
                    transition={{
                      duration: m.duration(0.22),
                      delay: m.duration(Math.min(rowIndex, 8) * 0.03),
                    }}
                    className={cn(
                      'border-b border-border transition-colors duration-150',
                      'hover:bg-surface-hover data-[state=selected]:bg-accent/40'
                    )}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell key={cell.id} className={mobileHiddenClass(index)}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow key="empty" className="hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    <p className="font-medium text-muted-foreground">
                      No forms yet
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground/70">
                      Create a link and share it with a customer to get started.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
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
  )
}
