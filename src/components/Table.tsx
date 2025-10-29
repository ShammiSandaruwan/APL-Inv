// src/components/Table.tsx
import React from 'react';

interface TableColumn {
  header: string;
  accessor: string;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  renderActions?: (item: any) => React.ReactNode;
}

const Table: React.FC<TableProps> = ({ columns, data, renderActions }) => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-background">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
            {renderActions && (
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-background transition-colors duration-200">
              {columns.map((col) => (
                <td key={col.accessor} className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                  {item[col.accessor]}
                </td>
              ))}
              {renderActions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {renderActions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
