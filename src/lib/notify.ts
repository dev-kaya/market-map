export async function notifyCurator(name: string) {
  // In a real implementation, this would send to Postmark/Slack
  // For now, just log to console
  console.log(`📩 New startup suggestion: "${name}"`);
  
  // Example Slack webhook (commented out)
  // await fetch(process.env.SLACK_WEBHOOK_URL!, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     text: `New startup suggestion: "${name}"`
  //   })
  // });
}