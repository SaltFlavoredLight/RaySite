import { defineConfig } from 'vite';
import { cpSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

function copyTestsToBuild() {
  let outputDirectory;

  return {
    name: 'copy-tests-to-build',
    apply: 'build',
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      cpSync(resolve(projectRoot, 'tests'), resolve(outputDirectory, 'tests'), { recursive: true });
    },
  };
}

export default defineConfig({
  appType: 'mpa', // Disables SPA history API fallback and returns 404 for unknown routes
  plugins: [copyTestsToBuild()],
  // ...other options
});
