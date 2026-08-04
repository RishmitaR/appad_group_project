interface DynamicTableProps<T extends Record<string, any>> {
    data: T[];
    editableColumns?: string[];
    onCellChange?: (rowIndex: number, column: string, value: string | number) => void;
}

function DynamicTable<T extends Record<string, any>>({
  data,
  editableColumns = [],
  onCellChange,
}: DynamicTableProps<T>) {
  if (!data || data.length === 0) return <div>No data available</div>;

  const columns = Object.keys(data[0]);

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col} style={{ border: '1px solid #ddd', padding: '8px' }}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col) => {
              const isEditable = editableColumns.includes(col);

              return (
                <td key={col} style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {isEditable ? (
                    <input
                      type="number"
                      min={0}
                      value={row[col] === 0 ? '': row[col]}
                      onChange={(e) => onCellChange?.(rowIndex, col, Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    row[col]
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DynamicTable;