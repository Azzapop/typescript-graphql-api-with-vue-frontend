import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { parsePrismaError, prisma } from '~database';
import { generateTokenVersion } from '~libs/auth-tokens';
import { logger } from '~libs/logger';
import type { Result } from '~libs/result';
import type { RepositoryError } from '../repository-types';
import { handleRepositoryError } from '../handle-repository-error';

const SALT_ROUNDS = 10;

type CreateWithLocalCredentialsInput = {
  username: string;
  password: string;
};

export const createWithLocalCredentials = async (
  input: CreateWithLocalCredentialsInput
): Promise<Result<User, RepositoryError>> => {
  const { username, password } = input;

  logger.info(`Creating user with username "${username}"`);

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const tokenVersion = generateTokenVersion();

  try {
    const data = await prisma().user.create({
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
    logger.info(`User created with id "${data.id}"`);
    return { success: true, data };
  } catch (e) {
    const parsed = parsePrismaError(e);
    logger.error('Failed to create user');
    return handleRepositoryError(parsed);
  }
};
