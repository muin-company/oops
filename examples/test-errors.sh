#!/bin/bash

# Example error messages for testing oops

echo "Testing Node.js error..."
echo "Error: Cannot find module 'express'
Require stack:
- /app.js
    at Module._resolveFilename (internal/modules/cjs/loader:933:15)" | node ../bin/oops.js

echo -e "\n---\n"

echo "Testing Python error..."
echo "Traceback (most recent call last):
  File \"script.py\", line 5, in <module>
    import flask
ModuleNotFoundError: No module named 'flask'" | node ../bin/oops.js

echo -e "\n---\n"

echo "Testing Go error..."
echo "# command-line-arguments
./main.go:10:2: undefined: fmt.Printl" | node ../bin/oops.js
