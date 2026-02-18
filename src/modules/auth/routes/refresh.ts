import { type Refresh } from '~packages/auth-api-client';

export const refresh: Refresh.RefreshCreate.Handler = async (req, res) => {
  const { id: userId } = req.getUser();
  return res.status(200).json({ user: { id: userId } });
};
