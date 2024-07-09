import fs from "node:fs";
import path from "node:path";
import { FileInfo, generateApi } from "swagger-typescript-api";

const OUTPUT_DIR = './src/services/api'

// TODO turn this into a script with command line args to re-use across modules

/* NOTE: all fields are optional expect one of `input`, `url`, `spec` */
generateApi({
  input: path.resolve(process.cwd(), "./src/api/swagger.yaml"),
  output: path.resolve(process.cwd(), OUTPUT_DIR),
  templates: path.resolve(process.cwd(), "./scripts/generate-api-types/templates"),

  // TODO customise modularisation to match style of application (individual files per object, named after object contained)
  modular: true,

  generateClient: true,
  httpClientType: 'axios',
  singleHttpClient: true,

  generateRouteTypes: true,
  generateResponses: true,
  generateUnionEnums: true,

  cleanOutput: true,
})
  .then(({ files }) => {
    // Generate an index file
    // TODO do this through a template
    files.forEach((file: FileInfo) => {
      const { fileName } = file
      fs.appendFileSync(`${OUTPUT_DIR}/index.ts`, `export * from './${fileName}'\n`);
    });
  })
  .catch((e) => console.error(e));
