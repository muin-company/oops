# oops

Pipe error messages to AI for instant solutions.

[![npm version](https://badge.fury.io/js/oops-cli.svg)](https://www.npmjs.com/package/oops-cli)
[![npm downloads](https://img.shields.io/npm/dm/oops-cli.svg)](https://www.npmjs.com/package/oops-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/oops-cli.svg)](https://nodejs.org)
[![GitHub stars](https://img.shields.io/github/stars/muinmomin/oops.svg?style=social)](https://github.com/muinmomin/oops)
[![GitHub issues](https://img.shields.io/github/issues/muinmomin/oops.svg)](https://github.com/muinmomin/oops/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/muinmomin/oops/pulls)

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

---

### Example 7: Rust Borrow Checker Error

**Error:**
```bash
$ cargo build
error[E0502]: cannot borrow `users` as mutable because it is also borrowed as immutable
  --> src/main.rs:12:5
   |
11 |     let first_user = &users[0];
   |                      ---------- immutable borrow occurs here
12 |     users.push(new_user);
   |     ^^^^^^^^^^^^^^^^^^^^ mutable borrow occurs here
13 |     println!("{}", first_user.name);
   |                    ---------- immutable borrow later used here
```

**Solution:**
```bash
$ cargo build 2>&1 | oops

🔍 Analyzing error...

Problem: Cannot borrow `users` as mutable while borrowed as immutable

Solution: The borrow checker prevents simultaneous mutable and immutable borrows

Fix: Limit the lifetime of the immutable borrow

  # Before (doesn't compile)
  let first_user = &users[0];
  users.push(new_user);  // Error: can't mutate while borrowed
  println!("{}", first_user.name);

  # After (compiles)
  {
      let first_user = &users[0];
      println!("{}", first_user.name);
  }  // first_user dropped here
  users.push(new_user);  // Now OK

  # Or: Clone the data you need
  let first_name = users[0].name.clone();
  users.push(new_user);
  println!("{}", first_name);

Done in 0.7s ✓
```

---

### Example 8: SSL Certificate Verification Failed

**Error:**
```bash
$ curl https://internal-api.company.com
curl: (60) SSL certificate problem: self signed certificate
More details here: https://curl.haxx.se/docs/sslcerts.html
```

**Solution:**
```bash
$ curl https://internal-api.company.com 2>&1 | oops

🔍 Analyzing error...

Problem: SSL certificate problem: self signed certificate

Solution: Self-signed certificate is not trusted by curl

Options:

  1. For development/testing only (NOT production):
     $ curl -k https://internal-api.company.com
     # or
     $ curl --insecure https://internal-api.company.com

  2. Proper fix - add CA certificate:
     $ curl --cacert /path/to/company-ca.crt https://internal-api.company.com

  3. System-wide trust (Linux):
     $ sudo cp company-ca.crt /usr/local/share/ca-certificates/
     $ sudo update-ca-certificates

  4. System-wide trust (macOS):
     $ sudo security add-trusted-cert -d -r trustRoot \
       -k /Library/Keychains/System.keychain company-ca.crt

⚠️  Using -k/--insecure disables security. Only use in dev environments.

Done in 0.9s ✓
```

---

### Example 9: Database Migration Failure

**Error:**
```bash
$ npm run migrate
Error: relation "users" already exists
    at Parser.parseErrorMessage (node_modules/pg-protocol/dist/parser.js:287:98)
    at Parser.handlePacket (node_modules/pg-protocol/dist/parser.js:126:29)
```

**Solution:**
```bash
$ npm run migrate 2>&1 | oops

🔍 Analyzing error...

Problem: relation "users" already exists

Solution: Migration trying to create a table that already exists

Diagnosis:
  1. Check migration status:
     $ npm run migrate:status
     # or
     $ psql -d yourdb -c "\dt"

  2. Reset migrations if in development:
     $ npm run migrate:rollback
     $ npm run migrate

  3. If migration was partially applied:
     # Create a new migration that checks existence:
     CREATE TABLE IF NOT EXISTS users (...);

  4. For production, create a fix migration:
     # migrations/fix-users-table.js
     exports.up = async (db) => {
       const exists = await db.schema.hasTable('users');
       if (!exists) {
         await db.schema.createTable('users', ...);
       }
     };

⚠️  Never drop tables in production to fix migrations!

Done in 1.0s ✓
```

---

### Example 10: Port Already in Use

**Error:**
```bash
$ npm start
Error: listen EADDRINUSE: address already in use :::3000
    at Server.setupListenHandle [as _listen2] (net.js:1318:16)
    at listenInCluster (net.js:1366:12)
```

**Solution:**
```bash
$ npm start 2>&1 | oops

🔍 Analyzing error...

Problem: Port 3000 is already in use

Solution: Another process is using port 3000

Quick fixes:

  1. Find and kill the process (macOS/Linux):
     $ lsof -ti:3000 | xargs kill -9

  2. Find and kill the process (Windows):
     > netstat -ano | findstr :3000
     > taskkill /PID <process_id> /F

  3. Use a different port:
     $ PORT=3001 npm start

  4. Check what's using it:
     $ lsof -i :3000
     # or
     $ netstat -an | grep 3000

Prevention:
  - Add a cleanup script to package.json
  - Use process managers like PM2 that handle this
  - Check for zombie node processes: ps aux | grep node

Done in 0.6s ✓
```

---

### Example 11: Memory Heap Out of Space (Node.js)

**Error:**
```bash
$ node build.js
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

**Solution:**
```bash
$ node build.js 2>&1 | oops

🔍 Analyzing error...

Problem: JavaScript heap out of memory

Solution: Node.js ran out of memory during execution

Immediate fix - increase heap size:
  $ node --max-old-space-size=4096 build.js  # 4GB
  $ node --max-old-space-size=8192 build.js  # 8GB

Add to package.json:
  {
    "scripts": {
      "build": "node --max-old-space-size=4096 build.js"
    }
  }

Or set environment variable:
  export NODE_OPTIONS="--max-old-space-size=4096"

Long-term solutions:
  1. Check for memory leaks:
     $ node --inspect build.js
     # Open chrome://inspect and take heap snapshots

  2. Process data in chunks instead of loading all at once
  3. Use streams for large file operations
  4. Profile with: node --prof build.js

Done in 0.8s ✓
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

## Use Cases

### 1. **Local Development - "Why isn't this working?"**

You're building a feature and suddenly hit an error. Instead of alt-tabbing to Google and losing your train of thought, just pipe it to `oops`:

```bash
$ npm test 2>&1 | oops
```

**Benefit:** Stay in the terminal, stay in flow. Get solutions in <2 seconds.

---

### 2. **Onboarding New Codebases**

You've just cloned a repo you've never seen before. Dependency issues, build errors, environment problems - all common when setting up:

```bash
$ npm install 2>&1 | oops
$ npm run build 2>&1 | oops
$ docker-compose up 2>&1 | oops
```

**Benefit:** Get up and running faster without knowing the project's quirks.

---

### 3. **CI/CD Pipeline Debugging**

Your CI build failed. The logs are 5000 lines long. Scroll to the error and:

```bash
# Copy the error section from CI logs to a file
$ cat ci-error.log | oops
```

**Benefit:** Instantly understand what broke in CI without manually parsing logs.

---

### 4. **Learning New Languages/Frameworks**

Picked up Rust/Go/Elixir for the first time? Error messages in unfamiliar languages are extra cryptic:

```bash
$ cargo build 2>&1 | oops   # Rust borrow checker errors explained
$ go run main.go 2>&1 | oops   # Go interface errors decoded
```

**Benefit:** Accelerate learning by understanding errors as you encounter them.

---

### 5. **Production Incident Response**

Something's broken in production. Logs are flooding in. You need answers NOW:

```bash
$ kubectl logs pod/api-7d9f8b-xk2m --tail=100 2>&1 | oops
$ journalctl -u myapp -n 50 2>&1 | oops
```

**Benefit:** Reduce MTTR (Mean Time To Resolution) when every second counts.

---

### 6. **Pair Programming / Mentoring**

Junior dev is stuck on an error. Instead of explaining everything verbally:

```bash
$ python script.py 2>&1 | oops --verbose
```

Show them the solution, then explain the "why" behind it. The verbose mode shows multiple approaches.

**Benefit:** Teaching tool that provides consistent, accurate explanations.

---

### 7. **Code Review - Pre-commit Checks**

Before pushing code, verify your build is actually clean:

```bash
$ npm run build 2>&1 | oops || echo "Fix this before committing!"
```

Set up as a git pre-commit hook to catch issues before they hit CI.

**Benefit:** Catch errors early, before they block your teammates.

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

---

## Advanced Workflows

### Workflow 1: Production Error Correlation Engine

**Scenario:** Multiple production errors occurring simultaneously across different services. Need to identify root cause by correlating error patterns.

**Challenge:** When a database goes down, you get 100+ different error messages across microservices. Which one is the actual root cause?

**Solution:**
```bash
#!/bin/bash
# error-correlation.sh - Correlate multiple error streams to find root cause

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
CORRELATION_DIR="error-correlation-$TIMESTAMP"
mkdir -p "$CORRELATION_DIR"

echo "🔍 Production Error Correlation Analysis"
echo "Timestamp: $TIMESTAMP"
echo "Output: $CORRELATION_DIR/"
echo ""

# Services to monitor
SERVICES=(
  "api-gateway"
  "auth-service"
  "payment-service"
  "notification-service"
  "database-proxy"
)

# Collect logs from last 10 minutes
echo "📥 Step 1: Collecting recent error logs..."
for service in "${SERVICES[@]}"; do
  echo "  → $service"
  kubectl logs "deployment/$service" --since=10m 2>&1 | grep -i "error\|exception\|fatal" > "$CORRELATION_DIR/$service.log"
done

# Analyze each service's errors
echo ""
echo "🤖 Step 2: AI analysis of each service..."
for service in "${SERVICES[@]}"; do
  if [ -s "$CORRELATION_DIR/$service.log" ]; then
    echo "  → Analyzing $service errors..."
    cat "$CORRELATION_DIR/$service.log" | oops --severity critical --no-color > "$CORRELATION_DIR/$service-analysis.md" 2>&1
  else
    echo "  → No errors in $service" > "$CORRELATION_DIR/$service-analysis.md"
  fi
done

# Extract error timestamps for correlation
echo ""
echo "⏰ Step 3: Building error timeline..."
{
  echo "# Error Timeline"
  echo ""
  echo "| Time | Service | Error Type | Count |"
  echo "|------|---------|------------|-------|"
  
  for service in "${SERVICES[@]}"; do
    if [ -s "$CORRELATION_DIR/$service.log" ]; then
      # Extract timestamp and error type
      grep -o "[0-9]\{2\}:[0-9]\{2\}:[0-9]\{2\}.*Error:\|Exception:" "$CORRELATION_DIR/$service.log" | \
        awk -v svc="$service" '{print $1, "|", svc, "|", $0}' | \
        sort | uniq -c | \
        awk '{printf "| %s | %s | %s | %d |\n", $2, $4, substr($0, index($0,$6)), $1}'
    fi
  done
} > "$CORRELATION_DIR/timeline.md"

# Identify common error patterns
echo ""
echo "🔗 Step 4: Finding correlated errors..."
{
  echo "# Error Correlation Analysis"
  echo ""
  echo "## Common Error Patterns"
  echo ""
  
  # Find errors that appear in multiple services (likely cascading)
  all_errors=$(cat "$CORRELATION_DIR"/*.log | grep -o "Error: [^$]*" | sort -u)
  
  echo "$all_errors" | while read error_pattern; do
    if [ -z "$error_pattern" ]; then
      continue
    fi
    
    # Count how many services have this error
    count=0
    affected_services=""
    
    for service in "${SERVICES[@]}"; do
      if grep -q "$error_pattern" "$CORRELATION_DIR/$service.log" 2>/dev/null; then
        count=$((count + 1))
        affected_services="$affected_services $service"
      fi
    done
    
    # If error appears in 2+ services, it's correlated
    if [ $count -ge 2 ]; then
      echo "### $error_pattern"
      echo ""
      echo "**Affected Services ($count):** $affected_services"
      echo ""
      
      # Get AI explanation for this error pattern
      echo '```' 
      echo "$error_pattern" | oops --no-color 2>&1 | head -20
      echo '```'
      echo ""
      
      # This is likely a cascading error or common root cause
      if [ $count -ge 4 ]; then
        echo "🚨 **HIGH CORRELATION** - This error appears in $count/${{#SERVICES[@]}} services. Likely root cause!"
      else
        echo "⚠️ **MEDIUM CORRELATION** - May be cascading from root cause"
      fi
      echo ""
      echo "---"
      echo ""
    fi
  done
  
  echo "## Isolated Errors (Single Service)"
  echo ""
  echo "These errors are likely symptoms, not root causes:"
  echo ""
  
  echo "$all_errors" | while read error_pattern; do
    if [ -z "$error_pattern" ]; then
      continue
    fi
    
    count=0
    service_name=""
    
    for service in "${SERVICES[@]}"; do
      if grep -q "$error_pattern" "$CORRELATION_DIR/$service.log" 2>/dev/null; then
        count=$((count + 1))
        service_name="$service"
      fi
    done
    
    if [ $count -eq 1 ]; then
      echo "- **$service_name**: $error_pattern"
    fi
  done
  
} > "$CORRELATION_DIR/correlation.md"

# Generate root cause hypothesis
echo ""
echo "🎯 Step 5: Root cause hypothesis..."
{
  echo "# Root Cause Hypothesis"
  echo ""
  echo "Based on error correlation analysis:"
  echo ""
  
  # Find the earliest error in timeline
  first_error=$(head -2 "$CORRELATION_DIR/timeline.md" | tail -1)
  
  echo "## Timeline Analysis"
  echo ""
  echo "**First error detected:**"
  echo "$first_error"
  echo ""
  
  # Find most correlated error
  most_correlated=$(grep "HIGH CORRELATION" "$CORRELATION_DIR/correlation.md" -B 5 | grep "^### " | head -1)
  
  if [ -n "$most_correlated" ]; then
    echo "## Most Likely Root Cause"
    echo ""
    echo "$most_correlated"
    echo ""
    echo "This error appears in most services, suggesting it's the root cause rather than a symptom."
    echo ""
  fi
  
  echo "## Recommended Actions"
  echo ""
  echo "1. **Immediate**: Focus investigation on the first service to fail"
  echo "2. **Priority**: Fix errors with HIGH CORRELATION first"
  echo "3. **Verify**: Once root cause is fixed, other errors should resolve"
  echo "4. **Monitor**: Watch for error rate decrease across all services"
  
} > "$CORRELATION_DIR/root-cause.md"

# Generate summary report
{
  echo "# Production Error Correlation Report"
  echo ""
  echo "**Generated:** $(date)"
  echo "**Time Window:** Last 10 minutes"
  echo "**Services Analyzed:** ${SERVICES[@]}"
  echo ""
  
  total_errors=$(cat "$CORRELATION_DIR"/*.log 2>/dev/null | wc -l | tr -d ' ')
  echo "**Total Error Lines:** $total_errors"
  echo ""
  
  echo "## Summary"
  cat "$CORRELATION_DIR/root-cause.md"
  echo ""
  
  echo "## Full Timeline"
  cat "$CORRELATION_DIR/timeline.md"
  echo ""
  
  echo "## Detailed Correlation"
  cat "$CORRELATION_DIR/correlation.md"
  echo ""
  
  echo "## Service-Specific Analysis"
  for service in "${SERVICES[@]}"; do
    echo "### $service"
    echo '```'
    cat "$CORRELATION_DIR/$service-analysis.md" 2>/dev/null | head -30
    echo '```'
    echo ""
  done
  
  echo "---"
  echo "*Generated by error-correlation.sh with oops*"
  
} > "$CORRELATION_DIR/REPORT.md"

echo ""
echo "✅ Correlation analysis complete!"
echo ""
echo "📊 Results:"
echo "   - Total errors: $(cat "$CORRELATION_DIR"/*.log 2>/dev/null | wc -l | tr -d ' ')"
echo "   - Services with errors: $(ls "$CORRELATION_DIR"/*.log 2>/dev/null | wc -l | tr -d ' ')"
echo "   - Correlated patterns: $(grep -c "CORRELATION" "$CORRELATION_DIR/correlation.md" 2>/dev/null || echo "0")"
echo ""
echo "📄 Full report: $CORRELATION_DIR/REPORT.md"
echo "🎯 Root cause: $CORRELATION_DIR/root-cause.md"
echo ""
echo "💡 Tip: Share REPORT.md with incident response team"
```

**Output Example:**
```
🔍 Production Error Correlation Analysis
Timestamp: 20260209-070000
Output: error-correlation-20260209-070000/

📥 Step 1: Collecting recent error logs...
  → api-gateway
  → auth-service
  → payment-service
  → notification-service
  → database-proxy

🤖 Step 2: AI analysis of each service...
  → Analyzing api-gateway errors...
  → Analyzing auth-service errors...
  → No errors in payment-service
  → Analyzing notification-service errors...
  → Analyzing database-proxy errors...

⏰ Step 3: Building error timeline...

🔗 Step 4: Finding correlated errors...

🎯 Step 5: Root cause hypothesis...

✅ Correlation analysis complete!

📊 Results:
   - Total errors: 147
   - Services with errors: 4
   - Correlated patterns: 3

📄 Full report: error-correlation-20260209-070000/REPORT.md
🎯 Root cause: error-correlation-20260209-070000/root-cause.md

💡 Tip: Share REPORT.md with incident response team
```

**Root Cause Report:**
```markdown
# Root Cause Hypothesis

Based on error correlation analysis:

## Timeline Analysis

**First error detected:**
| 07:00:23 | database-proxy | Error: connection pool exhausted | 1 |

## Most Likely Root Cause

### Error: connection pool exhausted

This error appears in 4/5 services, suggesting it's the root cause rather than a symptom.

## Recommended Actions

1. **Immediate**: Focus investigation on the first service to fail (database-proxy)
2. **Priority**: Fix errors with HIGH CORRELATION first (connection pool)
3. **Verify**: Once root cause is fixed, other errors should resolve
4. **Monitor**: Watch for error rate decrease across all services
```

**Benefits:**
- Quickly identify root cause in complex multi-service failures
- Avoid chasing symptoms instead of root cause
- AI-powered analysis of each error stream
- Timeline visualization shows cascade order
- Automated correlation detection

---

### Workflow 2: Intelligent Error Replay & Testing

**Scenario:** Production error occurred. Need to reproduce it locally, understand it, and create a test case to prevent regression.

**Challenge:** Production errors often can't be reproduced locally due to different data, environment, or timing.

**Solution:**
```bash
#!/bin/bash
# error-replay.sh - Capture, analyze, and create test from production error

if [ $# -lt 1 ]; then
  echo "Usage: $0 <production-error-log-file>"
  exit 1
fi

ERROR_LOG="$1"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
REPLAY_DIR="error-replay-$TIMESTAMP"
mkdir -p "$REPLAY_DIR"

echo "🎬 Error Replay & Test Generation"
echo "Source: $ERROR_LOG"
echo "Output: $REPLAY_DIR/"
echo ""

# Step 1: AI analysis of the error
echo "🤖 Step 1: AI analysis of error..."
cat "$ERROR_LOG" | oops --verbose > "$REPLAY_DIR/analysis.md"

# Extract key information
echo ""
echo "📋 Step 2: Extracting error context..."

{
  echo "# Error Context"
  echo ""
  
  # Extract stack trace
  echo "## Stack Trace"
  echo '```'
  grep -A 20 "Error:\|Exception:" "$ERROR_LOG" | head -25
  echo '```'
  echo ""
  
  # Extract environment info
  echo "## Environment"
  if grep -q "node" "$ERROR_LOG"; then
    echo "- Runtime: Node.js $(grep -o "node v[0-9.]*" "$ERROR_LOG" | head -1)"
  elif grep -q "python" "$ERROR_LOG"; then
    echo "- Runtime: Python $(grep -o "Python [0-9.]*" "$ERROR_LOG" | head -1)"
  fi
  
  # Extract timestamp
  timestamp=$(grep -o "[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}T[0-9]\{2\}:[0-9]\{2\}:[0-9]\{2\}" "$ERROR_LOG" | head -1)
  echo "- Timestamp: $timestamp"
  echo ""
  
  # Extract input/request data if available
  echo "## Request Data"
  echo '```'
  grep -i "request\|input\|payload" "$ERROR_LOG" -A 3 | head -20
  echo '```'
  
} > "$REPLAY_DIR/context.md"

# Step 3: Generate reproduction script
echo ""
echo "🔧 Step 3: Generating reproduction script..."

# Detect language/framework
if grep -q "TypeError\|ReferenceError\|node" "$ERROR_LOG"; then
  LANG="javascript"
elif grep -q "Traceback\|python" "$ERROR_LOG"; then
  LANG="python"
elif grep -q "panic:\|golang" "$ERROR_LOG"; then
  LANG="go"
else
  LANG="unknown"
fi

echo "  → Detected language: $LANG"

case $LANG in
  javascript)
    {
      echo "// reproduce-error.js"
      echo "// Generated from: $ERROR_LOG"
      echo ""
      echo "const assert = require('assert');"
      echo ""
      echo "// Extract error type and message from log"
      error_type=$(grep -o "Error: [^$]*" "$ERROR_LOG" | head -1 | cut -d: -f1)
      error_msg=$(grep -o "Error: [^$]*" "$ERROR_LOG" | head -1 | cut -d: -f2-)
      
      echo "/**"
      echo " * Error from production:"
      echo " * $error_type:$error_msg"
      echo " */"
      echo ""
      echo "async function reproduceError() {"
      echo "  // TODO: Set up environment to match production"
      echo "  // - Database state"
      echo "  // - Input data"
      echo "  // - External service mocks"
      echo ""
      echo "  try {"
      echo "    // TODO: Replace with actual code that failed in production"
      echo "    // Extract from stack trace in $REPLAY_DIR/context.md"
      echo "    "
      echo "    // This should throw:"
      echo "    // $error_type: $error_msg"
      echo "  } catch (error) {"
      echo "    console.log('✅ Successfully reproduced error');"
      echo "    console.log('Error type:', error.constructor.name);"
      echo "    console.log('Error message:', error.message);"
      echo "    assert.strictEqual(error.message.includes('$(echo $error_msg | cut -c1-30)'), true);"
      echo "    return error;"
      echo "  }"
      echo ""
      echo "  throw new Error('❌ Failed to reproduce error - code did not throw');"
      echo "}"
      echo ""
      echo "reproduceError()"
      echo "  .then(() => console.log('Reproduction successful'))"
      echo "  .catch(err => {"
      echo "    console.error('Reproduction failed:', err);"
      echo "    process.exit(1);"
      echo "  });"
    } > "$REPLAY_DIR/reproduce-error.js"
    ;;
    
  python)
    {
      echo "# reproduce-error.py"
      echo "# Generated from: $ERROR_LOG"
      echo ""
      echo "import pytest"
      echo ""
      error_type=$(grep -o "[A-Za-z]*Error:" "$ERROR_LOG" | head -1 | tr -d ':')
      error_msg=$(grep -o "Error: [^$]*" "$ERROR_LOG" | head -1)
      
      echo '"""'
      echo "Error from production:"
      echo "$error_type: $error_msg"
      echo '"""'
      echo ""
      echo "def test_reproduce_production_error():"
      echo "    '''Reproduce production error to create regression test'''"
      echo "    # TODO: Set up environment to match production"
      echo "    "
      echo "    with pytest.raises($error_type) as exc_info:"
      echo "        # TODO: Replace with actual code that failed"
      echo "        # Extract from stack trace in $REPLAY_DIR/context.md"
      echo "        pass"
      echo "    "
      echo "    # Verify error message matches production"
      echo "    assert '$(echo $error_msg | cut -c1-30)' in str(exc_info.value)"
      echo ""
      echo "if __name__ == '__main__':"
      echo "    test_reproduce_production_error()"
      echo "    print('✅ Successfully reproduced error')"
    } > "$REPLAY_DIR/reproduce_error.py"
    ;;
esac

# Step 4: Generate regression test template
echo ""
echo "🧪 Step 4: Generating regression test..."

{
  echo "# Regression Test Plan"
  echo ""
  echo "## Purpose"
  echo "Ensure the production error from $(date) does not happen again."
  echo ""
  echo "## Steps to Create Test"
  echo ""
  echo "1. **Reproduce locally:**"
  echo "   - Run \`$REPLAY_DIR/reproduce-error.$([[ $LANG == 'javascript' ]] && echo 'js' || echo 'py')\`"
  echo "   - Confirm error is reproduced exactly"
  echo ""
  echo "2. **Identify root cause:**"
  echo "   - Read AI analysis: \`$REPLAY_DIR/analysis.md\`"
  echo "   - Debug to find exact cause"
  echo ""
  echo "3. **Fix the bug:**"
  echo "   - Implement fix in source code"
  echo "   - Run reproduction script → should now pass"
  echo ""
  echo "4. **Convert to regression test:**"
  echo "   - Copy reproduction script to \`tests/regression/\`"
  echo "   - Add assertions for correct behavior"
  echo "   - Add to CI pipeline"
  echo ""
  echo "5. **Verify fix:**"
  echo "   - All tests pass (including new regression test)"
  echo "   - Deploy to staging"
  echo "   - Monitor for 24h"
  echo ""
  echo "## Test Case Template"
  echo ""
  echo '```'
  cat "$REPLAY_DIR/reproduce-error.$([[ $LANG == 'javascript' ]] && echo 'js' || echo 'py')" 2>/dev/null
  echo '```'
  echo ""
  echo "## Acceptance Criteria"
  echo ""
  echo "- [ ] Error is reproduced locally with 100% consistency"
  echo "- [ ] Root cause identified and documented"
  echo "- [ ] Fix implemented and tested"
  echo "- [ ] Regression test added to test suite"
  echo "- [ ] CI passes with new test"
  echo "- [ ] Production monitoring shows error rate = 0"
  
} > "$REPLAY_DIR/regression-test-plan.md"

# Step 5: Create checklist
echo ""
echo "✅ Step 5: Creating checklist..."

{
  echo "# Error Replay Checklist"
  echo ""
  echo "## Analysis Phase"
  echo "- [ ] Read AI analysis (\`analysis.md\`)"
  echo "- [ ] Review error context (\`context.md\`)"
  echo "- [ ] Understand stack trace"
  echo "- [ ] Identify input data that triggered error"
  echo ""
  echo "## Reproduction Phase"
  echo "- [ ] Run reproduction script locally"
  echo "- [ ] Match production environment (Node version, dependencies, etc.)"
  echo "- [ ] Reproduce error with 100% consistency"
  echo "- [ ] Document reproduction steps"
  echo ""
  echo "## Fix Phase"
  echo "- [ ] Identify root cause (not just symptom)"
  echo "- [ ] Implement fix"
  echo "- [ ] Verify fix with reproduction script"
  echo "- [ ] Add edge case tests"
  echo ""
  echo "## Testing Phase"
  echo "- [ ] Convert reproduction script to regression test"
  echo "- [ ] Add test to \`tests/regression/\` directory"
  echo "- [ ] Ensure test fails without fix"
  echo "- [ ] Ensure test passes with fix"
  echo "- [ ] Add to CI pipeline"
  echo ""
  echo "## Deployment Phase"
  echo "- [ ] All tests pass locally"
  echo "- [ ] Code review approved"
  echo "- [ ] Deploy to staging"
  echo "- [ ] Monitor for 24h (no recurrence)"
  echo "- [ ] Deploy to production"
  echo "- [ ] Monitor production metrics"
  echo ""
  echo "## Documentation Phase"
  echo "- [ ] Document root cause in post-mortem"
  echo "- [ ] Update error handling docs"
  echo "- [ ] Share learnings with team"
  
} > "$REPLAY_DIR/CHECKLIST.md"

echo ""
echo "✅ Error replay setup complete!"
echo ""
echo "📁 Files generated:"
echo "   - analysis.md - AI explanation of error"
echo "   - context.md - Extracted error context"
echo "   - reproduce-error.$([[ $LANG == 'javascript' ]] && echo 'js' || echo 'py') - Reproduction script"
echo "   - regression-test-plan.md - Test creation guide"
echo "   - CHECKLIST.md - Step-by-step checklist"
echo ""
echo "📋 Next steps:"
echo "   1. Read CHECKLIST.md"
echo "   2. Run reproduce-error.$([[ $LANG == 'javascript' ]] && echo 'js' || echo 'py')"
echo "   3. Follow regression-test-plan.md"
echo ""
echo "🎯 Goal: Turn this production error into a regression test"
```

**Benefits:**
- Systematic approach to reproducing production errors
- AI-powered error analysis guides debugging
- Automated test generation from production errors
- Ensures every production bug becomes a regression test
- Prevents same error from happening twice

---

### Workflow 3: Error-Driven Development (EDD) Pipeline

**Scenario:** Integrate error analysis into development workflow to catch errors earlier and learn from them continuously.

**Challenge:** Developers ignore errors until production, missing opportunities to learn and improve code quality.

**Solution:**
```bash
#!/bin/bash
# edd-pipeline.sh - Error-Driven Development CI/CD integration

# Install as Git hooks, CI pipeline, or local dev tool

MODE="${1:-pre-commit}"  # pre-commit, pre-push, ci, watch

ERROR_DB=".edd/error-database.jsonl"
ERROR_STATS=".edd/stats.json"
mkdir -p .edd

case $MODE in
  pre-commit)
    echo "🔍 EDD: Pre-commit error check..."
    
    # Run tests, capture errors
    npm test 2>&1 | tee /tmp/edd-test-output
    
    if [ ${PIPESTATUS[0]} -ne 0 ]; then
      echo ""
      echo "⚠️  Tests failed. Analyzing errors..."
      echo ""
      
      # Analyze with oops
      cat /tmp/edd-test-output | oops > /tmp/edd-analysis
      
      # Show analysis
      cat /tmp/edd-analysis
      
      # Log error to database
      {
        echo "{\"timestamp\":\"$(date -Iseconds)\",\"phase\":\"pre-commit\",\"type\":\"test-failure\"}"
      } >> "$ERROR_DB"
      
      echo ""
      read -p "Continue commit despite test failures? (y/N): " -n 1 -r
      echo
      if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
      fi
    fi
    ;;
    
  pre-push)
    echo "🔍 EDD: Pre-push validation..."
    
    # Run full build
    npm run build 2>&1 | tee /tmp/edd-build-output
    
    if [ ${PIPESTATUS[0]} -ne 0 ]; then
      echo ""
      echo "🚨 Build failed before push!"
      echo ""
      
      # Analyze build errors
      cat /tmp/edd-build-output | oops --severity error
      
      # Log
      echo "{\"timestamp\":\"$(date -Iseconds)\",\"phase\":\"pre-push\",\"type\":\"build-failure\"}" >> "$ERROR_DB"
      
      echo ""
      echo "❌ Fix build errors before pushing"
      exit 1
    fi
    
    # Check for new console.log/debugger statements
    if git diff origin/main HEAD | grep -E "console\.(log|error|warn|debug)|debugger"; then
      echo ""
      echo "⚠️  Found debugging statements in diff:"
      git diff origin/main HEAD | grep -E "console\.|debugger" --color
      echo ""
      read -p "Remove debugging code before push? (Y/n): " -n 1 -r
      echo
      if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        echo "Please remove debugging statements and try again"
        exit 1
      fi
    fi
    ;;
    
  ci)
    echo "🔍 EDD: CI Pipeline error analysis..."
    
    # Collect all errors from CI logs
    {
      npm run lint 2>&1
      npm test 2>&1
      npm run build 2>&1
      npm run e2e 2>&1
    } > /tmp/edd-ci-full-log 2>&1
    
    # Extract only errors
    grep -i "error\|fail\|exception" /tmp/edd-ci-full-log > /tmp/edd-errors || true
    
    if [ -s /tmp/edd-errors ]; then
      echo ""
      echo "📊 CI Error Summary:"
      echo ""
      
      # Analyze errors
      cat /tmp/edd-errors | oops --severity error > /tmp/edd-ci-analysis
      
      # Post to PR as comment (if in PR context)
      if [ -n "$GITHUB_PR_NUMBER" ]; then
        {
          echo "## 🤖 Error-Driven Development Analysis"
          echo ""
          echo "<details>"
          echo "<summary>AI Analysis of CI Errors</summary>"
          echo ""
          echo '```'
          cat /tmp/edd-ci-analysis
          echo '```'
          echo ""
          echo "</details>"
        } > /tmp/pr-comment.md
        
        gh pr comment "$GITHUB_PR_NUMBER" --body-file /tmp/pr-comment.md
      fi
      
      # Update error stats
      error_count=$(wc -l < /tmp/edd-errors | tr -d ' ')
      {
        echo "{"
        echo "  \"timestamp\": \"$(date -Iseconds)\","
        echo "  \"ci_run\": \"$GITHUB_RUN_ID\","
        echo "  \"error_count\": $error_count,"
        echo "  \"analysis\": \"$(cat /tmp/edd-ci-analysis | head -10 | tr '\n' ' ')\""
        echo "}"
      } >> "$ERROR_DB"
      
      exit 1
    fi
    ;;
    
  watch)
    echo "👀 EDD: Watch mode - learning from errors in real-time..."
    echo "Press Ctrl+C to stop"
    echo ""
    
    # Watch for file changes, run tests, analyze errors
    while true; do
      # Use fswatch, inotify, or fallback to sleep
      if command -v fswatch >/dev/null; then
        fswatch -1 src/ tests/
      else
        sleep 5
      fi
      
      echo ""
      echo "🔄 Files changed, running tests..."
      
      npm test 2>&1 | tee /tmp/edd-watch-output
      
      if [ ${PIPESTATUS[0]} -ne 0 ]; then
        echo ""
        echo "💡 Error detected! AI analysis:"
        echo ""
        cat /tmp/edd-watch-output | oops --severity error
        echo ""
        
        # Log error pattern for learning
        error_signature=$(cat /tmp/edd-watch-output | grep -i "error:" | head -1 | md5sum | cut -d' ' -f1)
        
        # Check if we've seen this error before
        if grep -q "$error_signature" "$ERROR_DB" 2>/dev/null; then
          echo "📚 Note: You've encountered this error before. Check $ERROR_DB for history."
        else
          echo "🆕 New error pattern detected and logged"
          echo "{\"timestamp\":\"$(date -Iseconds)\",\"phase\":\"watch\",\"signature\":\"$error_signature\"}" >> "$ERROR_DB"
        fi
      else
        echo "✅ All tests passed!"
      fi
    done
    ;;
    
  stats)
    echo "📊 Error-Driven Development Statistics"
    echo ""
    
    if [ ! -f "$ERROR_DB" ]; then
      echo "No error data collected yet"
      exit 0
    fi
    
    total_errors=$(wc -l < "$ERROR_DB" | tr -d ' ')
    
    echo "Total errors logged: $total_errors"
    echo ""
    
    echo "Errors by phase:"
    echo "  Pre-commit: $(grep -c '"phase":"pre-commit"' "$ERROR_DB" || echo "0")"
    echo "  Pre-push:   $(grep -c '"phase":"pre-push"' "$ERROR_DB" || echo "0")"
    echo "  CI:         $(grep -c '"phase":"ci"' "$ERROR_DB" || echo "0")"
    echo "  Watch:      $(grep -c '"phase":"watch"' "$ERROR_DB" || echo "0")"
    echo ""
    
    echo "Recent errors:"
    tail -5 "$ERROR_DB" | while read line; do
      timestamp=$(echo "$line" | grep -o '"timestamp":"[^"]*"' | cut -d'"' -f4)
      phase=$(echo "$line" | grep -o '"phase":"[^"]*"' | cut -d'"' -f4)
      echo "  [$timestamp] $phase"
    done
    ;;
    
  install)
    echo "📦 Installing EDD pipeline..."
    
    # Install git hooks
    cat > .git/hooks/pre-commit <<'EOF'
#!/bin/bash
./.edd/edd-pipeline.sh pre-commit
EOF
    chmod +x .git/hooks/pre-commit
    
    cat > .git/hooks/pre-push <<'EOF'
#!/bin/bash
./.edd/edd-pipeline.sh pre-push
EOF
    chmod +x .git/hooks/pre-push
    
    # Copy this script to .edd/
    mkdir -p .edd
    cp "$0" .edd/edd-pipeline.sh
    chmod +x .edd/edd-pipeline.sh
    
    echo "✅ EDD pipeline installed!"
    echo ""
    echo "Git hooks added:"
    echo "  - Pre-commit: Test validation with AI analysis"
    echo "  - Pre-push: Build validation and debug code check"
    echo ""
    echo "Additional commands:"
    echo "  ./.edd/edd-pipeline.sh watch  - Watch mode (auto-analyze on file change)"
    echo "  ./.edd/edd-pipeline.sh stats  - View error statistics"
    ;;
    
  *)
    echo "Usage: $0 {pre-commit|pre-push|ci|watch|stats|install}"
    exit 1
    ;;
