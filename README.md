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

---

### Example 7: Webpack/Vite Build Memory Error

**Error:**
```bash
$ npm run build

<--- Last few GCs --->
[23891:0x148008000]   124567 ms: Mark-sweep 2048.2 (2083.3) -> 2047.9 (2083.3) MB, 1829.3 / 0.0 ms  
allocation failure scavenge might not succeed

FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Solution:**
```bash
$ npm run build 2>&1 | oops

🔍 Analyzing error...

Problem: JavaScript heap out of memory during build

Solution: Increase Node.js memory limit

Quick fix for this build:
  $ NODE_OPTIONS="--max-old-space-size=4096" npm run build

Permanent fix - add to package.json:
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
  }

Or if using webpack:
  "scripts": {
    "build": "node --max-old-space-size=4096 node_modules/webpack/bin/webpack.js"
  }

Alternative solutions:
  1. Check for memory leaks in build plugins
  2. Reduce bundle size (analyze with webpack-bundle-analyzer)
  3. Split builds into smaller chunks
  4. Update Node.js to latest LTS (better GC)

Default heap size: ~512MB-2GB depending on platform
Recommended for large projects: 4096MB (4GB)

Done in 1.3s ✓
```

---

### Example 8: React/Next.js Hydration Mismatch

**Error:**
```bash
$ npm run dev

Warning: Text content did not match. Server: "Loading..." Client: "Welcome, John!"
Warning: An error occurred during hydration. The server HTML was replaced with client content.
Error: Hydration failed because the initial UI does not match what was rendered on the server.
```

**Solution:**
```bash
$ npm run dev 2>&1 | oops

🔍 Analyzing error...

Problem: React hydration mismatch - server and client HTML don't match

Solution: Common causes and fixes

1. **Using browser-only APIs during SSR:**
   ❌ Bad:
   const [time, setTime] = useState(Date.now())

   ✅ Fix:
   const [time, setTime] = useState(null)
   useEffect(() => setTime(Date.now()), [])

2. **Conditional rendering based on browser state:**
   ❌ Bad:
   {window.innerWidth > 768 && <MobileMenu />}

   ✅ Fix:
   const [isMobile, setIsMobile] = useState(false)
   useEffect(() => {
     setIsMobile(window.innerWidth > 768)
   }, [])

3. **Random values or timestamps in JSX:**
   ❌ Bad:
   <div id={Math.random()}>

   ✅ Fix:
   const [id] = useState(() => Math.random())

4. **Third-party scripts modifying DOM:**
   Check browser extensions, analytics, or ad blockers

Next.js specific fix:
  import dynamic from 'next/dynamic'
  const NoSSR = dynamic(() => import('./Component'), { ssr: false })

Debugging:
  • Check browser console for the specific mismatch
  • Add suppressHydrationWarning to the mismatched element (temporary)
  • Use React DevTools to inspect component tree

Done in 1.5s ✓
```

---

### Example 9: Rails/Django Migration Conflict

**Error:**
```bash
$ rails db:migrate

== 20250206143022 AddUserPreferences: migrating ===============================
rails aborted!
StandardError: An error has occurred, this and all later migrations canceled:

PG::DuplicateColumn: ERROR:  column "preferences" of relation "users" already exists
```

**Solution:**
```bash
$ rails db:migrate 2>&1 | oops

🔍 Analyzing error...

Problem: Migration tries to add column that already exists

Solution: Database is out of sync with migrations

Check migration status:
  $ rails db:migrate:status

Common scenarios:

1. **Someone ran migrations manually in production:**
   $ rails db:migrate:status
   # Find the migration that's "up" but shouldn't be
   $ rails db:migrate:down VERSION=20250206143022
   $ rails db:migrate

2. **You pulled code with new migrations:**
   $ git log db/migrate/
   # Check if column was added in an earlier migration
   
   Fix: Edit the new migration to check if column exists:
   class AddUserPreferences < ActiveRecord::Migration[7.0]
     def change
       unless column_exists?(:users, :preferences)
         add_column :users, :preferences, :jsonb
       end
     end
   end

3. **You're on a different branch:**
   $ git branch
   # Switch to correct branch or merge migrations

4. **Nuclear option (development only!):**
   $ rails db:drop db:create db:migrate db:seed

Django equivalent:
  $ python manage.py showmigrations
  $ python manage.py migrate --fake <app_name> <migration_name>

⚠️  Never run db:drop on production!

Done in 1.2s ✓
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

---

