<div align="center">

# 💥 oops

**Turn cryptic error messages into actionable fixes**

[![npm version](https://img.shields.io/npm/v/oops-ai?color=red&label=npm)](https://www.npmjs.com/package/oops-ai)
[![npm downloads/week](https://img.shields.io/npm/dw/oops-ai.svg)](https://www.npmjs.com/package/oops-ai)
[![npm downloads/month](https://img.shields.io/npm/dm/oops-ai.svg)](https://www.npmjs.com/package/oops-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/oops-ai.svg)](https://nodejs.org)

<br/>

<img src="./demo.gif" alt="oops demo" width="700"/>

<br/>

*Pipe any error → AI analysis → copy-paste fix. Under 2 seconds.*

</div>

---

## The Problem

Your build breaks. A 40-line stack trace stares back at you. You copy the error, open a browser, paste it into Google, click three Stack Overflow links from 2017, try two solutions that don't work, dig through GitHub issues, and finally find the fix 15 minutes later.

**Meanwhile, your flow state is gone.**

**`oops` is your error message decoder:** pipe cryptic errors to AI, get actionable fixes instantly, stay in the terminal, and keep coding.

---

## Quick Start (30 seconds)

```bash
# Option 1: Use without installing (fastest)
npx oops-ai

# Option 2: Install globally
npm install -g oops-ai

# Set your API key (get one at console.anthropic.com)
export ANTHROPIC_API_KEY="sk-ant-..."
```

**That's it.** Now pipe any error:

```bash
npm run build 2>&1 | oops
python script.py 2>&1 | oops
cargo build 2>&1 | oops
docker build . 2>&1 | oops
kubectl logs pod/api-xyz 2>&1 | oops
```

> **Why `2>&1`?** This redirects stderr (where errors live) to stdout so `oops` catches everything.

---

## Real Error Scenarios: Before → After

### 1. `ENOENT: no such file or directory`

<table>
<tr>
<td width="50%">

**Before** 😩
```
$ npm run dev
Error: ENOENT: no such file or directory, 
open '/Users/dev/app/config/database.json'
    at Object.openSync (node:fs:603:3)
    at Object.readFileSync (node:fs:471:35)
    at loadConfig (/app/server.js:12:18)
    ... 18 more lines ...

*Google: "ENOENT error node"*
*Stack Overflow: "What is ENOENT?"*
*15 minutes later: finally check if file exists*
```

</td>
<td width="50%">

**After** ⚡
```
$ npm run dev 2>&1 | oops

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem: File not found
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Missing: config/database.json

Solution:
  1. Create the file:
     $ mkdir -p config
     $ touch config/database.json
  
  2. Or check path typo in server.js:12

Why: ENOENT = Error NO ENTry (file doesn't exist)

Done. 0.9s ✓
```

</td>
</tr>
</table>

### 2. `EADDRINUSE: address already in use`

<table>
<tr>
<td width="50%">

**Before** 😩
```
$ npm start
Error: listen EADDRINUSE: address already in use :::3000
    at Server.setupListenHandle [as _listen2] (node:net:1380:16)
    at listenInCluster (node:net:1428:12)
    at Server.listen (node:net:1515:7)
    ... 12 more lines ...

*Google: "port 3000 already in use"*
*Try: lsof -i :3000 (what does this do?)*
*Copy PID, kill, restart*
*5 minutes of trial and error*
```

</td>
<td width="50%">

**After** ⚡
```
$ npm start 2>&1 | oops

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem: Port 3000 already in use
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Another process is using port 3000

Solution:
  # Option 1: Kill the process
  $ lsof -ti :3000 | xargs kill -9

  # Option 2: Use a different port
  $ PORT=3001 npm start

Pro tip: Install portguard to avoid this:
  $ npx portguard 3000

Done. 0.7s ✓
```

</td>
</tr>
</table>

### 3. `Cannot find module 'xyz'`

<table>
<tr>
<td width="50%">

**Before** 😩
```
$ node server.js
Error: Cannot find module 'express'
Require stack:
- /Users/dev/app/server.js
- /Users/dev/app/index.js
    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:1075:15)
    at Function.Module._load (node:internal/modules/cjs/loader:920:27)
    ... 22 more lines ...

*Google: "Cannot find module express"*
*Stack Overflow: "Did you npm install?"*
*Me: "I thought I did..."*
*Checks package.json, missing dependency*
*3 minutes wasted*
```

</td>
<td width="50%">

**After** ⚡
```
$ node server.js 2>&1 | oops

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem: Missing npm package
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

'express' is not installed

Solution:
  $ npm install express

If it's a dev dependency:
  $ npm install --save-dev express

Why: Node can't find the module because 
it's not in node_modules/

Done. 0.6s ✓
```

</td>
</tr>
</table>

### 4. `Permission denied (EACCES)`

<table>
<tr>
<td width="50%">

**Before** 😩
```
$ npm install -g typescript
npm ERR! code EACCES
npm ERR! syscall mkdir
npm ERR! path /usr/local/lib/node_modules/typescript
npm ERR! errno -13
npm ERR! Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/typescript'
npm ERR! [Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/typescript'] {
npm ERR!   errno: -13,
npm ERR!   code: 'EACCES',
npm ERR!   syscall: 'mkdir',
npm ERR!   path: '/usr/local/lib/node_modules/typescript'
npm ERR! }

*Google: "npm EACCES permission denied"*
*Stack Overflow: "Use sudo" (risky!)*
*Another answer: "Fix npm permissions" (how?)*
*10 minutes of frustration*
```

</td>
<td width="50%">

**After** ⚡
```
$ npm install -g typescript 2>&1 | oops

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem: Permission denied (npm global)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Can't write to /usr/local/lib/node_modules

Solution (safe):
  # Fix npm permissions once
  $ mkdir ~/.npm-global
  $ npm config set prefix '~/.npm-global'
  $ echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
  $ source ~/.zshrc
  
  # Then retry
  $ npm install -g typescript

⚠️  Don't use sudo! It creates permission issues.

Done. 1.1s ✓
```

</td>
</tr>
</table>

### 5. `Uncaught ReferenceError: x is not defined`

<table>
<tr>
<td width="50%">

**Before** 😩
```
$ node app.js
/Users/dev/app.js:42
  console.log(userData);
              ^
ReferenceError: userData is not defined
    at processUser (/Users/dev/app.js:42:15)
    at main (/Users/dev/app.js:78:3)
    at Object.<anonymous> (/Users/dev/app.js:85:1)
    ... 8 more lines ...

*Scroll through 200 lines of code*
*Find typo: used userData instead of userdata*
*Could've been caught with a linter*
*7 minutes of debugging*
```

</td>
<td width="50%">

**After** ⚡
```
$ node app.js 2>&1 | oops

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem: Variable not defined
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

'userData' doesn't exist at line 42

Common causes:
  1. Typo in variable name
  2. Missing variable declaration
  3. Wrong scope (var/let/const)

Solution:
  Check app.js:42
  
  // If it's a typo:
  const userData = ...  // Define it
  
  // Or check nearby lines for similar names:
  - userdata
  - user_data
  - userInfo

Pro tip: Use ESLint to catch this before runtime:
  $ npx eslint app.js

Done. 0.8s ✓
```

</td>
</tr>
</table>

---

## More Examples

### Rust Borrow Checker
```bash
$ cargo build 2>&1 | oops

Problem: Cannot borrow `users` as mutable while borrowed as immutable

Solution: Limit the lifetime of the immutable borrow

  let first_name = users[0].name.clone();
  users.push(new_user);     // Now OK
  println!("{}", first_name);
```

### Docker Build Failure
```bash
$ docker build -t myapp . 2>&1 | oops

Problem: Dockerfile parse error - unexpected EOF at line 12

Solution: Missing backslash in multi-line RUN command

  RUN apt-get update && \
      apt-get install -y curl
```

### Git Push Rejected
```bash
$ git push origin main 2>&1 | oops

Problem: Remote contains commits you don't have locally

Solution:
  $ git pull --rebase origin main
  $ git push origin main
```

### Kubernetes Pod Crash
```bash
$ kubectl logs pod/api-7d9f8b-xk2m 2>&1 | oops

Problem: ECONNREFUSED 10.0.0.5:5432 — Can't reach PostgreSQL

Solution:
  1. Check DB service: kubectl get svc postgres-service
  2. Verify DB_HOST env var in deployment
  3. Test: kubectl run debug --image=postgres:15 ...
```

---

## Why `oops` Beats Alternatives

### vs Google Search 🔍
- **Google:** Copy error → open browser → paste → click 3 links → try 2 wrong answers → find fix (5+ minutes)
- **`oops`:** Pipe error → get fix (< 2 seconds)

**Winner:** `oops` (150x faster)

### vs Stack Overflow 📚
- **Stack Overflow:** Answers from 2017, language version mismatches, no project context
- **`oops`:** Current AI model trained on latest docs, adapts to your specific error

**Winner:** `oops` (accurate + fresh)

### vs ChatGPT 🤖
- **ChatGPT:** Copy error → switch to browser → paste → wait 30s → copy solution → switch back to terminal
- **`oops`:** Never leave the terminal

**Winner:** `oops` (native terminal workflow)

### `oops` Advantages
✅ **AI-powered instant analysis** (Claude Sonnet 4.5)  
✅ **Project context aware** (detects language, framework, error type)  
✅ **Terminal-native** (pipe → fix, no browser)  
✅ **~$0.003 per query** (99% cheaper than 15 min of dev time)

---

## Use Cases

### 1. **Stay in Flow During Development**
Don't break focus hunting for fixes. Pipe the error, get the solution, keep coding.

```bash
npm test 2>&1 | oops
```

### 2. **Onboard Junior Developers Faster**
New to the codebase? Don't Slack teammates for every error. Pipe it to `oops` first.

```bash
npm run build 2>&1 | oops  # Instant learning
```

### 3. **Debug Production CI/CD Failures**
Build broke at 3am? No time to Google. Pipe the logs, ship the fix.

```bash
# GitHub Actions / GitLab CI logs
cat build.log | oops
```

### 4. **Learn New Languages**
Rust borrow checker cryptic? Go interfaces confusing? `oops` explains while you learn.

```bash
cargo build 2>&1 | oops   # "Oh, THAT'S why it won't compile"
```

### 5. **Pre-Commit Sanity Check**
Catch errors before pushing broken code to main.

```bash
npm test 2>&1 | oops || exit 1  # Git pre-commit hook
```

---

## How It Works

1. **Reads error from stdin** (your failed command's output)
2. **Auto-detects context** (language, framework, error type)
3. **Sends to Claude AI** for analysis (~0.5–1.5s)
4. **Returns concise fix** (copy-paste ready)

**Privacy note:** Error text is sent to [Anthropic's API](https://www.anthropic.com/legal/privacy). Don't pipe secrets (API keys, passwords, tokens).

---

## Supported Languages & Tools

JavaScript · TypeScript · Python · Go · Rust · Java · C/C++ · Ruby · PHP · Docker · Kubernetes · Git · Shell · PostgreSQL · MySQL · npm · pip · cargo · and more

**If it outputs an error, `oops` can decode it.**

---

## Options

```
-v, --verbose    Detailed analysis with multiple approaches
--no-color       Disable colored output
-V, --version    Show version
-h, --help       Show help
```

---

## Pro Tips

### Shell Aliases for Speed
```bash
# Add to ~/.zshrc or ~/.bashrc
alias oops-build='npm run build 2>&1 | oops'
alias oops-test='npm test 2>&1 | oops'
alias oops-start='npm start 2>&1 | oops'
```

### Trim Huge Logs
Docker builds spitting 10,000 lines? Trim for faster analysis:
```bash
docker build . 2>&1 | tail -100 | oops
```

### Save Solutions for Later
```bash
npm run build 2>&1 | oops > solution.txt
```

### Git Pre-Commit Hook
```bash
# .git/hooks/pre-commit
npm test 2>&1 | oops || exit 1
```

### Kubernetes Debug Helper
```bash
# Add to ~/.zshrc
k8s-debug() {
  kubectl logs "$1" 2>&1 | oops
}

# Usage:
k8s-debug pod/api-7d9f8b-xk2m
```

---

## Requirements

- **Node.js 18+** (check with `node --version`)
- **Anthropic API key** ([get one here](https://console.anthropic.com))

```bash
export ANTHROPIC_API_KEY="sk-ant-..."  # Add to ~/.zshrc to persist
```

---

## Also From MUIN

Love `oops`? Check out our other developer CLI tools:

- **[roast-cli](https://www.npmjs.com/package/roast-cli)** — AI code reviews with Gordon Ramsay energy. Get brutally honest feedback *before* errors even happen.
- **[git-why](https://www.npmjs.com/package/git-why)** — AI-powered git history explainer. Understand *why* that buggy code exists before you fix it.
- **[portguard](https://www.npmjs.com/package/portguard)** — Monitor and kill zombie processes hogging your ports. Fix the `EADDRINUSE` before you even need `oops`.

---

## Featured On

Read the launch article on Dev.to: **[4 CLI Tools Every Developer Needs (That You've Never Heard Of)](https://dev.to/mjmuin/4-cli-tools-every-developer-needs-that-youve-never-heard-of-318b)**

---

## License

MIT © [MUIN](https://muin.company)

---

<div align="center">

**Built by [MUIN](https://muin.company)** — *일하는 AI, 누리는 인간*

💥 **Stop Googling errors. Pipe them to AI instead.**

[npm](https://www.npmjs.com/package/oops-ai) · [GitHub](https://github.com/muin-company/oops) · [Dev.to Article](https://dev.to/mjmuin/4-cli-tools-every-developer-needs-that-youve-never-heard-of-318b)

</div>