esac
```

**Installation:**
```bash
# Install EDD pipeline in your project
curl -o edd-pipeline.sh https://example.com/edd-pipeline.sh
chmod +x edd-pipeline.sh
./edd-pipeline.sh install
```

**Daily workflow:**
```bash
# 1. Watch mode during development
./edd/edd-pipeline.sh watch
# → Automatically analyzes errors as you code

# 2. Git commit triggers pre-commit hook
git add .
git commit -m "feat: add new feature"
# → Runs tests, analyzes failures with oops

# 3. Git push triggers pre-push hook
git push
# → Validates build, checks for debug code

# 4. CI pipeline analyzes errors
# → Posts AI analysis as PR comment

# 5. Check error stats weekly
./edd/edd-pipeline.sh stats
# → See patterns, improve code quality
```

**Benefits:**
- Shift-left error detection (catch errors before production)
- Learn from every error with AI guidance
- Build error knowledge base over time
- Identify recurring error patterns
- Improve code quality through continuous feedback

---

## Performance Tips

### 1. **Use Shell Aliases for Speed**

Create shortcuts for common error-prone commands:

```bash
# Add to ~/.bashrc or ~/.zshrc
alias oops-npm='npm run build 2>&1 | oops'
alias oops-test='npm test 2>&1 | oops'
alias oops-py='python 2>&1 | oops'
alias oops-go='go build 2>&1 | oops'
alias oops-docker='docker build . 2>&1 | oops'
alias oops-k8s='kubectl logs 2>&1 | oops'
```

Now you can just type:
```bash
$ oops-npm
$ oops-test
```

---

### 2. **Optimize API Response Time**

The default model (`claude-sonnet-4-5`) balances speed and accuracy. If you need faster responses and errors are straightforward:

```bash
# Modify bin/oops.js to use faster model
model: 'claude-haiku-4-5'  // ~0.3-0.5s vs 0.8-1.2s
```

For complex errors (like multi-layer stack traces), stick with Sonnet for better accuracy.

---

### 3. **Cache Common Errors Locally (Future Feature)**

If you keep hitting the same error (e.g., during iteration on a bug), consider creating a local cache:

```bash
# Save solution for reuse
$ npm run build 2>&1 | oops > ~/errors/build-cache.txt

