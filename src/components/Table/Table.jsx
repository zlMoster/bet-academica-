const Table = ({ columns, children, emptyMessage = 'Nenhum registro encontrado.' }) => (
  <table className="data-table">
    <thead>
      <tr>
        {columns.map((col) => (
          <th key={col.key || col}>{col.label || col}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {children}
    </tbody>
  </table>
);

export default Table;
