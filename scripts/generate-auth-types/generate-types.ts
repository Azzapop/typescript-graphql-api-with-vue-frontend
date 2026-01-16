import fs from 'node:fs';
import path from 'node:path';
import { generateApi } from 'swagger-typescript-api';

// Found in 'swagger-typescript-api', no longer exported for some reason
type FileInfo = {
  /** @example myFilename */
  fileName: string;
  /** @example .d.ts */
  fileExtension: string;
  /** content of the file */
  fileContent: string;
};

const OUTPUT_DIR = './src/packages/auth-api-client';

// TODO turn this into a script with command line args to re-use across modules

/* NOTE: all fields are optional expect one of `input`, `url`, `spec` */
generateApi({
  input: path.resolve(process.cwd(), './src/modules/auth/swagger.yaml'),
  output: path.resolve(process.cwd(), OUTPUT_DIR),
  templates: path.resolve(
    process.cwd(),
    './scripts/generate-auth-types/templates'
  ),

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
      const { fileName } = file;
      fs.appendFileSync(
        `${OUTPUT_DIR}/index.ts`,
        `export * from './${fileName}'\n`
      );
    });
  })
  .catch((e) => console.error(e));
