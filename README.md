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

### Options

**`-v, --verbose`**  
Show detailed analysis including detected language and timing

```bash
npm test 2>&1 | oops --verbose
```

**`-s, --severity <level>`**  
Filter errors by severity level (critical, error, warning, info)

```bash
# Only analyze critical errors
npm run build 2>&1 | oops --severity critical

# Only analyze warnings
npm test 2>&1 | oops -s warning
```

**Severity Levels:**
- 🔴 **critical**: Fatal errors, crashes, security issues, permission denials
- 🟠 **error**: Standard errors and exceptions
- 🟡 **warning**: Deprecations, timeouts, missing optional items
- 🔵 **info**: Informational messages, hints, suggestions

**`--no-color`**  
Disable colored output (useful for CI/CD logs)

```bash
npm build 2>&1 | oops --no-color
```

## Examples

### Example 1: Missing Node.js Dependency

**Error:**
```bash
$ npm run start
Error: Cannot find module 'express'
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:880:15)
    at Function.Module._load (internal/modules/cjs/loader.js:725:27)
    ...
```

**Solution:**
```bash
$ npm run start 2>&1 | oops

🔍 Analyzing error...

Problem: Cannot find module 'express'

Solution: Install the missing dependency

  $ npm install express

Detected from: package.json references express but it's not in node_modules

Done in 0.8s ✓
```

---

### Example 2: Python Import Error with Virtual Environment

**Error:**
```bash
$ python app.py
Traceback (most recent call last):
  File "app.py", line 1, in <module>
    from flask import Flask
ModuleNotFoundError: No module named 'flask'
```

**Solution:**
```bash
$ python app.py 2>&1 | oops

🔍 Analyzing error...

Problem: ModuleNotFoundError: No module named 'flask'

Solution: Install Flask using pip

  $ pip install flask

If using a virtual environment (recommended):
  $ source venv/bin/activate
  $ pip install flask

Or add to requirements.txt:
  flask==3.0.0

Done in 1.1s ✓
```

---

### Example 3: TypeScript Type Errors

**Error:**
```bash
$ tsc
src/index.ts:5:7 - error TS2339: Property 'name' does not exist on type '{}'.

5 const user = {};
  user.name = "John";  // Error here
  ~~~~
```

**Solution:**
```bash
$ tsc 2>&1 | oops

🔍 Analyzing error...

Problem: Property 'name' does not exist on type '{}'

Solution: Define the type or interface before assignment

Option 1: Use interface
  interface User {
    name: string;
  }
  const user: User = { name: "John" };

Option 2: Type annotation
  const user: { name: string } = { name: "John" };

Option 3: Initialize with properties
  const user = { name: "John" };  // Type inferred

Done in 0.9s ✓
```

---

### Example 4: Docker Build Failure (Cryptic Error)

**Error:**
```bash
$ docker build -t myapp .
#5 ERROR: failed to solve with frontend dockerfile.v0: failed to create LLB definition: Dockerfile parse error line 12: unexpected EOF
```

**Solution:**
```bash
$ docker build -t myapp . 2>&1 | oops

🔍 Analyzing error...

Problem: Dockerfile parse error - unexpected EOF at line 12

Solution: Check Dockerfile line 12 for syntax errors

Common causes:
  1. Missing backslash (\) at end of multi-line RUN command
  2. Unclosed quote in COPY or ENV instruction
  3. Hidden special characters from copy-paste

Debug steps:
  $ cat -A Dockerfile  # Show hidden characters
  $ docker build --progress=plain -t myapp .  # Verbose output

Example fix:
  # Before (missing \)
  RUN apt-get update
      apt-get install -y curl

  # After
  RUN apt-get update && \
      apt-get install -y curl

Done in 1.2s ✓
```

---

### Example 5: Git Push Rejected - Merge Conflict

**Error:**
```bash
$ git push origin main
To github.com:user/repo.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'github.com:user/repo.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref.
```

**Solution:**
```bash
$ git push origin main 2>&1 | oops

🔍 Analyzing error...

Problem: Remote contains commits you don't have locally

Solution: Pull changes first, then push

  # Option 1: Merge (preserves all history)
  $ git pull origin main
  $ git push origin main

  # Option 2: Rebase (cleaner history)
  $ git pull --rebase origin main
  $ git push origin main

  # If you see merge conflicts:
  1. Fix conflicts in marked files
  2. git add <resolved-files>
  3. git commit  (for merge) or git rebase --continue  (for rebase)
  4. git push origin main

❌ Never: git push --force (destroys teammate's work!)

Done in 1.0s ✓
```

---

### Example 6: Production Kubernetes Pod CrashLoopBackOff

**Error:**
```bash
$ kubectl logs pod/api-7d9f8b-xk2m
Error: connect ECONNREFUSED 10.0.0.5:5432
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1148:16)
```

