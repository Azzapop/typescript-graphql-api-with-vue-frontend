import { type User as DomainUser } from '../libs/domain-model';

declare global {
  namespace Express {
    interface User extends DomainUser {}
  }
}
