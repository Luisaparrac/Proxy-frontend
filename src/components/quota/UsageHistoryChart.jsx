import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCompact, formatNumber, formatShortDay } from '../../utils/format';

function HistoryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const day = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <strong>{day.label}</strong>
      <span>{formatNumber(day.tokens)} tokens</span>
      <span>{formatNumber(day.requests)} solicitudes</span>
    </div>
  );
}

/**
 * Bar chart of tokens consumed per day over the last 7 days.
 */
export function UsageHistoryChart({ history }) {
  const data = history.map((day, index) => ({
    ...day,
    label: formatShortDay(day.date),
    isToday: index === history.length - 1,
  }));
  const weekTotal = history.reduce((sum, day) => sum + day.tokens, 0);

  return (
    <section className="history" aria-label="Historial de uso de los últimos 7 días">
      <div className="history__header">
        <h2 className="history__title">Últimos 7 días</h2>
        <p className="history__total">{formatNumber(weekTotal)} tokens</p>
      </div>

      <div className="history__chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 0, left: -18, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--line)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted)' }} />
            <YAxis tickFormatter={formatCompact} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted)' }} />
            <Tooltip content={<HistoryTooltip />} cursor={{ fill: 'var(--hover)' }} />
            <Bar
              dataKey="tokens"
              maxBarSize={28}
              shape={(props) => (
                <rect
                  x={props.x}
                  y={props.y}
                  width={props.width}
                  height={Math.max(0, props.height)}
                  rx={3}
                  fill={props.payload.isToday ? 'var(--ink)' : 'var(--bar)'}
                />
              )}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="history__note">La barra oscura es hoy.</p>
    </section>
  );
}
