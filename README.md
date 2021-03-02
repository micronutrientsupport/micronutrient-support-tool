# Micronutrient Support Tool

---
### :globe_with_meridians: [Latest Development Preview](https://develop--micronutrientsupport-tool.netlify.app/) :globe_with_meridians:

---



#### Branch Pipeline Status

| Branch    | Lint                                                                                                                      | Build                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `main`    | ![Linting](https://github.com/micronutrientsupport/micronutrient-support-tool/workflows/Linting/badge.svg?branch=main)    | ![Angular Build](https://github.com/micronutrientsupport/micronutrient-support-tool/workflows/Angular%20Build/badge.svg?branch=main)    |
| `develop` | ![Linting](https://github.com/micronutrientsupport/micronutrient-support-tool/workflows/Linting/badge.svg?branch=develop) | ![Angular Build](https://github.com/micronutrientsupport/micronutrient-support-tool/workflows/Angular%20Build/badge.svg?branch=develop) |

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0.

### Development Notes

Install the [Prettier](https://github.com/prettier/prettier-vscode) VSCode formatter for consistency in code format/style.

Linting is provided by ESLint as TSLint is [deprecated](https://medium.com/palantir/tslint-in-2019-1a144c2317a9).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:8100/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

### Headless

Run `ng run micronutrient-support-tool:cypress-run` to execute the Cypress end-to-end tests via [Cypress](https://www.cypress.io/).

This will build and serve the Angular app and then run the cypress tests found in the `cypress/integration` folder.

### GUI Tests / Writing and debugging tests

Run `ng run micronutrient-support-tool:cypress-open` to execute the Cypress end-to-end tests within the Cypress GUI tool. This is used to visualise the test runs and will help you debug and write future tests.

[Writing your first Cypress test](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Add-a-test-file)

[Chrome Extension to scaffold tests](https://chrome.google.com/webstore/detail/cypress-recorder/glcapdcacdfkokcmicllhcjigeodacab)

### Webpack Analysis

Webpack bundle analyzer can generate stats and on the current application bundle size and visualise them in a simple web tool.

Run `npm run build:stats` to build the Angular project and calculate the bundle stats (`dist/stats.json`)

Run `npm run analyze` to use this `stats.json` and load the bundle visualiser at `localhost:8888`

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
