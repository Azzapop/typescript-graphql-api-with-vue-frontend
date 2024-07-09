import { api } from './api'
import { setupServer } from './util/setupServer';

export const server = setupServer({ modules: { '/api': api } });
