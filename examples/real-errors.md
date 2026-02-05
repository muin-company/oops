# Real-World Error Examples

Test `oops` with these actual error messages.

## Node.js - Missing Module

```bash
cat <<'EOF' | oops
Error: Cannot find module 'express'
Require stack:
- /Users/dev/app.js
    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:933:15)
    at Function.Module._load (node:internal/modules/cjs/loader:778:27)
EOF
```

## Python - Import Error

```bash
cat <<'EOF' | oops
Traceback (most recent call last):
  File "app.py", line 1, in <module>
    from flask import Flask
ModuleNotFoundError: No module named 'flask'
EOF
```

## npm - Missing package.json

```bash
cat <<'EOF' | oops
npm ERR! code ENOENT
npm ERR! syscall open
npm ERR! path /Users/dev/myapp/package.json
npm ERR! errno -2
npm ERR! enoent ENOENT: no such file or directory, open '/Users/dev/myapp/package.json'
EOF
```

## Go - Undefined Function

```bash
cat <<'EOF' | oops
# command-line-arguments
./main.go:8:5: undefined: fmt.Printl
EOF
```

## Rust - Type Mismatch

```bash
cat <<'EOF' | oops
error[E0308]: mismatched types
 --> src/main.rs:4:9
  |
4 |     let x: i32 = "hello";
  |         -        ^^^^^^^ expected `i32`, found `&str`
  |         |
  |         expected due to this
EOF
```

## Docker - Image Not Found

```bash
cat <<'EOF' | oops
docker: Error response from daemon: pull access denied for myapp/backend, repository does not exist or may require 'docker login': denied: requested access to the resource is denied.
EOF
```

## Git - Merge Conflict

```bash
cat <<'EOF' | oops
error: Your local changes to the following files would be overwritten by merge:
	src/main.js
Please commit your changes or stash them before you merge.
Aborting
EOF
```

## TypeScript - Type Error

```bash
cat <<'EOF' | oops
src/app.ts:12:5 - error TS2322: Type 'string' is not assignable to type 'number'.

12     const count: number = "10";
       ~~~~~~~~~~~~
EOF
```
