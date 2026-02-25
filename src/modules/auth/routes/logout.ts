import { RefreshTokenStore, UserStore } from '~libs/domain-model';
import { type Logout } from '~packages/auth-api-client';

export const logout: Logout.LogoutDelete.Handler = async (req, res) => {
  const { id: userId } = req.getUser();
  // Rotate token version and clear refresh token family
  await UserStore.rotateTokenVersion(userId);
  await RefreshTokenStore.clearTokenFamily(userId);
  return res.status(200).json({ success: true });
};
