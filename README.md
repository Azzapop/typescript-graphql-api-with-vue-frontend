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
- trace tokens
- auth middleware for Gql
- auth middleware for client
- swagger validation middleware
- update functions to only pass what is needed
- nvim ejs syntax highlighting
- cleanup the api types script more
- Catch prisma errors and throw a domain specific error
- tests, tests, tests
- use find instead of get in stores
- setup individual apps to have their own express server, plugs into main one through /<identifier>
- use operationId for the route types
- split prisma schema into different modules

### GraphQL Mappers

If you want to resolve certain fields in the model resolvers, ensure that you add a mapper to omit that field in the codegen.ts file. Examples are there to guide you.
