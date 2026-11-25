// operations.js - Custom module for math operations

function add(numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

function subtract(numbers) {
  return numbers.slice(1).reduce((total, num) => total - num, numbers[0]);
}

function multiply(numbers) {
  return numbers.reduce((total, num) => total * num, 1);
}

function divide(numbers) {
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] === 0) {
      throw new Error("Division by zero is not allowed.");
    }
  }
  return numbers.slice(1).reduce((total, num) => total / num, numbers[0]);
}

function average(numbers) {
  const sum = add(numbers);
  return sum / numbers.length;
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  average
};