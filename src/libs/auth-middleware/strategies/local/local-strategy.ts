import bcrypt from 'bcrypt';
import type { VerifyFunction } from 'passport-local';
import { Strategy as LocalStrategy } from 'passport-local';
import { LocalCredentialsStore } from '~libs/domain-model';
import { logger } from '~libs/logger';

// passport-local calls the callback function type a different name
const verifyLocalCredentialsCallback: VerifyFunction = async (
  username,
  password,
  done
) => {
  const localCredentials = await LocalCredentialsStore.getWithUser(username);

  if (!localCredentials) {
    logger.request.info('No user found with the specified credentials');
    done(null, false);
    return;
  }

  // We retrieve and destructure the user in this way to ensure that we only
  // pass around the details of the users profile in the callback. This prevents
  // us from accidentally passing any credentials into the callback.
  const { hashedPassword, user } = localCredentials;

  const correctPassword = await bcrypt.compare(password, hashedPassword);
  if (!correctPassword) {
    logger.request.info('Specified password does not match given password.');
    done(null, false);
    return;
  }

  done(null, user);
};

export const localStrategy = new LocalStrategy(verifyLocalCredentialsCallback);
