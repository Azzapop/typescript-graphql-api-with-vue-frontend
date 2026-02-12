import { type Login } from '~packages/auth-api-client';

export const loginLocal: Login.LocalCreate.Handler = async (req, res) => {
  const { id: userId } = req.getUser();
  return res.status(200).json({ user: { id: userId } });
};
