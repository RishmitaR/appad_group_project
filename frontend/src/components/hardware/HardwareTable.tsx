interface DynamicTableProps<T extends Record<string, any>> {
    data: T[]
}

function DynamicTable<T extends Record<string, any>>({ data }: DynamicTableProps<T>) {
  if (!data || data.length === 0) return <div>No data available</div>;

  // Extract columns from the first row's keys
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
            {columns.map((col) => (
              <td key={col} style={{ border: '1px solid #ddd', padding: '8px' }}>
                {row[col]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DynamicTable;