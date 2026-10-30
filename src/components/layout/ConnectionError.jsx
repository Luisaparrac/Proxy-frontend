export function ConnectionError({ message, onRetry }) {
  return (
    <div className="connection-error" role="alert">
      <h1>No hay conexión con el servidor</h1>
      <p>{message}</p>
      <p className="connection-error__hint">
        Si el backend acaba de desplegarse, espera unos segundos y vuelve a intentarlo.
      </p>
      <button type="button" className="button button--send" onClick={onRetry}>Reintentar</button>
    </div>
  );
}
