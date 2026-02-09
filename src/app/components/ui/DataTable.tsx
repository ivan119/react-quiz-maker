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
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from '@mui/icons-material';
import {
  useState,
  useMemo,
  forwardRef,
  type ReactNode,
  useCallback,
} from 'react';
import { TableVirtuoso, type TableComponents } from 'react-virtuoso';
import { PreviewText } from './PreviewText';
import { Button } from './Button';

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
  // Header options
  title?: string;
  actions?: ReactNode;
  // Search options
  searchable?: boolean;
  searchFields?: (keyof T | string)[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  // Selection options
  selectedIds?: Set<string | number>;
  onSelectionChange?: (ids: Set<string | number>) => void;
  isRowSelectable?: (row: T) => boolean;
  showSelectionAction?: boolean;
  // Row styling
  getRowSx?: (row: T) => any;
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
  title,
  actions,
  searchValue: externalSearchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  searchable = false,
  searchFields,
  selectedIds,
  onSelectionChange,
  isRowSelectable,
  showSelectionAction = false,
  getRowSx,
}: DataTableProps<T>) => {
  const [internalSearchValue, setInternalSearchValue] = useState('');
  const [orderBy, setOrderBy] = useState<keyof T | string>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const searchValue =
    externalSearchValue !== undefined
      ? externalSearchValue
      : internalSearchValue;

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearchValue(value);
    }
    setPage(0);
  };

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

  // 1. Filter rows based on search
  const filteredRows = useMemo(() => {
    if (!searchable || !searchValue) return rows;

    const query = searchValue.toLowerCase();
    const fieldsToSearch = searchFields || columns.map((c) => c.id as string);

    return rows.filter((row: any) => {
      return fieldsToSearch.some((field) => {
        const value = row[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [rows, searchable, searchValue, searchFields, columns]);

  // 2. Sort the (filtered) rows
  const sortedRows = useMemo(() => {
    if (!orderBy) return filteredRows;

    return [...filteredRows].sort((a: any, b: any) => {
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
  }, [filteredRows, orderBy, order]);

  // 3. Apply pagination
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
      TableRow: ({ item, ...props }) => (
        <TableRow
          {...props}
          hover
          sx={{
            cursor: canEdit ? 'pointer' : 'default',
            ...(getRowSx ? getRowSx(item) : {}),
          }}
        />
      ),
      TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => (
        <tbody {...props} ref={ref} />
      )),
    }),
    [canEdit, getRowSx]
  );

  const fixedHeaderContent = useCallback(
    () => (
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
    ),
    [columns, orderBy, order, handleRequestSort]
  );

  const rowContent = useCallback(
    (index: number, row: T) => {
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
    },
    [columns, pagination, page, rowsPerPage, onRowClick]
  );

  // Selection logic
  const selectableVisibleRows = useMemo(() => {
    return filteredRows.filter((row) =>
      isRowSelectable ? isRowSelectable(row) : true
    );
  }, [filteredRows, isRowSelectable]);

  const isAllVisibleSelected = useMemo(() => {
    if (!selectedIds || selectableVisibleRows.length === 0) return false;
    return selectableVisibleRows.every(
      (row) => row.id !== undefined && selectedIds.has(row.id)
    );
  }, [selectedIds, selectableVisibleRows]);

  const handleToggleSelectAll = useCallback(() => {
    if (!onSelectionChange || !selectedIds) return;

    const next = new Set(selectedIds);
    if (isAllVisibleSelected) {
      selectableVisibleRows.forEach((row) => {
        if (row.id !== undefined) next.delete(row.id);
      });
    } else {
      selectableVisibleRows.forEach((row) => {
        if (row.id !== undefined) next.add(row.id);
      });
    }
    onSelectionChange(next);
  }, [
    isAllVisibleSelected,
    onSelectionChange,
    selectableVisibleRows,
    selectedIds,
  ]);

  const renderHeader = () => {
    if (!title && !actions && !searchable && !showSelectionAction) return null;
    return (
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          borderBottom: 1,
          borderColor: 'divider',
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
            flexGrow: 1,
          }}
        >
          {title && (
            <Box sx={{ flexShrink: 0 }}>
              <PreviewText
                variant="h5"
                component="h1"
                sx={{ fontWeight: 800 }}
                text={title}
              />
            </Box>
          )}

          {searchable && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              variant="outlined"
              sx={{
                width: { xs: '100%', sm: 300 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: 'background.paper',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" sx={{ fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            justifyContent: { xs: 'flex-start', md: 'flex-end' },
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {showSelectionAction && (
            <Button
              variant={isAllVisibleSelected ? 'contained' : 'outlined'}
              size="small"
              onClick={handleToggleSelectAll}
              icon={
                isAllVisibleSelected ? (
                  <CheckBoxIcon />
                ) : (
                  <CheckBoxOutlineBlankIcon />
                )
              }
              title={isAllVisibleSelected ? 'DESELECT' : 'SELECT ALL'}
              sx={{
                whiteSpace: 'nowrap',
                minWidth: 'fit-content',
                borderRadius: 3,
                fontWeight: 800,
                fontSize: '0.7rem',
              }}
            />
          )}

          {actions}
        </Box>
      </Box>
    );
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3 }}>
      {renderHeader()}
      {loading ? (
        <Box
          sx={{
            p: 8,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height,
          }}
        >
          <CircularProgress />
        </Box>
      ) : displayRows.length === 0 ? (
        <Box
          sx={{
            p: 8,
            textAlign: 'center',
            color: 'text.secondary',
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {searchValue ? 'No records match your search' : emptyMessage}
        </Box>
      ) : (
        <>
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
              count={filteredRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </>
      )}
    </Paper>
  );
};
