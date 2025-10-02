const { defineConfig } = require('cypress');
const codeCoverage = require('@cypress/code-coverage/task');
const { downloadFile } = require('cypress-downloadfile/lib/addPlugin');

module.exports = (on, config) => {
  on('task', {
    downloadFile,
    coverageReport: () => {
      return null; // Disable automatic report generation
    }
  });

  codeCoverage(on, config);
  return config;
}