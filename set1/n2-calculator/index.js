// Name: Liezelle Mangunay
// Section: IV BSIT-C
// Activity: N2 - Modular Calculator

const operations = require('./operations');
const formatter = require('./formatter');

const scriptPath = process.argv[1];
const operation = process.argv[2] ? process.argv[2].toLowerCase() : null;
const rawNumbers = process.argv.slice(3);

// Check if operation and at least 2 numbers are provided
if (!operation || rawNumbers.length < 2) {
  console.log(formatter.formatError('Usage: node index.js <operation> <num1> <num2> [more numbers...]'));
  console.log('Available operations: add, subtract, multiply, divide, average');
  process.exit(1);
}

// Convert command-line arguments to numbers
const numbers = rawNumbers.map(Number);

if (numbers.some(isNaN)) {
  console.log(formatter.formatError('All inputs after the operation must be valid numbers.'));
  process.exit(1);
}

// Check if the requested operation exists
if (!operations[operation]) {
  console.log(formatter.formatError(`Unknown operation "${operation}". Use: add, subtract, multiply, divide, or average.`));
  process.exit(1);
}

try {
  const result = operations[operation](numbers);
  console.log(formatter.formatResult(operation, numbers, result, scriptPath));
} catch (err) {
  console.log(formatter.formatError(err.message));
}