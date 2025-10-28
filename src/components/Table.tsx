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
    <div className="bg-white border border-gin-dark rounded-lg overflow-hidden shadow-subtle">
      <table className="min-w-full">
        <thead className="bg-gin-light">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                scope="col"
                className="px-6 py-4 text-left text-sm font-semibold text-mine-shaft uppercase tracking-wider"
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
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gin-light border-b border-gin-dark last:border-b-0">
              {columns.map((col) => (
                <td key={col.accessor} className="px-6 py-5 whitespace-nowrap text-base text-mine-shaft">
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
