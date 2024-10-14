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

### GraphQL Mappers

If you want to resolve certain fields in the model resolvers, ensure that you add a mapper to omit that field in the codegen.ts file. Examples are there to guide you.
