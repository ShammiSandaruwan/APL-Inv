// src/components/ui/DataTable.tsx
import { DataTable as MantineDataTable } from 'mantine-datatable';
import type { DataTableProps as MantineDataTableProps } from 'mantine-datatable';

function DataTable<T>(props: MantineDataTableProps<T>) {
  return <MantineDataTable {...props} />;
}

export default DataTable;
