import {
  Table,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  CircularProgress,
  Box,
  TablePagination,
} from '@mui/material';
import { useState, useMemo, forwardRef, type ReactNode } from 'react';
import { TableVirtuoso, type TableComponents } from 'react-virtuoso';

export interface Column<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row: T, index: number) => ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  onRowClick?: (row: T, index?: number) => void;
  canEdit?: boolean;
  emptyMessage?: string;
  height?: number;
  // Pagination options
  pagination?: boolean;
  initialRowsPerPage?: number;
  rowsPerPageOptions?: number[];
}

export const DataTable = <T extends { id?: string | number }>({
  columns,
  rows,
  loading = false,
  onRowClick = () => {},
  canEdit = true,
  emptyMessage = 'No data available',
  height = 440,
  pagination = true,
  initialRowsPerPage = 25,
  rowsPerPageOptions = [10, 25, 50, 100],
}: DataTableProps<T>) => {
  const [orderBy, setOrderBy] = useState<keyof T | string>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handleRequestSort = (property: keyof T | string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedRows = useMemo(() => {
    if (!orderBy) return rows;

    return [...rows].sort((a: any, b: any) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (bValue < aValue) {
        return order === 'desc' ? -1 : 1;
      }
      if (bValue > aValue) {
        return order === 'desc' ? 1 : -1;
      }
      return 0;
    });
  }, [rows, orderBy, order]);

  // Apply pagination if enabled
  const displayRows = useMemo(() => {
    if (!pagination) return sortedRows;
    return sortedRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedRows, pagination, page, rowsPerPage]);

  // Virtuoso table components
  const VirtuosoTableComponents: TableComponents<T> = useMemo(
    () => ({
      Scroller: forwardRef<HTMLDivElement>((props, ref) => (
        <Box
          {...props}
          ref={ref}
          sx={{
            overflow: 'auto',
            '&::-webkit-scrollbar': { width: 8, height: 8 },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'divider',
              borderRadius: 4,
            },
          }}
        />
      )),
      Table: (props) => (
        <Table
          {...props}
          stickyHeader
          sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }}
        />
      ),
      TableHead: forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableHead {...props} ref={ref} />
      )),
      TableRow: ({ item: _item, ...props }) => (
        <TableRow
          {...props}
          hover
          sx={{ cursor: canEdit ? 'pointer' : 'default' }}
        />
      ),
      TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => (
        <tbody {...props} ref={ref} />
      )),
    }),
    [canEdit]
  );

  const fixedHeaderContent = () => (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.id.toString()}
          align={column.align}
          sx={{
            minWidth: column.minWidth,
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            zIndex: 2,
          }}
          sortDirection={orderBy === column.id ? order : false}
        >
          {column.sortable !== false ? (
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : 'asc'}
              onClick={() => handleRequestSort(column.id)}
            >
              {column.label}
            </TableSortLabel>
          ) : (
            column.label
          )}
        </TableCell>
      ))}
    </TableRow>
  );

  const rowContent = (index: number, row: T) => {
    // Calculate actual index for pagination
    const actualIndex = pagination ? page * rowsPerPage + index : index;
    return (
      <>
        {columns.map((column) => {
          const value = (row as any)[column.id];
          return (
            <TableCell
              key={column.id.toString()}
              align={column.align}
              onClick={() => onRowClick(row, actualIndex)}
            >
              {column.format ? column.format(value, row, actualIndex) : value}
            </TableCell>
          );
        })}
      </>
    );
  };

  if (loading) {
    return (
      <Paper
        sx={{ width: '100%', p: 4, display: 'flex', justifyContent: 'center' }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  if (rows.length === 0) {
    return (
      <Paper
        sx={{
          width: '100%',
          p: 4,
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        {emptyMessage}
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableVirtuoso
        style={{ height }}
        data={displayRows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
      {pagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};
