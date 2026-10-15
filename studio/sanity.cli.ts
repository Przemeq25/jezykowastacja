import { defineCliConfig } from 'sanity/cli';
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'f1yzh257',
    dataset: process.env.SANITY_STUDIO_DATASET || 'stacja',
  },
  project: {
    basePath: process.env.SANITY_STUDIO_BASEPATH || '/jezykowastacja/studio',
  },
});
