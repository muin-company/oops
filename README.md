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

---

### Example 10: Ruby Gem Installation Failure

**Error:**
```bash
$ bundle install
Gem::Ext::BuildError: ERROR: Failed to build gem native extension.
    current directory: /usr/local/bundle/gems/nokogiri-1.13.1/ext/nokogiri
/usr/local/bin/ruby -I /usr/local/lib/ruby/site_ruby/3.1.0 extconf.rb
checking for gzdopen() in -lz... no
zlib is missing; necessary for building libxml2
```

**Solution:**
```bash
$ bundle install 2>&1 | oops

🔍 Analyzing error...

Problem: Missing system dependencies for native gem compilation

Solution: Install development headers for zlib and libxml2

  # Ubuntu/Debian:
  $ sudo apt-get update
  $ sudo apt-get install -y zlib1g-dev libxml2-dev libxslt-dev

  # macOS:
  $ brew install libxml2 libxslt
  $ bundle config build.nokogiri --use-system-libraries

  # CentOS/RHEL:
  $ sudo yum install -y zlib-devel libxml2-devel libxslt-devel

Then retry:
  $ bundle install

Done in 1.3s ✓
```

---

### Example 11: Rust Cargo Compilation Error

**Error:**
```bash
$ cargo build --release
   Compiling myapp v0.1.0 (/home/user/myapp)
error[E0277]: the trait bound `MyStruct: Clone` is not satisfied
  --> src/main.rs:15:22
   |
15 |     let copy = data.clone();
   |                      ^^^^^ the trait `Clone` is not implemented for `MyStruct`
```

**Solution:**
```bash
$ cargo build 2>&1 | oops

🔍 Analyzing error...

Problem: MyStruct doesn't implement the Clone trait

Solution: Derive Clone or implement it manually

  Option 1: Auto-derive (recommended if all fields are Clone)
  #[derive(Clone)]
  struct MyStruct {
      field1: String,
      field2: i32,
  }

  Option 2: Manual implementation
  impl Clone for MyStruct {
      fn clone(&self) -> Self {
          MyStruct {
              field1: self.field1.clone(),
              field2: self.field2,
          }
      }
  }

  Option 3: If you don't need ownership, use a reference
  let copy = &data;  // Borrow instead of clone

Done in 0.9s ✓
```

---

### Example 12: AWS CLI Permission Denied

**Error:**
```bash
$ aws s3 cp file.txt s3://my-bucket/
upload failed: ./file.txt to s3://my-bucket/file.txt
An error occurred (AccessDenied) when calling the PutObject operation: Access Denied
```

**Solution:**
```bash
$ aws s3 cp file.txt s3://my-bucket/ 2>&1 | oops

🔍 Analyzing error...

Problem: IAM permissions insufficient for S3 PutObject operation

Solution: Check and update IAM policy

  1. Verify current credentials:
     $ aws sts get-caller-identity

  2. Check bucket policy and IAM permissions:
     Required permission: s3:PutObject
     Required in policy:
     {
       "Effect": "Allow",
       "Action": ["s3:PutObject"],
       "Resource": "arn:aws:s3:::my-bucket/*"
     }

  3. Common causes:
     - Wrong AWS profile: $ aws configure list
     - Bucket policy blocks your IP/user
     - MFA required but not provided
     - Using wrong region: $ aws configure set region us-east-1

  4. Test with read-only operation first:
     $ aws s3 ls s3://my-bucket/

Done in 1.4s ✓
```

---

### Example 13: Java OutOfMemoryError

**Error:**
```bash
$ java -jar application.jar
Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
        at java.util.Arrays.copyOf(Arrays.java:3332)
        at java.util.ArrayList.grow(ArrayList.java:257)
        at java.util.ArrayList.ensureExplicitCapacity(ArrayList.java:231)
```

**Solution:**
```bash
$ java -jar application.jar 2>&1 | oops

🔍 Analyzing error...

Problem: Java heap space exhausted - application ran out of memory

Solution: Increase heap size or fix memory leak

  Immediate fix - increase heap size:
    $ java -Xms512m -Xmx2048m -jar application.jar
    
    -Xms512m   = Initial heap size (512 MB)
    -Xmx2048m  = Maximum heap size (2 GB)

  Debug memory usage:
    # Enable GC logging
    $ java -Xlog:gc* -jar application.jar

    # Create heap dump on OOM
    $ java -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp -jar application.jar

  Check for memory leaks:
    - Use VisualVM or JProfiler
    - Look for unbounded collections
    - Check for static references holding objects
    - Verify database connections are closed

  For production:
    # Docker container
    docker run -m 2g --memory-swap 2g myapp

    # Kubernetes
    resources:
      limits:
        memory: "2Gi"

Done in 1.2s ✓
```

