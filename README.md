# oops

Pipe error messages to AI for instant solutions.

[![npm version](https://badge.fury.io/js/oops-cli.svg)](https://www.npmjs.com/package/oops-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/muinmomin/oops.svg?style=social)](https://github.com/muinmomin/oops)

## What is this?

Stop copying error messages to Google. Just pipe them to `oops` and get instant, actionable solutions powered by Claude AI.

## Why use this?

**Before:**
```bash
$ npm run build
Error: Cannot find module 'express'
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:880:15)
    at Function.Module._load (internal/modules/cjs/loader.js:725:27)
    ...45 more lines of stack trace...

*copy error*
*open browser*
*search Google*
*click Stack Overflow*
*read 12 answers*
*try solution*
*doesn't work*
*repeat*
```

**After:**
```bash
$ npm run build 2>&1 | oops

Problem: Cannot find module 'express'

Solution: Install the missing dependency

  $ npm install express

Done. 0.8s
```

**Real pain points:**
- Error messages are cryptic
- Stack traces hide the actual problem
- Googling takes forever
- Solutions are outdated or wrong
- Context switching kills flow

`oops` analyzes the full error output, identifies the issue, and gives you copy-paste solutions in under 2 seconds.

## Installation

```bash
npm install -g oops-cli
```

Or use without installing:
```bash
npx oops-cli
```

## Setup

Set your Anthropic API key:
```bash
export ANTHROPIC_API_KEY=your-key-here
```

Add to `~/.bashrc` or `~/.zshrc` to make it permanent.

## Usage

Pipe any error output to `oops`:

```bash
npm run build 2>&1 | oops
python script.py 2>&1 | oops
go build 2>&1 | oops
cargo build 2>&1 | oops
```

The `2>&1` redirects stderr to stdout so `oops` catches all error messages.

## Examples

### JavaScript/Node.js

```bash
$ npm install 2>&1 | oops
```

Output:
```
[javascript]

Problem: Module not found - 'express' is not installed

Solution: Install the missing dependency

  $ npm install express

Detected from: package.json references express but it's not in node_modules
```

### Python

```bash
$ python app.py 2>&1 | oops
```

Output:
```
[python]

Problem: ModuleNotFoundError: No module named 'flask'

Solution: Install Flask using pip

  $ pip install flask

If using a virtual environment:
  $ source venv/bin/activate
  $ pip install flask
```

### Go

```bash
$ go build 2>&1 | oops
```

Output:
```
[go]

Problem: undefined: fmt.Printl

Fix: You have a typo - Go's function is fmt.Println (with 'n')

Change:
  fmt.Printl(x)

To:
  fmt.Println(x)
```

### Rust

```bash
$ cargo build 2>&1 | oops
```

Output:
```
[rust]

Problem: cannot find value `x` in this scope

Solution: Declare the variable before using it

  let x = 42;

Rust requires explicit variable declaration and type inference.
```

### TypeScript

```bash
$ tsc 2>&1 | oops
```

Output:
```
[typescript]

Problem: Property 'name' does not exist on type '{}'

Solution: Define the type or interface

  interface User {
    name: string;
  }

  const user: User = { name: "John" };

Or use type annotation:
  const user: { name: string } = { name: "John" };
```

## How It Works

1. **Reads stdin** - Captures error output piped from any command
2. **Detects context** - Identifies language/framework from error patterns
3. **Analyzes with AI** - Sends to Claude for solution generation
4. **Formats output** - Clean, actionable fixes in your terminal

Target response time: under 2 seconds (typically 0.5-1.5s)

## Options

```
-v, --verbose    Show detailed analysis and timing
--no-color       Disable colored output
-V, --version    Show version
-h, --help       Show help
```

## Verbose Output

```bash
$ npm run build 2>&1 | oops --verbose
```

Shows:
- Full error context
- Language/framework detection reasoning
- Multiple solution approaches
- Related documentation links
- Timing breakdown

## Tips

**Create shell aliases:**
```bash
# Add to ~/.bashrc or ~/.zshrc
alias oops-npm='npm run build 2>&1 | oops'
alias oops-py='python 2>&1 | oops'
alias oops-go='go build 2>&1 | oops'
```

**Use with watch mode:**
```bash
nodemon app.js 2>&1 | oops
```

**Pipe any command:**
```bash
make 2>&1 | oops
docker build . 2>&1 | oops
kubectl apply -f deployment.yaml 2>&1 | oops
```

## Development

```bash
# Clone repo
git clone https://github.com/muinmomin/oops.git
cd oops

# Install dependencies
npm install

# Link locally for testing
npm link

# Test with sample errors
echo "Error: Cannot find module 'express'" | oops

# Run tests
npm test
```

## Contributing

Contributions welcome!

**Ideas:**
- Add support for more languages/frameworks
- Improve error pattern detection
- Add caching for common errors
- Create web interface
- Support for warning messages (not just errors)

**How to contribute:**
1. Fork the repo
2. Create a feature branch (`git checkout -b feature/better-python-errors`)
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

Please include example error messages you're improving support for.

## Limitations

- Requires API key (uses Claude AI)
- Internet connection needed
- Best with English error messages
- May not catch extremely obscure errors

## Privacy

`oops` sends error messages to Anthropic's Claude API for analysis. Don't pipe sensitive information (passwords, keys, tokens) through it.

Error messages are processed through Anthropic's API - check their [privacy policy](https://www.anthropic.com/legal/privacy) if you have concerns.

## License

MIT

---

Made by [muin](https://github.com/muinmomin)

*Stop Googling errors. Pipe them to AI instead.*
