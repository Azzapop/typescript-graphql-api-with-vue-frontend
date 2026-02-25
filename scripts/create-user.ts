import 'dotenv/config';
import { logger } from '~libs/logger';
import { userRepo } from '~libs/repositories';
import { runWithTrace } from '~libs/trace-context';
import { generateTraceToken } from '~libs/trace-token';

const createUser = async () => {
  const username = process.env.SEED_USERNAME;
  const password = process.env.SEED_PASSWORD;

  if (!username || !password) {
    logger.error(
      'Missing required environment variables: SEED_USERNAME, SEED_PASSWORD'
    );
    process.exit(1);
  }

  const result = await userRepo.createWithLocalCredentials({
    username,
    password,
  });

  if (!result.success) {
    switch (result.error) {
      case 'UNEXPECTED_ERROR':
        logger.error('An unexpected error occurred while creating user.');
        process.exit(1);
      default:
        logger.info('Unable to create user, check the logs for more details.');
        return;
    }
  }

  logger.info('User created successfully:');
  logger.info(`  ID: ${result.data.id}`);
  logger.info(`  Username: ${username}`);
};

runWithTrace(
  { appName: 'create-user-script', traceToken: generateTraceToken() },
  createUser
);
