import { type User as DomainUser } from '@prisma/client';

declare global {
  namespace Express {
    interface User extends DomainUser {}
  }
}
