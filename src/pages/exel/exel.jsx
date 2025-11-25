import React, { useState } from 'react';

export default function InteractiveSpreadsheet() {
  // Inicjalne dane - 30 wierszy x 14 kolumn (A-N)
  const [data, setData] = useState(
    Array(30).fill(null).map(() => 
      Array(14).fill(null).map(() => ({ value: '' }))
    )
  );

  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
  
  const handleCellChange = (rowIndex, colIndex, newValue) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = { value: newValue };
    setData(newData);
  };

  return (
    <div className="w-full h-screen bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-300 p-2 bg-gray-50 flex items-center gap-2">
        <button className="px-3 py-1 text-sm hover:bg-gray-200 rounded">File</button>
        <button className="px-3 py-1 text-sm hover:bg-gray-200 rounded">Edit</button>
        <button className="px-3 py-1 text-sm hover:bg-gray-200 rounded">View</button>
        <button className="px-3 py-1 text-sm hover:bg-gray-200 rounded">Insert</button>
      </div>

      {/* Spreadsheet */}
      <div className="overflow-auto" style={{ height: 'calc(100vh - 48px)' }}>
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-100 w-12 h-8 text-xs sticky left-0 z-10"></th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="border border-gray-300 bg-gray-100 min-w-[120px] h-8 text-xs font-semibold"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border border-gray-300 bg-gray-100 w-12 h-8 text-center text-xs font-semibold sticky left-0 z-10">
                  {rowIndex + 1}
                </td>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-gray-300 p-0 min-w-[120px] h-8"
                  >
                    <input
                      type="text"
                      value={cell.value}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      className="w-full h-full px-2 outline-none focus:ring-2 focus:ring-blue-500 focus:z-20"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}