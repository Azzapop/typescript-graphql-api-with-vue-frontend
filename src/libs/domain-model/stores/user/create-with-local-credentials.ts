import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { logger } from '~libs/logger';
import type { User } from '../../models';
import { parsePrismaError, prisma } from '../../prisma';
import type { Result } from '../../types';

const SALT_ROUNDS = 10;

type CreateWithLocalCredentialsInput = {
  username: string;
  password: string;
};

type CreateWithLocalCredentialsError = 'USERNAME_EXISTS' | 'UNEXPECTED_ERROR';

export const createWithLocalCredentials = async (
  input: CreateWithLocalCredentialsInput
): Promise<Result<User, CreateWithLocalCredentialsError>> => {
  const { username, password } = input;

  logger.request.info(`Creating user with username "${username}"`);

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const tokenVersion = randomUUID();

  try {
    const data = await prisma.user.create({
      data: {
        tokenVersion,
        localCredentials: {
          create: {
            username,
            hashedPassword,
          },
        },
      },
    });
    logger.request.info(`User created with id "${data.id}"`);
    return { success: true, data };
  } catch (e) {
    const error = parsePrismaError(e);

    if (
      error.code === 'UNIQUE_CONSTRAINT' &&
      error.fields.includes('username')
    ) {
      logger.request.info(`Username "${username}" already exists`);
      return { success: false, error: 'USERNAME_EXISTS' };
    }

    logger.request.error(`Failed to create user: ${e}`);
    return { success: false, error: 'UNEXPECTED_ERROR' };
  }
};
