#!/usr/bin/env node

const { detectContext } = require('./lib/detector');

// Test cases
const testCases = [
  {
    name: 'Node.js module error',
    input: `Error: Cannot find module 'express'
Require stack:
- /Users/dev/app.js
    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:933:15)`,
    expected: 'javascript'
  },
  {
    name: 'Python traceback',
    input: `Traceback (most recent call last):
  File "script.py", line 5, in <module>
    import flask
ModuleNotFoundError: No module named 'flask'`,
    expected: 'python'
  },
  {
    name: 'Go build error',
    input: `# command-line-arguments
./main.go:10:2: undefined: fmt.Printl`,
    expected: 'go'
  },
  {
    name: 'Rust compiler error',
    input: `error[E0425]: cannot find value \`x\` in this scope
 --> src/main.rs:4:20
  |
4 |     println!("{}", x);
  |                    ^ not found in this scope`,
    expected: 'rust'
  },
  {
    name: 'npm error',
    input: `npm ERR! code ENOENT
npm ERR! syscall open
npm ERR! path /Users/dev/package.json
npm ERR! errno -2`,
    expected: 'javascript'
  }
];

console.log('Running detector tests...\n');

let passed = 0;
let failed = 0;

testCases.forEach(test => {
  const result = detectContext(test.input);
  const success = result.language === test.expected;
  
  if (success) {
    console.log(`✓ ${test.name}`);
    passed++;
  } else {
    console.log(`✗ ${test.name}`);
    console.log(`  Expected: ${test.expected}, Got: ${result.language}`);
    failed++;
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