## Framework Integration Examples

### React/Next.js Build Error Assistant

```bash
# Webpack/Next.js build fails
$ npm run build 2>&1 | oops

🔍 Analyzing error...

Problem: Module not found: Can't resolve './components/UserCard'

Solution: Import path error - check file location and extension

The file exists but:
  1. Case sensitivity: UserCard.tsx vs userCard.tsx
  2. Missing extension in import
  3. Wrong relative path

Debug steps:
  $ ls -la src/components/ | grep -i usercard
  
Common fixes:
  // ❌ Bad
  import UserCard from './components/UserCard'
  
  // ✅ Good (Next.js auto-resolves)
  import UserCard from '@/components/UserCard'
  
  // Or use absolute imports in tsconfig.json:
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"]
      }
    }
  }

💡 Enable VS Code auto-import to prevent this:
   "typescript.preferences.importModuleSpecifier": "non-relative"
```

---

### Django Migration Conflicts (Team Collaboration)

```bash
$ python manage.py migrate 2>&1 | oops

🔍 Analyzing error...

Problem: Conflicting migrations detected
  app.0023_add_user_field
  app.0023_add_profile_field

Solution: Two developers created migrations with same number

This happens when:
  1. You created migration (0023) locally
  2. Teammate merged their 0023 to main
  3. You pulled and now have duplicate 0023

Fix:
  # 1. Reset your migration
  $ python manage.py migrate app 0022
  
  # 2. Delete your 0023 file
  $ rm app/migrations/0023_add_user_field.py
  
  # 3. Re-create migration (will be 0024)
  $ python manage.py makemigrations
  
  # 4. Apply
  $ python manage.py migrate

Prevention:
  # Always pull before making migrations
  $ git pull origin main
  $ python manage.py makemigrations
  $ git add migrations/
  $ git push

Or use merge migration:
  $ python manage.py makemigrations --merge
```

---

### Docker Multi-Stage Build Failure

```bash
$ docker build -t myapp:latest . 2>&1 | oops

🔍 Analyzing error...

Problem: COPY failed: file not found in build context
  COPY dist/ /app/dist/

Solution: Build artifacts don't exist when Docker copies them

Common cause: Multi-stage build with missing stage

Your Dockerfile:
  FROM node:18 AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm install
  COPY . .
  RUN npm run build
  
  FROM nginx:alpine
  COPY dist/ /usr/share/nginx/html/  # ❌ Copies from wrong stage!

Fix:
  # Copy from builder stage, not local filesystem
  COPY --from=builder /app/dist/ /usr/share/nginx/html/

Full working Dockerfile:
  FROM node:18 AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .
  RUN npm run build
  
  FROM nginx:alpine
  COPY --from=builder /app/dist /usr/share/nginx/html
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]

💡 Debug: Build only first stage
   $ docker build --target builder -t myapp:debug .
   $ docker run -it myapp:debug ls -la /app/dist/
```

---

### Kubernetes CrashLoopBackOff Deep Dive

```bash
$ kubectl logs pod/api-7d9f8b-xk2m --previous 2>&1 | oops

🔍 Analyzing error...

Problem: Pod keeps crashing - CrashLoopBackOff
  Error: connect ECONNREFUSED 10.96.0.15:5432

Solution: App tries to connect to database before it's ready

Root cause: Race condition - app starts faster than database

Fix with init container:
  # deployment.yaml
  apiVersion: apps/v1
  kind: Deployment
  spec:
    template:
      spec:
        # Wait for postgres before starting app
        initContainers:
        - name: wait-for-db
          image: busybox:1.35
          command: ['sh', '-c', 'until nc -z postgres-service 5432; do echo waiting for db; sleep 2; done']
        
        containers:
        - name: api
          image: myapi:latest
          env:
          - name: DB_HOST
            value: postgres-service

Or use readiness/liveness probes:
  containers:
  - name: api
    livenessProbe:
      httpGet:
        path: /health
        port: 3000
      initialDelaySeconds: 30  # Give app time to connect
      periodSeconds: 10
    
    readinessProbe:
      httpGet:
        path: /ready
        port: 3000
      initialDelaySeconds: 5
      periodSeconds: 5

💡 Check all pod events:
   $ kubectl describe pod api-7d9f8b-xk2m
   
💡 Check if service exists:
   $ kubectl get svc postgres-service -o yaml
```

---

### TypeScript Type Error Chain Resolution

