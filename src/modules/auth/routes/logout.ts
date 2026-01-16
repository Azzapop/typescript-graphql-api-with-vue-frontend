import { RefreshTokenStore } from '~libs/domain-model';
import { type Logout } from '~packages/auth-api-client';

export const logout: Logout.LogoutDelete.Handler = (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .json({
        code: 'UNAUTHORIZED',
        message: 'No authorized user, nothing to logout.',
      });
  }

  // Clear refresh token family
  const {
    user: { id: userId },
  } = req;
  RefreshTokenStore.clearTokenFamily(userId);

  return res
    .status(200)
    .clearCookie('access_token')
    .clearCookie('refresh_token')
    .json({ success: true });
};