# Next time it fails
$ cat ~/errors/build-cache.txt
```

This is a manual workaround until caching is built in (see Roadmap).

---

### 4. **Reduce Input Size**

Claude has token limits. If your error output is massive (e.g., 10,000 lines), trim it first:

```bash
# Only send last 100 lines
$ npm run build 2>&1 | tail -100 | oops

# Or just the error section
$ npm run build 2>&1 | grep -A 20 "Error:"  | oops
```

This speeds up processing and reduces API costs.

---

### 5. **Parallelize for Batch Processing**

If you're debugging multiple services/files, run in parallel:

```bash
# GNU parallel example
$ ls *.py | parallel 'python {} 2>&1 | oops > {}.solution'

# Check all solutions
$ cat *.solution
```

---

### 6. **Set Environment Variables Globally**

Don't redefine `ANTHROPIC_API_KEY` in every session:

```bash
# Add to ~/.bashrc or ~/.zshrc ONCE
export ANTHROPIC_API_KEY="sk-ant-..."
```

Then `source ~/.bashrc` to reload.

---

### 7. **Use `npx` for One-off Fixes, Install Globally for Regular Use**

If you use `oops` daily, install globally to avoid npx overhead:

```bash
# npx adds ~0.5-1s startup time
$ time npx oops-cli
# real 0m1.234s

