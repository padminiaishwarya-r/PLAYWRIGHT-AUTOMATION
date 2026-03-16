import { test } from '@playwright/test';
import { loginToMagento } from '../../utils/magentoLogin.js';
import { getMagentoEnrollments } from '../../utils/magentoEnrollments.js';
import { getStripeInstallments } from '../../utils/stripeApi.js';
import { sendReconciliationToGChat } from '../../utils/gchatNotifier.js';

test('Installment reconciliation Magento vs Stripe', async ({ page }) => {
  test.setTimeout(300000);

  console.log('🚀 Starting Installment Reconciliation Test');

  // ==============================
  // STEP 1: Login + Get Magento Data
  // ==============================
  await loginToMagento(page);

  const magentoEnrollments = await getMagentoEnrollments(page);

  console.log(`📊 Magento Active Enrollments: ${magentoEnrollments.length}`);

 
  /** @type {{ planId: string, magento: number, stripe: number }[]} */
  const mismatches = [];

  for (const enrollment of magentoEnrollments) {
    const planId = enrollment.planId;
    const subscriptionId = (enrollment.subscriptionId && String(enrollment.subscriptionId).trim()) || '';
    const magentoInstallments = Number(enrollment.installmentsPaid ?? 0);

    if (!subscriptionId) {
      console.log(`\n⏭️ Skipping Plan ID: ${planId} (no Stripe subscription ID in Magento)`);
      continue;
    }
    if (!/^sub_/i.test(subscriptionId)) {
      console.log(`\n⏭️ Skipping Plan ID: ${planId} (not a Stripe subscription ID: "${subscriptionId}")`);
      continue;
    }

    console.log('\n-----------------------------------------');
    console.log(`📦 Plan ID: ${planId}`);
    console.log(`🛒 Magento Installments: ${magentoInstallments}`);

    const stripeInstallments = await getStripeInstallments(subscriptionId);
    console.log(`💳 Stripe Installments: ${stripeInstallments}`);

    if (Number(stripeInstallments) !== magentoInstallments) {
      mismatches.push({ planId, magento: magentoInstallments, stripe: stripeInstallments });
    }
  }

  if (mismatches.length > 0) {
    console.log('\n❌ Mismatched Pop IDs (Magento installments ≠ Stripe period count):');
    for (const m of mismatches) {
      console.log(`   Pop ID: ${m.planId} — Magento: ${m.magento}, Stripe: ${m.stripe}`);
    }
  }

  await sendReconciliationToGChat({
    totalEnrollments: magentoEnrollments.length,
    mismatchCount: mismatches.length,
    mismatches
  });

  console.log('\n✅ Reconciliation Completed Successfully');
});