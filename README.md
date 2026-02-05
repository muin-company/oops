# oops

Pipe error messages to AI for instant solutions.

## Install

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

### Options

```
-v, --verbose    Show detailed analysis and timing
--no-color       Disable colored output
-V, --version    Show version
-h, --help       Show help
```

## Examples

### JavaScript/Node.js

```bash
$ npm install 2>&1 | oops
[javascript]

Problem: Module not found

Solution: Install the missing dependency

  $ npm install express
```

### Python

```bash
$ python app.py 2>&1 | oops
[python]

Problem: ModuleNotFoundError: No module named 'flask'

Solution: Install Flask

  $ pip install flask
```

### Go

```bash
$ go build 2>&1 | oops
[go]

Problem: undefined: fmt.Printl

Fix: Change `fmt.Printl` to `fmt.Println`
```

### Rust

```bash
$ cargo build 2>&1 | oops
[rust]

Problem: cannot find value `x` in this scope

Solution: Declare the variable before use

  let x = 42;
```

## How It Works

1. **Reads stdin** - Captures error output piped from any command
2. **Detects context** - Identifies language/framework from error patterns
3. **Analyzes with AI** - Sends to Claude for solution generation
4. **Formats output** - Clean, actionable fixes in your terminal

## Speed

Target: Sub-2s response time (typically 0.5-1.5s depending on error complexity)

## Development

```bash
# Clone repo
git clone [repo-url]
cd oops

# Install dependencies
npm install

# Link locally for testing
npm link

# Test
echo "Error: Cannot find module 'express'" | oops
```

## License

MIT
