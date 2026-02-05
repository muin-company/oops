/**
 * Detect language/framework from error messages
 */

const patterns = {
  typescript: [
    /error TS\d+:/i,
    /\.ts\(\d+,\d+\):/,
    /\.ts:\d+:\d+/,
    /Type '.+' is not assignable/i,
    /tsc /i
  ],
  javascript: [
    /npm ERR!/i,
    /yarn error/i,
    /Cannot find module/i,
    /SyntaxError:/i,
    /TypeError:/i,
    /ReferenceError:/i,
    /at .+\.js:\d+/,
    /Module\._/,
    /Require stack:/i,
    /node_modules/,
    /webpack/i,
    /vite/i
  ],
  python: [
    /Traceback \(most recent call last\)/i,
    /File ".+\.py", line \d+/,
    /\w+Error:/,
    /pip install/i,
    /python\d?\.\d+/i,
    /django/i,
    /flask/i
  ],
  go: [
    /go build/i,
    /cannot find package/i,
    /undefined:/,
    /go\.mod/i,
    /\.go:\d+:\d+:/
  ],
  rust: [
    /error\[E\d+\]/,
    /cargo build/i,
    /--> .+\.rs:\d+:\d+/,
    /rustc/i,
    /expected .+, found .+/
  ],
  java: [
    /Exception in thread/i,
    /\w+Exception:/,
    /at .+\.java:\d+/,
    /gradle/i,
    /maven/i
  ],
  ruby: [
    /\.rb:\d+:in/,
    /\w+Error:/,
    /gem install/i,
    /bundler/i
  ],
  php: [
    /Fatal error:/i,
    /Parse error:/i,
    /in .+\.php on line \d+/i,
    /composer/i
  ],
  docker: [
    /docker/i,
    /dockerfile/i,
    /container/i,
    /image .+ not found/i
  ],
  git: [
    /fatal: .+/i,
    /^git /im,
    /\[rejected\]/i,
    /error: failed to push/i
  ]
};

function detectContext(errorText) {
  const context = {
    language: null,
    hasStackTrace: false,
    errorType: null
  };

  // Detect language/framework - score based on matches
  let maxScore = 0;
  for (const [lang, regexes] of Object.entries(patterns)) {
    const matches = regexes.filter(regex => regex.test(errorText));
    if (matches.length > maxScore) {
      maxScore = matches.length;
      context.language = lang;
    }
  }

  // Detect stack trace
  context.hasStackTrace = /at .+:\d+:\d+|Traceback|\.rs:\d+:\d+/.test(errorText);

  // Extract error type (first line usually contains it)
  const firstLine = errorText.split('\n')[0];
  const errorMatch = firstLine.match(/(\w+Error|Error\[\w+\]|FATAL|ERROR)/i);
  if (errorMatch) {
    context.errorType = errorMatch[1];
  }

  return context;
}

module.exports = { detectContext };
