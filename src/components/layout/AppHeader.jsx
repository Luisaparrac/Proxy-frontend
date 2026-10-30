import { PlanBadge } from '../quota/PlanBadge';

export function AppHeader({ users, selectedUserId, onSelectUser, plan }) {
  return (
    <header className="app-header">
      <div className="brand">
        <svg className="brand__mark" viewBox="0 0 32 32" aria-hidden="true">
          <rect x="6" y="18" width="4" height="8" rx="1" />
          <rect x="12" y="13" width="4" height="13" rx="1" />
          <rect x="18" y="9" width="4" height="17" rx="1" />
          <rect x="24" y="5" width="4" height="21" rx="1" className="brand__mark-empty" />
        </svg>
        <span className="brand__name">Medidor IA</span>
      </div>

      <div className="user-picker">
        <label htmlFor="user-select" className="user-picker__label">Usuario</label>
        <select
          id="user-select"
          className="user-picker__select"
          value={selectedUserId ?? ''}
          onChange={(event) => onSelectUser(event.target.value)}
          disabled={!users.length}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        <PlanBadge plan={plan} />
      </div>
    </header>
  );
}