```bash
$ tsc --noEmit 2>&1 | oops --verbose

🔍 Analyzing error (verbose mode)...

Problem: Type error cascade - 47 errors from one root cause
  src/types.ts:12:5 - Property 'userId' is missing
  src/api.ts:34:12 - Argument not assignable
  src/components/User.tsx:67:8 - Type mismatch
  ... (44 more errors)

Solution: Fix root type definition to resolve all

Root cause analysis:
  // src/types.ts - Missing required field
  interface User {
    id: number;
    name: string;
    // Missing: userId: string;
  }

This breaks:
  1. API calls expecting userId
  2. Components rendering user data
  3. Database queries
  4. Redux reducers

Fix:
  interface User {
    id: number;
    name: string;
    userId: string;  // Add this
    email: string;
    createdAt: Date;
  }

Then run:
  $ tsc --noEmit  # Should go from 47 errors → 0

💡 Pro tip: Fix errors from top to bottom
   Start with type definitions, then API layer, then components

💡 Use TypeScript strict mode to catch these earlier:
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,
       "noUncheckedIndexedAccess": true,
       "noImplicitReturns": true
     }
   }

Detected: TypeScript 5.3.3
Timing: Analysis took 1.8s (verbose output)
```

---

### Terraform Plan Failure (Infrastructure as Code)

```bash
$ terraform plan 2>&1 | oops

🔍 Analyzing error...

Problem: Error creating ECS cluster: InvalidParameterException
  Cluster name "my_api_cluster" is invalid

Solution: AWS resource names can't contain underscores

AWS naming rules:
  ✅ Letters, numbers, hyphens only
  ✅ Must start with letter
  ❌ No underscores, spaces, or special chars
  ❌ Length limits vary by service

Fix:
  # terraform/main.tf
  resource "aws_ecs_cluster" "api" {
    name = "my-api-cluster"  # Changed _ to -
  }

Other common Terraform errors:

1. State lock:
   Error: Error acquiring the state lock
   Fix: $ terraform force-unlock <lock-id>

2. Provider version:
   Error: Invalid provider version
   Fix:
     terraform {
       required_providers {
         aws = {
           source  = "hashicorp/aws"
           version = "~> 5.0"  # Pin version
         }
       }
     }

3. Circular dependency:
   Error: Cycle: aws_security_group.app, aws_instance.web
   Fix: Remove interdependent references or use data sources

💡 Always run terraform validate before plan:
   $ terraform init
   $ terraform validate
   $ terraform plan
```

---

## CI/CD Integration

### GitHub Actions Auto-Debug

```yaml
# .github/workflows/build.yml
name: Build and Deploy

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build with auto-debug
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          npm run build 2>&1 | tee build.log
          
          if [ $? -ne 0 ]; then
            echo "Build failed, analyzing error..."
            cat build.log | npx oops-cli > solution.md
            cat solution.md >> $GITHUB_STEP_SUMMARY
            exit 1
          fi
      
      - name: Comment solution on PR (if failed)
        if: failure() && github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const solution = fs.readFileSync('solution.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## 🔍 Build Failed - Auto-Analysis\n\n${solution}`
            });
```

---

### GitLab CI Pipeline Integration

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test

build:
  stage: build
  script:
    - npm ci
    - npm run build 2>&1 | tee build.log || BUILD_FAILED=true
    
    - |
      if [ "$BUILD_FAILED" = "true" ]; then
        echo "Analyzing build failure with AI..."
        cat build.log | npx oops-cli -v > solution.txt
        cat solution.txt
        exit 1
      fi
  
  artifacts:
    when: on_failure
    paths:
      - build.log
      - solution.txt
    expire_in: 1 week

test:
  stage: test
  script:
    - npm test 2>&1 | npx oops-cli --severity error || true
  allow_failure: true
```

---

### Pre-push Hook (Catch Errors Before CI)

```bash
#!/bin/bash
# .git/hooks/pre-push

echo "🧪 Running tests before push..."

npm test 2>&1 | tee test.log

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Tests failed! Analyzing errors..."
  echo ""
  cat test.log | npx oops-cli
  echo ""
  read -p "Tests failed. Push anyway? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Push cancelled. Fix tests first."
    exit 1
  fi
fi

echo "✅ Tests passed!"
exit 0
```

---

## Error Handling Pattern Examples

### Pattern 1: Promise Rejection Handling (Unhandled Rejections)

