import bcrypt from 'bcrypt';
import type { VerifyFunctionWithRequest } from 'passport-local';
import { Strategy as LocalStrategy } from 'passport-local';
import { LocalCredentialsStore } from '~libs/domain-model';
import { logger } from '~libs/logger';

// passport-local calls the callback function type a different name
const verifyLocalCredentialsCallback: VerifyFunctionWithRequest = async (
  req,
  username,
  password,
  done
) => {
  const credentialsResult =
    await LocalCredentialsStore.getWithUser(username);

  if (!credentialsResult.success || !credentialsResult.data) {
    logger.info('No user found with the specified credentials');
    done(null, false);
    return;
  }

  // We retrieve and destructure the user in this way to ensure that we only
  // pass around the details of the users profile in the callback. This prevents
  // us from accidentally passing any credentials into the callback.
  const { data: { hashedPassword, user } } = credentialsResult;

  const correctPassword = await bcrypt.compare(password, hashedPassword);
  if (!correctPassword) {
    logger.info('Specified password does not match given password.');
    done(null, false);
    return;
  }

  req.issueNewTokens = true;
  done(null, user);
};

export const localCredentialsStrategy = new LocalStrategy(
  { passReqToCallback: true },
  verifyLocalCredentialsCallback
);
