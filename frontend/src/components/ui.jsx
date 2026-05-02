export function PageHeader({ title, subtitle }) {
    return (
        <div className="page-heading">
            <h2>{title}</h2>
            <p>{subtitle}</p>
        </div>
    );
}

export function Panel({ title, children }) {
    return (
        <section className="panel">
            {title && <h3 className="panel-title">{title}</h3>}
            {children}
        </section>
    );
}

export function Field({ label, children }) {
    return (
        <label className="field">
            <span>{label}</span>
            {children}
        </label>
    );
}

export function Table({ columns, rows, renderRow }) {
    return (
        <div className="table-wrap">
            <table>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length}>No records found</td>
                        </tr>
                    ) : (
                        rows.map(renderRow)
                    )}
                </tbody>
            </table>
        </div>
    );
}