**Error:**
```bash
$ node app.js
(node:12345) UnhandledPromiseRejectionWarning: Error: Connection timeout
    at Timeout._onTimeout (/app/db.js:45:12)
(Use `node --trace-warnings ...` to show where the warning was created)
(node:12345) UnhandledPromiseRejectionWarning: Unhandled promise rejection.
This error originated either by throwing inside of an async function without
a catch block, or by rejecting a promise which was not handled with .catch().
```

**Solution:**
```bash
$ node app.js 2>&1 | oops

🔍 Analyzing error...

Problem: Unhandled Promise Rejection - async function threw without catch

Solution: Add error handling to async operations

Common causes:

1. **Async function without try-catch:**
   ❌ Bad:
   async function fetchUser(id) {
     const user = await db.query('SELECT * FROM users WHERE id = $1', [id])
     return user  // If query fails, unhandled rejection
   }

   ✅ Fix:
   async function fetchUser(id) {
     try {
       const user = await db.query('SELECT * FROM users WHERE id = $1', [id])
       return user
     } catch (error) {
       console.error('Failed to fetch user:', error)
       throw new Error(`User ${id} not found`)
     }
   }

2. **Promise without .catch():**
   ❌ Bad:
   fetch('/api/users').then(r => r.json()).then(data => console.log(data))

   ✅ Fix:
   fetch('/api/users')
     .then(r => r.json())
     .then(data => console.log(data))
     .catch(err => console.error('Fetch failed:', err))

3. **Global handler (safety net):**
   process.on('unhandledRejection', (reason, promise) => {
     console.error('Unhandled Rejection at:', promise, 'reason:', reason)
     // Application specific logging, throwing an error, etc.
   })

4. **Using async/await at top level (Node 14.8+):**
   // package.json
   {
     "type": "module"
   }
   
   // Top-level await
   try {
     const data = await fetchData()
   } catch (err) {
     console.error(err)
   }

💡 Enable strict rejection handling:
   node --unhandled-rejections=strict app.js

Done in 1.2s ✓
```

---

### Pattern 2: Try-Catch Anti-Patterns

**Error:**
```bash
$ npm test
TypeError: Cannot read property 'length' of undefined
    at calculateTotal (utils.js:23:15)
```

**Solution:**
```bash
$ npm test 2>&1 | oops

🔍 Analyzing error...

Problem: Cannot read property of undefined - missing null check

Solution: Defensive programming and better error handling

Anti-patterns to avoid:

1. **Empty catch blocks (swallowing errors):**
   ❌ Bad:
   try {
     const data = JSON.parse(input)
   } catch (e) {
     // Silent failure - impossible to debug
   }

   ✅ Fix:
   try {
     const data = JSON.parse(input)
   } catch (e) {
     console.error('Failed to parse JSON:', e.message)
     return null  // Or throw with context
   }

2. **Catching without rethrowing:**
   ❌ Bad:
   try {
     await criticalOperation()
   } catch (error) {
     console.log('Oops')  // Logged but not handled
   }
   // Execution continues as if nothing happened!

   ✅ Fix:
   try {
     await criticalOperation()
   } catch (error) {
     console.error('Critical operation failed:', error)
     throw error  // Propagate to caller
   }

3. **Catching Error instead of specific types:**
   ❌ Bad:
   try {
     const data = await fetch(url)
   } catch (error) {
     // Catches syntax errors, network errors, everything
   }

   ✅ Fix:
   try {
     const response = await fetch(url)
     if (!response.ok) {
       throw new NetworkError(`HTTP ${response.status}`)
     }
     return await response.json()
   } catch (error) {
     if (error instanceof NetworkError) {
       // Handle network issues
     } else if (error instanceof SyntaxError) {
       // Handle JSON parse errors
     } else {
       throw error  // Unknown error
     }
   }

4. **Not validating inputs before use:**
   ❌ Bad:
   function calculateTotal(items) {
     return items.reduce((sum, item) => sum + item.price, 0)
     // Crashes if items is undefined/null
   }

   ✅ Fix:
   function calculateTotal(items) {
     if (!items || !Array.isArray(items)) {
       throw new TypeError('items must be an array')
     }
     return items.reduce((sum, item) => sum + item.price, 0)
   }

   Or with optional chaining:
   function calculateTotal(items) {
     return items?.reduce((sum, item) => sum + (item?.price ?? 0), 0) ?? 0
   }

💡 Use ESLint rule: no-empty (warns about empty catch blocks)

Done in 1.4s ✓
```

---

### Pattern 3: Async Error Propagation

