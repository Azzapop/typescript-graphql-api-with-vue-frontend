import type { NavigationGuard } from 'vue-router';
import { HttpClient, RefreshClient } from '~packages/auth-api-client';
import { useAuthStore } from '../stores/auth-store';

const httpClient = new HttpClient({ baseURL: '/auth', withCredentials: true });
const refreshClient = new RefreshClient(httpClient);

export const authGuard: NavigationGuard = async (to) => {
  if (to.meta.public) {
    return true;
  }

  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    return true;
  }

  // Try to refresh the token
  try {
    const response = await refreshClient.refreshCreate();
    if (response.data.user?.id) {
      authStore.setUser(response.data.user.id);
      return true;
    }
  } catch {
    // Refresh failed, continue to redirect
  }

  return { name: 'login', query: { returnUrl: to.fullPath } };
};
