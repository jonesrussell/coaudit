export function generateReport(results, targetDir) {
  const timestamp = new Date().toISOString();
  
  let report = `# Copilot Pipeline Audit Report\n\n`;
  report += `**Repository:** ${targetDir}\n`;
  report += `**Timestamp:** ${timestamp}\n\n`;
  
  const completed = Object.values(results).filter(r => r.status === 'completed').length;
  const skipped = Object.values(results).filter(r => r.status === 'skipped').length;
  const errors = Object.values(results).filter(r => r.status === 'error').length;
  
  report += `## Summary\n\n`;
  report += `| Status | Count |\n`;
  report += `|--------|-------|\n`;
  report += `| Completed | ${completed} |\n`;
  report += `| Skipped | ${skipped} |\n`;
  report += `| Errors | ${errors} |\n\n`;
  
  report += `## Findings\n\n`;
  
  for (const [dimension, data] of Object.entries(results)) {
    const title = dimension
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    report += `### ${title}\n\n`;
    
    if (data.status === 'completed') {
      report += `**Status:** ✅ Completed\n\n`;
      report += `\`\`\`\n${data.raw.substring(0, 500)}\n\`\`\`\n\n`;
    } else if (data.status === 'skipped') {
      report += `**Status:** ⏭️ Skipped\n`;
      report += `**Reason:** ${data.reason}\n\n`;
    } else if (data.status === 'error') {
      report += `**Status:** ❌ Error\n`;
      report += `**Error:** ${data.error}\n\n`;
    }
  }

  report += `## Next Steps\n\n`;
  report += `- [ ] Review findings above\n`;
  report += `- [ ] Prioritize issues by dimension\n`;
  report += `- [ ] Create issues/PRs for fixes\n`;
  report += `- [ ] Re-run audit to verify improvements\n`;
  
  return report;
}