**Error:**
```bash
$ node server.js
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent
    at ServerResponse.setHeader (_http_outgoing.js:561:11)
    at ServerResponse.header (express/lib/response.js:767:10)
```

**Solution:**
```bash
$ node server.js 2>&1 | oops

🔍 Analyzing error...

Problem: Headers already sent - response sent twice

Solution: Proper async/await error handling in Express

Common mistake:
   ❌ Bad:
   app.get('/users/:id', async (req, res) => {
     try {
       const user = await User.findById(req.params.id)
       res.json(user)
     } catch (error) {
       res.status(500).json({ error: error.message })
     }
     
     // Implicit return allows execution to continue
     console.log('Request processed')
   })

This can cause:
   1. Try block succeeds → sends response
   2. Exception happens in console.log → catch runs
   3. Catch tries to send response → headers already sent!

✅ Fix with early returns:
   app.get('/users/:id', async (req, res) => {
     try {
       const user = await User.findById(req.params.id)
       if (!user) {
         return res.status(404).json({ error: 'User not found' })
       }
       return res.json(user)
     } catch (error) {
       console.error('Error fetching user:', error)
       return res.status(500).json({ error: 'Internal server error' })
     }
   })

✅ Or use async error handler middleware:
   // middleware/asyncHandler.js
   const asyncHandler = (fn) => (req, res, next) => {
     Promise.resolve(fn(req, res, next)).catch(next)
   }
   
   // Use it:
   app.get('/users/:id', asyncHandler(async (req, res) => {
     const user = await User.findById(req.params.id)
     if (!user) {
       throw new NotFoundError('User not found')
     }
     res.json(user)
   }))
   
   // Global error handler
   app.use((err, req, res, next) => {
     if (err instanceof NotFoundError) {
       return res.status(404).json({ error: err.message })
     }
     console.error(err)
     res.status(500).json({ error: 'Internal server error' })
   })

💡 Never send response twice in the same handler
💡 Always return after res.json() / res.send()

Done in 1.3s ✓
```

---

### Pattern 4: Event Emitter Error Handling

**Error:**
```bash
$ node app.js
events.js:377
      throw er; // Unhandled 'error' event
      ^

Error: connect ECONNREFUSED 127.0.0.1:5432
Emitted 'error' event on Socket instance at:
    at Socket.<anonymous> (net.js:1266:12)
```

**Solution:**
```bash
$ node app.js 2>&1 | oops

🔍 Analyzing error...

Problem: Unhandled 'error' event on EventEmitter

Solution: Always listen for 'error' events

EventEmitters crash the process if 'error' event is emitted with no listeners!

Common sources:
   1. **Database connections:**
      ❌ Bad:
      const client = new Client({ /* config */ })
      client.connect()  // No error listener!

      ✅ Fix:
      const client = new Client({ /* config */ })
      client.on('error', (err) => {
        console.error('Database error:', err)
        // Attempt reconnection or graceful shutdown
      })
      client.connect()

   2. **HTTP requests:**
      ❌ Bad:
      const req = http.request(options, (res) => { /* handle */ })
      req.end()  // No error listener!

      ✅ Fix:
      const req = http.request(options, (res) => { /* handle */ })
      req.on('error', (err) => {
        console.error('Request failed:', err)
      })
      req.end()

   3. **Streams:**
      ❌ Bad:
      const stream = fs.createReadStream('file.txt')
      stream.pipe(destination)  // No error listeners!

      ✅ Fix:
      const stream = fs.createReadStream('file.txt')
      stream.on('error', (err) => {
        console.error('Stream error:', err)
      })
      destination.on('error', (err) => {
        console.error('Destination error:', err)
      })
      stream.pipe(destination)

   4. **WebSocket connections:**
      const ws = new WebSocket('ws://localhost:8080')
      
      ws.on('error', (err) => {
        console.error('WebSocket error:', err)
        // Attempt reconnection
      })
      
      ws.on('close', () => {
        console.log('Connection closed, reconnecting...')
        setTimeout(connect, 5000)
      })

💡 Pattern: Add error listener immediately after creating EventEmitter
💡 Use pipeline() for streams (handles errors automatically in Node 15+)

   import { pipeline } from 'stream/promises'
   await pipeline(source, transform, destination)

Done in 1.1s ✓
```

---

### Pattern 5: Callback Error Handling (Legacy Code)

**Error:**
```bash
$ node legacy.js
TypeError: callback is not a function
    at readFileCallback (legacy.js:12:5)
```

