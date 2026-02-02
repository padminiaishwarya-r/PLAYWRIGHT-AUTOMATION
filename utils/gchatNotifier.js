
export async function sendGChatReport({
  total,
  passed,
  failed,
  flaky,
  vitalsStatus
}) {
  // 🔕 HARD STOP if disabled
  if (process.env.GCHAT_ENABLED !== "true") {
    console.log("🔕 Google Chat notification is disabled");
    return;
  }

  if (!process.env.GCHAT_WEBHOOK_URL) {
    console.log("⚠️ GCHAT_WEBHOOK_URL not set. Skipping Google Chat");
    return;
  }

  const executionTime = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  const message = `
 *Automation Execution Report*
 *Executed on:* ${executionTime}

 *Test Summary*
• Total: ${total}
• Passed: ${passed}
• Flaky: ${flaky}
• Failed: ${failed}

 *Web Vitals Status*
${vitalsStatus}

 _Detailed HTML report sent via Email_
`;

  await fetch(process.env.GCHAT_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: message })
  });

  console.log("✅ Google Chat summary sent");
}
