#!/usr/bin/env python3
# Example: A broken Python script to test oops
# Run: python examples/broken-script.py 2>&1 | oops

from flask import Flask  # Module not installed

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello World'

if __name__ == '__main__':
    app.run()
