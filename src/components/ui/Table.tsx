import React, { ReactNode } from 'react';

interface Column {
  header: string;
  accessor: string;
}

interface TableProps {
  children?: ReactNode;
  columns?: Column[];
  data?: any[];
  actions?: (item: any) => ReactNode;
}

export const Table: React.FC<TableProps> = ({ children, columns, data, actions }) => {
  if (children) {
    return (
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-card-foreground">{children}</table>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-card-foreground">
        <thead className="bg-accent/5">
          <tr>
            {columns?.map((column, index) => (
              <th key={index} className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                {column.header}
              </th>
            ))}
            {actions && <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data?.map((item, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-accent/5 transition-colors">
              {columns?.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 text-sm">
                  {item[column.accessor]}
                </td>
              ))}
              {actions && <td className="px-6 py-4 text-sm">{actions(item)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const TableHeader: React.FC<TableProps> = ({ children }) => (
  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">{children}</thead>
);

export const TableBody: React.FC<TableProps> = ({ children }) => (
  <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
);

export const TableRow: React.FC<TableProps> = ({ children }) => (
  <tr className="transition-colors hover:bg-gray-50">{children}</tr>
);

export const TableHead: React.FC<TableProps> = ({ children }) => (
  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
    {children}
  </th>
);

export const TableCell: React.FC<TableProps> = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
    {children}
  </td>
);

