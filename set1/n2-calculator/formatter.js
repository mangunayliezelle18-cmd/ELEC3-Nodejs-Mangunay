// formatter.js - Custom module for formatting output (uses built-in path & os modules)
const path = require('path');
const os = require('os');

const symbols = {
  add: '+',
  subtract: '-',
  multiply: '*',
  divide: '/'
};

function formatResult(operation, numbers, result, scriptPath) {
  const scriptName = path.basename(scriptPath);
  const userName = os.userInfo().username;

  if (operation === 'average') {
    return `[${scriptName} | User: ${userName}] Average of (${numbers.join(', ')}) = ${result}`;
  }

  const symbol = symbols[operation];
  const expression = numbers.join(` ${symbol} `);
  return `[${scriptName} | User: ${userName}] ${expression} = ${result}`;
}

function formatError(message) {
  return `Error: ${message}`;
}

module.exports = {
  formatResult,
  formatError
};