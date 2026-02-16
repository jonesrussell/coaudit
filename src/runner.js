import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { generateReport } from './report.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const AUDIT_DIMENSIONS = [
  'dead_code',
  'architectural_leaks',
  'selector_fragility',
  'routing_inconsistencies',
  'missing_tests',
  'observability_gaps',
];

export async function runAudit(targetDir) {
  console.log(`🔍 Auditing: ${targetDir}\n`);

  if (!fs.existsSync(targetDir)) {
    throw new Error(`Directory not found: ${targetDir}`);
  }

  const results = {};

  for (const audit of AUDIT_DIMENSIONS) {
    console.log(`📋 Running ${audit} audit...`);
    
    try {
      const prompt = loadPrompt(audit);
      const context = collectContext(targetDir, audit);
      
      if (!context) {
        console.warn(`  ⚠️  No relevant files found (skipping)`);
        results[audit] = { status: 'skipped', reason: 'no context' };
        continue;
      }

      const output = await runCopilot(prompt, context, targetDir);
      results[audit] = normalize(output, audit);
      console.log(`  ✓ ${audit} audit complete`);
    } catch (err) {
      console.error(`  ✗ Error in ${audit}:`, err.message);
      results[audit] = { status: 'error', error: err.message };
    }
  }

  const report = generateReport(results, targetDir);
  console.log('\n📄 Audit Report:\n');
  console.log(report);

  return { results, report };
}

function loadPrompt(dimension) {
  const promptPath = path.join(__dirname, 'prompts', `${dimension}.md`);
  if (!fs.existsSync(promptPath)) {
    throw new Error(`Prompt not found: ${dimension}.md`);
  }
  return fs.readFileSync(promptPath, 'utf8');
}

async function runCopilot(prompt, context, targetDir) {
  // Create a temporary context file for Copilot to reference
  const contextFile = path.join(targetDir, '.copilot-audit-context.md');
  const fullPrompt = `${prompt}\n\n## Code Context\n\n${context}`;

  try {
    fs.writeFileSync(contextFile, fullPrompt, 'utf8');
    
    // Use Copilot CLI in interactive mode with the context
    // For automation, we simulate a response based on the prompt structure
    const mockResponse = generateMockResponse(prompt);
    
    return mockResponse;
  } finally {
    try {
      if (fs.existsSync(contextFile)) {
        fs.unlinkSync(contextFile);
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

function generateMockResponse(prompt) {
  // This is a placeholder that shows how Copilot output would be processed
  // In a real scenario, this would parse actual Copilot CLI output
  return `[Mock Analysis]\n\nBased on the audit prompt:\n${prompt.substring(0, 100)}...\n\nNote: To see real Copilot analysis, run:\ncopilot "Analyze the codebase for ${prompt.split('Audit Prompt')[0].trim().toLowerCase()} issues"`;
}

function collectContext(targetDir, audit) {
  const files = [];
  const dirsToScan = ['src', 'app', 'routes', 'resources/js', 'lib', 'components'];

  for (const dir of dirsToScan) {
    const full = path.join(targetDir, dir);
    if (!fs.existsSync(full)) continue;

    walkDir(full, (file) => {
      const ext = path.extname(file);
      if (['.js', '.ts', '.tsx', '.jsx', '.py', '.php', '.go'].includes(ext)) {
        try {
          const content = fs.readFileSync(file, 'utf8');
          const relativePath = path.relative(targetDir, file);
          files.push(`\n/* File: ${relativePath} */\n${content}`);
        } catch (e) {
          // Skip unreadable files silently
        }
      }
    });
  }

  if (files.length === 0) return null;

  // Limit context to 50KB to avoid overwhelming Copilot
  return files.join('\n\n/* --- FILE BREAK --- */\n\n').substring(0, 50000);
}

function walkDir(dir, callback) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(full, callback);
      } else {
        callback(full);
      }
    }
  } catch (err) {
    // Skip inaccessible directories
  }
}

function normalize(raw, dimensionName) {
  return {
    status: 'completed',
    dimension: dimensionName,
    raw,
    summary: extractSummary(raw),
  };
}

function extractSummary(raw) {
  const lines = raw.split('\n');
  return lines.slice(0, 3).join(' ').substring(0, 150);
}
