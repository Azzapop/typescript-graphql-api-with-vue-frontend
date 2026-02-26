import bcrypt from 'bcrypt';
import type { VerifyFunctionWithRequest } from 'passport-local';
import { Strategy as LocalStrategy } from 'passport-local';
import { logger } from '~libs/logger';
import { localCredentialsRepo } from '~libs/repositories';

// passport-local calls the callback function type a different name
const verifyLocalCredentialsCallback: VerifyFunctionWithRequest = async (
  req,
  username,
  password,
  done
) => {
  try {
    const credentialsResult = await localCredentialsRepo.getWithUser(username);

    if (!credentialsResult.success) {
      logger.error(
        `Failed to look up credentials during login [${credentialsResult.error}]`
      );
      done(null, false);
      return;
    }

    if (!credentialsResult.data) {
      logger.info('No user found with the specified credentials');
      done(null, false);
      return;
    }

    // We retrieve and destructure the user in this way to ensure that we only
    // pass around the details of the users profile in the callback. This prevents
    // us from accidentally passing any credentials into the callback.
    const {
      data: { hashedPassword, user },
    } = credentialsResult;

    const correctPassword = await bcrypt.compare(password, hashedPassword);
    if (!correctPassword) {
      logger.info('Specified password does not match given password.');
      done(null, false);
      return;
    }

    req.issueNewTokens = true;
    done(null, user);
  } catch (err) {
    done(err);
  }
};

export const localCredentialsStrategy = new LocalStrategy(
  { passReqToCallback: true },
  verifyLocalCredentialsCallback
);
