import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { generateReport } from './report.js';

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

  // Validate target directory exists
  if (!fs.existsSync(targetDir)) {
    throw new Error(`Directory not found: ${targetDir}`);
  }

  const results = {};

  for (const dimension of AUDIT_DIMENSIONS) {
    console.log(`📋 Running ${dimension} audit...`);
    try {
      const promptPath = new URL(`./prompts/${dimension}.md`, import.meta.url);
      
      if (!fs.existsSync(promptPath)) {
        console.warn(`  ⚠️  Prompt not found: ${dimension}.md (skipping)`);
        continue;
      }

      const prompt = fs.readFileSync(promptPath, 'utf-8');
      
      // TODO: Call Copilot CLI to analyze
      // For now, store the dimension for mock execution
      results[dimension] = {
        status: 'pending',
        prompt: prompt.substring(0, 100) + '...',
      };

      console.log(`  ✓ ${dimension} audit queued`);
    } catch (err) {
      console.error(`  ✗ Error loading ${dimension}:`, err.message);
    }
  }

  // Generate report
  const report = generateReport(results, targetDir);
  
  console.log('\n📄 Audit Report:\n');
  console.log(report);

  return { results, report };
}
