import { cleanWorkerDatabase } from '#test';
import { defineUserFactory } from '#test/factories';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '~database';
import { rotateTokenVersion } from '../rotate-token-version';

const setup = () => ({
  UserFactory: defineUserFactory(),
});

describe('rotateTokenVersion', () => {
  beforeEach(async () => {
    await cleanWorkerDatabase();
  });

  it('tokenVersion changes after rotation', async () => {
    const { UserFactory } = setup();
    const user = await UserFactory.create();

    const result = await rotateTokenVersion(user.id);

    expect(result).toEqual({ success: true, data: undefined });

    const updatedUser = await prisma().user.findFirst({
      where: { id: user.id },
    });

    expect(updatedUser?.tokenVersion).not.toBe(user.tokenVersion);
  });

  it('new tokenVersion is unique across multiple rotations', async () => {
    const { UserFactory } = setup();
    const user = await UserFactory.create();

    const versions: string[] = [user.tokenVersion];

    for (let i = 0; i < 5; i++) {
      const result = await rotateTokenVersion(user.id);
      expect(result.success).toBe(true);

      const updated = await prisma().user.findFirst({ where: { id: user.id } });
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

    const user1After = await prisma().user.findFirst({
      where: { id: user1.id },
    });
    const user2After = await prisma().user.findFirst({
      where: { id: user2.id },
    });
    const user3After = await prisma().user.findFirst({
      where: { id: user3.id },
    });

    expect(user1After?.tokenVersion).toBe(user1.tokenVersion);
    expect(user2After?.tokenVersion).not.toBe(user2.tokenVersion);
    expect(user3After?.tokenVersion).toBe(user3.tokenVersion);
  });

  it('returns NOT_FOUND for non-existent id', async () => {
    const result = await rotateTokenVersion(faker.string.uuid());

    expect(result).toEqual({ success: false, error: 'NOT_FOUND' });
  });
});