# global install is instant
$ npm install -g oops-cli
$ time oops
# real 0m0.045s
```

For occasional use, `npx` is fine. For everyday debugging, go global.

---

### 8. **Combine with Watch Mode for Rapid Iteration**

When actively debugging, combine with file watchers:

```bash
# Auto-analyze errors on file change
$ nodemon --exec 'npm test 2>&1 | oops' src/
```

This way every test run gets auto-analyzed.

## Troubleshooting

### 1. **"ANTHROPIC_API_KEY not set" error**

**Problem:**
```bash
$ npm run build 2>&1 | oops
Error: ANTHROPIC_API_KEY not set
Set it with: export ANTHROPIC_API_KEY=your-key-here
```

**Solutions:**

a) Set for current session:
```bash
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

b) Make it permanent (add to shell config):
```bash
# For bash
echo 'export ANTHROPIC_API_KEY="sk-ant-your-key"' >> ~/.bashrc
source ~/.bashrc

# For zsh
echo 'export ANTHROPIC_API_KEY="sk-ant-your-key"' >> ~/.zshrc
source ~/.zshrc
```

c) Verify it's set:
```bash
echo $ANTHROPIC_API_KEY
# Should print: sk-ant-...
```

---

### 2. **"No input received" error**

**Problem:**
```bash
$ oops
No input received. Pipe an error message to oops:
  npm run build 2>&1 | oops
```

