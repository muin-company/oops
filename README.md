# oops

**Your terminal just crashed. oops knows why.**

[![npm version](https://badge.fury.io/js/@mj-muin%2Foops-cli.svg)](https://www.npmjs.com/package/@mj-muin/oops-cli)
[![npm downloads](https://img.shields.io/npm/dm/@mj-muin/oops-cli.svg)](https://www.npmjs.com/package/@mj-muin/oops-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/@mj-muin/oops-cli.svg)](https://nodejs.org)
[![GitHub stars](https://img.shields.io/github/stars/muin-company/oops.svg?style=social)](https://github.com/muin-company/oops)

## The Problem

Your build breaks. You stare at a 40-line stack trace. You copy the error, open a browser, paste it into Google, click three Stack Overflow links, try two solutions that don't work, and finally find the fix 15 minutes later.

Meanwhile, your flow state is gone.

## The Solution

Pipe any error to `oops`. Get the fix in under 2 seconds.

```bash
$ npm run build 2>&1 | oops

[javascript]

Problem: Cannot find module 'express'

Solution: Install the missing dependency

  $ npm install express

Done. 0.8s
```

No browser. No context switching. No Stack Overflow rabbit holes.

## Installation

```bash
npm install -g @mj-muin/oops-cli
```

Or run without installing:

```bash
npx @mj-muin/oops-cli
```

## Setup

```bash
export ANTHROPIC_API_KEY="your-key-here"
```

Add to `~/.bashrc` or `~/.zshrc` to make it permanent.

Get a key at [console.anthropic.com](https://console.anthropic.com/settings/keys).

## Quick Start

```bash
# Pipe any failing command
npm run build 2>&1 | oops
python script.py 2>&1 | oops
cargo build 2>&1 | oops
go build 2>&1 | oops
docker build . 2>&1 | oops

# Verbose mode for detailed analysis
npm test 2>&1 | oops --verbose
```

The `2>&1` redirects stderr to stdout so `oops` catches all error output.

## Examples

### Node.js — Missing dependency

```bash
$ npm run start 2>&1 | oops

[javascript]

Problem: Cannot find module 'express'

Solution: Install the missing dependency

  $ npm install express
```

### Python — Virtual environment confusion

```bash
$ python app.py 2>&1 | oops

[python]

Problem: ModuleNotFoundError: No module named 'flask'

Solution: Install Flask using pip

  $ pip install flask

If using a virtual environment:
  $ source venv/bin/activate
  $ pip install flask
```

### Rust — Borrow checker

```bash
$ cargo build 2>&1 | oops

[rust]

Problem: Cannot borrow `users` as mutable while borrowed as immutable

Solution: Limit the lifetime of the immutable borrow

  let first_name = users[0].name.clone();
  users.push(new_user);
  println!("{}", first_name);
```

### Docker — Cryptic build error

```bash
$ docker build -t myapp . 2>&1 | oops

[docker]

Problem: Dockerfile parse error - unexpected EOF at line 12

Solution: Check for missing backslash in multi-line RUN command

  # Before (broken)
  RUN apt-get update
      apt-get install -y curl

  # After (fixed)
  RUN apt-get update && \
      apt-get install -y curl
```

### Git — Push rejected

```bash
$ git push origin main 2>&1 | oops

[git]

Problem: Remote contains commits you don't have locally

Solution:
  $ git pull --rebase origin main
  $ git push origin main
```

## How It Works

1. Reads error output from stdin
2. Auto-detects language/framework (JS, Python, Rust, Go, Docker, Git, etc.)
3. Sends to Claude AI for analysis
4. Returns concise, actionable fix

Typical response time: 0.5–1.5 seconds.

## Supported Languages

JavaScript/TypeScript, Python, Go, Rust, Java, Ruby, PHP, Docker, Git, and shell errors. The AI model has broad knowledge, so even obscure tools often get good results.

## Options

```
-v, --verbose    Show detailed analysis and timing
--no-color       Disable colored output
-V, --version    Show version
-h, --help       Show help
```

## Tips

```bash
# Shell aliases for speed
alias oops-npm='npm run build 2>&1 | oops'
alias oops-test='npm test 2>&1 | oops'

# Trim huge output for faster results
npm run build 2>&1 | tail -100 | oops

# Save solutions
npm run build 2>&1 | oops > solution.txt

# Git pre-commit hook
npm run build 2>&1 | oops || exit 1
```

## Privacy

Error text is sent to [Anthropic's API](https://www.anthropic.com/legal/privacy) for analysis. Don't pipe sensitive data (passwords, API keys, tokens).

## Cost

Uses the Anthropic Claude API. Each analysis costs roughly $0.003–0.015 (less than 2 cents). Free tier gives $5 credit (~500+ analyses).

## License

MIT © [muin](https://github.com/muin-company)

---

*Stop Googling errors. Pipe them to AI.*
