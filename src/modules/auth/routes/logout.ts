import { refreshTokenRepo, userRepo } from '~libs/repositories';
import { type Logout } from '~packages/auth-api-client';

export const logout: Logout.LogoutDelete.Handler = async (req, res) => {
  const { id: userId } = req.getUser();
  // Rotate token version and clear refresh token family
  await userRepo.rotateTokenVersion(userId);
  await refreshTokenRepo.clearTokenFamily(userId);
  return res.status(200).json({ success: true });
};
