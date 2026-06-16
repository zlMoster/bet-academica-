const Table = ({ data }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
    <thead style={{ backgroundColor: 'var(--blue-light)' }}>
      <tr>
        <th>Evento</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {data.map(item => (
        <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
          <td>{item.nome}</td>
          <td>{item.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
export default Table;