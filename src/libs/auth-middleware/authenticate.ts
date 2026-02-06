import type { Handler } from 'express';
import { registry } from './strategies';

type StrategyName = keyof typeof registry;

export const authenticate = (strategy: StrategyName): Handler => {
  return registry[strategy].middleware;
};
