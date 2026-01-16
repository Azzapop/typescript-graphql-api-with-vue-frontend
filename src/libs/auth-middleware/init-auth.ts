import passport from 'passport';
import { registerStrategies } from './register-strategies';

export const initAuth = () => {
  registerStrategies();

  return passport.initialize();
};
