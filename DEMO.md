# oops CLI - Demo Guide

Quick demo script to show off `oops` capabilities.

## Setup

```bash
# Install dependencies (if not already)
cd ~/muin/projects/oops
npm install

# Link for local testing
npm link

# Set API key (required)
export ANTHROPIC_API_KEY=your-key-here
```

## Quick Tests

### 1. Simple Node.js Error

```bash
echo "Error: Cannot find module 'express'" | oops -v
```

**Expected**: Suggests `npm install express`

### 2. Python Import Error

```bash
cat <<'EOF' | oops
Traceback (most recent call last):
  File "app.py", line 1, in <module>
    from flask import Flask
ModuleNotFoundError: No module named 'flask'
EOF
```

**Expected**: Suggests `pip install flask`

### 3. Real Script Error

```bash
node examples/broken-script.js 2>&1 | oops
```

**Expected**: Detects Node.js, suggests installing express

### 4. Multiple Errors

```bash
python examples/broken-script.py 2>&1 | oops -v
```

**Expected**: Detects Python, suggests Flask installation

## Performance Test

Time the response:

```bash
time (echo "TypeError: undefined is not a function" | oops)
```

**Target**: < 2 seconds

## Features to Highlight

1. **Auto-detection** - No need to specify language
2. **Actionable commands** - Ready to copy-paste
3. **Clean output** - Color-coded, easy to read
4. **Fast** - Sub-2s responses
5. **Universal** - Works with any command that outputs to stderr

## Demo Script

```bash
# Show the concept
echo "I have an error. Let me pipe it to oops..."

# Run example
npm install nonexistent-package 2>&1 | oops

# Show verbose mode
echo "With verbose flag for details..."
python -c "import nonexistent" 2>&1 | oops -v

# Real-world scenario
echo "Let me try running this broken script..."
node examples/broken-script.js 2>&1 | oops
```

## Troubleshooting

If you get "ANTHROPIC_API_KEY not set":
```bash
export ANTHROPIC_API_KEY=your-key-here
```

If command not found:
```bash
npm link  # or use: node bin/oops.js
```