**Solution:**
```bash
$ node legacy.js 2>&1 | oops

🔍 Analyzing error...

Problem: Callback error handling anti-patterns in legacy code

Solution: Proper Node.js callback conventions

Node.js callback pattern: (err, result) => { }

Common mistakes:

1. **Wrong argument order:**
   ❌ Bad:
   fs.readFile('file.txt', (data, err) => {  // Wrong order!
     if (err) throw err
     console.log(data)
   })

   ✅ Fix:
   fs.readFile('file.txt', 'utf8', (err, data) => {
     if (err) {
       console.error('Read failed:', err)
       return
     }
     console.log(data)
   })

2. **Not checking for errors:**
   ❌ Bad:
   db.query('SELECT * FROM users', (err, results) => {
     console.log(results[0].name)  // Crashes if err is set
   })

   ✅ Fix:
   db.query('SELECT * FROM users', (err, results) => {
     if (err) {
       console.error('Query failed:', err)
       return
     }
     if (!results || results.length === 0) {
       console.log('No users found')
       return
     }
     console.log(results[0].name)
   })

3. **Callback hell (nested callbacks):**
   ❌ Bad:
   fs.readFile('config.json', (err, data) => {
     if (err) throw err
     db.connect(data, (err, connection) => {
       if (err) throw err
       connection.query('SELECT *', (err, results) => {
         if (err) throw err
         // 😱 Callback hell
       })
     })
   })

   ✅ Fix with Promises:
   const { promisify } = require('util')
   const readFile = promisify(fs.readFile)
   
   async function init() {
     try {
       const data = await readFile('config.json', 'utf8')
       const connection = await db.connect(data)
       const results = await connection.query('SELECT *')
       return results
     } catch (err) {
       console.error('Init failed:', err)
       throw err
     }
   }

4. **Calling callback multiple times:**
   ❌ Bad:
   function processFile(path, callback) {
     fs.readFile(path, (err, data) => {
       if (err) {
         callback(err)  // Called once
         return
       }
       
       try {
         const result = JSON.parse(data)
         callback(null, result)  // May be called again if parse fails!
       } catch (parseErr) {
         callback(parseErr)
       }
     })
   }

   ✅ Fix:
   function processFile(path, callback) {
     let called = false
     
     const done = (err, result) => {
       if (called) return
       called = true
       callback(err, result)
     }
     
     fs.readFile(path, 'utf8', (err, data) => {
       if (err) return done(err)
       
       try {
         const result = JSON.parse(data)
         done(null, result)
       } catch (parseErr) {
         done(parseErr)
       }
     })
   }

💡 Modern alternative: Convert to Promises with util.promisify
💡 Or use fs.promises API (Node 10+)

   import { readFile } from 'fs/promises'
   const data = await readFile('file.txt', 'utf8')

Done in 1.5s ✓
```

---

### Pattern 6: Error Context and Stack Traces

**Error:**
```bash
$ npm run import
Error: Import failed
    at Object.<anonymous> (/app/importer.js:145:11)
```

**Solution:**
```bash
$ npm run import 2>&1 | oops

🔍 Analyzing error...

Problem: Generic error message with no context

Solution: Throw errors with rich context information

Poor error messages slow down debugging. Add context!

1. **Generic errors:**
   ❌ Bad:
   throw new Error('Failed')

   ✅ Fix:
   throw new Error(`Failed to import user ${userId} from file ${filename}: ${originalError.message}`)

2. **Losing stack traces:**
   ❌ Bad:
   try {
     await dangerousOperation()
   } catch (err) {
     throw new Error('Operation failed')  // Original stack trace lost!
   }

   ✅ Fix (wrap with cause):
   try {
     await dangerousOperation()
   } catch (err) {
     throw new Error('Operation failed', { cause: err })
   }
   
   // Or preserve stack:
   catch (err) {
     const newError = new Error(`Operation failed: ${err.message}`)
     newError.stack = err.stack
     newError.originalError = err
     throw newError
   }

3. **Custom error classes:**
   ✅ Create meaningful error types:
   
   class DatabaseError extends Error {
     constructor(message, query, params) {
       super(message)
       this.name = 'DatabaseError'
       this.query = query
       this.params = params
       this.timestamp = new Date()
     }
   }
   
   class ValidationError extends Error {
     constructor(field, value, constraint) {
       super(`Validation failed for ${field}`)
       this.name = 'ValidationError'
       this.field = field
       this.value = value
       this.constraint = constraint
     }
   }
   
   // Usage:
   if (!email.includes('@')) {
     throw new ValidationError('email', email, 'must contain @')
   }

4. **Structured error logging:**
   ✅ Include useful metadata:
   
   function logError(error, context = {}) {
     console.error({
       message: error.message,
       stack: error.stack,
       name: error.name,
       timestamp: new Date().toISOString(),
       ...context,
       // Add application-specific context
       userId: context.userId,
       requestId: context.requestId,
       environment: process.env.NODE_ENV
     })
   }
   
   // Usage:
   try {
     await processPayment(orderId)
   } catch (err) {
     logError(err, {
       operation: 'processPayment',
       orderId,
       userId: req.user.id,
       requestId: req.id
     })
     throw err
   }

💡 Use Error.captureStackTrace() to customize stack traces
💡 Consider using a library like pino or winston for structured logging

Done in 1.6s ✓
```