---

### Example 14: Gradle Build Failure (Dependency Conflict)

**Error:**
```bash
$ ./gradlew build
FAILURE: Build failed with an exception.

* What went wrong:
Could not resolve all dependencies for configuration ':compileClasspath'.
> Could not resolve com.google.guava:guava.
  Required by:
      project : > com.google.api:api-common:2.0.0
      project : > com.google.cloud:google-cloud-storage:2.1.0
   > Cannot find a version of 'com.google.guava:guava' that satisfies the version constraints:
      Dependency path 'project :' --> 'com.google.api:api-common:2.0.0' --> 'com.google.guava:guava:31.0.1-jre'
      Dependency path 'project :' --> 'com.google.cloud:google-cloud-storage:2.1.0' --> 'com.google.guava:guava:30.1-jre'
```

**Solution:**
```bash
$ ./gradlew build 2>&1 | oops

🔍 Analyzing error...

Problem: Dependency version conflict - two libraries require different Guava versions

Solution: Force a compatible version or update dependencies

  Option 1: Force a specific version (in build.gradle)
  configurations.all {
      resolutionStrategy {
          force 'com.google.guava:guava:31.1-jre'
      }
  }

  Option 2: Use dependency constraints
  dependencies {
      constraints {
          implementation('com.google.guava:guava:31.1-jre') {
              because 'Resolve version conflict between api-common and google-cloud-storage'
          }
      }
  }

  Option 3: Update conflicting dependencies
  dependencies {
      implementation 'com.google.cloud:google-cloud-storage:2.2.0'  // Newer version
      implementation 'com.google.api:api-common:2.1.0'              // Newer version
  }

  Debug dependency tree:
    $ ./gradlew dependencies --configuration compileClasspath

Done in 1.1s ✓
```

---

### Example 15: Elixir/Phoenix Compilation Error

**Error:**
```bash
$ mix phx.server
Compiling 12 files (.ex)

== Compilation error in file lib/my_app/accounts/user.ex ==
** (CompileError) lib/my_app/accounts/user.ex:45: undefined function validate_required/2
    (elixir 1.14.2) lib/kernel/parallel_compiler.ex:340: anonymous fn/5 in Kernel.ParallelCompiler.spawn_workers/7
```

**Solution:**
```bash
$ mix phx.server 2>&1 | oops

🔍 Analyzing error...

Problem: Missing import for Ecto.Changeset functions

Solution: Import Ecto.Changeset at the top of your module

  Add to lib/my_app/accounts/user.ex:
  
  defmodule MyApp.Accounts.User do
    use Ecto.Schema
    import Ecto.Changeset  # ← Add this line
    
    schema "users" do
      field :email, :string
      field :name, :string
      timestamps()
    end
    
    def changeset(user, attrs) do
      user
      |> cast(attrs, [:email, :name])
      |> validate_required([:email, :name])  # Now this works
    end
  end

  Common Ecto.Changeset functions that need the import:
    - cast/3
    - validate_required/2
    - validate_length/3
    - validate_format/3
    - unique_constraint/2

Done in 0.7s ✓
```

---

### Example 16: CI/CD Pipeline Failure - GitHub Actions

**Error:**
```bash
$ gh run view 1234567890
✓ build Build and test    52s
✗ deploy Deploy to production 5s

deploy Deploy to production
  Error: Process completed with exit code 1.
  
  Run aws ecs update-service --cluster prod --service web --force-new-deployment
  
  An error occurred (ClusterNotFoundException) when calling the UpdateService operation:
  Cluster not found.
```

**Solution:**
```bash
$ gh run view 1234567890 --log-failed 2>&1 | oops

🔍 Analyzing error...

Problem: AWS ECS cluster not found - likely wrong region or missing AWS credentials in CI

Solution: Configure AWS credentials and region in GitHub Actions

  Add to .github/workflows/deploy.yml:
  
  - name: Configure AWS credentials
    uses: aws-actions/configure-aws-credentials@v2
    with:
      role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRole
      aws-region: us-east-1  # ← Make sure region matches your cluster
  
  - name: Deploy to ECS
    run: |
      aws ecs update-service \
        --cluster prod \
        --service web \
        --force-new-deployment \
        --region us-east-1  # Explicit region

  Checklist:
    ✓ Secrets.AWS_ACCESS_KEY_ID set in repository settings
    ✓ Secrets.AWS_SECRET_ACCESS_KEY set in repository settings
    ✓ IAM user/role has ecs:UpdateService permission
    ✓ Region matches where cluster was created
    ✓ Cluster name matches exactly (case-sensitive)

  Debug:
    $ aws ecs list-clusters --region us-east-1
    $ aws ecs describe-clusters --clusters prod --region us-east-1

Done in 1.5s ✓
```

