// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  version: require('../../package.json').version,
  // buildDate: '{BUILD-DATE}', // populated during pipeline
  // gitCommitHash: '{GIT-COMMIT-HASH}', // populated during pipeline
  // gitTag: '{GIT-TAG}', // populated during pipeline
  // gitBranchName: '{GIT-BRANCH-NAME}', // populated during pipeline
  apiBaseUrl: 'https://devapi.micronutrient.support',
  useLiveApi: true,
};