**Solutions:**

a) Make sure you're piping data:
```bash
# Wrong ❌
$ oops npm run build

# Right ✅
$ npm run build 2>&1 | oops
```

b) If command succeeded (no error), `oops` has nothing to analyze:
```bash
$ echo "Success! No errors" 2>&1 | oops
# Will analyze the text anyway, but not useful
```

c) Test with a known error:
```bash
$ node -e "require('nonexistent')" 2>&1 | oops
# Should work
```

---

### 3. **API rate limit exceeded**

**Problem:**
```bash
$ npm test 2>&1 | oops
Error analyzing: rate_limit_error: API rate limit exceeded
```

**Solutions:**

a) Wait a minute and retry (Anthropic has per-minute rate limits)

b) Check your rate limits at [console.anthropic.com](https://console.anthropic.com/settings/limits)

c) For batch processing, add delays:
```bash
for file in *.py; do
  python "$file" 2>&1 | oops
  sleep 2  # Wait 2 seconds between calls
done
```

d) Upgrade to a higher tier plan if you're hitting limits regularly

---

### 4. **Command not found: oops**

**Problem:**
```bash
$ npm install -g oops-cli
$ oops
zsh: command not found: oops
```

**Solutions:**

a) Check if npm global bin directory is in PATH:
```bash
$ npm config get prefix
# Should show something like /usr/local or ~/.npm-global

$ echo $PATH
# Should include the bin directory from above
```

