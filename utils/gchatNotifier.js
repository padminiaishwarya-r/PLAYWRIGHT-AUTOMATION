export async function sendGChatReport({
  total,
  passed,
  failed,
  flaky,
  vitalsStatus,
  type = "automation"   // 👈 NEW (default)
}) {

  // 🔕 Control per report type
  if (type === "automation" && process.env.GCHAT_ENABLED !== "true") {
    console.log("🔕 Automation GChat disabled");
    return;
  }

  if (type === "magento" && process.env.MAGENTO_GCHAT_ENABLED !== "true") {
    console.log("🔕 Magento GChat disabled");
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

  const title =
    type === "magento"
      ? "Magento Daily Orders Report"
      : "Automation Execution Report";

  const message = `
 *${title}*
 *Executed on:* ${executionTime}

${vitalsStatus}

`;

  await fetch(process.env.GCHAT_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: message })
  });

  console.log("✅ Google Chat message sent");
}

/**
 * Sends reconciliation summary (Magento vs Stripe installments) to Google Chat.
 * Uses MAGENTO_GCHAT_ENABLED and GCHAT_WEBHOOK_URL.
 * Sends a card layout when supported; falls back to aligned text.
 * @param {{ totalEnrollments: number, mismatchCount: number, mismatches: { planId: string, magento: number, stripe: number }[] }} payload
 */
export async function sendReconciliationToGChat({ totalEnrollments, mismatchCount, mismatches }) {
  if (process.env.MAGENTO_GCHAT_ENABLED !== "true") {
    console.log("🔕 Magento/Reconciliation GChat disabled");
    return;
  }
  if (!process.env.GCHAT_WEBHOOK_URL) {
    console.log("⚠️ GCHAT_WEBHOOK_URL not set. Skipping reconciliation GChat");
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

  const mismatchList = (mismatches || []).slice(0, 25);
  const moreCount = Math.max(0, (mismatches || []).length - 25);

  // Table aligned like Magento Daily Orders Report (WIDTH 70); clear columns for Pop ID | Magento count | Stripe count
  const WIDTH = 70;
  const border = (char = "=") => "+" + char.repeat(WIDTH - 2) + "+";
  const padEnd = (s, n) => String(s).padEnd(n, " ");
  const padStart = (s, n) => String(s).padStart(n, " ");
  const center = (text) => {
    const space = WIDTH - 2 - text.length;
    const left = Math.max(0, Math.floor(space / 2));
    const right = Math.max(0, space - left);
    return "|" + " ".repeat(left) + text + " ".repeat(right) + "|";
  };
  const row2 = (left, right) => `| ${padEnd(left, 31)} | ${padEnd(right, 32)} |`;
  const COL_POP = 26;
  const COL_MAG = 18;
  const COL_STR = 16;
  const row3 = (popId, mag, str) =>
    `| ${padEnd(String(popId), COL_POP)} | ${padStart(String(mag), COL_MAG)} | ${padStart(String(str), COL_STR)} |`;
  // Separator row with same column widths as row3 so vertical bars align
  const row3Sep = `| ${"-".repeat(COL_POP)} | ${"-".repeat(COL_MAG)} | ${"-".repeat(COL_STR)} |`;

  const reportLines = [
    border("="),
    center("RECONCILIATION: MAGENTO VS STRIPE"),
    border("="),
    row2("Executed on", executionTime),
    border("-"),
    row2("Total enrollments", String(totalEnrollments)),
    row2("Mismatches (Magento ≠ Stripe)", String(mismatchCount)),
    border("-"),
    row3("Pop ID", "Magento count", "Stripe count"),
    row3Sep,
    ...(mismatchCount > 0
      ? mismatchList.map((m) => row3(m.planId, m.magento, m.stripe))
      : [row3("(No mismatches)", "", "")]),
    ...(moreCount > 0 ? [row2("... and more", String(moreCount))] : []),
    border("=")
  ];
  const reportBlock = reportLines.join("\n");

  // Card: plain-text table only (no HTML in rows) so every row is exactly WIDTH chars and pipes align
  const cardPayload = {
    cards: [
      {
        header: {
          title: "Reconciliation: Magento vs Stripe",
          subtitle: `Executed on ${executionTime}`
        },
        sections: [
          {
            widgets: [{ textParagraph: { text: "<pre>" + reportBlock + "</pre>" } }]
          }
        ]
      }
    ]
  };

  const textPayload = { text: reportBlock };

  try {
    const res = await fetch(process.env.GCHAT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cardPayload)
    });
    if (!res.ok) {
      await fetch(process.env.GCHAT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(textPayload)
      });
    }
  } catch {
    await fetch(process.env.GCHAT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(textPayload)
    });
  }

  console.log("✅ Reconciliation report sent to Google Chat");
}
