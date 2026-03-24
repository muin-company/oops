<div align="center">

# 💥 oops

**Your terminal just crashed. oops knows why.**

[![npm version](https://img.shields.io/npm/v/oops-ai?color=red&label=npm)](https://www.npmjs.com/package/oops-ai)
[![npm downloads](https://img.shields.io/npm/dm/oops-ai.svg)](https://www.npmjs.com/package/oops-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/oops-ai.svg)](https://nodejs.org)

<br/>

<img src="./demo.gif" alt="oops demo" width="700"/>

<br/>

*Pipe any error → AI analysis → copy-paste fix. Under 2 seconds.*

<img src="demo.gif" alt="oops demo" width="600"/>

</div>

---

## The Problem

Your build breaks. You stare at a 40-line stack trace. You copy the error, open a browser, paste it into Google, click three Stack Overflow links, try two solutions that don't work, and finally find the fix 15 minutes later.

Meanwhile, your flow state is gone.

## Quick Start

```bash
npx oops-ai                                # Use without installing
# or
npm install -g oops-ai                     # Install globally

export ANTHROPIC_API_KEY="sk-ant-..."      # Get one at console.anthropic.com
```

Then pipe any error:

```bash
npm run build 2>&1 | oops
python script.py 2>&1 | oops
cargo build 2>&1 | oops
docker build . 2>&1 | oops
kubectl logs pod/api-xyz 2>&1 | oops
```

The `2>&1` redirects stderr to stdout so `oops` catches all error output.

## Before → After

<table>
<tr>
<td width="50%">

**Before** 😩
```
$ npm run build
Error: Cannot find module 'express'
    at Function.Module._resolveFilename
    ...45 more lines...

*copy → Google → SO → try → fail → repeat*
```

</td>
<td width="50%">

**After** ⚡
```
$ npm run build 2>&1 | oops

Problem: Cannot find module 'express'

Solution:
  $ npm install express

Done. 0.8s ✓
```

</td>
</tr>
</table>

## Examples

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

## Use Cases

- **Stay in flow** — Get solutions without leaving the terminal
- **Onboard faster** — Clone a new repo, pipe errors instead of asking teammates
- **Debug production** — `kubectl logs ... | oops` when every second counts
- **Learn new languages** — Rust borrow checker, Go interfaces explained instantly
- **Pre-commit check** — `npm test 2>&1 | oops` before pushing broken code

## How It Works

1. Reads error output from stdin
2. Auto-detects language/framework
3. Sends to Claude AI for analysis
4. Returns concise, actionable fix (~0.5–1.5s)

## Supported Languages

JavaScript · TypeScript · Python · Go · Rust · Java · C/C++ · Ruby · PHP · Docker · Kubernetes · Git · Shell · PostgreSQL · MySQL · and more

## Options

```
-v, --verbose    Detailed analysis with multiple approaches
--no-color       Disable colored output
-V, --version    Show version
-h, --help       Show help
```

## Pro Tips

```bash
# Shell aliases for speed
alias oops-build='npm run build 2>&1 | oops'
alias oops-test='npm test 2>&1 | oops'

# Trim huge output for faster analysis
docker build . 2>&1 | tail -100 | oops

# Save solutions for later
npm run build 2>&1 | oops > solution.txt

# Git pre-commit hook
npm test 2>&1 | oops || exit 1
```

## vs Alternatives

| | `oops` | Google/SO | ChatGPT | Copilot |
|---|---|---|---|---|
| Speed | ~1 second | 2-5 minutes | 30+ seconds | N/A |
| Context-aware | ✅ Full error | ❌ You summarize | ❌ You paste | IDE only |
| Terminal-native | ✅ Pipe & done | ❌ Browser | ❌ Browser | IDE only |
| Cost per query | ~$0.003 | Free | $20/mo | $10/mo |

## Privacy

Error text is sent to [Anthropic's API](https://www.anthropic.com/legal/privacy) for analysis. Don't pipe sensitive data (passwords, API keys, tokens).

## Requirements

- Node.js 18+
- [Anthropic API key](https://console.anthropic.com) (`ANTHROPIC_API_KEY`)

## Also From MUIN

Love `oops`? Check out our other developer CLI tools:

- **[roast-cli](https://www.npmjs.com/package/roast-cli)** — AI code reviews with Gordon Ramsay energy. Get brutally honest feedback before errors even happen.
- **[git-why](https://www.npmjs.com/package/git-why)** — AI-powered git history explainer. Understand *why* that buggy code exists before you fix it.
- **[portguard](https://www.npmjs.com/package/portguard)** — Monitor and kill zombie processes hogging your ports. Fix the `EADDRINUSE` before you even need `oops`.

## Featured On

Read the launch article on Dev.to: **[4 CLI Tools Every Developer Needs (That You've Never Heard Of)](https://dev.to/mjmuin/4-cli-tools-every-developer-needs-that-youve-never-heard-of-318b)**

## License

MIT © [MUIN](https://muin.company)

---

<div align="center">

**Built by [MUIN](https://muin.company)** — *일하는 AI, 누리는 인간*

💥 Stop Googling errors. Pipe them to AI instead.

</div>
