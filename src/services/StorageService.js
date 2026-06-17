const USER_KEY = 'user';

export const StorageService = {
  getUser() {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser() {
    localStorage.removeItem(USER_KEY);
  }
};
