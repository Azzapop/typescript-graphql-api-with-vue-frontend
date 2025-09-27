import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import * as path from 'path';

const __FILENAME = fileURLToPath(import.meta.url);
const __DIRNAME = path.dirname(__FILENAME);

const ROOT = path.resolve(__DIRNAME, '../src/modules/client/app');
const OUTPUT = path.join(ROOT, 'i18n/locales/en-AU.json');
const TARGET_FILENAME = 'i18n.json';

function relativeToCwd(filePath: string) {
  return path.relative(process.cwd(), filePath);
}

async function findI18nFiles(dir: string): Promise<string[]> {
  let results: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(await findI18nFiles(fullPath));
    } else if (entry.isFile() && entry.name === TARGET_FILENAME) {
      results.push(fullPath);
    }
  }
  return results;
}

async function mergeI18nFiles() {
  const files = await findI18nFiles(ROOT);
  if (files.length === 0) {
    console.log('No i18n files found.');
    return;
  }
  console.log('Found i18n files:');
  files.forEach(file => {
    if (file !== OUTPUT) {
      console.log('  -', relativeToCwd(file));
    }
  });

  const merged: Record<string, any> = {};
  for (const file of files) {
    if (file === OUTPUT) continue; // skip the output file if found
    const content = await fs.readFile(file, 'utf-8');
    try {
      const json = JSON.parse(content);
      Object.assign(merged, json);
    } catch (e) {
      console.error(`Failed to parse ${relativeToCwd(file)}:`, e);
    }
  }

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
  await fs.writeFile(OUTPUT, JSON.stringify(merged, null, 2) + '\n', 'utf-8');
  console.log(`Merged ${files.length} files into ${relativeToCwd(OUTPUT)}`);
}

mergeI18nFiles().catch(err => {
  console.error('Error during merge:', err);
  process.exit(1);
}); 