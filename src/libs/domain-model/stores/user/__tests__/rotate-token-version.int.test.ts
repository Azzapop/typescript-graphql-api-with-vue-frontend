import { defineUserFactory } from '#test/factories/prisma';
import { cleanWorkerDatabase } from '#test/integration';
import { PrismaClient } from '@prisma/client';
import { beforeEach, describe, expect, it } from 'vitest';
import { rotateTokenVersion } from '../rotate-token-version';

const setup = () => ({
  UserFactory: defineUserFactory(),
});

const prisma = new PrismaClient();

describe('rotateTokenVersion (integration)', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  it('tokenVersion changes after rotation', async () => {
    const { UserFactory } = setup();
    const user = await UserFactory.create();

    await rotateTokenVersion(user.id);

    const updatedUser = await prisma.user.findFirst({ where: { id: user.id } });

    expect(updatedUser?.tokenVersion).not.toBe(user.tokenVersion);
  });

  it('new tokenVersion is unique across multiple rotations', async () => {
    const { UserFactory } = setup();
    const user = await UserFactory.create();

    const versions: string[] = [user.tokenVersion];

    for (let i = 0; i < 5; i++) {
      await rotateTokenVersion(user.id);
      const updated = await prisma.user.findFirst({ where: { id: user.id } });
      if (updated) {
        versions.push(updated.tokenVersion);
      }
    }

    const uniqueVersions = new Set(versions);
    expect(uniqueVersions.size).toBe(versions.length);
  });

  it('only rotates the specified user', async () => {
    const { UserFactory } = setup();
    const user1 = await UserFactory.create();
    const user2 = await UserFactory.create();
    const user3 = await UserFactory.create();

    await rotateTokenVersion(user2.id);

    const user1After = await prisma.user.findFirst({ where: { id: user1.id } });
    const user2After = await prisma.user.findFirst({ where: { id: user2.id } });
    const user3After = await prisma.user.findFirst({ where: { id: user3.id } });

    expect(user1After?.tokenVersion).toBe(user1.tokenVersion);
    expect(user2After?.tokenVersion).not.toBe(user2.tokenVersion);
    expect(user3After?.tokenVersion).toBe(user3.tokenVersion);
  });

  it('throws for non-existent id', async () => {
    await expect(rotateTokenVersion('non-existent-id')).rejects.toThrow();
  });
});
