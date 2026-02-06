import passport from 'passport';
import { registry } from './strategies';

export const registerStrategies = () => {
  Object.entries(registry).forEach(([strategyName, { strategy }]) => {
    passport.use(strategyName, strategy);
  });
};
