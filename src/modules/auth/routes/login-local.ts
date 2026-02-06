import { issueTokens, accessTokens, refreshTokens } from '~libs/auth-tokens';
import { type Login } from '~packages/auth-api-client';

export const loginLocal: Login.LocalCreate.Handler = async (req, res) => {
  if (!req.user) {
    // Not authed correctly, can't generate tokens, return to login page
    return res
      .status(401)
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .json({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
  }

  // Generate and set tokens
  const { accessToken, refreshToken } = await issueTokens(req.user);
  const {
    user: { id: userId },
  } = req;
  return res
    .status(200)
    .cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: accessTokens.ACCESS_TTL_SECONDS,
    })
    .cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshTokens.REFRESH_TTL_SECONDS,
    })
    .json({ user: { id: userId } });
};