---

### Example 17: Terraform Apply Failure

**Error:**
```bash
$ terraform apply
...
Error: Error creating ALB Target Group: ValidationError: A target group with the same name 'api-tg' already exists
        status code: 400, request id: abc-123-def
  
  on alb.tf line 23, in resource "aws_lb_target_group" "api":
  23: resource "aws_lb_target_group" "api" {
```

**Solution:**
```bash
$ terraform apply 2>&1 | oops

🔍 Analyzing error...

Problem: AWS resource already exists outside Terraform state

Solution: Import existing resource or use different name

  Option 1: Import existing resource into Terraform state
    # Find the ARN of the existing target group
    $ aws elbv2 describe-target-groups --names api-tg \
      --query 'TargetGroups[0].TargetGroupArn' --output text
    
    # Import it
    $ terraform import aws_lb_target_group.api \
      arn:aws:elasticloadbalancing:us-east-1:123456789:targetgroup/api-tg/abc123

    # Then apply
    $ terraform apply

  Option 2: Use different name or dynamic naming
    resource "aws_lb_target_group" "api" {
      name = "api-tg-${var.environment}"  # api-tg-prod, api-tg-staging
      ...
    }

  Option 3: Delete manually and recreate (CAREFUL!)
    $ aws elbv2 delete-target-group --target-group-arn <arn>
    $ terraform apply

  Check Terraform state:
    $ terraform state list
    $ terraform state show aws_lb_target_group.api

Done in 1.3s ✓
```

---

### Example 18: Redis Connection Error in Rails

**Error:**
```bash
$ rails server
=> Booting Puma
=> Rails 7.0.4 application starting in development
=> Run `bin/rails server --help` for more startup options
Error connecting to Redis on localhost:6379 (Errno::ECONNREFUSED)
/usr/local/bundle/gems/redis-4.8.0/lib/redis/connection/ruby.rb:22:in `rescue in connect'
```

**Solution:**
```bash
$ rails server 2>&1 | oops

🔍 Analyzing error...

Problem: Rails can't connect to Redis - Redis server not running or wrong host/port

Solution: Start Redis and verify connection settings

  1. Check if Redis is running:
     $ redis-cli ping
     
     If "Connection refused":
     $ redis-server  # Start Redis (foreground)
     
     Or as service:
     $ brew services start redis  # macOS
     $ sudo systemctl start redis  # Linux

  2. Check Rails Redis configuration:
     # config/cable.yml or config/redis.yml
     development:
       adapter: redis
       url: redis://localhost:6379/1  # ← Verify this matches your Redis

  3. If using Docker:
     # docker-compose.yml should have:
     redis:
       image: redis:7-alpine
       ports:
         - "6379:6379"
     
     # Rails should connect to:
     url: redis://redis:6379/1  # ← Use service name, not localhost

  4. Test Redis connection:
     $ redis-cli -h localhost -p 6379 ping
     PONG

  5. Environment-specific settings:
     # Use environment variables
     url: <%= ENV.fetch("REDIS_URL") { "redis://localhost:6379/1" } %>

Done in 1.0s ✓
```

---

### Example 19: MongoDB Connection Timeout

**Error:**
```bash
$ npm start
> node server.js

MongooseServerSelectionError: connect ETIMEDOUT 127.0.0.1:27017
    at Connection.openUri (/app/node_modules/mongoose/lib/connection.js:825:32)
    at Mongoose.connect (/app/node_modules/mongoose/lib/index.js:380:15)
