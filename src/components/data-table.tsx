"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowClick?: (row: TData) => void
}

/**
 * Renders a customizable data table with support for dynamic columns, row selection, and optional row click handling.
 *
 * Displays tabular data using the provided column definitions and data array. If no data is present, shows a "No results" message. When a row is clicked, invokes the optional `onRowClick` callback with the original row data.
 *
 * @param columns - Column definitions describing how each column should be rendered
 * @param data - Array of data objects to display in the table
 * @param onRowClick - Optional callback invoked with the original row data when a row is clicked
 *
 * @template TData - The type of each data object in the table
 * @template TValue - The type of the value rendered in each cell
 */
export function DataTable<TData, TValue>({
    columns,
    data,
    onRowClick,

}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-lg border bg-background overflow-hidden">
      <Table>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="cursor-pointer"
                onClick={()=>onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-sm p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-19 text-center text-muted-foreground">
                No results
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}