#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const Anthropic = require('@anthropic-ai/sdk');
const { detectContext } = require('../lib/detector');
const { formatSolution } = require('../lib/formatter');

program
  .name('oops')
  .description('Pipe error messages to AI for instant solutions')
  .version('1.0.0')
  .option('-v, --verbose', 'Show detailed analysis')
  .option('--no-color', 'Disable colored output')
  .parse(process.argv);

const options = program.opts();

// Read from stdin
let inputData = '';

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  let chunk;
  while ((chunk = process.stdin.read()) !== null) {
    inputData += chunk;
  }
});

process.stdin.on('end', async () => {
  if (!inputData.trim()) {
    console.error(chalk.red('No input received. Pipe an error message to oops:'));
    console.error(chalk.gray('  npm run build 2>&1 | oops'));
    process.exit(1);
  }

  try {
    await analyzeError(inputData, options);
  } catch (error) {
    console.error(chalk.red('Error analyzing:'), error.message);
    process.exit(1);
  }
});

async function analyzeError(errorText, options) {
  const startTime = Date.now();

  // Detect context
  const context = detectContext(errorText);
  
  if (options.verbose) {
    console.log(chalk.blue('Detected:'), context.language || 'unknown');
    console.log(chalk.gray('Analyzing...\n'));
  }

  // Check for API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error(chalk.red('Error: ANTHROPIC_API_KEY not set'));
    console.error(chalk.gray('Set it with: export ANTHROPIC_API_KEY=your-key-here'));
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  // Build prompt
  const systemPrompt = `You are a debugging assistant. Analyze error messages and provide actionable solutions.

Rules:
- Be concise and direct
- Provide exact commands or code fixes
- No fluff or explanations unless necessary
- Format as: Problem → Solution → Command/Code
- If multiple solutions exist, list the most likely first`;

  const userPrompt = `${context.language ? `Language/Framework: ${context.language}\n\n` : ''}Error output:
\`\`\`
${errorText}
\`\`\`

Provide the fix.`;

  // Call API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    temperature: 0,
    system: systemPrompt,
    messages: [{
      role: 'user',
      content: userPrompt
    }]
  });

  const solution = response.content[0].text;
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  // Format and display
  console.log(formatSolution(solution, context, options));
  
  if (options.verbose) {
    console.log(chalk.gray(`\n⚡ ${elapsed}s`));
  }
}
