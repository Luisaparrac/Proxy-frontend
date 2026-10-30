import { PLANS } from '../../constants/plans';

export function PlanBadge({ plan }) {
  if (!plan) return null;
  return (
    <span className={`plan-badge plan-badge--${plan.toLowerCase()}`} title={`Plan ${PLANS[plan]?.label ?? plan}`}>
      {plan}
    </span>
  );
}
