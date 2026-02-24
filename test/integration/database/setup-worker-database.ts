import { execSync } from 'child_process';

export const setupWorkerDatabase = (): void => {
  execSync(
    'npx prisma migrate deploy --schema=./src/libs/domain-model/prisma/schema.prisma',
    { stdio: 'inherit' }
  );
};
