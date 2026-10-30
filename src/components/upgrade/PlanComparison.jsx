import { PLANS } from '../../constants/plans';
import { formatNumber } from '../../utils/format';

const ROWS = [
  { label: 'Solicitudes por minuto', value: (plan) => formatNumber(plan.requestsPerMinute) },
  { label: 'Tokens al mes', value: (plan) => formatNumber(plan.monthlyTokens) },
  { label: 'Precio mensual', value: (plan) => (plan.priceUsd ? `USD ${plan.priceUsd.toFixed(2)}` : 'Gratis') },
];

export function PlanComparison() {
  return (
    <table className="plan-table">
      <thead>
        <tr>
          <th scope="col"><span className="visually-hidden">Característica</span></th>
          <th scope="col">Free</th>
          <th scope="col" className="plan-table__target">Pro</th>
        </tr>
      </thead>
      <tbody>
        {ROWS.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}</th>
            <td>{row.value(PLANS.FREE)}</td>
            <td className="plan-table__target">{row.value(PLANS.PRO)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
