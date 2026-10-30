import { apiClient } from './ApiClient';

/**
 * Loads the demo users and remembers the selected one in the browser.
 */
export class UserService {
  static STORAGE_KEY = 'ai-proxy:selected-user';

  constructor(client = apiClient) {
    this.client = client;
  }

  getUsers() {
    return this.client.get('/api/users');
  }

  getSavedUserId() {
    try {
      return localStorage.getItem(UserService.STORAGE_KEY);
    } catch {
      return null;
    }
  }

  saveUserId(userId) {
    try {
      localStorage.setItem(UserService.STORAGE_KEY, userId);
    } catch {
      // Storage may be blocked (private mode); the selection simply won't persist.
    }
  }
}

export const userService = new UserService();
