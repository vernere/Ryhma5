const { defineConfig } = require("cypress");
const { downloadFile } = require('cypress-downloadfile/lib/addPlugin');
const codeCoverageTask = require('@cypress/code-coverage/task');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      on('task', { downloadFile });
      return config;
    },
    supportFile: 'cypress/support/e2e.js',
    env: {
      codeCoverage: {
        exclude: [
          'cypress/**/*.*',
          'coverage/**/*.*',
          'dist/**/*.*',
          'node_modules/**/*.*'
        ]
      }
    }
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  }
});
