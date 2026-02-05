const chalk = require('chalk');

/**
 * Format the AI solution for terminal output
 */
function formatSolution(solution, context, options) {
  const lines = solution.split('\n');
  let output = [];

  // Header
  if (context.language) {
    output.push(chalk.blue(`[${context.language}]`) + '\n');
  }

  let inCodeBlock = false;
  let codeBlockContent = [];

  for (const line of lines) {
    // Detect code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        output.push(chalk.gray('  ' + codeBlockContent.join('\n  ')));
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        // Start of code block
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Format headers/sections
    if (line.match(/^#+\s/)) {
      const text = line.replace(/^#+\s/, '');
      output.push('\n' + chalk.bold.yellow(text));
      continue;
    }

    // Format command lines (starting with $, npm, cargo, etc.)
    if (line.match(/^\s*([$>]|npm|yarn|pip|cargo|go|git|docker)\s/)) {
      output.push(chalk.green('  $ ') + chalk.white(line.replace(/^\s*[$>]\s*/, '')));
      continue;
    }

    // Bold for Problem/Solution/Fix keywords
    if (line.match(/^(Problem|Solution|Fix|Command|Code):/i)) {
      const [keyword, ...rest] = line.split(':');
      output.push('\n' + chalk.bold.yellow(keyword + ':') + rest.join(':'));
      continue;
    }

    // Regular lines
    if (line.trim()) {
      output.push(line);
    } else {
      output.push('');
    }
  }

  // If there's remaining code block content
  if (codeBlockContent.length > 0) {
    output.push(chalk.gray('  ' + codeBlockContent.join('\n  ')));
  }

  return output.join('\n');
}

module.exports = { formatSolution };