b) Fix PATH (add to ~/.bashrc or ~/.zshrc):
```bash
export PATH="$PATH:$(npm config get prefix)/bin"
source ~/.bashrc  # or ~/.zshrc
```

c) Verify installation:
```bash
$ npm list -g oops-cli
# Should show oops-cli@1.0.0
```

d) Alternative: Use npx (doesn't require global install):
```bash
$ npx oops-cli
```

---

### 5. **Colored output is broken / weird characters**

**Problem:**
```bash
$ npm test 2>&1 | oops
[32mProblem:[0m Cannot find...
```

**Solutions:**

a) Your terminal might not support ANSI colors. Disable them:
```bash
$ npm test 2>&1 | oops --no-color
```

b) Check if terminal supports colors:
```bash
$ echo $TERM
# Should be xterm-256color or similar

# If it's 'dumb', colors won't work
export TERM=xterm-256color
```

c) Add alias for no-color mode:
```bash
alias oops='oops --no-color'
```

---

### 6. **Network/connection errors**

**Problem:**
```bash
$ npm test 2>&1 | oops
Error analyzing: connect ETIMEDOUT 151.101.1.57:443
```

**Solutions:**

a) Check internet connection:
```bash
$ curl https://api.anthropic.com
```

b) Check if firewall/VPN is blocking Anthropic API

