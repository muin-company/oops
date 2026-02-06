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

/**
 * Classify error severity based on keywords and patterns
 */
function detectSeverity(errorText) {
  const text = errorText.toLowerCase();
  
  // Critical: System crashes, data loss, security issues
  const criticalPatterns = [
    /fatal/i,
    /segmentation fault/i,
    /core dumped/i,
    /out of memory/i,
    /killed/i,
    /signal sigkill/i,
    /panic/i,
    /abort/i,
    /cannot allocate memory/i,
    /database connection failed/i,
    /permission denied/i,
    /access denied/i,
    /authentication failed/i,
    /security/i,
    /vulnerability/i
  ];
  
  // Warning: Non-breaking issues, deprecations, performance
  const warningPatterns = [
    /warn/i,
    /deprecated/i,
    /obsolete/i,
    /slow/i,
    /timeout/i,
    /retry/i,
    /skipping/i,
    /ignoring/i,
    /fallback/i,
    /unable to/i,
    /could not find/i,
    /missing/i
  ];
  
  // Info: Non-critical notices, suggestions
  const infoPatterns = [
    /info/i,
    /notice/i,
    /suggestion/i,
    /hint/i,
    /tip/i,
    /did you mean/i,
    /consider/i
  ];
  
  // Check critical first (highest severity)
  for (const pattern of criticalPatterns) {
    if (pattern.test(errorText)) {
      return 'critical';
    }
  }
  
  // Check warnings
  for (const pattern of warningPatterns) {
    if (pattern.test(errorText)) {
      return 'warning';
    }
  }
  
  // Check info
  for (const pattern of infoPatterns) {
    if (pattern.test(errorText)) {
      return 'info';
    }
  }
  
  // Default: If it contains Error, Exception, or stack trace → error
  if (/error|exception|failed|failure/i.test(errorText)) {
    return 'error';
  }
  
  // Otherwise info
  return 'info';
}

function detectContext(errorText) {
  const context = {
    language: null,
    hasStackTrace: false,
    errorType: null,
    severity: null
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

  // Detect severity
  context.severity = detectSeverity(errorText);

  return context;
}

module.exports = { detectContext };
