import { execSync } from 'child_process';

export const setupWorkerDatabase = (): void => {
  execSync(
    'npx prisma migrate deploy --schema=./src/database/schema.prisma',
    { stdio: 'inherit' }
  );
};
