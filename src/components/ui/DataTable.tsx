// src/components/ui/DataTable.tsx
import { DataTable as MantineDataTable } from 'mantine-datatable';
import type { DataTableProps as MantineDataTableProps } from 'mantine-datatable';

// Extend the props to allow for more flexibility if needed in the future
interface DataTableProps<T> extends MantineDataTableProps<T> {
  // Add any custom props here
}

function DataTable<T>({ ...props }: DataTableProps<T>) {
  return (
    <MantineDataTable
      withBorder
      borderRadius="md"
      shadow="sm"
      highlightOnHover
      // Default props can be set here
      recordsPerPage={10}
      recordsPerPageOptions={[10, 25, 50]}
      {...props}
    />
  );
}

export default DataTable;
