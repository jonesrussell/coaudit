export function generateReport(results, targetDir) {
  const timestamp = new Date().toISOString();
  
  let report = `# Copilot Pipeline Audit Report\n\n`;
  report += `**Repository:** ${targetDir}\n`;
  report += `**Timestamp:** ${timestamp}\n\n`;
  report += `## Summary\n\n`;
  
  const dimensions = Object.keys(results);
  report += `Audit dimensions analyzed: ${dimensions.length}\n\n`;
  
  report += `## Findings\n\n`;
  
  for (const [dimension, data] of Object.entries(results)) {
    const title = dimension
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    report += `### ${title}\n\n`;
    report += `**Status:** ${data.status}\n`;
    report += `**Details:** Analysis pending (Copilot CLI integration)\n\n`;
  }

  report += `## Next Steps\n\n`;
  report += `- [ ] Review findings\n`;
  report += `- [ ] Prioritize issues\n`;
  report += `- [ ] Create issues/PRs\n`;
  
  return report;
}
