import { randomUUID } from 'crypto';

export const generateTokenVersion = (): string => randomUUID();