c) Set proxy if behind corporate firewall:
```bash
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

d) Retry with longer timeout (modify code if needed)

---

### 7. **Very slow responses (>10 seconds)**

**Problem:**
```bash
$ docker build . 2>&1 | oops
# ...waiting 15 seconds...
```

**Solutions:**

a) Large input slows processing. Trim error output:
```bash
# Only send relevant error section
$ docker build . 2>&1 | tail -100 | oops
```

b) Check Anthropic API status:
```bash
$ curl -I https://api.anthropic.com
# HTTP/1.1 200 OK = service is up
```

c) Your API key tier might affect speed (free tier can be slower during peak)

d) Network latency - test your connection:
```bash
$ ping api.anthropic.com
```

---

### 8. **Getting generic unhelpful responses**

**Problem:**
```bash
$ some-obscure-tool 2>&1 | oops

Problem: Tool failed
Solution: Check the documentation
```

**Solutions:**

a) Use `--verbose` mode for more context:
```bash
$ some-obscure-tool 2>&1 | oops --verbose
```

b) Provide more context by including command output:
```bash
$ some-obscure-tool --help 2>&1 > context.txt
$ some-obscure-tool 2>&1 | cat context.txt - | oops
```

c) If error is truly obscure, Claude might not have training data for it. Fall back to manual debugging.

---

### 9. **Incorrect or outdated solutions**

**Problem:**
```bash
$ npm run build 2>&1 | oops

# Suggests a solution that doesn't work
```

**Solutions:**

a) AI models can suggest outdated syntax. Always verify solutions.

b) Check version compatibility:
```bash
$ node --version
$ npm --version
# Make sure suggested solution matches your version
```

c) Provide more context about your environment:
```bash
$ (echo "Node: $(node --version)"; npm run build 2>&1) | oops
```

d) Try `--verbose` mode which often provides multiple approaches

e) Cross-reference with official documentation when in doubt

---

### 10. **Windows-specific issues (2>&1 not working)**

**Problem:**
```bash
C:\project> npm test 2>&1 | oops
# Doesn't capture stderr properly
```

**Solutions:**

a) Use PowerShell instead of CMD:
```powershell
PS> npm test 2>&1 | oops
```

b) Or use CMD with proper syntax:
```cmd
npm test 2>&1 | npx oops-cli
```

c) For complex scenarios, save to file first:
```cmd
npm test > error.log 2>&1
type error.log | oops
```

---

### 11. **Permission denied installing globally**

**Problem:**
```bash
$ npm install -g oops-cli
npm ERR! Error: EACCES: permission denied
```

**Solutions:**

a) Use a node version manager (recommended):
```bash
# Install nvm (macOS/Linux)
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
$ nvm install node
$ npm install -g oops-cli  # No sudo needed!
```

b) Fix npm permissions (alternative):
```bash
$ mkdir ~/.npm-global
$ npm config set prefix '~/.npm-global'
$ echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
$ source ~/.bashrc
$ npm install -g oops-cli
```

c) Use npx (no global install needed):
```bash
$ npx oops-cli
```

d) Last resort (NOT recommended):
```bash
$ sudo npm install -g oops-cli
# This can cause permission issues later
```

---

### 12. **Multiline errors get truncated**

**Problem:**
```bash
$ npm run build 2>&1 | oops
# Only shows first line of stack trace
```

**Solutions:**

a) This shouldn't happen normally. Check if your shell is truncating:
```bash
# Test full capture
$ npm run build 2>&1 | tee full-error.txt | oops
$ cat full-error.txt  # Verify all output is there
```

b) If piping through other tools, make sure they preserve full output:
```bash
# Wrong - head truncates
$ npm run build 2>&1 | head | oops

