// Example: A broken Node.js script to test oops
// Run: node examples/broken-script.js 2>&1 | oops

const express = require('express'); // Module not installed
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000);