**Solution:**
```bash
$ kubectl logs pod/api-7d9f8b-xk2m 2>&1 | oops

🔍 Analyzing error...

Problem: ECONNREFUSED 10.0.0.5:5432 - Cannot connect to PostgreSQL

Solution: Database connection refused in Kubernetes

Troubleshooting steps:

  1. Check if PostgreSQL service is running:
     $ kubectl get svc postgres-service
     $ kubectl get pods -l app=postgres

  2. Verify environment variables in deployment:
     $ kubectl describe deployment api
     # Look for DB_HOST, DB_PORT in env section

  3. Check if secret exists:
     $ kubectl get secret db-creds

  4. Test connection from debug pod:
     $ kubectl run -it --rm debug --image=postgres:15 --restart=Never -- \
       psql -h postgres-service -U admin

  5. Check network policies:
     $ kubectl get networkpolicy

Common fix: Update DB_HOST in deployment.yaml
  env:
    - name: DB_HOST
      value: "postgres-service"  # Not IP address!

Done in 1.4s ✓
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

## Real-World Workflows

### The "cloned a repo" starter pack
```bash
$ git clone https://github.com/someone/cool-project
$ cd cool-project
$ npm install 2>&1 | oops

[javascript]

Problem: ENOENT: no such file or directory, open 'package-lock.json'

Solution: Looks like package-lock.json is gitignored. Just install normally.

  $ npm install

The lock file will be generated. This is normal for fresh clones.
```

### Docker build fails (cryptic error edition)
```bash
$ docker build -t myapp . 2>&1 | oops

[docker]

Problem: failed to solve with frontend dockerfile.v0:
         failed to create LLB definition: unexpected EOF

Solution: Check your Dockerfile for unclosed quotes or missing line continuations

Common causes:
  - Missing \ at end of RUN command split across lines
  - Unclosed string: COPY file.txt /app\ (missing closing quote/path)
  - Copy-paste error with hidden characters

Try:
  $ cat -A Dockerfile  # Show hidden characters
```

### Production deploy error (stress mode activated)
```bash
# Deploy fails, site is down, boss is asking questions
$ kubectl logs pod/api-7d9f8b-xk2m 2>&1 | oops

[kubernetes]

Problem: CrashLoopBackOff - "ECONNREFUSED 10.0.0.5:5432"

Solution: Database connection refused. Pod can't reach PostgreSQL.

Check:
  1. Is DB_HOST env var set correctly in deployment?
  2. Is the PostgreSQL service running?
     $ kubectl get svc postgres-service
  3. Check network policies:
     $ kubectl get networkpolicy
  4. Verify DB credentials in secret:
     $ kubectl get secret db-creds -o yaml

Quick test:
  $ kubectl run -it --rm debug --image=postgres:15 --restart=Never -- psql -h postgres-service -U admin

# Ah right, forgot to apply the service yaml
```

### Test failures after updating deps
```bash
$ npm test 2>&1 | oops

[jest]

Problem: Jest encountered an unexpected token
         SyntaxError: Cannot use import statement outside a module

Solution: Jest config needs to handle ES modules after dependency update

Add to package.json:
  "jest": {
    "transform": {
      "^.+\\.jsx?$": "babel-jest"
    }
  }

Or if using modern Jest:
  "jest": {
    "preset": "ts-jest/presets/default-esm"
  }

Alternative quick fix:
  $ npm install --save-dev @babel/preset-env
```

### The "it works on my machine" debugger
```bash
# Teammate: "The build works for me?"
# You: *pulls latest*
$ npm run build 2>&1 | oops

[javascript]

Problem: 'NODE_OPTIONS' is not recognized as an internal or external command

Solution: You're on Windows, teammate is on Mac/Linux.

Windows fix:
  # Install cross-env
  $ npm install --save-dev cross-env

  Then update package.json:
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack"
  }

This makes env vars work across platforms.
```

### SSH connection debugging
```bash
$ ssh user@server.com 2>&1 | oops

[ssh]

Problem: Permission denied (publickey)

Solution: Server doesn't have your public key or can't find it

Check:
  1. Is your key added to ssh-agent?
     $ ssh-add -l
     
     If empty:
     $ ssh-add ~/.ssh/id_rsa

  2. Is your public key on the server?
     $ ssh-copy-id user@server.com
     
  3. Check key permissions (must be 600):
     $ chmod 600 ~/.ssh/id_rsa
     $ chmod 644 ~/.ssh/id_rsa.pub

  4. Try with verbose mode to see what's happening:
     $ ssh -v user@server.com
```

### Git push rejected (force push? never!)
```bash
$ git push origin main 2>&1 | oops

[git]

Problem: Updates were rejected because the remote contains work that you don't have locally

Solution: Someone pushed while you were working. Pull and merge first.

  $ git pull origin main
  # Fix any merge conflicts
  $ git push origin main

Or if you want to keep your history clean:
  $ git pull --rebase origin main
  $ git push origin main

Never: git push --force (unless you like angry coworkers)
```

### Python virtual environment confusion
```bash
$ python app.py 2>&1 | oops

[python]

Problem: ModuleNotFoundError: No module named 'flask'
         But you definitely installed it yesterday

Solution: Wrong Python environment activated (or none at all)

Check:
  $ which python
  $ pip list | grep flask

Fix:
  # Activate the right venv
  $ source venv/bin/activate  # Mac/Linux
  $ venv\Scripts\activate     # Windows

  # Then verify
  $ which python  # Should show venv path
  $ pip list | grep flask

If still missing:
  $ pip install -r requirements.txt
```

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

**Save solutions for later:**
```bash
npm run build 2>&1 | oops > solution.txt
```

**Chain with other tools:**
```bash
# Run tests, if they fail, explain them
npm test 2>&1 || (npm test 2>&1 | oops)
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