reason: TopologyDescription {
  type: 'Unknown',
  servers: Map(1) {
    '127.0.0.1:27017' => ServerDescription {
      address: '127.0.0.1:27017',
      type: 'Unknown',
      error: MongoNetworkError: connect ETIMEDOUT
```

**Solution:**
```bash
$ npm start 2>&1 | oops

🔍 Analyzing error...

Problem: Cannot connect to MongoDB - connection timeout

Solution: Check MongoDB is running and connection string is correct

  1. Is MongoDB running?
     $ mongosh  # Try to connect locally
     
     If not running:
     $ brew services start mongodb-community  # macOS
     $ sudo systemctl start mongod            # Linux
     $ docker run -d -p 27017:27017 mongo:6   # Docker

  2. Check connection string:
     # For local MongoDB:
     mongodb://localhost:27017/mydb
     
     # For MongoDB Atlas (cloud):
     mongodb+srv://username:password@cluster.mongodb.net/mydb
     
     # With authentication:
     mongodb://username:password@localhost:27017/mydb

  3. Firewall/Network issues:
     # Test if port is open:
     $ telnet localhost 27017
     $ nc -zv localhost 27017

  4. Check MongoDB logs:
     $ tail -f /usr/local/var/log/mongodb/mongo.log  # macOS
     $ sudo tail -f /var/log/mongodb/mongod.log      # Linux

  5. Common fixes:
     - Increase connection timeout in Mongoose:
       mongoose.connect(uri, {
         serverSelectionTimeoutMS: 5000  // Default is 30000
       });
     
     - Use correct host in Docker:
       # Don't use localhost, use container name
       mongodb://mongo:27017/mydb

Done in 1.4s ✓
```

---

### Example 20: Webpack Build Out of Memory

**Error:**
```bash
$ npm run build
> webpack --mode production

<--- Last few GCs --->

[18234:0x5638f0a40000]   145623 ms: Mark-sweep 2048.0 (2083.3) -> 2047.7 (2083.3) MB, 1847.6 / 0.0 ms  (average mu = 0.098, current mu = 0.002) allocation failure scavenge might not succeed
[18234:0x5638f0a40000]   147821 ms: Mark-sweep 2048.7 (2084.3) -> 2048.4 (2084.8) MB, 2197.3 / 0.0 ms  (average mu = 0.046, current mu = 0.001) allocation failure scavenge might not succeed

<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

**Solution:**
```bash
$ npm run build 2>&1 | oops

🔍 Analyzing error...

Problem: Node.js ran out of memory during webpack build

Solution: Increase Node memory limit or optimize webpack config

  Quick fix - increase memory:
    # In package.json:
    "scripts": {
      "build": "node --max-old-space-size=4096 node_modules/.bin/webpack --mode production"
    }
    
    # Or set environment variable:
    $ export NODE_OPTIONS="--max-old-space-size=4096"
    $ npm run build

  Long-term fixes - optimize webpack:
    1. Enable code splitting:
       optimization: {
         splitChunks: {
           chunks: 'all',
           maxSize: 244000,
         }
       }

    2. Disable source maps in production (if not needed):
       devtool: false  // or 'source-map' instead of 'eval-source-map'

    3. Use thread-loader for parallel processing:
       npm install --save-dev thread-loader

    4. Enable caching:
       cache: {
         type: 'filesystem'
       }

    5. Check for circular dependencies:
       npm install --save-dev circular-dependency-plugin

  Debug memory usage:
    $ node --expose-gc --max-old-space-size=4096 \
      node_modules/.bin/webpack --mode production --profile

Done in 1.6s ✓
```

---

## Advanced Features

### Severity Filtering

Use `--severity` to focus on specific error types:

```bash
# Only show critical errors (crashes, security, permissions)
$ npm run build 2>&1 | oops --severity critical

# Only analyze warnings (deprecations, timeouts)
$ npm test 2>&1 | oops --severity warning

# Default: all errors
$ python script.py 2>&1 | oops
```

**Severity levels:**
- 🔴 **critical** - Fatal errors, segfaults, out-of-memory, permission denied, security violations
- 🟠 **error** - Standard errors, exceptions, failed assertions, compilation errors
- 🟡 **warning** - Deprecation warnings, lint warnings, timeouts, missing optional dependencies
- 🔵 **info** - Hints, suggestions, performance tips, informational messages

---

### Batch Error Analysis

Analyze multiple error logs at once:

```bash
# Analyze all CI job failures
$ gh run view --log-failed | oops > solutions.txt

# Process saved error logs
$ cat /var/log/application.log | oops

# Combine multiple sources
$ cat error1.log error2.log error3.log | oops
```

---

### Integration with Shell Aliases

**Create smart error handlers:**

```bash
# Add to ~/.bashrc or ~/.zshrc

# Auto-explain errors for common commands
alias npm-safe='npm 2>&1 | tee /dev/tty | oops'
alias py='python 2>&1 | tee /dev/tty | oops'
alias build='npm run build 2>&1 | tee /dev/tty | oops'

# Test runner with auto-explanation
alias test='npm test 2>&1 | tee /dev/tty | (grep -q "FAIL" && oops || cat)'

# Git push with error handling
git-safe() {
  git push "$@" 2>&1 | tee /dev/tty | (grep -q "error:" && oops || cat)
}
```

**Usage:**
```bash
$ npm-safe install express  # Errors automatically explained
$ py app.py                  # Python errors auto-analyzed
$ git-safe origin main       # Git push errors explained
```

---

### CI/CD Pipeline Integration

**GitHub Actions:**
```yaml
# .github/workflows/ci.yml
name: CI with Error Explanation

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests with error analysis
        run: |
          npm test 2>&1 | tee test-output.log || {
            echo "## Test Failures" >> $GITHUB_STEP_SUMMARY
            echo '```' >> $GITHUB_STEP_SUMMARY
            npx oops-cli < test-output.log >> $GITHUB_STEP_SUMMARY
            echo '```' >> $GITHUB_STEP_SUMMARY
            exit 1
          }
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

**GitLab CI:**
```yaml
# .gitlab-ci.yml
test:
  script:
    - npm test 2>&1 | tee test.log || true
  after_script:
    - |
      if grep -q "FAILED" test.log; then
        echo "Analyzing test failures..."
        cat test.log | npx oops-cli
      fi
  artifacts:
    when: on_failure
    paths:
      - test.log
```

---

### Error Pattern Recognition

`oops` learns from common patterns and provides context-aware solutions:

**Detected patterns:**

- **Missing dependency** → Suggests installation command for specific package manager
- **Port in use** → Shows how to kill process + find what's using it
- **Permission denied** → Checks file permissions, ownership, sudo requirements
- **Connection refused** → Verifies service status, firewall, network config
- **Out of memory** → Analyzes heap size, suggests optimizations
- **Environment variable missing** → Shows where to set it for your platform
- **Certificate/SSL errors** → Guides through cert validation, renewal
- **Version mismatch** → Suggests upgrading/downgrading specific packages

---

### Performance Tuning

**Optimize API usage:**

```bash
# Cache common errors locally (coming soon)
$ oops --cache enable

# Use faster model for simple errors
$ oops --model claude-haiku < error.log

# Batch processing for multiple errors
$ find logs/ -name "*.log" -exec cat {} \; | oops --batch
```

---

### Keyboard Shortcuts & Workflow

**Quick error re-run pattern:**

```bash
# Save last command that failed
alias failed='fc -ln -1 2>&1 | oops'

# Usage:
$ npm run build  # Fails
$ failed         # Automatically analyzes the error

# Or use !! (repeat last command) with pipe:
$ npm run build  # Fails
$ !! 2>&1 | oops # Explains it
```

**Multi-stage debugging:**

```bash
# 1. Run and capture
$ npm test 2>&1 | tee test-error.log

# 2. Analyze
$ cat test-error.log | oops

# 3. Try fix
$ npm install missing-package

# 4. Re-run
$ npm test
```

---

## Troubleshooting oops Itself

### "ANTHROPIC_API_KEY not set"

```bash
$ oops
Error: ANTHROPIC_API_KEY environment variable not set

# Solution:
$ export ANTHROPIC_API_KEY="sk-ant-..."

# Make permanent:
$ echo 'export ANTHROPIC_API_KEY="sk-ant-..."' >> ~/.bashrc
$ source ~/.bashrc
```

---

### "No error detected in input"

```bash
$ echo "Everything is fine" | oops
No error detected in input

# oops needs actual error messages to analyze
# Make sure you're piping stderr (2>&1):

# ❌ Wrong:
$ npm test | oops

# ✅ Correct:
$ npm test 2>&1 | oops
```

---

### "API rate limit exceeded"

```bash
$ npm build 2>&1 | oops
Error: Rate limit exceeded. Try again in 60 seconds.

# Solution: Wait or upgrade Anthropic API tier
# For testing, use --verbose to see request details:
$ npm build 2>&1 | oops --verbose
```

---

### Verbose mode shows too much

```bash
# Default (concise):
$ npm test 2>&1 | oops

# Verbose (detailed):
$ npm test 2>&1 | oops --verbose

# Minimal (just the solution):
$ npm test 2>&1 | oops | grep "Solution:" -A 20
```

---

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
