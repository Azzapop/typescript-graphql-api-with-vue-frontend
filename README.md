### Filenaming/Foldernaming

- Folders -> kebab-case
- Files -> kebab-case
- Exports camelCase, mathing file or folder name if index file
- only one export unless index file
- Anything generated must be in the .gitignore

### TODO

- Maybe type-ify the express injectors?
- Replace multi-line comments with /\*\*/
- Prefix resolver types with Gql on generate
- Only one / allowed per import
- lint rule so that test imports '#' can't be in prod files
- swagger validation middleware
- update functions to only pass what is needed
- nvim ejs syntax highlighting
- nvim vue syntax highlighting and ts validation
- tests, tests, tests
- use find instead of get in stores
- setup individual apps to have their own express server, plugs into main one through /<identifier> (only client left)
- use operationId for the route types
- split prisma schema into different modules
- create for things that are saved, generate for things that are created on the fly
- way to mark libs as server or client facing
- better error handling on the client using codes from the backend. Error handler lib for both express errors and gql errors. Should catch errors from external libs at boundaries using result pattern, then convert them to the corresponding error at the top level for the resolver or route handler
- standard fontsize for labels and icons so it's not set everywhere
- figure out a better pattern for the navbar to handle dropdowns and collapse on mobile. Move the user dropdown to the end
- composables for menu toggles to make it more generic
- logging in dev, log basic error message, turn on json logging based on config
- pull out module logger to it's own config
- Store settings in local storage for client
- doc for auth flow
- doc for client flow
- doc for gql flow
- const for token cookies names
- honestly just clean up the whole script for generate auth types
- better auth lib and handling for the client

### GraphQL Mappers

If you want to resolve certain fields in the model resolvers, ensure that you add a mapper to omit that field in the codegen.ts file. Examples are there to guide you.
