import { test } from '@playwright/test';
import { loginToMagento } from '../../utils/magentoAuth.js';
import { getYesterdayOrdersCountByStatus } from '../../utils/magentoOrders.js';
import { sendGChatReport } from '../../utils/gchatNotifier.js';
import { buildMagentoOrdersReport } from '../../utils/magentoReportFormatter.js';

test('Daily Magento Orders Report', async ({ page }) => {
  await loginToMagento(page);

  const report = await getYesterdayOrdersCountByStatus(page);

  const executedOn = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const rows = [
    { status: 'Order Received', count: report.counts['Order Received'] },
    { status: 'Shipped', count: report.counts['Shipped'] },
    { status: 'In Progress', count: report.counts['In Progress'] }
  ];

  const message = `
\`\`\`
${buildMagentoOrdersReport({
  executedOn,
  datePST: report.date,
  rows
})}
\`\`\`
`;

await sendGChatReport({
  type: 'magento',
  vitalsStatus: message
});

});
