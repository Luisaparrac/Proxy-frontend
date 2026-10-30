import { useCallback, useEffect, useState } from 'react';
import { userService } from '../services/UserService';

/**
 * Loads the demo users and keeps the selected one.
 */
export function useUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const list = await userService.getUsers();
      setUsers(list);
      setError(null);
      const saved = userService.getSavedUserId();
      const initial = list.find((user) => user.id === saved) ?? list[0];
      setSelectedUserId((current) => current ?? initial?.id ?? null);
    } catch (e) {
      setError(e);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selectUser = useCallback((userId) => {
    setSelectedUserId(userId);
    userService.saveUserId(userId);
  }, []);

  return { users, selectedUserId, selectUser, error, reload: load };
}