---

### Pattern 7: Timeout and Resource Cleanup

**Error:**
```bash
$ node worker.js
MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
11 error listeners added. Use emitter.setMaxListeners() to increase limit
```

**Solution:**
```bash
$ node worker.js 2>&1 | oops

🔍 Analyzing error...

Problem: Memory leak from uncleaned event listeners or timeouts

Solution: Proper cleanup and timeout handling

Common leak sources:

1. **Forgotten setTimeout/setInterval:**
   ❌ Bad:
   function startPolling() {
     setInterval(async () => {
       await checkForUpdates()
     }, 5000)
     // Never cleared, even if component unmounted!
   }

   ✅ Fix:
   let pollingInterval = null
   
   function startPolling() {
     pollingInterval = setInterval(async () => {
       try {
         await checkForUpdates()
       } catch (err) {
         console.error('Polling failed:', err)
         stopPolling()
       }
     }, 5000)
   }
   
   function stopPolling() {
     if (pollingInterval) {
       clearInterval(pollingInterval)
       pollingInterval = null
     }
   }
   
   // Clean up on exit
   process.on('SIGTERM', stopPolling)

2. **Timeout with Promise race:**
   ✅ Proper timeout pattern:
   
   function withTimeout(promise, timeoutMs) {
     let timeoutId
     
     const timeout = new Promise((_, reject) => {
       timeoutId = setTimeout(() => {
         reject(new Error(`Operation timed out after ${timeoutMs}ms`))
       }, timeoutMs)
     })
     
     return Promise.race([promise, timeout])
       .finally(() => clearTimeout(timeoutId))
   }
   
   // Usage:
   try {
     const result = await withTimeout(
       fetch('https://slow-api.com/data'),
       5000
     )
   } catch (err) {
     if (err.message.includes('timed out')) {
       console.error('Request took too long')
     }
   }

3. **Database connection cleanup:**
   ✅ Use try-finally:
   
   let client
   try {
     client = await pool.connect()
     const result = await client.query('SELECT * FROM users')
     return result.rows
   } catch (err) {
     console.error('Query error:', err)
     throw err
   } finally {
     if (client) {
       client.release()  // Always release connection
     }
   }

4. **AbortController for cancellable operations:**
   ✅ Modern approach:
   
   const controller = new AbortController()
   const timeoutId = setTimeout(() => controller.abort(), 5000)
   
   try {
     const response = await fetch(url, {
       signal: controller.signal
     })
     const data = await response.json()
     return data
   } catch (err) {
     if (err.name === 'AbortError') {
       console.error('Request was aborted (timeout or manual cancel)')
     }
     throw err
   } finally {
     clearTimeout(timeoutId)
   }

5. **Event listener cleanup:**
   ✅ Remove listeners:
   
   class DataFetcher extends EventEmitter {
     constructor() {
       super()
       this.active = true
     }
     
     async start() {
       const handler = (data) => this.emit('data', data)
       stream.on('data', handler)
       
       // Clean up when done
       this.once('stop', () => {
         stream.off('data', handler)
         this.active = false
       })
     }
   }

💡 Use AbortController for modern cancellation
💡 Always pair setUp with tearDown logic
💡 Test cleanup in your unit tests!

Done in 1.8s ✓
```

---

## Advanced Usage Patterns

### Error Severity Filtering (Focus on Critical Issues)

```bash
# Only show critical errors (crashes, permission denied, OOM)
$ npm run build 2>&1 | oops --severity critical

# Show all warnings and errors
$ npm test 2>&1 | oops --severity warning

# Info level (includes hints and suggestions)
$ npm audit 2>&1 | oops --severity info
```