# Right
$ npm run build 2>&1 | oops
```

c) For very long errors, increase buffer size (modify source code if needed)

## Frequently Asked Questions (FAQ)

### 1. **Is my error data sent to Anthropic's servers?**

**Yes.** When you pipe an error to `oops`, it sends the error text to Anthropic's Claude API for analysis. 

**Security note:** Do NOT pipe errors containing:
- API keys or passwords
- Database credentials
- Private tokens
- PII (personally identifiable information)
- Proprietary code you can't share

Anthropic's privacy policy: https://www.anthropic.com/legal/privacy

---

### 2. **How much does it cost to use?**

`oops` is free and open-source. However, it uses the Anthropic Claude API which has usage costs:

- **Free tier:** $5 credit (usually enough for ~500-1000 `oops` calls)
- **After that:** ~$0.003-0.015 per error analysis (0.3-1.5 cents)
- **Monthly estimate:** If you analyze 50 errors/day: ~$15-20/month

Check current pricing: https://www.anthropic.com/pricing

---

### 3. **Can I use this offline?**

**No.** `oops` requires internet connection to reach Anthropic's API.

**Alternatives for offline:**
- Save common solutions locally in a notes file
- Use traditional debugging (logs, print statements)
- Set up a local LLM (complex, beyond scope of this tool)

---

### 4. **What languages/frameworks does it support?**

`oops` auto-detects and supports:

✅ JavaScript/TypeScript/Node.js  
✅ Python  
✅ Go  
✅ Rust  
✅ Java/Kotlin  
✅ C/C++  
✅ Ruby  
✅ PHP  
✅ Docker  
✅ Kubernetes  
✅ Git  
✅ Shell/Bash  
✅ Database errors (PostgreSQL, MySQL, MongoDB)  
✅ Build tools (Webpack, Vite, Rollup)  
✅ CI/CD (GitHub Actions, GitLab CI)  

The AI model (Claude) has broad knowledge, so even obscure tools often get good results.

---

### 5. **Does it work with warnings, not just errors?**

**Currently, no.** `oops` is optimized for error messages (non-zero exit codes, stack traces, exceptions).

**Workaround:** Pipe warnings manually:
```bash
$ npm run lint 2>&1 | oops
```

**Future:** Warning analysis is on the roadmap (see Roadmap section).

---

### 6. **Can I customize the output format?**

Not currently. The format is optimized for readability in terminal.

**Workaround:** Parse output with standard tools:
```bash
$ npm run build 2>&1 | oops | grep "Solution:"
```

**Future:** JSON output mode is planned for programmatic use.

---

### 7. **Why does it sometimes give wrong answers?**

AI models can hallucinate or suggest outdated solutions. This happens when:
- Error is from a very new library version
- Error is extremely rare/obscure
- Context is ambiguous

**Best practice:** Always verify solutions before running them, especially in production.

---

### 8. **Can I use a different AI model (GPT-4, Gemini, etc.)?**

**Currently, no.** `oops` is built specifically for Anthropic Claude.

**Why Claude?**
- Excellent reasoning for technical debugging
- Fast response times (Sonnet model)
- Good at following instructions (concise output)

**Future:** Multi-model support is on the roadmap.

---

### 9. **Does it store my errors anywhere?**

**No local storage.** `oops` doesn't save errors on your machine.

**API-side:** Anthropic may temporarily log API requests for abuse prevention. Check their privacy policy for retention details.

---

### 10. **Can I contribute to the project?**

**Absolutely!** Contributions welcome:

- Report bugs via GitHub Issues
- Suggest features
- Submit pull requests
- Improve error detection logic
- Add support for new languages/frameworks

See [Contributing](#contributing) section for details.

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

**Git pre-commit hook:**
```bash
#!/bin/bash
# .git/hooks/pre-commit
npm run build 2>&1 | oops || exit 1
```

**Create project-specific wrappers:**
```bash
# scripts/debug.sh
#!/bin/bash
docker-compose logs api 2>&1 | tail -50 | oops
```

## Roadmap

### v1.1 (Next Release)
- [ ] **Local caching** - Remember solutions for repeated errors
- [ ] **JSON output mode** - Structured output for scripting: `oops --json`
- [ ] **Config file support** - `~/.oopsrc` for default model, verbosity, etc.
- [ ] **Warning analysis** - Not just errors, but also linter warnings
- [ ] **Diff mode** - Compare error before/after a code change

### v1.2
- [ ] **Interactive mode** - Ask follow-up questions: "Why did this fail?"
- [ ] **Multi-model support** - Use GPT-4, Gemini, or local models
- [ ] **Error history** - `oops --history` to see past analyses
- [ ] **Batch processing** - Analyze multiple error logs: `oops *.log`
- [ ] **Performance profiling** - Detect slow queries, memory leaks from errors

### v2.0 (Future)
- [ ] **Auto-fix mode** - Apply solutions automatically with confirmation
- [ ] **Web dashboard** - Browse error history, statistics
- [ ] **Team features** - Share common error solutions across team
- [ ] **IDE integrations** - VS Code, IntelliJ plugins
- [ ] **Slack/Discord bot** - Paste errors, get solutions
- [ ] **Learning mode** - Improve suggestions based on your feedback

### Community Requests
- [ ] Windows support improvements
- [ ] Docker container for sandboxed runs
- [ ] Support for log aggregation tools (Datadog, Splunk)
- [ ] Offline mode with cached solutions

**Want to prioritize a feature?** Open a GitHub issue or +1 existing ones!

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

**Project structure:**
```
oops/
├── bin/
│   └── oops.js          # CLI entry point
├── lib/
│   ├── detector.js      # Language/framework detection
│   └── formatter.js     # Output formatting
├── test.js              # Test suite
├── package.json
└── README.md
```

**Adding new language detection:**
Edit `lib/detector.js`:
```javascript
function detectContext(errorText) {
  if (errorText.includes('Traceback')) return { language: 'python' };
  if (errorText.includes('error[E0')) return { language: 'rust' };
  // Add your pattern here
}
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

**Code style:**
- Use ESLint (config included)
- Follow existing patterns
- Add comments for non-obvious logic
- Update README if changing behavior

## Limitations

- Requires API key (uses Claude AI)
- Internet connection needed
- Best with English error messages
- May not catch extremely obscure errors
- Solutions can occasionally be outdated (verify before use)
- No offline mode

## Privacy

`oops` sends error messages to Anthropic's Claude API for analysis. Don't pipe sensitive information (passwords, keys, tokens) through it.

Error messages are processed through Anthropic's API - check their [privacy policy](https://www.anthropic.com/legal/privacy) if you have concerns.

**What is sent:**
- Error message text
- Detected language/framework context
- No file contents (unless included in error output)
- No system information beyond what's in the error

**Not sent:**
- Your source code (unless in stack trace)
- Environment variables (unless in error output)
- File system paths (unless in error output)

**Best practice:** Review error output before piping to ensure no secrets are included.

## License

MIT

---

Made by [muin](https://github.com/muinmomin)

*Stop Googling errors. Pipe them to AI instead.*
