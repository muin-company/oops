# Quick Start - oops CLI

Get started in 60 seconds.

## 1. Install

```bash
npm install -g oops-cli
```

## 2. Set API Key

Get your key from: https://console.anthropic.com/

```bash
export ANTHROPIC_API_KEY=sk-ant-xxxxx
```

Add to `~/.bashrc` or `~/.zshrc` to make permanent:
```bash
echo 'export ANTHROPIC_API_KEY=sk-ant-xxxxx' >> ~/.bashrc
source ~/.bashrc
```

## 3. Use It

Just pipe any error to `oops`:

```bash
npm install 2>&1 | oops
python script.py 2>&1 | oops
cargo build 2>&1 | oops
```

## That's It!

### Tips

**Save typing** with an alias:
```bash
alias fix='2>&1 | oops'
```

Then use:
```bash
npm run build fix
python app.py fix
```

**Verbose mode** for details:
```bash
go build 2>&1 | oops -v
```

**No color** for logs/CI:
```bash
npm test 2>&1 | oops --no-color
```

## Common Issues

**"Command not found"**
```bash
npm install -g oops-cli  # Install globally
# or
npx oops-cli  # Use without installing
```

**"ANTHROPIC_API_KEY not set"**
```bash
export ANTHROPIC_API_KEY=your-key-here
```

**"No input received"**  
Don't forget `2>&1` to capture stderr:
```bash
command 2>&1 | oops  # ✅ Correct
command | oops       # ❌ Misses stderr
```

## Examples

```bash
# Node.js
npm install express 2>&1 | oops

# Python
python -c "import flask" 2>&1 | oops

# Go
go build ./... 2>&1 | oops

# Rust
cargo check 2>&1 | oops

# Git
git push 2>&1 | oops

# Docker
docker run myapp 2>&1 | oops
```

## Need Help?

- Docs: See README.md
- Demo: See DEMO.md
- Examples: See examples/real-errors.md
- Issues: [GitHub Issues](https://github.com/yourusername/oops-cli/issues)

---

Made with ❤️ and Claude
