# oops CLI - Visual Demo

See what `oops` looks like in action (formatted output examples).

## Example 1: Node.js Missing Module

**Input:**
```bash
$ node app.js 2>&1 | oops
```

**Output:**
```
[javascript]

Problem: Cannot find module 'express'

Solution: Install the missing dependency

  $ npm install express

After installing, the require statement will work correctly.
```

---

## Example 2: Python Import Error (Verbose)

**Input:**
```bash
$ python app.py 2>&1 | oops -v
```

**Output:**
```
Detected: python
Analyzing...

[python]

Problem: ModuleNotFoundError: No module named 'flask'

Solution: Install Flask using pip

  $ pip install flask

Or if using Python 3 specifically:

  $ pip3 install flask

For development with dependencies:

  $ pip install -r requirements.txt

⚡ 1.2s
```

---

## Example 3: TypeScript Type Error

**Input:**
```bash
$ tsc 2>&1 | oops
```

**Output:**
```
[typescript]

Problem: Type 'string' is not assignable to type 'number'

Fix: Change the variable type or convert the value

  const count: number = parseInt("10");

Or update the type annotation:

  const count: string = "10";
```

---

## Example 4: Go Undefined Function

**Input:**
```bash
$ go build 2>&1 | oops
```

**Output:**
```
[go]

Problem: undefined: fmt.Printl

Fix: Change `fmt.Printl` to `fmt.Println`

  fmt.Println("Hello World")

Common typo - the correct function name has 'ln' at the end.
```

---

## Example 5: Rust Type Mismatch

**Input:**
```bash
$ cargo build 2>&1 | oops
```

**Output:**
```
[rust]

Problem: expected `i32`, found `&str`

Fix: Convert the string to an integer

  let x: i32 = "hello".parse().unwrap();

Or if you want a string:

  let x: &str = "hello";
```

---

## Example 6: Docker Image Not Found

**Input:**
```bash
$ docker run myapp 2>&1 | oops
```

**Output:**
```
[docker]

Problem: pull access denied for myapp, repository does not exist

Solution: Build the image locally first

  $ docker build -t myapp .

Or pull from the correct registry:

  $ docker pull username/myapp
```

---

## Example 7: Git Merge Conflict

**Input:**
```bash
$ git merge feature 2>&1 | oops
```

**Output:**
```
[git]

Problem: Your local changes would be overwritten by merge

Solution: Save your changes first

  $ git stash

Then merge:

  $ git merge feature

Apply your changes back:

  $ git stash pop
```

---

## Example 8: npm Package Not Found

**Input:**
```bash
$ npm install 2>&1 | oops
```

**Output:**
```
[javascript]

Problem: ENOENT: no such file or directory, open 'package.json'

Solution: Initialize a new npm project

  $ npm init -y

Or navigate to the correct directory containing package.json.
```

---

## Color Legend

When using `oops` in your terminal, output is color-coded:

- **Blue** - Language/framework detected
- **Green** - Commands to run (preceded by `$`)
- **Yellow** - Section headers (Problem, Solution, Fix)
- **White** - Explanatory text
- **Gray** - Code blocks and timing info

## No Color Mode

For logs or CI/CD, use `--no-color`:

```bash
npm test 2>&1 | oops --no-color > error-log.txt
```

Output will be plain text without ANSI codes.

---

## Real Terminal Recording

Try it yourself:

```bash
# Install
npm install -g oops-cli

# Set API key
export ANTHROPIC_API_KEY=your-key-here

# Run any command with oops
npm run build 2>&1 | oops
```

**The magic happens instantly.** ✨
