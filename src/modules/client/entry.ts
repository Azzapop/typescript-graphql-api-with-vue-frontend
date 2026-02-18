import { clientConfig } from './client-config';
import { devServerEntry } from './server-entry/dev-server-entry';
import { productionServerEntry } from './server-entry/production-server-entry';

/*
 *  Configure our client application with SSR
 *
 *  For production we serve our pre-compiled static assets direct from the dist directory.
 *  For all other environments we allow the vite dev server to serve our assets for us.
 *
 *  TODO Change to dynamic imports here so that we can tree shake either path out. Will need
 *  to use vite.ssrLoadModule for dev and inject it into the entry point
 */
const isProduction = clientConfig('NODE_ENV') === 'production';

export const entry = isProduction ? productionServerEntry : devServerEntry;