---

### Team Error Knowledge Base

Build a searchable error solution database:

```bash
# Create error KB directory
mkdir -p .error-kb

# Save common errors with solutions
$ npm run build 2>&1 | oops --no-color > .error-kb/$(date +%Y%m%d)-build-error.md

# Search previous solutions
$ grep -r "EADDRINUSE" .error-kb/
$ grep -r "Module not found" .error-kb/

# Add to git for team sharing
$ git add .error-kb/
$ git commit -m "docs: add build error solution to KB"
```

---

### Integration with Error Monitoring (Sentry, Datadog)

```javascript
// server.js - Send production errors to AI for analysis

const Sentry = require('@sentry/node');
const { exec } = require('child_process');

Sentry.init({ dsn: process.env.SENTRY_DSN });

app.use((err, req, res, next) => {
  // Log to Sentry
  Sentry.captureException(err);
  
  // Also get AI solution
  const errorLog = `${err.name}: ${err.message}\n${err.stack}`;
  exec(`echo "${errorLog}" | npx oops-cli`, (error, stdout) => {
    if (!error) {
      // Send solution to Slack/Discord
      notifyTeam({
        error: err.message,
        solution: stdout,
        request: req.path
      });
    }
  });
  
  res.status(500).json({ error: 'Internal server error' });
});
```

---

### Custom Error Parsers for Domain-Specific Tools

```javascript
// custom-oops.js - Wrapper for domain-specific error context

const { spawn } = require('child_process');

function analyzeWithContext(errorLog, context) {
  const enrichedLog = `
Context: ${context.environment} environment
Project: ${context.projectName}
Last Deploy: ${context.lastDeploy}
Dependencies: ${context.packageVersions}

Error:
${errorLog}
  `;
  
  const oops = spawn('npx', ['oops-cli', '-v']);
  oops.stdin.write(enrichedLog);
  oops.stdin.end();
  
  oops.stdout.on('data', (data) => {
    console.log(data.toString());
  });
}

// Usage
const context = {
  environment: 'production',
  projectName: 'ecommerce-api',
  lastDeploy: '2025-02-06 14:30',
  packageVersions: require('./package.json').dependencies
};

process.stdin.on('data', (data) => {
  analyzeWithContext(data.toString(), context);
});
```

---

### Watch Mode for Development (Auto-Analyze on Error)

```bash
# Monitor logs in real-time, analyze errors automatically
$ tail -f /var/log/app.log | while read line; do
    echo "$line"
    if echo "$line" | grep -q "Error\|Exception\|Fatal"; then
      echo "$line" | oops
    fi
  done

# Or use with nodemon
$ nodemon --exec 'node app.js 2>&1 | oops' app.js
```

---

### Multi-Language Project Error Aggregation

```bash
#!/bin/bash
# analyze-all-errors.sh

echo "# Project Error Analysis" > error-report.md
echo "Generated: $(date)" >> error-report.md
echo "" >> error-report.md

# Frontend errors
echo "## Frontend (React)" >> error-report.md
npm --prefix frontend run build 2>&1 | oops --no-color >> error-report.md
echo "" >> error-report.md

# Backend errors
echo "## Backend (Python)" >> error-report.md
cd backend && python -m pytest 2>&1 | oops --no-color >> ../error-report.md
cd ..
echo "" >> error-report.md

# Infrastructure errors
echo "## Infrastructure (Terraform)" >> error-report.md
cd terraform && terraform validate 2>&1 | oops --no-color >> ../error-report.md
cd ..

echo "✓ Full project error analysis saved to error-report.md"
```

---

## Tips

**Create shell aliases:**
```bash
# Add to ~/.bashrc or ~/.zshrc
alias oops-npm='npm run build 2>&1 | oops'
alias oops-py='python 2>&1 | oops'
alias oops-go='go build 2>&1 | oops'
alias oops-docker='docker build . 2>&1 | oops'
alias oops-k8s='kubectl logs 2>&1 | oops'
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
terraform plan 2>&1 | oops
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

**Integration with ChatOps:**
```bash
# Slack/Discord bot command
/debug <paste error here>
# Bot internally runs: echo "$error" | oops
```

**Create project-specific error handling:**
```bash
# package.json scripts
{
  "scripts": {
    "build": "webpack build",
    "build:debug": "npm run build 2>&1 | oops --verbose",
    "test:debug": "npm test 2>&1 | oops --severity error"
  }
}
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
