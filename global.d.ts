declare module '*.yaml' {
  const data: any;
  export default data;
}

// Must declare and import from the cjs files due to a recent issue with the package
// https://github.com/apollographql/apollo-client/issues/11895
declare module '@apollo/client/main.cjs';

/// <reference types="vite/client" />
